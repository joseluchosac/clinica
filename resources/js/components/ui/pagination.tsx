import { Link } from "@inertiajs/react"

interface LinkProps {
  active: boolean;
  label: string;
  url: string | null;
}
interface PaginationData {
  links: LinkProps[];
  from: number;
  to: number;
  total: number;
  per_page: number;
}
export const Pagination = ({ patients }: { patients: PaginationData }) => {
  return (
    <div className="flex gap-2 justify-between overflow-x-auto min-h-[43px]">
      <small>Mostrando: {patients.from} - {patients.to} de {patients.total} reg</small>
      <div className="flex gap-1 align-middle my-1">
        {patients.links.map((link, index) => (
          <Link
            className= {`px-2 py-1 h-full border rounded text-sm ${link.active ? 'dark:bg-white dark:text-black bg-black text-white' : ''} ${link.active || link.label == '...' ? 'pointer-events-none' : ''}`}
            key={index}
            href={link.url || '#'}
            // dangerouslySetInnerHTML={{__html: link.label}}
          >
            {link.label == "&laquo; Anterior" ? "<" : link.label == "Siguiente &raquo;" ? ">" : link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}