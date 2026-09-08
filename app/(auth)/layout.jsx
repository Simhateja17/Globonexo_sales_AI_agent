export const metadata = {
  title: "GNX Sales authentication",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }) {
  return (
    <div className="frame">
      {children}
    </div>
  );
}
