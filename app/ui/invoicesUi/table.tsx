import {fetchFilteredInvoices} from "@/app/lib/data";
import { formatCurrency } from "@/app/lib/utils";
import { formatDateToLocal } from "@/app/lib/utils";
import Image from 'next/image';


export default async function InvoiceTable({ 
    query , currentPage 
    } : {   
    query:string ;
    currentPage:number
}){


    const invoices = await fetchFilteredInvoices(query , currentPage);
    // console.log("invoices", invoices);


  
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {/* Pour les petits écrans */}
              {invoices?.map((invoice) => (
                <div
                  key={invoice.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="mb-2 flex items-center">
                      <Image
                        className="mr-2 rounded-full "
                        src={invoice.image_url}
                        alt="image client"
                        width={50}
                        height={50}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(invoice.amount)}
                      </p>
                      {formatDateToLocal(invoice.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

              {/* Pour les grands écrans */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Client
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Montant
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {invoices?.map((invoice) => (
                      <tr
                        key={invoice.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <Image
                              className="mr-2 rounded-full "
                              src={invoice.image_url}
                              alt={`photo de profil de ${invoice.name}`}
                              width={28}
                              height={28}
                            />
                            <p>{invoice.name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {invoice.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {formatDateToLocal(invoice.date)}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            
          </div>
        </div>
      </div>
    );

}