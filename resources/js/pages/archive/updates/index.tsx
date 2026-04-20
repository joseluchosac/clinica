import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Actualizaciones de historias',
        href: '/updates/index',
    },
];
export default function Index() {


    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actualizaciones de historias" />
            <div>Contenido de la pagina de actualizaciones</div>
        </AppLayout>
    );
}
