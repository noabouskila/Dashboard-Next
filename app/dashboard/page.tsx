import { lusitana } from "@/app/ui/fonts"
import { Card } from '@/app/ui/dashboardUi/cards'
import { fetchCardData } from "@/app/lib/data"




export  default  async function Page(){


    const {collected} =  await fetchCardData();

    return (
        
        <main >
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Tableau de bord</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card   title='collecté' value={collected}  type="collected"/>
            </div>
        </main>

    )
}