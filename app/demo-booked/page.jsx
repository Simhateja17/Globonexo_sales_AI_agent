import { Suspense } from "react";
import DemoContent from "./DemoContent";

export const metadata = {
  title: { absolute: "Your demo is booked · GNX Sales" },
  robots: { index: false, follow: false },
};

export default function DemoBookedPage() {
  return (
    <Suspense fallback={null}>
      <DemoContent />
    </Suspense>
  );
}
