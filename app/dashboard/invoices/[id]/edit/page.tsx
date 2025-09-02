import { fetchInvoiceById } from '@/app/lib/data';
import { fetchCustomers } from '@/app/lib/data';
import BreadCrumbs from '@/app/ui/invoicesUi/breadCrumbs';
import EditForm from '@/app/ui/invoicesUi/EditForm';
import { notFound } from 'next/navigation';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier une facture",
};


export default async function EditInvoice( {params} :{  params: {id:string}} ){4

    const {id} = params;

    const [invoice , customers] = await  Promise.all([   
        fetchInvoiceById(id),
        fetchCustomers()
    ])

    //  condition pour gestion d'erreur si id n'existe pas
    if(!invoice) {
        notFound()
    }

  return (
        <main>
            <BreadCrumbs 
                breadCrumbs={[
                    {label : "Factures" , href : "/dashboard/invoices"},    
                    {label : "Modifier la facture", href : `/dashboard/invoices/${invoice.id}/edit` ,active : true},
                ]}  
            /> 

            <EditForm invoice={invoice} customers={customers} />
        </main>
    )
    
}