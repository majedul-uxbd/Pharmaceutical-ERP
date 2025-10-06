import { auth } from "@/auth";
import DesignationTable from "../../../../components/hrm-module/designation/designation-table";

const DesignationPage = async () => {
    const session = await auth();

    return (
        <DesignationTable session={session?.user} />
    )
}

export default DesignationPage;