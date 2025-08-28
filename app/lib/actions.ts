'use server'

import {z} from 'zod'


const FormSchema = z.object({
  id: z.string(),
  customerId : z.string() ,
    // convertir en number parce que l'entrée du user est en string et ts attend un number
  amount : z.coerce.number(),
  date: z.string(),
  status : z.enum(['pending' , 'paid'])

});

// on exlut les données du schema quon a pas besoin
const createInvoiceSchema = FormSchema.omit({id:true , date :true })


export async function createInvoiceAction(formData : FormData){

    const { customerId, amount, status } = createInvoiceSchema.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // ou on peut :  recuperes toutes les entrees du user en meme temps
    // const rawFormData = Object.fromEntries(formData.entries())


    //   transformer en centimes
    const amountInCents = amount*100

    // creer la date au moment de l'enregistrement de la facture 
    const date = new Date().toISOString().split('T')[0]

    
}