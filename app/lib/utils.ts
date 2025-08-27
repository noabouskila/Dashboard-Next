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

// formater une date au format local (fr-FR)
export const formatDateToLocal = (
    dateStr : string ,
    locale :string = 'fr-FR'
)=>{

    // convertir la chaine de caractere en objet Date
    const date = new Date(dateStr);
    
    // Intl.DateTimeFormat pour formater des dates en fonction de la langue/région.
    const options : Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    // utiliser Intl.DateTimeFormat pour formater la date selon le locale spécifié
    const formatter = new Intl.DateTimeFormat(locale, options)

    return formatter.format(date);
}

// -----------------------------------------------------------------
export const generatePagination = (currentPage : number , totalPages : number ) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // si on est dans les 3 premiers pages , si oui afficher :
  // [1][2][3] [...][5][6]
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // si on est dans les  3 dernieres pages ,si oui afficher
  // [1][2] [...][4][5][6]
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // si la page actuelle  fait partie pages du milieu ,si oui afficher :
  // [1] [...]  [currentPage-1] [currentPage ] [currentPage+1][...] [totalPages]
  if (currentPage >= totalPages - 2) {
    return [1, "...", currentPage-1 , currentPage , currentPage + 1,"..." , totalPages];
  }
}