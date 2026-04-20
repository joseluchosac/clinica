import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flash } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CirclePlus, Pencil, Trash } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface LinkProps {
  active: boolean;
  label: string;
  url: string;
}

interface UserItem {
  id: number | null;
  name: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface UserPagination {
  data: UserItem[];
  links: LinkProps[];
  from: number;
  to: number;
  total: number;
  per_page: number;
}

interface FilterProps {
  search: string;
}

interface IndexProps {
  users: UserPagination;
  filters: FilterProps;
  request_all: {
    s_name: string;
    s_username: string;
    s_email: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/admin/users/index',
  },
];

export default function Index({ users }: IndexProps) {
  const {flash} = usePage<{flash?: Flash}>().props;

  useEffect(()=>{
    if(flash){
      if (flash.resp?.type == 'success') {
        toast.success(flash.resp?.msg);
      } else if (flash.resp?.type == 'error') {
        toast.error(flash.resp?.msg);
      }
    }
  },[flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* SECCION TABLA */}
        <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl px-4 pt-4 pb-2`}>
          <div className="flex justify-end gap-4 py-2">
            {/* <Button variant="outline" onClick={resetFilter}>
                        <RotateCcw /> reset
                    </Button> */}
            {/* SECCION FILTRADO */}
            <Button onClick={() => router.visit(route('admin.users.create'))}>
              <CirclePlus /> Nuevo usuario
            </Button>
          </div>

          <div className="grow overflow-hidden">
            <ScrollArea className="h-full rounded-md border">
              <Table>
                <TableHeader className="bg-blue-600">
                  <TableRow>
                    <TableHead className="p-2 text-blue-100">USUARIO</TableHead>
                    <TableHead className="p-2 text-blue-100">EMAIL</TableHead>
                    <TableHead className="p-2 text-blue-100">NOMBRE COMPLETO</TableHead>
                    <TableHead className="p-2 text-blue-100">CREADO</TableHead>
                    <TableHead className="p-2 text-blue-100">ACTUALIZADO</TableHead>
                    <TableHead className="p-2 text-blue-100"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[0.85rem]">
                  {users.data.length > 0 ? (
                    users.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-4 py-2 text-nowrap">{user.username}</TableCell>
                        <TableCell className="px-4 py-2 text-nowrap">{user.email}</TableCell>
                        <TableCell className="px-4 py-2 text-nowrap">{user.name}</TableCell>
                        <TableCell className="px-4 py-2 text-nowrap">{user.created_at?.split(' ')[0]}</TableCell>
                        <TableCell className="px-4 py-2 text-nowrap">{user.updated_at?.split(' ')[0]}</TableCell>
                        <TableCell className="px-4 py-2 text-nowrap">
                          <div className='flex gap-4'>
                            <Link 
                              className='hover:opacity-50 cursor-pointer text-blue-500'
                              href={route('admin.users.edit', user.id ?? '')}
                            >
                              <Pencil />
                            </Link>
                            <Link 
                              className='hover:opacity-50 cursor-pointer text-red-500'
                              href={route('admin.users.destroy', user.id ?? '')}
                            >
                              <Trash />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No hay pacientes</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          {/* <Pagination patients={patients} /> */}
        </div>
      </div>
    </AppLayout>
  );
}
