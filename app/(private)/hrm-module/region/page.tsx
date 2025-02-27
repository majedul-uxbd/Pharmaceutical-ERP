import { auth } from "@/auth";
import RegionTable from "./region-table/page";

const RegionPage = async () => {
    const session = await auth();

    return (
        <div>
            <RegionTable session={session?.user} />
        </div>
    )
}

export default RegionPage;