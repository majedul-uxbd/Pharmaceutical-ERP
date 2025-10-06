import { auth } from "@/auth";
import RegionTable from "../../../../components/hrm-module/region/region-table";

const RegionPage = async () => {
    const session = await auth();

    return (
        <RegionTable session={session?.user} />
    )
}

export default RegionPage;