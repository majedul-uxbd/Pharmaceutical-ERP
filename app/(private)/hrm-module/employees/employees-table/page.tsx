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
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateZone } from "@/components/hrm-module/zone/create/page";
import DeactivateZone from "@/components/hrm-module/zone/deactivate/page";
import ActivateZone from "@/components/hrm-module/zone/active/page";
import UpdateZoneDialog from "@/components/hrm-module/zone/update/page";
import { Employees } from "@/interfaces/employees.interface";
import ActivateEmployee from "@/components/hrm-module/employees/active/page";
import DeactivateEmployee from "@/components/hrm-module/employees/deactivate/page";


interface EmployeesTableProps {
    session: any;
}

const EmployeesTable = (session: EmployeesTableProps) => {
    const accessToken = session?.session.id;
    const [data, setData] = useState<Employees[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useState<number>();
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    // const [depotData, setDepotData] = useState<Zone[]>([]);
    const [zoneCount, setZoneCount] = useState<any[]>([]);


    const columns: ColumnDef<Employees>[] = [
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
            accessorKey: "employee_id",
            header: "Employee ID",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("employee_id")}</div>
            ),
        },

        {
            accessorKey: "full_name",
            header: "Full Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("full_name")}</div>
            ),
        },

        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.original.email ? row.original.email : ""}</div>
            ),
        },

        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("contact")}</div>
            ),
        },

        {
            accessorKey: "present_address",
            header: "Present Address",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("present_address")}</div>
            ),
        },

        {
            accessorKey: "permanent_address",
            header: "Permanent Address",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("permanent_address")}</div>
            ),
        },

        {
            accessorKey: "joining_date",
            header: "Joining Date",
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.joining_date
                    ? format(new Date(row.original.joining_date), 'yyyy-MM-dd')
                    : 'N/A'}</div>
            ),
        },

        {
            accessorKey: "posting_place",
            header: "Posting Place",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("posting_place")}</div>
            ),
        },

        {
            accessorKey: "permanent_date",
            header: "Permanent Date",
            cell: ({ row }) => (
                <div className={row.original.permanent_date ? "text-slate-700" : "whitespace-nowrap bg-yellow-300 text-slate-700 font-bold border p-1"}>{row.original.permanent_date
                    ? format(new Date(row.original.permanent_date), 'yyyy-MM-dd')
                    : 'Temporary Employee'}</div>
            ),
        },

        {
            accessorKey: "designation_name",
            header: "Designation Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("designation_name")}</div>
            ),
        },

        {
            accessorKey: "department_name",
            header: "Department Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("department_name")}</div>
            ),
        },

        {
            accessorKey: "depot_name",
            header: "Deport Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("depot_name")}</div>
            ),
        },

        {
            accessorKey: "module_name",
            header: "Module Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-slate-700">{row.getValue("module_name")}</div>
            ),
        },

        {
            accessorKey: "employee_status",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("employee_status") === 1;
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
                const isActive = row.original.employee_status === 1;

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
                                    <DeactivateEmployee
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onInactiveSuccess={() => {
                                            employeeTableData({
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
                                    <ActivateEmployee
                                        id={row.original.id}
                                        accessToken={accessToken}
                                        onActiveSuccess={() => {
                                            employeeTableData({
                                                itemsPerPage: pagination.pageSize,
                                                currentPageNumber: pagination.pageIndex,
                                                sortOrder: "asc",
                                                filterBy: "",
                                            });
                                        }}
                                    />
                                </div>
                            )}

                            {/* <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
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
                            </div> */}
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

    // const getDepotInformation = async () => {
    //     const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_API_URL}/common/get-depot`,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         }
    //     );

    //     const responseData = await response.json();
    //     // console.warn('🚀 ~ getDepotInformation ~ responseData:', responseData.data);

    //     if (responseData.status === 'success') {
    //         setDepotData(() => responseData?.data)
    //         setIsLoading(false);

    //     } else {
    //         setIsLoading(true);
    //         console.error(responseData.message);
    //     }
    //     // setButtonDisable(false);
    // };

    // const getCountInformation = async () => {
    //     const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_API_URL}/id-count/get-zone-id-count`,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         }
    //     );

    //     const responseData = await response.json();
    //     // console.warn('🚀 ~ getCountInformation ~ responseData:', responseData.data);

    //     if (responseData.status === 'success') {
    //         setZoneCount(() => responseData?.data)

    //     } else {
    //         console.error(responseData.message);
    //     }
    // };

    const employeeTableData = async (paginationData: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/employees/get-employees-data`,
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
            const employeeData = responseData?.data?.data as Employees[];
            const pageCount = Math.ceil(responseData?.data?.metadata?.totalRows / pagination.pageSize);
            setTotalPage(() => pageCount);
            setData(() => employeeData)
            setIsLoading(false)
        }
        else {
            console.error("fetch req failed: ", response)
        }

    }

    useEffect(() => {
        // getDepotInformation();
        // getCountInformation();
        employeeTableData({
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
        },
    })
    return (
        <div className="w-full">
            <div className="flex justify-start flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mb-2">
                <div className="w-full">
                    <Input
                        className="w-full md:w-3/5"
                        placeholder="Filter by Department Name..."
                        value={(
                            table.getColumn('full_name')?.getFilterValue() as string
                        ) ?? ''}
                        onChange={(event) =>
                            table.getColumn('full_name')?.setFilterValue(event.target.value)
                        }
                    />
                </div>
                {/* <div className="">
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
                </div> */}
            </div>

            <div className="max-h-[calc(100vh-250px)] overflow-y-auto rounded-t-md border border-solid">
                <Table className="relative h-[80%]">
                    <TableHeader className="sticky top-0 whitespace-nowrap z-10 bg-[#f2f4f6]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-slate-200">
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
                        ) : table.getRowModel().rows.length === 0 && table.getColumn('full_name')?.getFilterValue() ? (
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
                                        <TableCell key={cell.id} className="p-3 border-r rounded border-slate-200">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="border-slate-200">
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

export default EmployeesTable;