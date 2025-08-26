import { lusitana } from "@/app/ui/fonts"
import Search from "@/app/ui/search"
import CreateInvoice from "@/app/ui/invoicesUi/buttons"
import InvoiceTable from "@/app/ui/invoicesUi/table"
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"


export default async function Invoices( {searchParams} :
    {   searchParams?: {
            query?:string ; 
            page?:string;
        }
    } ){

        const query = searchParams?.query || "";
        const currentPage = Number(searchParams?.page )|| 1;

        console.log("query", query);
        console.log("currentPage", currentPage);


    return (
        <div className="w-full ">
            <div className="flex w-full items-center justify-between">
                <h1 className={ `${lusitana.className} text-2xl`}>Factures</h1>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Recherche des factures ... "/>
                <CreateInvoice/>
            </div>


            {/* affichages factures */}
            {/*  le suspense se reinitialise à chaque changement de query + currentPage */}
            <Suspense key={ query + currentPage } fallback={<InvoicesTableSkeleton/>}>

                <InvoiceTable query={query} currentPage={currentPage} />

            </Suspense>

          
           

        </div>
        
       
    )
}