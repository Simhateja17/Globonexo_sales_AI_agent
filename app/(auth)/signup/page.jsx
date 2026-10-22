import { AuthFrame } from "../../../components/auth/AuthFrame";
import { SignupForm } from "../../../components/auth/SignupForm";

export const metadata = {
  title: { absolute: "Create a GNX Sales account" },
};

export default function SignupPage() {
  return (
    <AuthFrame panel="free">
      <SignupForm />
    </AuthFrame>
  );
}
