import { auth } from "@/auth";
import DesignationTable from "./designation-table/page";

const DesignationPage = async () => {
    const session = await auth();

    return (
        <DesignationTable session={session?.user} />
    )
}

export default DesignationPage;