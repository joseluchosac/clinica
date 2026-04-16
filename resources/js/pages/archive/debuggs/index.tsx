import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Depuración de historias',
        href: '/debuggs/index',
    },
];
export default function Index() {

    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimiento de historias" />
            <div>Contenido de la pagina de depuraciones</div>
        </AppLayout>
    );
}
