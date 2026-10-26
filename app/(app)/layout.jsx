import "./app-design.css";
import AppShell from "../../components/layout/AppShell";
import { SetupProvider } from "../../providers/SetupProvider";
import { ConfirmProvider } from "../../components/ui/ConfirmDialog";
import TourOverlay from "../../components/tour/TourOverlay";
import SetupCopilot from "../../components/setup/SetupCopilot";

export const metadata = {
  title: "GNX sales",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({ children }) {
  return (
    <SetupProvider>
      <ConfirmProvider>
        <AppShell>{children}</AppShell>
      </ConfirmProvider>
      <TourOverlay />
      <SetupCopilot />
    </SetupProvider>
  );
}
