import { auth } from "@/auth";
import MarketTable from "./market-table/page";

const MarketPage = async () => {
    const session = await auth();

    return (
        <MarketTable session={session?.user} />
    )
}

export default MarketPage;