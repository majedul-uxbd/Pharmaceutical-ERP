import { auth } from "@/auth";
import SalaryStructure from "@/components/payroll/salary-structure";

const Page = async () => {
    const session = await auth();

    return (
        <SalaryStructure session={session?.user} />
    )
}

export default Page;