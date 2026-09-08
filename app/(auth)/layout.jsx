export const metadata = {
  title: { absolute: "GNX Sales authentication" },
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
