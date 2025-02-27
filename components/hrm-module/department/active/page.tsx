import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeactivateDepartmentProps {
    id: number;
    accessToken: string;
    onActiveSuccess: () => void;
}

const ActivateDepartment = ({ id, accessToken, onActiveSuccess }: DeactivateDepartmentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const handleDelete = async () => {
        setButtonDisable(true);
        setIsOpen(false);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/department/active`,
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
            onActiveSuccess();
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
                    <Trash2 className="text-green-600 font-bold" size={18} />
                    <span>Active</span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Confirm Activation</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to active this Department?
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


export default ActivateDepartment;