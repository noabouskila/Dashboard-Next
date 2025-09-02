import { lusitana } from "@/app/ui/fonts"
import  RevenueChart  from "@/app/ui/dashboardUi/revenue-chart"
import LatestInvoices from "@/app/ui/dashboardUi/latest-invoices"
import { Suspense } from "react";
import { RevenueChartSkeleton ,LatestInvoicesSkeleton, CardsSkeleton} from "@/app/ui/skeletons"
import CardWrapper from "@/app/ui/dashboardUi/cards"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};


export  default  async function Page(){
    
    return (
        
        <main >
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Tableau de bord</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* WRAPPER CARD */}
              <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper/>
              </Suspense>
             
            </div>



            {/* graphique des revenues par mois  */}
            <div className="mt-6 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                {/* <RevenueChart revenue={revenue} /> */}
                <Suspense fallback={<RevenueChartSkeleton/>} >
                      <RevenueChart/>
                </Suspense>
            </div>

            {/* 5 dernieres factures avec leurs infos */}
             <Suspense fallback={<LatestInvoicesSkeleton />} >
                <LatestInvoices  />
             </Suspense>
           

        </main>

    )
}