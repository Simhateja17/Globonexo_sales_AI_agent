import AdminShell from "../../components/layout/AdminShell";

export const metadata = {
  title: "GNX Sales admin console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
