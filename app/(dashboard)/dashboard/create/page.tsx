import { CreateWizardClient } from "./_components/create-wizard-client";

export const metadata = {
  title: "Create",
  description: "Create a new TESKEL offering.",
};

export default function UnifiedCreatePage() {
  return <CreateWizardClient />;
}
