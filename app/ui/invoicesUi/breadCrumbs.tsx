
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";

interface BreadCrumb {
    label : string ;
    href : string ;
    active? : boolean;
}


export default function BreadCrumbs({ breadCrumbs }: { breadCrumbs : BreadCrumb[] }) {



  return (
    <nav aria-label="BreadCrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, "flex text-xl md:text-2xl")}>
        {breadCrumbs.map((breadCrumb , index) => (
          <li
            key={breadCrumb.href}
            aria-current={breadCrumb.active}
            className={clsx(
              breadCrumb.active ? "text-gray-900" : "text-gray-500"
            )}
          >
            <Link href={breadCrumb.href}>{breadCrumb.label} </Link>

            {
                //pour le slash / attention breadCrumbs avec un S : pour avoir length
                index < breadCrumbs.length -1 ? (
                    <span className="mx-3 inline-block">/</span>
                ) : null

            }
          </li>
        ))}
      </ol>
    </nav>
  );


}
