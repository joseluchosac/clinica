import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dialogConfirmInit } from '@/lib/utils';
import { BreadcrumbItem, Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { KeySquare, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Form {
  id: number | null;
  name: string;
  username: string;
  email: string;
  rolesIds: number[]; // Array de IDs de roles
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Actions {
  type: 'create' | 'update' | 'delete' | 'reset-psw' | null;
  data: any;
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/admin/users',
  },
  {
    title: 'Nuevo',
    href: '/admin/users/user-form',
  },
];

const formInit: Form = {
  id: null,
  name: '',
  username: '',
  email: '',
  rolesIds: [],
};

interface UserFormProps {
  user: User | undefined;
  roles: Role[];
  userRolesIds: number[] | undefined;
}
export default function UserForm({ ...props }: UserFormProps) {
  const { user, roles, userRolesIds } = props;
  const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
  const [action, setAction] = useState<Actions | null>(null);
  const form = useForm(formInit);
  const formResetPsw = useForm({id: ''});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.data.id) {
      setAction({ type: 'update', data: form.data.id });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Actualizar usuario?',
        description: '¿Deseas actualizar los datos de este usuario?'
      });
    } else {
      setAction({ type: 'create', data: null });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Registrar nuevo usuario?',
        description: '¿Deseas registrar este nuevo usuario?'
      });
    }
  };

  const handleResetPassword = () => {
    setAction({ type: 'reset-psw', data: form.data.id });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Resetear contraseña?',
        description: '¿Deseas resetear la contraseña de este usuario? La nueva contraseña será "123456789"?'
      });
  };

  const executeAction = () => {
    if (action?.type === 'update') {
      form.put(route('admin.users.update', action.data), {
        onError: () => {
          toast.error('Error al actualizar el usuario');
        },
      }) 
    } else if (action?.type === 'create') {
      form.post(route('admin.users.store'), {
        onError: () => {
          toast.error('Error al registrar el usuario');
        },
      });
    } else if (action?.type === 'reset-psw') {
      formResetPsw.post(route('admin.users.reset-psw', action.data), {
        onError: () => {
          toast.error('Error al resetear la contraseña');
        },
      });
    }
    setDialogConfirm({ ...dialogConfirm, open: false });
  };

  useEffect(() => {
    if(user){
      form.setData({
        ...form.data,
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        rolesIds: userRolesIds ?? [], // Asignar los IDs de roles al formulario
      });
    }
  }, [user]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-4 my-4 md:flex-row md:justify-between">
                <CardTitle>{form.data.id ? 'Actualizar usuario' : 'Nuevo usuario'}</CardTitle>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={route('admin.users.index')}>
                      <X />
                      Cerrar
                    </Link>
                  </Button>
                  {form.data.id && (
                    <Button
                      variant='outline'
                      type="button"
                      // disabled={form.processing || !form.isDirty}
                      onClick={handleResetPassword}
                    >
                      <KeySquare /> Resetear password
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={form.processing || !form.isDirty}
                  >
                    <Save /> {form.data.id ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombres</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Apellidos y nombres: Ej. Juan Perez"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                  />
                  <InputError message={form.errors.name} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
                  <Input
                    disabled={form.data.id ? true : false}
                    id="username"
                    name="username"
                    placeholder="Ej. juan"
                    value={form.data.username}
                    onChange={(e) => form.setData('username', e.target.value)}
                  />
                  <InputError message={form.errors.username} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                  />
                  <InputError message={form.errors.email} />
                </Field>
              </FieldGroup>
              <div className='text-sm font-medium mt-4 mb-2'>Roles (Seleccionar solo uno)</div>
              <div className="md:columns-2 lg:columns-4 gap-2">
                {roles.map((role) => (
                  <div key={role.id}>
                    <label>
                      <input
                        type="checkbox"
                        name="rolesIds[]"
                        checked={form.data.rolesIds.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setData('rolesIds', [...form.data.rolesIds, role.id]);
                          } else {
                            form.setData('rolesIds', form.data.rolesIds.filter((id: number) => id !== role.id));
                          }
                        }}
                      />
                      <span> {role.name}</span>
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
