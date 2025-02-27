import { auth } from "@/auth";
import DesignationTable from "./designation-table/page";

const DesignationPage = async () => {
    const session = await auth();

    return (
        <div>
            <DesignationTable session={session?.user} />
        </div>
    )
}

export default DesignationPage;