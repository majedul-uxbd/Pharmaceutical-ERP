import { auth } from "@/auth";
import ZoneTable from "./zone-table/page";

// interface ZoneProps {
//     session: any;
// }

const ZonePage = async () => {
    const session = await auth();

    return (
        <div>
            <ZoneTable session={session?.user} />
        </div>
    )
}

export default ZonePage;