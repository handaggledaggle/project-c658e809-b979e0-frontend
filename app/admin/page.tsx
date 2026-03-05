import AdminNavbar from "./_components/AdminNavbar";
import AdminDashboardClient from "./_components/AdminDashboardClient";
import PolicyComparison from "./_components/PolicyComparison";
import IncidentFlowTimeline from "./_components/IncidentFlowTimeline";
import IncidentActionSection from "./_components/IncidentActionSection";
import AdminFooter from "./_components/AdminFooter";

export default function AdminPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col">
      <AdminNavbar />

      <main className="flex flex-col gap-8 bg-gray-50 px-8 py-8">
        <AdminDashboardClient />
        <PolicyComparison />
        <IncidentFlowTimeline />
        <IncidentActionSection />
      </main>

      <AdminFooter />
    </div>
  );
}
