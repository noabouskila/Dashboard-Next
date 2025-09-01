"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  // convertir en number parce que l'entrée du user est en string et ts attend un number
  amount: z.coerce.number(),
  date: z.string(),
  status: z.enum(["pending", "paid"]),
});

// on exlut les données du schema quon a pas besoin
const createInvoiceSchema = FormSchema.omit({ id: true, date: true });
const updateInvoiceSchema = FormSchema.omit({ id: true, date: true });

export async function createInvoiceAction(formData: FormData) {
  const { customerId, amount, status } = createInvoiceSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // ou on peut :  recuperes toutes les entrees du user en meme temps
  // const rawFormData = Object.fromEntries(formData.entries())

  //   transformer en centimes
  const amountInCents = amount * 100;

  // creer la date au moment de l'enregistrement de la facture
  const date = new Date().toISOString().split("T")[0];

  // enregistrer la facture dans la base de donnee
  // try { on verra plus tard pour la gestion d'erreur

  await sql`
        INSERT INTO invoices (customer_id, amount, date, status)
        VALUES (${customerId}, ${amountInCents}, ${date}, ${status})
        `;

  // vider le cache  de route coté client puis le mettre a jour
  revalidatePath("/dashboard/invoices");

  // rediection apres enregistrement en bdd
  redirect("/dashboard/invoices");

  // }catch (error) {
  //     console.error("Error creating invoice:", error);
  //     // throw new Error("Failed to create invoice");
  // }
}

export async function UpdateInvoiceAction(id:string , formData: FormData ) {
  const { customerId, amount, status } = updateInvoiceSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // ou on peut :  recuperes toutes les entrees du user en meme temps
  // const rawFormData = Object.fromEntries(formData.entries())

  //   transformer en centimes
  const amountInCents = amount * 100;

  // Modifier la facture dans la base de donnee avec un id specifique
  // try { on verra plus tard pour la gestion d'erreur

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

  // rediection apres enregistrement en bdd
  redirect("/dashboard/invoices");

  // }catch (error) {
  //     console.error("Error creating invoice:", error);
  //     // throw new Error("Failed to create invoice");
  // }
}

export async function DeleteInvoiceAction(id: string) {

  // try { on verra plus tard pour la gestion d'erreur

    await sql`
        DELETE FROM invoices 
        WHERE id = ${id}
         `;

  // vider le cache  de route coté client puis le mettre a jour
  revalidatePath("/dashboard/invoices");

  // }catch (error) {
  //     console.error("Error creating invoice:", error);
  //     // throw new Error("Failed to create invoice");
  // }
}