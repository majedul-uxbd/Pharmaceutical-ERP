import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateSchema } from "@/schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PhoneInput from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface CreateEmployeeProps {
    session: any;
    moduleData: any;
    depotData: any;
    departmentData: any;
    designationData: any;
    postingData: any;
    idCount: any;
    onCreateSuccess(): void;
}
const CreateEmployee = ({
    session,
    moduleData,
    depotData,
    departmentData,
    designationData,
    postingData,
    idCount,
    onCreateSuccess }: CreateEmployeeProps) => {
    const authToken = session?.session.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            employee_id: idCount.employee_id,
            full_name: '',
            email: "",
            contact: '',
            present_address: '',
            permanent_address: '',
            joining_date: '',
            posting_place: '',
            permanent_date: '',
            nid_no: '',
            designation_name: designationData.designation_id,
            department_name: departmentData.department_id,
            module_name: moduleData.module_id,
            depot_name: depotData.depot_id
        },
    });


    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/employees/add-employee`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }
        );

        const responseData = await response.json();
        if (responseData.status === 'success') {
            toast.success(responseData?.message);
            form.reset();
            onCreateSuccess();
            setIsDialogOpen(false);
        } else {
            toast.error(responseData.message);
        }
        setButtonDisable(false);
    };

    // const handleSubmit = form.handleSubmit(onSubmit, (errors) => {
    //     console.error("🚨 Validation errors:", errors);
    // });

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-800 hover:bg-green-900">
                    <SquarePlus className="font-bold" size={20} />
                    <span className="hidden sm:inline">Add Employee</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[97vh]">
                {moduleData.length > 0 &&
                    depotData.length > 0 &&
                    departmentData.length > 0 &&
                    designationData.length > 0 &&
                    idCount ? (
                    <>
                        {/* Header Section */}
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Create Employee
                            </DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Fill in the details below to create a new Employee.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4  h-[70vh]  overflow-auto">
                                    {/* Employee ID */}
                                    <FormField
                                        control={form.control}
                                        name="employee_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Employee ID</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select employee ID" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={idCount.employee_id}>
                                                            {idCount.employee_id}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Full Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Full Name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" placeholder="Enter Email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Contact Number Field */}
                                    <FormField
                                        control={form.control}
                                        name="contact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        {...field}
                                                        placeholder="Enter phone number"
                                                        value={field.value}
                                                        onChange={(phone) => field.onChange(phone)}
                                                        defaultCountry="BD"
                                                        className="w-full p-2 border rounded-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Present Address Field */}
                                    <FormField
                                        control={form.control}
                                        name="present_address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Present Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Present Address" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Permanent Address Field */}
                                    <FormField
                                        control={form.control}
                                        name="permanent_address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Permanent Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Permanent Address" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* NID No Field */}
                                    <FormField
                                        control={form.control}
                                        name="nid_no"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NID No</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter NID No" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Joining Date Field */}
                                    <FormField
                                        control={form.control}
                                        name="joining_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Joining Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full flex items-center justify-start px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                                        >
                                                            <CalendarIcon />
                                                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined} // Convert string to Date
                                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} // Convert Date to string
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Permanent Date Field */}
                                    <FormField
                                        control={form.control}
                                        name="permanent_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Permanent Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full flex items-center justify-start px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"

                                                        >
                                                            <CalendarIcon />
                                                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined} // Convert string to Date
                                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} // Convert Date to string, or allow empty
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Posting Place */}
                                    <FormField
                                        control={form.control}
                                        name="posting_place"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Posting Place</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Posting Place" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {postingData.map((post: any) => (
                                                            <SelectItem key={post.id} value={post.place_id}>
                                                                {post.place_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Designation Name */}
                                    <FormField
                                        control={form.control}
                                        name="designation_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Designation Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {designationData.map((designation: any) => (
                                                            <SelectItem key={designation.id} value={designation.designation_id}>
                                                                {designation.designation_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Department Name */}
                                    <FormField
                                        control={form.control}
                                        name="department_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departmentData.map((department: any) => (
                                                            <SelectItem key={department.id} value={department.department_id}>
                                                                {department.department_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Depot Name */}
                                    <FormField
                                        control={form.control}
                                        name="depot_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Depot Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {depotData.map((depot: any) => (
                                                            <SelectItem key={depot.id} value={depot.depot_id}>
                                                                {depot.depot_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Module Name */}
                                    <FormField
                                        control={form.control}
                                        name="module_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Module Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {moduleData.map((module: any) => (
                                                            <SelectItem key={module.id} value={module.module_id}>
                                                                {module.module_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter className="w-full flex flex-row justify-between space-x-2">
                                    <Button
                                        className="w-1/2"
                                        type="button"
                                        variant='ghost'
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-1/2"
                                        type="submit"
                                        variant='default'
                                        disabled={buttonDisable}
                                    >
                                        {buttonDisable ? "Creating..." : "Create"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </>
                ) : (
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin" />
                            <span className="text-xl">Loading...</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
}

export default CreateEmployee;