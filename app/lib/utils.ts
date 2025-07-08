

export const  formatCurrency  = (amount: number)  =>{

    //  divise la valeur par 100 : amount est exprimé en centimes (comme souvent en base de données ou dans les APIs Stripe).
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}