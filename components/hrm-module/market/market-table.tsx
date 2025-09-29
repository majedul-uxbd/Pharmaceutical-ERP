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
import { ArrowUpDown, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Region } from "@/interfaces/region.interface";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Market } from "@/interfaces/market.interface";
import { CreateMarket } from "@/components/hrm-module/market/create-market";
import ActivateMarket from "@/components/hrm-module/market/active-market";
import DeactivateMarket from "@/components/hrm-module/market/deactive-market";
import UpdateMarketDialog from "@/components/hrm-module/market/update-market";


interface MarketTableProps {
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

const MarketTable = (session: MarketTableProps) => {
    const accessToken = session?.session.id;
    const [data, setData] = useState<Market[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useState<number>();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([
        // { id: "market_id", desc: false }, // default ascending
    ]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [regionData, setRegionData] = useState<Region[]>([]);
    const [marketCount, setMarketCount] = useState<any[]>([]);
    // 🔹 Load saved visibility from localStorage (if exists)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        () => {
            if (typeof window !== "undefined") {
                const saved = localStorage.getItem("storeTableColumnVisibility");
                return saved ? JSON.parse(saved) : {};
            }
            return {};
        }
    );

    const columns: ColumnDef<Market>[] = [
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
            accessorKey: "market_id",
            header: ({ column }) => {
                const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
                return (
                    <div className="flex items-center justify-center gap-2">
                        Market ID
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            enableSorting: true,
            sortingFn: (rowA, rowB, columnId) => {
                const numA = parseInt((rowA.getValue(columnId) as string), 10);
                const numB = parseInt((rowB.getValue(columnId) as string), 10);
                return numA - numB;
            },
            cell: ({ row }) => (
                <div className="whitespace-nowrap">
                    {row.getValue("market_id")}
                </div>
            ),
        },

        {
            accessorKey: "market_name",
            header: "Market Name",
            cell: ({ row }) => {
                const marketName = row.getValue("market_name") as string;
                return <div className="whitespace-nowrap">{highlightText(marketName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "market_code",
            header: "Market Code",
            cell: ({ row }) => {
                const marketCode = row.getValue("market_code") as string;
                return <div className="whitespace-nowrap">{highlightText(marketCode, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "region_name",
            header: "Region Name",
            cell: ({ row }) => {
                const regionName = row.getValue("region_name") as string;
                return <div className="whitespace-nowrap">{highlightText(regionName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "created_by",
            header: "Created By",
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.getValue("created_by")}</div>
            ),
        },
        {
            accessorKey: "modified_by",
            header: "Modified By",
            cell: ({ row }) => {
                return <div className="whitespace-nowrap">{row.getValue("modified_by") || "Not Modified"}</div>;
            },
        },

        {
            accessorKey: "active_status",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("active_status") === 1;
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
                <div className="whitespace-nowrap">{row.getValue("comment")}</div>
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
                const isActive = row.original.active_status === 1;

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
                                    <DeactivateMarket
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onInactiveSuccess={() => {
                                            marketTableData({
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
                                    <ActivateMarket
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onActiveSuccess={() => {
                                            marketTableData({
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
                                <UpdateMarketDialog
                                    rowData={row.original}
                                    regionData={regionData}
                                    accessToken={accessToken}
                                    onUpdateSuccess={() => {
                                        marketTableData({
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

    const handlePaginationState = useCallback((btnType: "prev" | "next") => {
        setPagination((prev) => {
            const newIndex = btnType === "next" ? prev.pageIndex + 1 : Math.max(0, prev.pageIndex - 1);
            return { ...prev, pageIndex: newIndex };
        });
    }, []);


    const getRegionInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-region`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getRegionInformation ~ responseData:', responseData.data);
        if (responseData.status === 'success') {
            setRegionData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const getCountInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/id-count/get-market-id-count`,
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
            setMarketCount(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const marketTableData = async (paginationData: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/market/get-market-data`,
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
            const regionData = responseData?.data?.data as Market[];
            const pageSize = pagination.pageSize || 10; // Default to 10 if pageSize is undefined
            const pageCount = responseData?.data?.metadata?.totalRows
                ? Math.ceil(responseData.data.metadata.totalRows / pageSize)
                : 1;
            if (pageCount === 0) {
                setTotalPage(() => 1);
            } else {
                setTotalPage(() => pageCount);
            }
            setData(() => regionData)
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
        getRegionInformation();
        getCountInformation();
        marketTableData({
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
                        placeholder="Search by Market name or Code or Region name..."
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
                    <CreateMarket
                        accessToken={accessToken}
                        regionData={regionData}
                        marketCount={marketCount}
                        onCreateSuccess={() => {
                            getCountInformation();
                            marketTableData({
                                itemsPerPage: pagination.pageSize,
                                currentPageNumber: pagination.pageIndex,
                                sortOrder: "desc",
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
                            <TableRow key={headerGroup.id} className="border-b">
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
                        ) : table.getRowModel().rows.length === 0 && table.getColumn('region_name')?.getFilterValue() ? (
                            // If no rows match the filter, show the "No data matched" message inside a table row
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center ">
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

export default MarketTable;