import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/user/Users',
    },
];

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
}

export default function Index({ users }: { users: User[] }) {
    useEffect(() => {
        console.log(users);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">Pagina de usuarios lista</div>
        </AppLayout>
    );
}
