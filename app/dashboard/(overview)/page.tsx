import { lusitana } from "@/app/ui/fonts"
// import { Card } from '@/app/ui/dashboardUi/cards'
// import { fetchCardData ,fetchRevenue  , fetchLatestInvoices} from "@/app/lib/data"
// import { fetchCardData  } from "@/app/lib/data"
import  RevenueChart  from "@/app/ui/dashboardUi/revenue-chart"
import LatestInvoices from "@/app/ui/dashboardUi/latest-invoices"
import { Suspense } from "react";
import { RevenueChartSkeleton ,LatestInvoicesSkeleton, CardsSkeleton} from "@/app/ui/skeletons"
import CardWrapper from "@/app/ui/dashboardUi/cards"


export  default  async function Page(){
    
    // const revenue = await fetchRevenue();

    // const {collected , pending ,customers , invoices} =  await fetchCardData();
    //  const latestInvoices = await fetchLatestInvoices();

    // //  on verifie si les donnees sont vides
    // if(!revenue || !collected || !pending || !customers || !invoices || !latestInvoices){
    //     return <div className="text-center">Aucune donnée disponible</div>
    // }

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
               {/* <LatestInvoices LatestInvoices={latestInvoices} /> */}
                <LatestInvoices  />
             </Suspense>
           

        </main>

    )
}