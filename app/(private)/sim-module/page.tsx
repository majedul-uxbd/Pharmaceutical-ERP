import { auth } from "@/auth";
import SimDashboard from "./sim-dashboard/page";
import { ModuleInfo } from "@/utilities/module.enum";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SalesInvoiceManagement = async () => {
    const session = await auth();
    if (session?.user.module_id !== ModuleInfo[1].value) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center p-6 bg-white border border-red-200 shadow-lg shadow-red-100 rounded-2xl">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
                    <Link href="/" passHref>
                        <Button className="mt-4">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <SimDashboard session={session?.user} />
            </div>
        );
    }
}

export default SalesInvoiceManagement;