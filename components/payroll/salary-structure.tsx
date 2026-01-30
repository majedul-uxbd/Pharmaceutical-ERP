'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { ArrowRight, CalendarIcon } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { toast } from "sonner"
interface SalaryStructureProps {
    session: any
}

interface EmployeeList {
    full_name: string
    place_name: string
    designation_name: string
    department_name: string
    joining_date: string
}

interface BankInfo {
    id: number,
    short_name: string
    bank_name: string
}

const SalaryStructure = ({ session }: SalaryStructureProps) => {
    const accessToken = session?.id;
    const [employeeId, setEmployeeId] = useState("")
    const [employee, setEmployee] = useState<EmployeeList | null>(null)
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [salaryEDate, setSalaryEDate] = useState<Date | undefined>(undefined)
    const [pfDate, setPfDate] = useState<Date | undefined>(undefined)
    const [accountNo, setAccountNo] = useState("")
    const formattedJoiningDate = employee?.joining_date
        ? format(new Date(employee.joining_date), "yyyy-MM-dd")
        : ""

    // Mock employee data fetching
    const fetchEmployeeList = async () => {
        setLoading1(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/employees/list`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: employeeId
                }),
            }
        );

        const responseData = await response.json();
        if (responseData.status === 'success') {
            setEmployee(responseData.data)
            setLoading1(false)
            // toast.success(responseData?.message);
        } else {
            toast.error(responseData.message);
        }
    }

    // Mock employee data fetching
    const fetchBankAccountDetails = async () => {
        setLoading2(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/bank-info`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountNo: accountNo
                }),
            }
        );
        const responseData = await response.json();
        console.log('🚀 ----------------------------------------------------------------🚀');
        console.log('🚀 ~ :92 ~ fetchBankAccountDetails ~ responseData:', responseData);
        console.log('🚀 ----------------------------------------------------------------🚀');
        if (responseData.status === 'success') {
            setBankInfo(responseData.data)
            setLoading2(false)
        } else {
            setLoading2(false)

            toast.error(responseData.message);
        }
    }

    return (
        <Card className="mx-auto">
            <CardHeader>
                <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex flex-col">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <div className="min-w-50 flex gap-2 mt-3">
                            <Input
                                id="employeeId"
                                placeholder="Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            <Button variant="default" onClick={fetchEmployeeList} disabled={loading1 || !employeeId}>
                                {loading1 ?
                                    <>
                                        <Spinner />
                                    </>
                                    : (
                                        <>
                                            {/* Fetch Details */}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label>Employee Name</Label>
                        <Input id="full_name" value={employee?.full_name ?? ""} readOnly />
                    </div>
                    <div>
                        <Label>Posting Place</Label>
                        <Input id="place_name" value={employee?.place_name ?? ""} readOnly />
                    </div>
                    <div>
                        <Label htmlFor="designation_name">Designation</Label>
                        <Input id="designation_name" value={employee?.designation_name ?? ""} readOnly />
                    </div>

                    <div>
                        <Label htmlFor="department_name">Department</Label>
                        <Input id="department_name" value={employee?.department_name ?? ""} readOnly />
                    </div>

                    <div>
                        <Label htmlFor="joining_date">Joining Date</Label>
                        <Input
                            id="joining_date"
                            value={
                                employee?.joining_date
                                    ? format(new Date(employee.joining_date), "yyyy-MM-dd")
                                    : ""
                            }
                            readOnly
                        />
                    </div>
                </div>

                <div className="w-full gap-2 flex flex-col md:flex-row mt-4">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-[16px] font-bold">Salary Group</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border">
                            <div>
                                <Label htmlFor="salaryEDate">Salary Effective Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {salaryEDate ? format(salaryEDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={salaryEDate}
                                            onSelect={setSalaryEDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="">
                                <Label>Provident Fund Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pfDate ? format(pfDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={pfDate}
                                            onSelect={setPfDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="salaryGrout">Salary Group</Label>
                            <Input id="salaryGrout" value="" readOnly />
                        </div>

                    </div>
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-[16px] font-bold">Account Details</h1>
                        <div className="p-4 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <Label>Pay Mode</Label>
                                    <Input id="joining_date" value={employee?.joining_date ?? ""} readOnly />
                                </div>
                                <div>
                                    <Label>Bank</Label>
                                    <div className="flex gap-2">
                                        <Input className="w-1/3" id="short_name" value={bankInfo?.short_name ?? ""} readOnly />
                                        <Input className="w-2/3" id="full_name" value={bankInfo?.bank_name ?? ""} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mt-2">
                                <Label>Account No</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="accountNo"
                                        placeholder="Enter Account No"
                                        value={accountNo}
                                        onChange={(e) => setAccountNo(e.target.value)}
                                    />
                                    <Button variant="default" onClick={fetchBankAccountDetails} disabled={loading2 || !accountNo}>
                                        {loading2 ?
                                            <>
                                                <Spinner />
                                            </>
                                            : (
                                                <>
                                                    {/* Fetch Details */}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-full gap-2 flex flex-col md:flex-row mt-4">

                </div>
            </CardContent>
        </Card>
    )
}

export default SalaryStructure
