import { Suspense } from "react";
import { ContractorRegisterForm } from "./contractor-register-form";

export default function ContractorRegisterPage() {
  return (
    <Suspense>
      <ContractorRegisterForm />
    </Suspense>
  );
}
