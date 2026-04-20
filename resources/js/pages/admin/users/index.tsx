import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flash } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
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

interface Actions {
  type: 'create' | 'update' | 'delete' | 'debug' | null;
  data: any;
}

export default function Index({ users }: IndexProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [action, setAction] = useState<Actions | null>(null);
  const formUser = useForm();
  const {flash} = usePage<{flash?: Flash}>().props;

  const handleDelete = (id: number | null) => {
    if (!id) return;
    setAction({ type: 'delete', data: id });
    setOpenConfirm(true);
  };

  const executeAction = () => {
    if (action?.type === 'delete') {
      formUser.delete(route('admin.users.destroy', action.data), {
        onError: () => toast.error('Error al eliminar usuarios'),
      });
    }
    setOpenConfirm(false);
  };

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
                        <div className='flex'>
                          <Button
                            asChild 
                            variant='link'
                            className='hover:opacity-90 text-blue-500'
                          >
                            <Link 
                              href={route('admin.users.edit', user.id ?? '')}
                            >
                              <Pencil />
                            </Link>

                          </Button>
                          <Button
                            variant='link'
                            className='hover:opacity-90 cursor-pointer text-red-500'
                            onClick={() => {
                              setTimeout(() => { // para espere el cerrado del dropdown
                                  handleDelete(user.id);
                                  console.log('eliminando')
                              }, 100);
                            }}
                          >
                            <Trash />
                          </Button>
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
      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="¿Confirmar acción?"
        description={
          action?.type === 'delete' ? 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar?' : '¿Deseas confirmar esta operación?'
        }
        onConfirm={executeAction}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
      />
    </AppLayout>
  );
}
