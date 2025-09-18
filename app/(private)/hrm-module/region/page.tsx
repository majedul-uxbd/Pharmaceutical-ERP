import { auth } from "@/auth";
import RegionTable from "./region-table/page";

const RegionPage = async () => {
    const session = await auth();

    return (
        <RegionTable session={session?.user} />
    )
}

export default RegionPage;