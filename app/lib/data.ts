import { sql} from '@vercel/postgres';
import { formatCurrency } from './utils';
import { Revenue } from './definitions';
import { LatestInvoiceRaw } from './definitions';

// permet de recuperer les donnees de la base de donnee

export async function fetchCardData() {

    try{

        // 1) nombre de factures collectées
        const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;

        // 2) nombre de clients
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;

        // 3 ) total du montant des factures en attente et collectées
        const invoicesStatusPromise = sql` SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending" 
        FROM invoices`;


        // 4) on utilise Promise.all pour executer les 3 requetes en parallele et les stocker dans un tableau data
        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoicesStatusPromise   
        ])

        // 5) recuperer la somme des factures collectées :formaté en devise
        const totalPaidInvoices =  formatCurrency(data[2].rows[0].paid ?? 0)
        
        // 6) recuperer la somme des factures en attente :formaté en devise
        const totalPendingInvoices =  formatCurrency(data[2].rows[0].pending ?? 0) 

        // 7) recuperer le nombre de clients : converties en nombre
        const totalCustomers =Number(data[1].rows[0].count ?? 0) 

        // 8) recuperer le nombre de factures :converties en nombre
        const totalInvoices = Number(data[0].rows[0].count ?? 0)


        // 9) on retourne un objet avec les donnees
        return{
            collected: totalPaidInvoices,  // nombre de factures collectées
            pending:totalPendingInvoices, //nombre de factures en attente
            customers: totalCustomers, // nombre de clients
            invoices: totalInvoices // nombre de factures
        }


    }
    catch (error) {
        console.error("Error fetching card data:", error);
        throw new Error("Failed to fetch card data");
    }

}

export async function fetchRevenue() {
    try {
        // 1) on recupere les revenus mensuels des 12 derniers mois
        const data = await sql<Revenue>`SELECT * FROM revenue `
        
        return  data.rows;

            
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw new Error("Failed to fetch revenue data");
    }   
}


export async function fetchLatestInvoices() {
    try {
        // 1) on recupere les 5 dernieres factures :
        // avec info client et montant 
        const data = await sql<LatestInvoiceRaw>`
        SELECT invoices.amount ,invoices.id , customers.name , customers.image_url , customers.email 
        FROM invoices
        -- on fait une jointure entre les factures et les clients
        JOIN customers ON invoices.customer_id = customers.id
        -- ON filtre les 5 dernieres factures
        ORDER BY invoices.date DESC
        LIMIT 5
        `;    


        // 2) retourner un tableau en changeant le type de amount en string : devise  dollars
        const latestInvoices = data.rows.map((invoice)=>({
            ...invoice, 
            amount: formatCurrency(invoice.amount)  // on formate le montant en devise
        }))

        return latestInvoices;

    }   
    catch (error) {
        console.error("Error fetching latest invoices:", error);
        throw new Error("Failed to fetch latest invoices");
    }
}