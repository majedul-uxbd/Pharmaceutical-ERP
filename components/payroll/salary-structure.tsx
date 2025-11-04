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

interface SalaryStructureProps {
    session: any
}

interface EmployeeInfo {
    name: string
    postingPlace: string
    designation: string
    department: string
    joiningDate: string
}

interface BankInfo {
    shortName: string
    fullname: string
}

const SalaryStructure = ({ session }: SalaryStructureProps) => {
    const [employeeId, setEmployeeId] = useState("")
    const [employee, setEmployee] = useState<EmployeeInfo | null>(null)
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [salaryEDate, setSalaryEDate] = useState<Date | undefined>(undefined)
    const [pfDate, setPfDate] = useState<Date | undefined>(undefined)
    const [accountNo, setAccountNo] = useState("")


    // Mock employee data fetching
    const fetchEmployeeDetails = async () => {
        setLoading1(true)

        // simulate an API call
        setTimeout(() => {
            // Dummy data (replace with API call)
            const fetchedData: EmployeeInfo = {
                name: "John Doe",
                postingPlace: "Head Office",
                designation: "Software Engineer",
                department: "IT Department",
                joiningDate: "2022-05-15",
            }

            setEmployee(fetchedData)
            setLoading1(false)
        }, 1000)
    }

    // Mock employee data fetching
    const fetchBankAccountDetails = async () => {
        setLoading2(true)

        // simulate an API call
        setTimeout(() => {
            // Dummy data (replace with API call)
            const fetchedData: BankInfo = {
                shortName: "IBL",
                fullname: "Islamic Bank PLC"
            }

            setBankInfo(fetchedData)
            setLoading2(false)
        }, 1000)
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
                        <div className="w-[200px] flex gap-2 mt-3">
                            <Input
                                id="employeeId"
                                placeholder="Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            <Button variant="default" onClick={fetchEmployeeDetails} disabled={loading1 || !employeeId}>
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
                        <Input id="name" value={employee?.name ?? ""} readOnly />
                    </div>
                    <div>
                        <Label>Posting Place</Label>
                        <Input id="postingPlace" value={employee?.postingPlace ?? ""} readOnly />
                    </div>
                    <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" value={employee?.designation ?? ""} readOnly />
                    </div>

                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={employee?.department ?? ""} readOnly />
                    </div>

                    <div>
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input id="joiningDate" value={employee?.joiningDate ?? ""} readOnly />
                    </div>
                </div>

                <div className="w-full gap-2 flex flex-col md:flex-row mt-4">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-[16px] font-bold">Salary Group</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border">
                            <div>
                                <Label htmlFor="salaryEDate">Salary E-Date</Label>
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
                                <Label>PF Date</Label>
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

                    </div>
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-[16px] font-bold">Payment Details</h1>
                        <div className="p-4 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <Label>Pay Mode</Label>
                                    <Input id="joiningDate" value={employee?.joiningDate ?? ""} readOnly />
                                </div>
                                <div>
                                    <Label>Bank</Label>
                                    <div className="flex gap-2">
                                        <Input className="w-1/3" id="shortName" value={bankInfo?.shortName ?? ""} readOnly />
                                        <Input className="w-2/3" id="fullName" value={bankInfo?.fullname ?? ""} readOnly />
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
            </CardContent>
        </Card>
    )
}

export default SalaryStructure
