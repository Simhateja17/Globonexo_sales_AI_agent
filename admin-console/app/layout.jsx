import AdminShell from "../../components/layout/AdminShell";
import "../../app/globals.css";
import { AdminAuthProvider } from "../providers/AdminAuthProvider";

export const metadata = {
  title: { absolute: "GNX Sales admin console" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminAuthProvider><AdminShell>{children}</AdminShell></AdminAuthProvider>;
}
