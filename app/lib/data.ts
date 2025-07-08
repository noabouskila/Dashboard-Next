import { sql} from '@vercel/postgres';
import { formatCurrency } from './utils';

// permet de recuperer les donnees de la base de donnee

export async function fetchCardData() {

    try{
        // de facon alternative, on peut faire une seule requete pour recuperer les 4 valeurs

        // const { rows } = await sql`
        //     SELECT 
        //         (SELECT COUNT(*) FROM invoices WHERE status = 'collected') AS collected,
        //         (SELECT COUNT(*) FROM invoices WHERE status = 'pending') AS pending,
        //         (SELECT COUNT(*) FROM customers) AS customers,
        //         (SELECT COUNT(*) FROM invoices) AS invoices
        // `;

        // if (rows.length === 0) {
        //     throw new Error("No data found");
        // }

        // return {
        //     collected: rows[0].collected,
        //     pending: rows[0].pending,
        //     customers: rows[0].customers,
        //     invoices: rows[0].invoices
        // };

        // sinon, on peut faire plusieurs requetes pour recuperer les 4 valeurs

        // 1) nombre de factures collectées
        const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
        // 15

        // 2) nombre de clients
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
        // 10

        // 3 ) nombre de factures en attente et collectées
        const invoicesStatusPromise = sql` SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending" 
        FROM invoices`;

        // paid : 	237032
        // pending : 251264


        // on utilise Promise.all pour executer les 3 requetes en parallele
        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoicesStatusPromise   
        ])

        // recuperer la somme des factures collectées 
        // 3eme requete du tableau data => puis dans la ligne 0 de la bdd , de la section paid
        // formaté en devise
        const totalPaidInvoices =  formatCurrency(data[2].rows[0].paid ?? 0)
        
        // recuperer la somme des factures en attente
        const totalPendingInvoices =  formatCurrency(data[2].rows[0].pending ?? 0) 

        return{
            collected: totalPaidInvoices,  // nombre de factures collectées
            // pending:totalPendingInvoices, //nombre de factures en attente
            // customers: data[1].rows[0].customers, // nombre de clients
            // invoices: data[0].rows[0].invoices // nombre de factures
        }


    }
    catch (error) {
        console.error("Error fetching card data:", error);
        throw new Error("Failed to fetch card data");
    }

}