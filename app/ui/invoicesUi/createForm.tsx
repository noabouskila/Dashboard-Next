import { useActionState } from "react";

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { CustomerField } from "@/app/lib/definitions";
import { createInvoiceAction } from "@/app/lib/actions";

export default function CreateForm({ customers }:{ customers : CustomerField[]}) {

  const initialState = {
    message: "",
    errors: {}
  };
  const [state, dispatch] = useActionState(createInvoiceAction, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nom du client */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Sélectionner un client
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              // decrit l'element qui cause l'erreur
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Choisir un client
              </option>

              {/* MAP CUSTOMERS */}
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* gestion d'erreur */}
          <div
            id="customer-error"
            aria-live="polite" // annonce les changements de texte aux lecteurs d'ecran seulement quand le user interagit avec le formulaire
            aria-atomic="true" // annonce le contenu entier de l'element lorsqu'il change
          >
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Montant de la facture */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choisir un montant
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Entrez un montant en USD"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // required
                // decrit l'element qui cause l'erreur
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>

            {/* gestion d'erreur */}
            <div
              id="amount-error"
              aria-live="polite" // annonce les changements de texte aux lecteurs d'ecran seulement quand le user interagit avec le formulaire
              aria-atomic="true" // annonce le contenu entier de l'element lorsqu'il change
            >
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p key={error} className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* Statut de la facture */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Définir le statut de la facture
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  // decrit l'element qui cause l'erreur
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  En attente <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  // decrit l'element qui cause l'erreur
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Payé <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>

          {/* gestion d'erreur */}
          <div
            id="status-error"
            aria-live="polite" // annonce les changements de texte aux lecteurs d'ecran seulement quand le user interagit avec le formulaire
            aria-atomic="true" // annonce le contenu entier de l'element lorsqu'il change
          >
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {/* Message d'erreur global */}
        <div
          aria-live="polite" // annonce les changements de texte aux lecteurs d'ecran seulement quand le user interagit avec le formulaire
          aria-atomic="true" // annonce le contenu entier de l'element lorsqu'il change
        >
          {state.message?(
              <p  className="mt-2 text-sm text-red-500">
                {state.message}
              </p>
            ) : null
          }
        </div>



      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Annuler
        </Link>
        <Button type="submit">Créer une facture</Button>
      </div>
    </form>
  );
}
