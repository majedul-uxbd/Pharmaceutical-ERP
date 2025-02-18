import { auth } from "@/auth";
import { ModuleInfo } from "@/utilities/module.enum";
import { redirect } from "next/navigation";

const Dashboard = async () => {
    const session = await auth();
    if (session?.user.module_id === ModuleInfo[0].value) {
        redirect('/mm-module');
    } else if (session?.user.module_id === ModuleInfo[1].value) {
        redirect('/sim-module');
    } else if (session?.user.module_id === ModuleInfo[2].value) {
        redirect('/hrm-module');
    } else if (session?.user.module_id === ModuleInfo[3].value) {
        redirect('/pm-module');
    } else if (session?.user.module_id === ModuleInfo[4].value) {
        redirect('/am-module');
    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <h1>Loading...</h1>
        </div>
    );
}

export default Dashboard;