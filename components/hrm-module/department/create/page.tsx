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
import { CreateSchema } from "@/schema/department.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CreateDepartmentProps {
    session: any;
    deptCount: any;
    onCreateSuccess(): void;
}
export function CreateDepartment({ session, deptCount, onCreateSuccess }: CreateDepartmentProps) {
    const authToken = session?.session.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            department_id: deptCount.department_id,
            department_code: "",
            department_name: "",
            comment: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/department/add-department`,
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
            setIsDialogOpen(false); // Close the dialog when successful
        } else {
            toast.error(responseData.message);
        }
        setButtonDisable(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-800 hover:bg-green-900">
                    <SquarePlus className="font-bold" size={20} />
                    <span className="hidden sm:inline">Add Department</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {deptCount && deptCount.department_id ? (
                    <>
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Create Department
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-center">
                                Fill in the details below to create a new department.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    {/* Department ID */}
                                    <FormField
                                        control={form.control}
                                        name="department_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department ID</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Department ID" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={deptCount.department_id}>
                                                            {deptCount.department_id}
                                                        </SelectItem>
                                                        {/* Add more options dynamically if needed */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Department code */}
                                    <FormField
                                        control={form.control}
                                        name="department_code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter department code" />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Input {...field} placeholder="IT Department" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Comment Field */}
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Comment</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Comment" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter className="w-full flex space-x-2">
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
        </Dialog>
    );
}
