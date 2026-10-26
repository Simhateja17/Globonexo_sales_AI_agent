import "../(app)/app-design.css";
import "../../components/auth/auth-design.css";

export const metadata = {
  title: { absolute: "GNX Sales authentication" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }) {
  return children;
}
