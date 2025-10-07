import { Calendar28 } from "@/components/date-picker";

interface HrmDashboardProps {
    session: any;
}

const HrmDashboard = (session: HrmDashboardProps) => {

    return (
        <div>
            <h1>Hrm Dashboard</h1>
            <Calendar28 />
        </div>
    )
}

export default HrmDashboard;