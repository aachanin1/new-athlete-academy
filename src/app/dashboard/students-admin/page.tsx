import DashboardLayout from "@/components/DashboardLayout";
import { getAllStudentsWithParents } from "@/lib/data/dashboard";
import AdminStudentsClient from "../students/AdminStudentsClient";

export default async function AdminStudentsPage() {
    const students = await getAllStudentsWithParents();

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <AdminStudentsClient students={students} />
        </DashboardLayout>
    );
}

