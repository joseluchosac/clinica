import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dialogConfirmInit } from '@/lib/utils';
import { BreadcrumbItem, Permission, Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Form {
  id: number | null;
  name: string;
  permissionsIds: number[]; // Array de IDs de permisos
}

interface Actions {
  type: 'create' | 'update' | 'delete' | null;
  data: any;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Roles',
    href: '/admin/roles',
  },
  {
    title: 'Edición',
    href: '/admin/roles/role-form',
  },
];

const formInit: Form = {
  id: null,
  name: '',
  permissionsIds: [],
};
interface RoleFormProps {
  role: Role | undefined;
  permissions: Permission[];
  rolePermissionsIds: number[] | undefined; // Array de IDs de permisos
}

export default function RoleForm({ ...props }: RoleFormProps) {
  const { role, permissions, rolePermissionsIds } = props;
  const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
  const [action, setAction] = useState<Actions | null>(null);
  const form = useForm(formInit);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.data.id) {
      setAction({ type: 'update', data: form.data.id });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Actualizar rol?',
        description: '¿Deseas confirmar esta operación?'
      });
    } else {
      setAction({ type: 'create', data: null });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Registrar rol?',
        description: '¿Deseas confirmar esta operación?'
      });
    }
  };

  const executeAction = () => {
    if (action?.type === 'update') {
      form.put(route('admin.roles.update', action.data), {
        onError: () => {
          toast.error('Error al actualizar el rol');
        },
      }) 
    } else if (action?.type === 'create') {
      form.post(route('admin.roles.store'), {
        onError: () => {
          toast.error('Error al registrar el rol');
        },
      });
    }
    setDialogConfirm({ ...dialogConfirm, open: false });
  };

  useEffect(() => {
    if(role){
      form.setData({
        ...form.data,
        id: role.id,
        name: role.name,
        permissionsIds: rolePermissionsIds ?? [], // Asignar los IDs de permisos al formulario
      });
    }
  }, [role]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-4 my-4 md:flex-row md:justify-between">
                <CardTitle>{form.data.id ? 'Actualizar rol' : 'Nuevo rol'}</CardTitle>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={route('admin.roles.index')}>
                      <X />
                      Cerrar
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                  // disabled={form.processing || !form.isDirty}
                  >
                    <Save /> {form.data.id ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej. Archivo"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                  />
                  <InputError message={form.errors.name} />
                </Field>
              </FieldGroup>
              <div className='text-sm font-medium mt-4 mb-2'>Permisos</div>
              <div className="md:columns-2 lg:columns-4 gap-2">
                {permissions.map((permission) => (
                  <div key={permission.id}>
                    <label>
                      <input
                        type="checkbox"
                        name="permissionsIds[]"
                        checked={form.data.permissionsIds.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setData('permissionsIds', [...form.data.permissionsIds, permission.id]);
                          } else {
                            form.setData('permissionsIds', form.data.permissionsIds.filter((id: number) => id !== permission.id));
                          }
                        }}
                      />
                      <span> {permission.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
        <ConfirmDialog
          open={dialogConfirm.open}
          onOpenChange={ (open) => setDialogConfirm({ ...dialogConfirm, open }) }
          title={dialogConfirm.title}
          description={dialogConfirm.description}
          onConfirm={executeAction}
          confirmText={dialogConfirm.confirmText}
          cancelText={dialogConfirm.cancelText}
        />
      </div>
    </AppLayout>
  );
}
