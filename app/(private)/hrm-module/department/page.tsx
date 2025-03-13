import { auth } from "@/auth";
import DepartmentTable from "./department-table/page";



const ZonePage = async () => {
    const session = await auth();

    return (
        <div>
            <DepartmentTable session={session?.user} />
        </div>
    )
}

export default ZonePage;