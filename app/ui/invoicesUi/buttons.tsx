import Link from "next/link";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteInvoiceAction } from "@/app/lib/actions";

export function CreateBtnInvoice() {
  return (
    <Link
      href="/dashboard/invoices/createInvoices"
      className=" flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-blue-600 "
    >
      <span className="hidden md:block">Créer une facture </span>
      <PlusIcon className="h-5 md:ml-5" />
    </Link>
  );
}

export function UpdateBtnInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover;bg-gray-100 "
    >
      <PencilIcon className=" w-5 " />
    </Link>
  );
}

export function DeleteBtnInvoice({ id }: { id: string }) {

  const DeleteInvoiceActionWithId = DeleteInvoiceAction.bind(null, id);
  
  return (
    <form action= {DeleteInvoiceActionWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Supprimer </span>
        <TrashIcon className=" w-5 " />
      </button>
    </form>
  );
}