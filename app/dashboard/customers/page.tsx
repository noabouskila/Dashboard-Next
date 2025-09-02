import CustomersTable from "@/app/ui/customersUi/table";
import { fetchFilteredCustomers } from "@/app/lib/data";

export default async function Page({searchParams} : {searchParams?: {query?: string, page?: string}}) {

    const query = searchParams?.query || "";
    const currentPage = parseInt(searchParams?.page || "1", 10);

    const customers = await fetchFilteredCustomers(query , currentPage);

    return (
        <main>
        <CustomersTable customers={customers} />
        </main>
    );
}
