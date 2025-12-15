import { auth } from "@/auth";
import DesignationTable from "../../../../components/hrm-module/designation/designation-table";

const DesignationPage = async () => {
    const session = await auth();

    return (
        <div>
            <DesignationTable session={session?.user} />
        </div>
    )
}

export default DesignationPage;