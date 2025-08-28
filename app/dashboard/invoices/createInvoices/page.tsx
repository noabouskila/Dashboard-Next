import BreadCrumbs from "@/app/ui/invoicesUi/breadCrumbs"
import CreateForm from "@/app/ui/invoicesUi/createForm";
import { fetchCustomers } from "@/app/lib/data";





export default async function  CreateInvoices() {


    const customers = await fetchCustomers();
  return (
    <main>
      <BreadCrumbs
        breadCrumbs={[
          // array d'objet
          {
            label: "Facture ",
            href: "/dashboard/invoices",
          },
          {
            label: "créer une facture ",
            href: "/dashboard/invoices/createInvoices",
            active: true,
          },
        ]}
      />
      <CreateForm customers={customers} />
    </main>
  );
}
