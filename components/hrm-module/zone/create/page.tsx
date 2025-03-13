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
import { CreateSchema } from "@/schema/zone.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CreateZoneProps {
    session: any;
    depotData: any;
    zoneCount: any;
    onCreateSuccess(): void;
}
export function CreateZone({ session, depotData, zoneCount, onCreateSuccess }: CreateZoneProps) {

    const authToken = session?.session.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            depot_name: "",
            zone_id: zoneCount.zone_id,
            zone_code: zoneCount.zone_code,
            zone_name: "",
            comment: ""
        },
    });


    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {

        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/zone/add-zone`,
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

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-800 hover:bg-green-900">
                    <SquarePlus className="font-bold" size={20} />
                    <span className="hidden sm:inline">Add Zone</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {depotData.length > 0 ? (
                    <>
                        {/* Header Section */}
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Create Zone
                            </DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Fill in the details below to create a new depot.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
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

                                    {/* Zone ID */}
                                    <FormField
                                        control={form.control}
                                        name="zone_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zone ID</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Zone ID" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={zoneCount.zone_id}>
                                                            {zoneCount.zone_id}
                                                        </SelectItem>
                                                        {/* Add more options dynamically if needed */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Zone Code */}
                                    <FormField
                                        control={form.control}
                                        name="zone_code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zone Code</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Zone Code" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={zoneCount.zone_code}>
                                                            {zoneCount.zone_code}
                                                        </SelectItem>
                                                        {/* Add more options dynamically if needed */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Zone Name */}
                                    <FormField
                                        control={form.control}
                                        name="zone_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zone Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Zone Name" />
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
