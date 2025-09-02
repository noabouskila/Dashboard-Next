"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {signIn} from "@/auth"
import { AuthError } from "next-auth";

export type State = {
    errors?: {
        customerId?: string[] ,
        amount?: string[],
        status?: string[]
    } ,
    message?: string | null
}

// permet de valider le type et aussi la valeur des champs du formulaire
const FormSchema = z.object({
    id: z.string(),

    customerId: z.string({
        invalid_type_error : "veuillez selectionner un client"
    }),

    // convertir en number parce que l'entrée du user est en string et ts attend un number 
    amount: z.coerce.number().gt(0, { message: "le montant doit etre superieur a 0" }),

    date: z.string(),

    status: z.enum(["pending", "paid"], {
        invalid_type_error: "veuillez selectionner le  statut de la facture",
    }),
});

// on exlut les données du schema quon a pas besoin
const createInvoiceSchema = FormSchema.omit({ id: true, date: true });
const updateInvoiceSchema = FormSchema.omit({ id: true, date: true });

export async function createInvoiceAction(
    prevState: State,
    formData: FormData) 
{
    // safeParse valide les données et renvoie un objet avec success et error
    const validateFields = createInvoiceSchema.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
  });

  if(!validateFields.success) {
    return {
      // recuperer erreurs applaties dans un objet
      errors: validateFields.error.flatten().fieldErrors,
      message: "champs manquants; Echec de la création de la facture",
    };
  }

  const {customerId , amount , status} =  validateFields.data

  //   transformer en centimes
  const amountInCents = amount * 100;

  // creer la date au moment de l'enregistrement de la facture
  const date = new Date().toISOString().split("T")[0];

  // enregistrer la facture dans la base de donnee
  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, date, status)
        VALUES (${customerId}, ${amountInCents}, ${date}, ${status})
    `;

    // vider le cache  de route coté client puis le mettre a jour
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return {
      message:
        "erreur base de donnée  : echec  lors de la  creation de la facture",
    };
  }

  // rediection apres enregistrement en bdd en dehors de try catch
  redirect("/dashboard/invoices");
}

export async function UpdateInvoiceAction( id:string ,prevState:State , formData: FormData ) {

  const validateFields = updateInvoiceSchema.safeParse({

    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      // recuperer erreurs applaties dans un objet
      errors: validateFields.error.flatten().fieldErrors,
      message: "champs manquants; Echec de la modification de la facture",
    };
  }

  const { customerId, amount, status } = validateFields.data;

  //   transformer en centimes
  const amountInCents = amount * 100;

  // Modifier la facture dans la base de donnee avec un id specifique
    try {
        await sql`
            UPDATE invoices 
            SET 
            customer_id = ${customerId},
            amount = ${amountInCents},
            status = ${status}
            WHERE id = ${id}
        `;

    // vider le cache  de route coté client puis le mettre a jour
    revalidatePath("/dashboard/invoices");

    } catch (error) {
        return {
            message:
            "erreur base de donnée  : echec  lors de la modification de la facture",
        };  
    }



  // rediection apres enregistrement en bdd
  redirect("/dashboard/invoices");
}


export async function DeleteInvoiceAction(
  id: string
): Promise<void> {
  // throw new Error("simulation d'erreur : echec de la suprresion de la facture");

  try {
    await sql`
        DELETE FROM invoices 
        WHERE id = ${id}
         `;

    // vider le cache  de route coté client puis le mettre a jour
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    // return {
    //   message:
    //     "erreur base de donnée  : echec  lors de la suppression de la facture",
    console.error("Erreur lors de la suppression :", error)
    // };
    
  }
}



// authentification avec next auth
export async function authenticate(prevState: string | undefined , formData : FormData){

  try {
    await signIn('credentials' , formData)
    
  } catch (error) {
    if(error instanceof AuthError){

        switch (error.type) {
          case 'CredentialsSignin':
            return  'Identifiants invalides';
    
          default:
            return "Quelque chose s'est mal passé, veuillez réessayer.";
        }
    }

    throw error;
    
  }

}
