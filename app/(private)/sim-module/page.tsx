import { auth } from "@/auth";

const SalesInvoiceManagement = async () => {
    const session = await auth();

    return (
        <div>Sales Invoice Management</div>
    );
}

export default SalesInvoiceManagement;