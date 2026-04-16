import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Movimiento de historias',
        href: '/movements/index',
    },
];
export default function Index() {

    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimiento de historias" />
            <div>Contenido de la pagina de movimientos</div>
        </AppLayout>
    );
}
