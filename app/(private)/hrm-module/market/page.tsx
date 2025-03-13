import { auth } from "@/auth";
import MarketTable from "./market-table/page";

const MarketPage = async () => {
    const session = await auth();

    return (
        <div>
            <MarketTable session={session?.user} />
        </div>
    )
}

export default MarketPage;