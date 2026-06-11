'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ArrowRight, CalendarIcon, Plus, Trash } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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
    const [breakupOptions, setBreakupOptions] = useState<any[]>([])
    const [deductionOptions, setDeductionOptions] = useState<any[]>([])
    const [salaryGroups, setSalaryGroups] = useState<any[]>([])
    const [salaryHeads, setSalaryHeads] = useState<any[]>([])
    const [selectedSalaryGroup, setSelectedSalaryGroup] = useState<string>("")
    const [selectedSalaryHead, setSelectedSalaryHead] = useState<string>("")
    const [paymentDetails, setPaymentDetails] = useState<Array<{ breakupId: string; amount: string }>>([
        { breakupId: "", amount: "" }
    ])
    const [deductionDetails, setDeductionDetails] = useState<Array<{ deductionId: string; amount: string }>>([
        { deductionId: "", amount: "" }
    ])

    useEffect(() => {
        if (!accessToken) return;
        const fetchBreakupOptions = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/breakup/breakup-list`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setBreakupOptions(responseData.data)
                }
            } catch (error) {
                console.error("Failed to fetch breakup options", error);
            }
        };

        const fetchDeductionOptions = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/deduction/deduction-list`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setDeductionOptions(responseData.data)
                }
            } catch (error) {
                console.error("Failed to fetch deduction options", error);
            }
        };

        const fetchSalaryGroups = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/common/salary-group`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setSalaryGroups(responseData.data)
                }
            } catch (error) {
                console.error("Failed to fetch salary groups", error);
            }
        };

        const fetchSalaryHeads = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/common/salary-head`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const responseData = await response.json();
                if (responseData.status === 'success') {
                    setSalaryHeads(responseData.data)
                }
            } catch (error) {
                console.error("Failed to fetch salary heads", error);
            }
        };

        fetchBreakupOptions();
        fetchDeductionOptions();
        fetchSalaryGroups();
        fetchSalaryHeads();
    }, [accessToken]);

    const handlePaymentChange = (index: number, field: 'breakupId' | 'amount', value: string) => {
        const updated = [...paymentDetails];
        updated[index] = { ...updated[index], [field]: value };
        setPaymentDetails(updated);
    }

    const addPaymentRow = () => {
        setPaymentDetails([...paymentDetails, { breakupId: "", amount: "" }]);
    }

    const removePaymentRow = (index: number) => {
        if (paymentDetails.length > 1) {
            const updated = paymentDetails.filter((_, i) => i !== index);
            setPaymentDetails(updated);
        }
    }

    const handlePaymentKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index === paymentDetails.length - 1) {
                addPaymentRow();
            }
        }
    }

    const handleDeductionChange = (index: number, field: 'deductionId' | 'amount', value: string) => {
        const updated = [...deductionDetails];
        updated[index] = { ...updated[index], [field]: value };
        setDeductionDetails(updated);
    }

    const addDeductionRow = () => {
        setDeductionDetails([...deductionDetails, { deductionId: "", amount: "" }]);
    }

    const removeDeductionRow = (index: number) => {
        if (deductionDetails.length > 1) {
            const updated = deductionDetails.filter((_, i) => i !== index);
            setDeductionDetails(updated);
        }
    }

    const handleDeductionKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index === deductionDetails.length - 1) {
                addDeductionRow();
            }
        }
    }

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
                            <div>
                                <Label htmlFor="salaryGroup">Salary Group</Label>
                                <Select
                                    value={selectedSalaryGroup}
                                    onValueChange={setSelectedSalaryGroup}
                                >
                                    <SelectTrigger className="w-full mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                        <SelectValue placeholder="Select Salary Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salaryGroups.map((g: any) => {
                                            const gId = g.id !== undefined ? g.id : g['id '];
                                            const val = g.group_id || String(gId);
                                            return (
                                                <SelectItem key={gId} value={val}>
                                                    {g.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="salaryHead">Salary Head</Label>
                                <Select
                                    value={selectedSalaryHead}
                                    onValueChange={setSelectedSalaryHead}
                                >
                                    <SelectTrigger className="w-full mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                        <SelectValue placeholder="Select Salary Head" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salaryHeads.map((h: any) => {
                                            const hId = h.id !== undefined ? h.id : h['id '];
                                            const val = h.head_id || String(hId);
                                            return (
                                                <SelectItem key={hId} value={val}>
                                                    {h.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
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

                <div className="w-full gap-4 flex flex-col lg:flex-row mt-4">
                    {/* Payment Details */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-[16px]">Payment Details</h1>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPaymentRow}
                                className="h-8 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Row
                            </Button>
                        </div>
                        <div className="space-y-3 p-4 border rounded-xl bg-card shadow-sm">
                            <div className="grid grid-cols-12 gap-3 font-semibold text-xs text-muted-foreground pb-2 border-b">
                                <div className="col-span-6">Breakup Element</div>
                                <div className="col-span-5">Amount</div>
                                <div className="col-span-1"></div>
                            </div>
                            {paymentDetails.map((row, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3 items-center group animate-in fade-in-50 duration-200">
                                    <div className="col-span-6">
                                        <Select
                                            value={row.breakupId}
                                            onValueChange={(val) => handlePaymentChange(index, 'breakupId', val)}
                                        >
                                            <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                                <SelectValue placeholder="Select Breakup" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {breakupOptions.map((opt: any) => {
                                                    const optId = opt.id !== undefined ? opt.id : opt['id '];
                                                    const val = opt.breakup_id || String(optId);
                                                    return (
                                                        <SelectItem key={optId} value={val}>
                                                            {opt.breakup_name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-5">
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={row.amount}
                                            onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                                            onKeyDown={(e) => handlePaymentKeyDown(e, index)}
                                            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        {paymentDetails.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removePaymentRow(index)}
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deduction Details */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-[16px]">Deduction Details</h1>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addDeductionRow}
                                className="h-8 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Row
                            </Button>
                        </div>
                        <div className="space-y-3 p-4 border rounded-xl bg-card shadow-sm">
                            <div className="grid grid-cols-12 gap-3 font-semibold text-xs text-muted-foreground pb-2 border-b">
                                <div className="col-span-6">Deduction Element</div>
                                <div className="col-span-5">Amount</div>
                                <div className="col-span-1"></div>
                            </div>
                            {deductionDetails.map((row, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3 items-center group animate-in fade-in-50 duration-200">
                                    <div className="col-span-6">
                                        <Select
                                            value={row.deductionId}
                                            onValueChange={(val) => handleDeductionChange(index, 'deductionId', val)}
                                        >
                                            <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                                <SelectValue placeholder="Select Deduction" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deductionOptions.map((opt: any) => {
                                                    const optId = opt.id !== undefined ? opt.id : opt['id '];
                                                    const val = opt.deduction_id || String(optId);
                                                    return (
                                                        <SelectItem key={optId} value={val}>
                                                            {opt.deduction_name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-5">
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={row.amount}
                                            onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                                            onKeyDown={(e) => handleDeductionKeyDown(e, index)}
                                            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        {deductionDetails.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeDeductionRow(index)}
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SalaryStructure
