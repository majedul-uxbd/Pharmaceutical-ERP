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
import { PenLine } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateZone } from "@/interfaces/zone.interface";
import { UpdateSchema } from "@/schema/zone.schema";

interface UpdateZoneDialogProps {
    rowData: UpdateZone;
    depotData: any;
    accessToken: string;
    onUpdateSuccess: () => void;
}

const UpdateZoneDialog = ({ rowData, depotData, accessToken, onUpdateSuccess }: UpdateZoneDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    // Initialize form with default values
    const form = useForm({
        resolver: zodResolver(UpdateSchema),
        defaultValues: rowData,
    });

    useEffect(() => {
        const selectedDepot = depotData.find((depot: any) => depot.depot_name === rowData.depot_name);
        form.reset({
            depot_name: selectedDepot ? selectedDepot.depot_id : "",
            zone_name: rowData.zone_name,
            comment: rowData.comment || "",
        });
    }, [rowData, form, depotData]);


    const handleUpdateData = async (values: z.infer<typeof UpdateSchema>) => {
        const data = { ...values, id: rowData.id };
        try {
            setButtonDisable(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/zone/update`,
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
            <DialogContent className="p-6 rounded-xl shadow-2xl bg-white">
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
                        <div className="max-h-[70vh] space-y-4">
                            {/* Depot Name */}
                            <FormField
                                control={form.control}
                                name="depot_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Depot Name</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a depot" />
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

                            {/* Zone Name Field */}
                            <FormField
                                control={form.control}
                                name="zone_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Zone Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter a depot name"
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

export default UpdateZoneDialog;
