import { auth } from "@/auth";
import ZoneTable from "../../../../components/hrm-module/zone/zone-table";

// interface ZoneProps {
//     session: any;
// }

const ZonePage = async () => {
    const session = await auth();

    return (
        <ZoneTable session={session?.user} />
    )
}

export default ZonePage;