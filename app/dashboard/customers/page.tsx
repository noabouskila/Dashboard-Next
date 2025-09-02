import CustomersTable from "@/app/ui/customersUi/table";
import { fetchFilteredCustomers } from "@/app/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};


export default async function Page({searchParams} : {searchParams?: {query?: string, page?: string}}) {

    const query = searchParams?.query || "";
    // const currentPage = parseInt(searchParams?.page || "1", 10);

    const customers = await fetchFilteredCustomers(query );

    return (
        <main>
        <CustomersTable customers={customers} />
        </main>
    );
}
