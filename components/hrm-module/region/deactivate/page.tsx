import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeactivateRegionProps {
    id: number;
    accessToken: string;
    onInactiveSuccess: () => void;
}

const DeactivateRegion = ({ id, accessToken, onInactiveSuccess }: DeactivateRegionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const handleDelete = async () => {
        setButtonDisable(true);
        setIsOpen(false);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/region/inactive`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            }
        );

        const responseData = await response.json();
        if (responseData.status === 'success') {
            toast.success(responseData?.message);

            onInactiveSuccess();
            setIsOpen(true)
        } else {
            setIsOpen(false)
            toast.error(responseData.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Delete button */}
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                    className="flex w-full justify-start items-center"
                >
                    <Trash2 className="text-red-700 font-bold" size={18} />
                    <span>Inactive</span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Confirm Inactivation</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to inactive this Region?
                </DialogDescription>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>

                    <Button variant="destructive" disabled={buttonDisable} onClick={handleDelete}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default DeactivateRegion;