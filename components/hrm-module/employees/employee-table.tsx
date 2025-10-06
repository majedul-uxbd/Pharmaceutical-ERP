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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employees } from "@/interfaces/employees.interface";
import ActivateEmployee from "@/components/hrm-module/employees/active-employee";
import DeactivateEmployee from "@/components/hrm-module/employees/deactive-employee";
import { Depot } from "@/interfaces/depot.interface";
import CreateEmployee from "@/components/hrm-module/employees/create-employee";


interface EmployeesTableProps {
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

const EmployeesTable = (session: EmployeesTableProps) => {
    const accessToken = session?.session.id;
    const [data, setData] = useState<Employees[]>([]);
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
    const [moduleData, setModuleData] = useState<any[]>([]);
    const [departmentData, setDepartmentData] = useState<any[]>([]);
    const [designationData, setDesignationData] = useState<any[]>([]);
    const [depotData, setDepotData] = useState<Depot[]>([]);
    const [idCount, setIdCount] = useState<any[]>([]);
    const [postingData, setPostingData] = useState<any[]>([]);
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
            header: ({ column }) => {
                const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
                return (
                    <div className="flex items-center justify-center gap-2">
                        Employee ID
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
                const numA = parseInt((rowA.getValue(columnId) as string).replace(/\D/g, ""), 10);
                const numB = parseInt((rowB.getValue(columnId) as string).replace(/\D/g, ""), 10);
                return numA - numB;
            },
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">
                    {row.getValue("employee_id")}
                </div>
            ),
        },

        {
            accessorKey: "full_name",
            header: "Full Name",
            cell: ({ row }) => {
                const fullName = row.getValue("full_name") as string;
                return <div className="whitespace-nowrap text-start">{highlightText(fullName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => {
                const username = row.getValue("username") as string;
                return <div className="whitespace-nowrap text-start">{highlightText(username, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                const email = row.getValue("email") as string;
                return <div className="whitespace-nowrap text-start">{highlightText(email, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("contact")}</div>
            ),
        },

        {
            accessorKey: "present_address",
            header: "Present Address",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("present_address")}</div>
            ),
        },

        {
            accessorKey: "permanent_address",
            header: "Permanent Address",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("permanent_address")}</div>
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
            accessorKey: "place_name",
            header: "Posting Place",
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("place_name")}</div>
            ),
        },

        {
            accessorKey: "permanent_date",
            header: "Permanent Date",
            cell: ({ row }) => (
                <div className={row.original.permanent_date ? "" : "whitespace-nowrap bg-cyan-300 dark:text-cyan-700  font-bold border rounded-sm p-1"}>{row.original.permanent_date
                    ? format(new Date(row.original.permanent_date), 'yyyy-MM-dd')
                    : 'Intern'}</div>
            ),
        },

        {
            accessorKey: "designation_name",
            header: "Designation Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-start">{row.getValue("designation_name")}</div>
            ),
        },

        {
            accessorKey: "department_name",
            header: "Department Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-start">{row.getValue("department_name")}</div>
            ),
        },

        {
            accessorKey: "depot_name",
            header: "Deport Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-start">{row.getValue("depot_name")}</div>
            ),
        },

        {
            accessorKey: "module_name",
            header: "Module Name",
            cell: ({ row }) => (
                <div className="whitespace-nowrap text-start">{row.getValue("module_name")}</div>
            ),
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

                            <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                Make Author
                                {/* <ActivateEmployee
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
                                /> */}
                            </div>

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

    const getModuleInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-module`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getModuleInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setModuleData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const getDesignationInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-designation`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getDesignationInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setDesignationData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const getPostingInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-posting`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getPostingInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setPostingData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const getDepartmentInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/get-department`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getDepartmentInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setDepartmentData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

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
        // console.warn('🚀 ~ getDepotInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setDepotData(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

    const getCountInformation = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/id-count/get-employee-id-count`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseData = await response.json();
        // console.warn('🚀 ~ getCountInformation ~ responseData:', responseData);
        if (responseData.status === 'success') {
            setIdCount(() => responseData?.data)
        } else {
            console.error(responseData.message);
        }
    };

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
            if (pageCount === 0) {
                setTotalPage(() => 1);
            } else {
                setTotalPage(() => pageCount);
            }
            setData(() => employeeData)
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
        getModuleInformation();
        getDepartmentInformation();
        getDesignationInformation();
        getDepotInformation();
        getCountInformation();
        getPostingInformation();
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
                        placeholder="Search by Full name or Username or Email..."
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
                    <CreateEmployee
                        session={session}
                        moduleData={moduleData}
                        depotData={depotData}
                        departmentData={departmentData}
                        designationData={designationData}
                        postingData={postingData}
                        idCount={idCount}
                        onCreateSuccess={() => {
                            getCountInformation();
                            employeeTableData({
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
                    <TableHeader className="sticky top-0 whitespace-nowrap z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="text-center font-bold border bg-accent"
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
                        ) : table.getRowModel().rows.length === 0 && table.getState().globalFilter ? (
                            // If no rows match the filter, show the "No data matched" message inside a table row
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No data matched
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="text-center" key={row.id} data-state={row.getIsSelected() && 'selected'}>
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

export default EmployeesTable;