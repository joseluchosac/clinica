import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registro de datos',
        href: '/admission/register/index',
    },
];
export default function Index() {

    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registro de datos" />
            <div>Registro de datos</div>
        </AppLayout>
    );
}
