import { lusitana } from "@/app/ui/fonts"
import { Card } from '@/app/ui/dashboardUi/cards'
import { fetchCardData ,fetchRevenue  , fetchLatestInvoices} from "@/app/lib/data"
import  RevenueChart  from "@/app/ui/dashboardUi/revenue-chart"
import LatestInvoices from "@/app/ui/dashboardUi/latest-invoices"




export  default  async function Page(){

    
    const revenue = await fetchRevenue();

    const {collected , pending ,customers , invoices} =  await fetchCardData();
     const latestInvoices = await fetchLatestInvoices();

    // //  on verifie si les donnees sont vides
    // if(!revenue || !collected || !pending || !customers || !invoices || !latestInvoices){
    //     return <div className="text-center">Aucune donnée disponible</div>
    // }

    return (
        
        <main >
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Tableau de bord</h1>
            {/* cards  */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card   title='Factures collectées' value={collected}  type="collected"/>
                <Card   title='Factures en attente' value={pending}  type="pending"/>
                <Card   title='Nombre de clients' value={customers}  type="customers"/>
                <Card   title='Total des factures' value={invoices}  type="invoices"/>
            </div>



            {/* graphique des revenues par mois  */}
            <div className="mt-6 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue} />
            </div>

            {/* 5 dernieres factures avec leurs infos */}
             <LatestInvoices LatestInvoices={latestInvoices} />

        </main>

    )
}