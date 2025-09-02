import CustomersTable from "@/app/ui/customersUi/table";
import { fetchFilteredCustomers } from "@/app/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";

  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}


