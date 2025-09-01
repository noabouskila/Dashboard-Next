import { FaceFrownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex h-full  flex-col items-center justify-center gap-2 ">

            <FaceFrownIcon className="w-10 text-gray-400"/>

            <h2 className="text-xl font-semibold ">404 | page introuvable </h2>
            <p>La facture demandée est introuvable </p>
            <Link href="/dashboard/invoices" className="mt-4 rounde-md bg-blue-500 px-4 py-2 text-sm  text-white hover:bg-blue-400 transition-colors">
                Retourner aux factures  
            </Link>
        </main>
    )
}