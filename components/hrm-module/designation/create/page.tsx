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
import { CreateSchema } from "@/schema/designation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CreateDesignationProps {
    session: any;
    onCreateSuccess(): void;
}
export function CreateDesignation({ session, onCreateSuccess }: CreateDesignationProps) {
    const authToken = session?.session.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            designation_id: "",
            designation_name: "",
            short_name: "",
            description: "",
            comment: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/designation/add-designation`,
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
                    <span className="hidden sm:inline">Add Designation</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {/* Header Section */}
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">
                        Create Designation
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Fill in the details below to create a new designation.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {/* Designation ID */}
                            <FormField
                                control={form.control}
                                name="designation_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Designation ID" />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Designation Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Designation Short Name */}
                            <FormField
                                control={form.control}
                                name="short_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Short Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Description" />
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
            </DialogContent>
        </Dialog>
    );
}
