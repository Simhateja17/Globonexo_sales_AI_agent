import { AuthAside } from "../../../components/layout/AuthAside";
import { SignupForm } from "../../../components/auth/SignupForm";

export const metadata = {
  title: { absolute: "Create a GNX Sales account" },
};

export default function SignupPage() {
  return (
    <div className="screen auth-screen" style={{ flexDirection: 'row' }}>
      <AuthAside
        kicker="Start free"
        headline="Hire your AI sales rep in 5 minutes."
        sub="Start free with a work email, connect your inbox, and launch your first AI email campaign."
        bullets={['Free plan, no card needed', '2-minute inbox connect', 'Upgrade whenever you want']}
      />
      <div className="grow scroll auth-main" style={{ display: 'grid', placeItems: 'center', padding: 40, background: '#fff' }}>
        <SignupForm />
      </div>
    </div>
  );
}
