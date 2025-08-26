// import { Revenue } from "@/app/lib/definitions";
import { generateYAxis } from "@/app/lib/utils";
import { lusitana } from "@/app/ui/fonts";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {fetchRevenue} from "@/app/lib/data"



// export  default  async function RevenueChart( { revenue } : {revenue: Revenue[]}) {
export  default  async function RevenueChart() {

    const revenue =await fetchRevenue(); // appel de la fonction dans ce composant  pour simuler le chargement de skeleton que dans ce composant precis 



    // definir la hauteur du graphique
    const chartHeight = 350;

    const topLabel = generateYAxis(revenue)

    if(!revenue || revenue.length === 0) {
        return (
            <p className="mt-4 text-gray-400"> Pas de data disponible !</p>
        )
    }


    return (
     <div className="w-full md:col-span-4 ">
        <h2 className= {`${lusitana.className} mb-4 text-xl md:text-2xl`}>Revenus récents</h2>

        <div className="rounded-xl bg-gray-50 p-4 ">
            <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
                {revenue.map((month) => (
                    // les barres du graphique des revenus par mois
                    <div key={month.month} className="flex flex-col items-center gap-2 ">
                        <div 
                        className="w-full rounded-md bg-blue-300" 
                        // Convertir une valeur de revenu (en € ou autre) en hauteur en pixels,

                        // En fonction de l’échelle maximale (topLabel),

                        // Pour dessiner des barres proportionnelles et bien calibrées dans le graphique
                        style={{ 
                            height: `${(chartHeight / topLabel) * month.revenue }px` }}>


                        </div>

                        {/* le mois */}
                        <p className="rotate-90 text-sm text-gray-400 sm:rotate-0">
                            {month.month}
                        </p>

                    </div>
                ))}

                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500"> 12 derniers mois </h3>
                </div>

            </div>
        </div>
            
    

     </div>
       
    );
}