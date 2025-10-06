import { auth } from "@/auth";
import MarketTable from "../../../../components/hrm-module/market/market-table";

const MarketPage = async () => {
    const session = await auth();

    return (
        <MarketTable session={session?.user} />
    )
}

export default MarketPage;