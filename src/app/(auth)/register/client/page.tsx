import { Suspense } from "react";
import { ClientRegisterForm } from "./client-register-form";

export default function ClientRegisterPage() {
  return (
    <Suspense>
      <ClientRegisterForm />
    </Suspense>
  );
}
