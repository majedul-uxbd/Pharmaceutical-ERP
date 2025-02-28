import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Import React Hook Form
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"; // Replace with your Dialog component
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import "react-phone-number-input/style.css";
import { UserPen } from "lucide-react";
import { toast } from "sonner";
import { Department, UpdateDepartment } from "@/interfaces/department.interface";
import { UpdateSchema } from "@/schema/department.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

interface UpdateUserDialogProps {
    rowData: UpdateDepartment;
    accessToken: string;
    onUpdateSuccess: () => void;
}

const UpdateDepartmentDialog = ({ rowData, accessToken, onUpdateSuccess }: UpdateUserDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    // Initialize form with default values
    const form = useForm({
        resolver: zodResolver(UpdateSchema),
        defaultValues: rowData,
    });

    useEffect(() => {
        form.reset({
            department_id: rowData.department_id,
            department_name: rowData.department_name,
            comment: rowData.comment
        });
    }, [rowData, form]);

    const handleUpdateData = async (values: z.infer<typeof UpdateSchema>) => {
        const data = { ...values, id: rowData.id };
        try {
            setButtonDisable(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/department/update`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();

            if (result.status === "success") {
                toast.success(result.message);
                form.reset();
                setButtonDisable(false)
                onUpdateSuccess();
                setIsOpen(false);
            } else {
                setButtonDisable(false)
                toast.error(result.message);
            }
        } catch (error) {
            setButtonDisable(false)
            console.error("file: register-form.tsx:67 ~ onSubmit ~ error:", error);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                    className="flex w-full justify-start items-center"
                >
                    <UserPen className="font-bold" size={18} />
                    <span>Update</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg p-6 rounded-xl shadow-2xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                        Update Department
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Update Department Information
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdateData)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {/* Department ID Field*/}
                            <FormField
                                control={form.control}
                                name="department_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Department Name Field */}
                            <FormField
                                control={form.control}
                                name="department_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Comment Fields */}
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Comment
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Enter your comment"
                                                className="min-h-[100px]"
                                            />
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
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="w-1/2"
                                type="submit"
                                variant='default'
                                disabled={buttonDisable}
                            >
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

export default UpdateDepartmentDialog;
