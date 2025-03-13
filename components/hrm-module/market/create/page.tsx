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
import { CreateSchema } from "@/schema/market.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface CreateMarketProps {
    session: any;
    regionData: any;
    marketCount: any;
    onCreateSuccess(): void;
}
export function CreateMarket({ session, regionData, marketCount, onCreateSuccess }: CreateMarketProps) {
    const authToken = session?.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            region_name: "",
            market_id: marketCount.market_id,
            market_code: marketCount.market_code,
            market_name: "",
            comment: ""
        },
    });


    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/market/add-market`,
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
                    <span className="hidden sm:inline">Add Market</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {regionData.length > 0 && marketCount !== undefined ? (
                    <>
                        {/* Header Section */}
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Create Market
                            </DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Fill in the details below to create a new market.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    {/* Region Name */}
                                    <FormField
                                        control={form.control}
                                        name="region_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Region Name</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Region" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {regionData.map((region: any) => (
                                                            <SelectItem key={region.id} value={region.region_id}>
                                                                {region.region_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Market ID */}
                                    <FormField
                                        control={form.control}
                                        name="market_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Market ID</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Market ID" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={marketCount.market_id}>
                                                            {marketCount.market_id}
                                                        </SelectItem>
                                                        {/* Add more options dynamically if needed */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Market Code */}
                                    <FormField
                                        control={form.control}
                                        name="market_code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Market Code</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Market Code" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={marketCount.market_code}>
                                                            {marketCount.market_code}
                                                        </SelectItem>
                                                        {/* Add more options dynamically if needed */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Market Name */}
                                    <FormField
                                        control={form.control}
                                        name="market_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Market Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter Market Name" />
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
