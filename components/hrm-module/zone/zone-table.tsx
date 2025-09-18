"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zone } from "@/interfaces/zone.interface";
import { CreateZone } from "@/components/hrm-module/zone/create-zone";
import DeactivateZone from "@/components/hrm-module/zone/deactive-zone";
import ActivateZone from "@/components/hrm-module/zone/active-zone";
import UpdateZoneDialog from "@/components/hrm-module/zone/update-zone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
interface ZoneTableProps {
    session: any;
}

const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <span key={index} className="bg-yellow-300 text-black rounded px-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

const ZoneTable = (session: ZoneTableProps) => {
    const accessToken = session?.session.id;
    const [data, setData] = useState<Zone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useState<number>();
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [depotData, setDepotData] = useState<Zone[]>([]);
    const [zoneCount, setZoneCount] = useState<any[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        () => {
            if (typeof window !== "undefined") {
                const saved = localStorage.getItem("storeTableColumnVisibility");
                return saved ? JSON.parse(saved) : {};
            }
            return {};
        }
    );

    const columns: ColumnDef<Zone>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="mr-3"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: true,
            enableHiding: false,
        },

        {
            accessorKey: "zone_id",
            header: "Zone ID",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("zone_id")}</div>
            ),
        },

        {
            accessorKey: "zone_name",
            header: "Zone Name",
            cell: ({ row }) => {
                const zoneName = row.getValue("zone_name") as string;
                return <div className="whitespace-nowrap">{highlightText(zoneName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "zone_code",
            header: "Zone Code",
            cell: ({ row }) => {
                const zoneCode = row.getValue("zone_code") as string;
                return <div className="whitespace-nowrap">{highlightText(zoneCode, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "depot_name",
            header: "Depot Name",
            cell: ({ row }) => {
                const deportName = row.getValue("depot_name") as string;
                return <div className="whitespace-nowrap">{highlightText(deportName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "zone_status",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("zone_status") === 1;
                return (
                    <Badge
                        variant={isActive ? "default" : "destructive"}
                        className="capitalize"
                    >
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "comment",
            header: "Comment",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("comment")}</div>
            ),
        },

        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.created_at
                    ? format(new Date(row.original.created_at), 'yyyy-MM-dd HH:mm:ss')
                    : ''}</div>
            ),
        },

        {
            accessorKey: "modified_at",
            header: "Modified At",
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.modified_at
                    ? format(new Date(row.original.modified_at), 'yyyy-MM-dd HH:mm:ss')
                    : 'N/A'}</div>
            ),
        },

        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const isActive = row.original.zone_status === 1;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontalIcon className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {isActive ? (
                                <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                    <DeactivateZone
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onInactiveSuccess={() => {
                                            zoneTableData({
                                                itemsPerPage: pagination.pageSize,
                                                currentPageNumber: pagination.pageIndex,
                                                sortOrder: "asc",
                                                filterBy: "",
                                            });
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                    <ActivateZone
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onActiveSuccess={() => {
                                            zoneTableData({
                                                itemsPerPage: pagination.pageSize,
                                                currentPageNumber: pagination.pageIndex,
                                                sortOrder: "asc",
                                                filterBy: "",
                                            });
                                        }}
                                    />
                                </div>
                            )}

                            <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <UpdateZoneDialog
                                    rowData={row.original}
                                    depotData={depotData}
                                    accessToken={accessToken}
                                    onUpdateSuccess={() => {
                                        getCountInformation();
                                        zoneTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "asc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }

    ]

    const handlePaginationState = useCallback(async (btnType: "prev" | "next" | "last" | "first" = "next") => {
        const factor = btnType === "next" ? 1 : -1;

        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + factor
        }))
    }, [pagination])

    const getDepotInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-depot`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getDepotInformation ~ responseData:', responseData.data);

        if (responseData.status === 'success') {
            setDepotData(() => responseData?.data)
            setIsLoading(false);

        } else {
            setIsLoading(true);
            console.error(responseData.message);
        }
        // setButtonDisable(false);
    };

    const getCountInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/id-count/get-zone-id-count`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getCountInformation ~ responseData:', responseData.data);

        if (responseData.status === 'success') {
            setZoneCount(() => responseData?.data)

        } else {
            console.error(responseData.message);
        }
    };

    const zoneTableData = async (paginationData: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/zone/get-zone-data`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    paginationData
                }),
            },
        );


        if (response.ok) {
            const responseData = await response.json();
            const zoneData = responseData?.data?.data as Zone[];
            const pageCount = Math.ceil(responseData?.data?.metadata?.totalRows / pagination.pageSize);
            if (pageCount === 0) {
                setTotalPage(() => 1);
            } else {
                setTotalPage(() => pageCount);
            }
            setData(() => zoneData)
            setIsLoading(false)
        }
        else {
            console.error("fetch req failed: ", response)
        }
    }

    useEffect(() => {
        localStorage.setItem(
            "storeTableColumnVisibility",
            JSON.stringify(columnVisibility)
        );
    }, [columnVisibility]);

    useEffect(() => {
        getDepotInformation();
        getCountInformation();
        zoneTableData({
            itemsPerPage: pagination.pageSize,
            currentPageNumber: pagination.pageIndex,
            sortOrder: "asc",
            filterBy: ""
        })
    }, [pagination]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter, // use the state variable here
        },
        onGlobalFilterChange: setGlobalFilter, // <-- important
    })
    return (
        <div className="w-full">
            <div className="flex justify-start flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mb-2">
                <div className="w-full">
                    <Input
                        className="w-full"
                        placeholder="Search by Zone name or Code or Deport Name..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                </div>
                <div className="w-full flex justify-between md:justify-end  gap-2">
                    {/* Column Toggle Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="default" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                Columns
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3">
                            <p className="text-sm font-medium mb-2">Toggle Columns</p>
                            <Separator className="mb-2" />
                            <ScrollArea className="h-48 pr-2">
                                <div className="flex flex-col gap-2">
                                    {table
                                        .getAllLeafColumns()
                                        .filter((col) => col.getCanHide())
                                        .map((column) => (
                                            <div key={column.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                />
                                                <label className="capitalize text-sm cursor-pointer">
                                                    {column.id.replaceAll("_", " ")}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                    <CreateZone
                        session={session}
                        depotData={depotData}
                        zoneCount={zoneCount}
                        onCreateSuccess={() => {
                            getCountInformation();
                            zoneTableData({
                                itemsPerPage: pagination.pageSize,
                                currentPageNumber: pagination.pageIndex,
                                sortOrder: "asc",
                                filterBy: "",
                            });
                        }}
                    />
                </div>
            </div>

            <div className="max-h-[calc(100vh-250px)] overflow-y-auto rounded-t-md border border-solid">
                <Table className="relative h-[80%]">
                    <TableHeader className="sticky top-0 whitespace-nowrap z-10 bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b ">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="text-center font-bold"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2Icon className="animate-spin" />
                                        &nbsp; Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 && table.getColumn('depot_name')?.getFilterValue() ? (
                            // If no rows match the filter, show the "No data matched" message inside a table row
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No data matched
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-3 border-r rounded ">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


            </div>
            <div className="flex items-center justify-between py-2 border rounded-b-md px-2">
                <div className="flex-1 hidden sm:block text-sm text-muted-foreground">
                    Total&nbsp;{table.getFilteredRowModel().rows.length} row(s)
                </div>
                <div className="flex md:items-center sm:space-x-6 lg:space-x-8">
                    <div className="sm:flex hidden whitespace-nowrap items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                setPagination({
                                    pageIndex: 0,
                                    pageSize: Number(value)
                                });
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 ">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex w-full gap-4 md:flex-row md:items-center justify-between md:w-auto">
                        {/* Current Page Info and Navigation */}
                        <div className="flex flex-row justify-between text-sm items-center gap-4 md:flex-row md:gap-8">
                            Page {pagination.pageIndex + 1} of{' '}
                            {totalPage}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-24 p-2"
                                onClick={() => {
                                    handlePaginationState("prev");
                                }}
                                disabled={pagination.pageIndex === 0}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-16 p-2"
                                onClick={() => {
                                    handlePaginationState("next");
                                }}
                                disabled={pagination.pageIndex + 1 === totalPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ZoneTable;