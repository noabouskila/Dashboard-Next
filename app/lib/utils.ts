import { Revenue } from "./definitions";


export const  formatCurrency  = (amount: number)  =>{

    //  divise la valeur par 100 : amount est exprimé en centimes (comme souvent en base de données ou dans les APIs Stripe).
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}

// -----------------------------------------------------------------
// Générer une échelle pour l’axe Y  (arrodie vers le seuil superieur) d’un graphique de revenus mensuels.



// obtenir la valeur maximale en calculant la valeur maxximale de la propriete revenue : pour chaque objet du tableau revenue 
export const generateYAxis = (revenue : Revenue []) => {

    // avec map :  extraire toutes les valeurs de revenue dans un tableau via le destructuringpour chaque mois 
    //  puis Math.max  pour obtenir la valeur la valeur la plus élevée : representant le montant le + elevé des revenus 
 
    // => on peut  faire un map car on  a passer la props revenue en array 
    const highestRecord =  Math.max(...revenue.map( (month) => month.revenue ))

    //  /1000  et darrondir vers le haut (ceil)  la valeur maximale : pr obtenir un nombre rond 
    // => pour avoir une etiquette maximal dans le graphique qui sera aggrandit au seuil superieur ===> + lisible 
    const topLabel =  Math.ceil(highestRecord / 1000) *1000

    return topLabel
}