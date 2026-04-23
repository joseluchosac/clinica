import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/custom/pagination';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dialogConfirmInit } from '@/lib/utils';
import { BreadcrumbItem, Flash, Permission } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Permisos',
    href: '/admin/permissions/index',
  },
];
interface Actions {
  type: 'create' | 'update' | 'delete' | 'debug' | null;
  data: any;
}
interface LinkProps {
  active: boolean;
  label: string;
  url: string;
}

interface RolePagination {
  data: Permission[];
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
  permissions: RolePagination;
  filters: FilterProps;
}

export default function Index({ permissions, filters }: IndexProps) {
  const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
  const [action, setAction] = useState<Actions | null>(null);
  const formPermission = useForm();
  const formSearch = useForm({ search: filters.search ?? '' });
  const { flash } = usePage<{ flash?: Flash }>().props;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === formSearch.data.search) return; // para evitar consultas iguales
    formSearch.setData('search', value);
    const queryString = value ? { search: value } : {};
    router.get(route('admin.permissions.index'), queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }

  const handleDelete = (id: number | null) => {
    if (!id) return;
    setAction({ type: 'delete', data: id });
    setDialogConfirm({
      ...dialogConfirm,
      open: true,
      title: '¿Eliminar permiso?',
      description: 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar?'
    });
  };

  const executeAction = () => {
    if (action?.type === 'delete') {
      formPermission.delete(route('admin.permissions.destroy', action.data), {
        onError: () => toast.error('Error al eliminar permiso'),
      });
    }
    setDialogConfirm({ ...dialogConfirm, open: false });
  };

  useEffect(() => {
    if (flash) {
      if (flash.resp?.type == 'success') {
        toast.success(flash.resp?.msg);
      } else if (flash.resp?.type == 'error') {
        toast.error(flash.resp?.msg);
      }
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permisos" />
      {/* SECCION TABLA */}
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl px-4 pt-4 pb-2`}>
        <div className="flex justify-end gap-4 py-2">
          <Input
            type='search'
            name='search'
            placeholder="Buscar..."
            value={formSearch.data.search}
            onChange={handleSearch}
          // value={filters.search}
          // onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          {/* <Button variant="outline" onClick={resetFilter}>
                      <RotateCcw /> reset
                  </Button> */}
          {/* SECCION FILTRADO */}
          <Button onClick={() => router.visit(route('admin.permissions.create'))}>
            <CirclePlus /> Nuevo permiso
          </Button>
        </div>

        <div className="grow overflow-hidden">
          <ScrollArea className="h-full rounded-md border">
            <Table>
              <TableHeader className="bg-blue-600">
                <TableRow>
                  <TableHead className="p-2 text-blue-100">PERMISO</TableHead>
                  <TableHead className="p-2 text-blue-100">ROLES</TableHead>
                  <TableHead className="p-2 text-blue-100">CREADO</TableHead>
                  <TableHead className="p-2 text-blue-100">ACTUALIZADO</TableHead>
                  <TableHead className="p-2 text-blue-100"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[0.85rem]">
                {permissions.data.length > 0 ? (
                  permissions.data.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="px-4 py-2 text-nowrap">{permission.name}</TableCell>
                      <TableCell className="px-4 py-2 text-nowrap">
                        <div className='flex flex-wrap gap-2'>
                          {permission?.roles?.map((role) => (
                            <div className='bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-center rounded-sm' key={role.id}>{role.name}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-nowrap">{permission.created_at?.split(' ')[0]}</TableCell>
                      <TableCell className="px-4 py-2 text-nowrap">{permission.updated_at?.split(' ')[0]}</TableCell>
                      <TableCell className="px-4 py-2 text-nowrap">
                        <div className='flex'>
                          <Button
                            asChild
                            variant='link'
                            className='hover:opacity-90 text-blue-500'
                          >
                            <Link
                              href={route('admin.permissions.edit', permission.id ?? '')}
                            >
                              <Pencil />
                            </Link>

                          </Button>
                          <Button
                            variant='link'
                            className='hover:opacity-90 cursor-pointer text-red-500'
                            onClick={() => {
                              setTimeout(() => { // para espere el cerrado del dropdown
                                handleDelete(permission.id);
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
        <Pagination paginationData={permissions} />
      </div>
      <ConfirmDialog
          open={dialogConfirm.open}
          onOpenChange={ (open) => setDialogConfirm({ ...dialogConfirm, open }) }
          title={dialogConfirm.title}
          description={dialogConfirm.description}
          onConfirm={executeAction}
          confirmText={dialogConfirm.confirmText}
          cancelText={dialogConfirm.cancelText}
        />
    </AppLayout>
  );
}
