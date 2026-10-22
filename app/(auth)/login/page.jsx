import { Suspense } from "react";
import { AuthFrame } from "../../../components/auth/AuthFrame";
import { LoginForm } from "../../../components/auth/LoginForm";

export const metadata = {
  title: { absolute: "Sign in to GNX Sales" },
};

export default function LoginPage() {
  return (
    <AuthFrame panel="away">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthFrame>
  );
}
