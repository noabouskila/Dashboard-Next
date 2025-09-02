import { sql} from '@vercel/postgres';
import { formatCurrency } from './utils';
import { InvoicesTable, Revenue , CustomerField ,LatestInvoiceRaw , InvoiceForm , CustomersTableType , FormattedCustomersTable } from './definitions';

import { unstable_noStore as noStore } from 'next/cache';

// permet de recuperer les donnees de la base de donnee

export async function fetchCardData() {
    noStore(); // empeche la mise en cache de cette fonction
    try{

        // ici on met le await seulement a la fin en promiseAll pour faire les requetes en paralelle

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
    noStore();

    // // simulation du temps de chargement 
    // console.log("recuperation des donnéees de revenue...");
    // await new Promise ((resolve)=> 
    //     (setTimeout(resolve , 3000)
    // ) )
    // // 


    try {
        // 1) on recupere les revenus mensuels des 12 derniers mois
        const data = await sql<Revenue>`SELECT * FROM revenue `
        
        // console.log("Recuperation des données de revenue terminée  apres 3 secondes");

        return  data.rows;

            
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw new Error("Failed to fetch revenue data");
    }   
}


export async function fetchLatestInvoices() {
    noStore();

    //    // simulation du temps de chargement 
    // console.log("recuperation des donnéees des dernieres factures ...");
    // await new Promise ((resolve)=> 
    //     (setTimeout(resolve , 1500)
    // ) )
    // // 

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

        // console.log("Recuperation des données de revenue terminée  apres 1.5 secondes");

        return latestInvoices;

    }   
    catch (error) {
        console.error("Error fetching latest invoices:", error);
        throw new Error("Failed to fetch latest invoices");
    }
}



const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query :string , currentPage : number) {

    noStore()
    // commencer la pagination a partir de 0
    // offset definit le nombre d'elements a sauter avant de commencer a recuperer les elements cest a dire le point de depart des elements a recuperer
    const offset = (currentPage - 1)*ITEMS_PER_PAGE

    try{
        

        const invoices = await sql<InvoicesTable>`
        SELECT
        invoices.id ,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name ,
        customers.email,
        customers.image_url

        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id

        WHERE
        customers.name ILIKE ${`%${query}%`}::text
        OR customers.email ILIKE ${`%${query}%`}::text
        OR invoices.amount::text ILIKE ${`%${query}%`}::text
        OR invoices.date::text ILIKE ${`%${query}%`}::text
        OR invoices.status ILIKE ${`%${query}%`}::text

        ORDER BY invoices.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
        // ilike permet  de faire une recherhe de comparaison insensible a la casse
        // ::text permet de convertir un champ en texte pour pouvoir faire une recherche avec ilike


        return invoices.rows
        // .rows permet de recuperer que le tableau des resultats pas les metadonnées

    }catch (error) {
        console.error("Error fetching filtered invoices:", error);
        console.dir(error, { depth: null });
        throw new Error("Failed to fetch filtered invoices");
    }
}


export async function fetchInvoicesPages(query :string) {

    noStore()

    try{

        // total du nombre de factures correspondant a la recherche
        const count = await sql`SELECT COUNT(*) 
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        WHERE 
        customers.name ILIKE ${`%${query}%`}::text
        OR customers.email ILIKE ${`%${query}%`}::text
        OR invoices.amount::text ILIKE ${`%${query}%`}::text
        OR invoices.date::text ILIKE ${`%${query}%`}::text
        OR invoices.status ILIKE ${`%${query}%`}::text
        `;

        // arrondir à l'entier supérieur pour obtenir le nombre total de pages
        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)

        return totalPages;

    }catch (error) {
        console.error("Error fetching invoices pages:", error);
        throw new Error("Failed to fetch ivoices pages");
    }
        
       
}

export async function fetchCustomers(){
    noStore()

    try {
      //  odre croissant au niveau du name
      const data = await sql<CustomerField>`
        SELECT 
            id , 
            name 
        FROM 
        customers 
        ORDER BY name 
        ASC`;

      // acceder aux lignes rows de la requetes
      const customers = data.rows;
      return customers;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw new Error("Failed to fetch customers");
    }
        
}


export async function fetchInvoiceById(id : string){
    noStore()

    try {
        const data = await sql<InvoiceForm>`
        SELECT
        invoices.id,
        invoices.customer_id ,
        invoices.amount,
        invoices.status
        FROM invoices
        WHERE invoices.id = ${id};
        `;

        const invoice = data.rows.map((invoice)=>({
            ...invoice,
            amount: invoice.amount / 100  // convertir en dollars
        }))

        return invoice[0]; // retourner la premiere ligne (la facture correspondante)
        
    } catch (error) {
        
        // console.error("Error fetching invoice by id:", error);
        // throw new Error("Failed to fetch invoice by id");

        return null; // pour gerer l'erreur dans la page de notFound
    }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
)
// : Promise<FormattedCustomersTable[]>
 {

  noStore();

  // commencer la pagination a partir de 0
  // offset definit le nombre d'elements a sauter avant de commencer a recuperer les elements cest a dire le point de depart des elements a recuperer
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<CustomersTableType>`
            SELECT
            customers.id,
            customers.name,
            customers.email,
            customers.image_url,

            COUNT(invoices.id) AS total_invoices,
            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid

            FROM customers
            LEFT JOIN invoices ON customers.id = invoices.customer_id

            WHERE
                customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`}
            GROUP BY customers.id, customers.name, customers.email, customers.image_url
            ORDER BY customers.name ASC`;

    // formater les donnees pour l'affichage
    // const customers: FormattedCustomersTable[] = data.rows.map((customer) => ({
    //   ...customer,
    //   total_invoices: Number(customer.total_invoices ?? 0),
    //   total_pending: formatCurrency(Number(customer.total_pending ?? 0)),
    //   total_paid: formatCurrency(Number(customer.total_paid ?? 0)),
    // }));

    // formater les donnees pour l'affichage
    const customers= data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending ?? 0),
      total_paid: formatCurrency(customer.total_paid ?? 0),
    }));

    console.log("customers");
    console.log(customers);

    return customers;
  } catch (error) {
    console.error("Error fetching filtered customers:", error);
    throw new Error("Failed to fetch filtered customers");
  }
}