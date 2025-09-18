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
import { PenLine, UserPen } from "lucide-react";
import { toast } from "sonner";
import { UpdateSchema } from "@/schema/designation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { UpdateDesignation } from "@/interfaces/designation.interface";

interface UpdateDesignationDialogProps {
    rowData: UpdateDesignation;
    accessToken: string;
    onUpdateSuccess: () => void;
}

const UpdateDesignationDialog = ({ rowData, accessToken, onUpdateSuccess }: UpdateDesignationDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    // Initialize form with default values
    const form = useForm({
        resolver: zodResolver(UpdateSchema),
        defaultValues: rowData,
    });

    useEffect(() => {
        form.reset({
            designation_id: rowData.designation_id,
            designation_code: rowData.designation_code,
            designation_name: rowData.designation_name,
            description: rowData.description,
            comment: rowData.comment
        });
    }, [rowData, form]);

    const handleUpdateData = async (values: z.infer<typeof UpdateSchema>) => {
        const data = { ...values, id: rowData.id };
        try {
            setButtonDisable(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/designation/update`,
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
                    <PenLine className="font-bold" size={18} />
                    <span>Update</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg h-[98vh]   p-6 rounded-xl shadow-2xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                        Update Designation
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Update Designation Information
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdateData)}
                        className="space-y-6"
                    >
                        <div className="max-h-[70vh] space-y-4 overflow-y-auto">
                            {/* Designation ID Field*/}
                            <FormField
                                control={form.control}
                                name="designation_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Designation ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Designation ID"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Designation Code Field*/}
                            <FormField
                                control={form.control}
                                name="designation_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Designation code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Designation Code"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Designation Name Field */}
                            <FormField
                                control={form.control}
                                name="designation_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Designation Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Designation Name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Designation description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Enter Description"
                                                className="min-h-[40px]"
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
                                                placeholder="Enter Your comment"
                                                className="min-h-[80px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <DialogFooter className="w-full flex-row space-x-2">
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

export default UpdateDesignationDialog;
