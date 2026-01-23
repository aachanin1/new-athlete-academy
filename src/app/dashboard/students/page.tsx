import DashboardLayout from "@/components/DashboardLayout";
import { getAllStudents, getBranches } from "@/lib/data/dashboard";
import StudentsClient from "./StudentsClient";

export default async function StudentsPage() {
    const [students, branches] = await Promise.all([
        getAllStudents(),
        getBranches(),
    ]);

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <StudentsClient initialStudents={students} branches={branches} />
        </DashboardLayout>
    );
}
