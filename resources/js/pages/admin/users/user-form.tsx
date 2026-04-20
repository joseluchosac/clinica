import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Form {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Actions {
  type: 'create' | 'update' | 'delete' | null;
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
  id: 0,
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
};

export default function UserForm({ ...props }: { user: User | undefined }) {
  const { user } = props;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [action, setAction] = useState<Actions | null>(null);
  const form = useForm(formInit);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.data.id) {
      setAction({ type: 'update', data: form.data.id });
    } else {
      setAction({ type: 'create', data: null });
    }
    setOpenConfirm(true);
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
    }
  };

  useEffect(() => {
    if(user){
      form.setData({
        ...form.data,
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card>
          <CardContent>
            <form onSubmit={submit}>
              <div className="flex items-center justify-between">
                <CardTitle>{form.data.id ? 'Actualizar usuario' : 'Nuevo usuario'}</CardTitle>
                <div className="mt-2 flex items-center justify-end gap-4">
                  <Button asChild variant="outline">
                    <Link href={route('admin.users.index')}>
                      <X />
                      Cerrar
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                  // disabled={form.processing || !form.isDirty}
                  >
                    <Save /> {/* {patientId ? 'Actualizar' : 'Guardar'} */} Guardar
                  </Button>
                </div>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej. Juan Perez"
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
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                  />
                  <InputError message={form.errors.password} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password_confirmation">Confirmar contraseña</FieldLabel>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                  />
                  <InputError message={form.errors.password_confirmation} />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <ConfirmDialog
          open={openConfirm}
          onOpenChange={setOpenConfirm}
          title="¿Confirmar acción?"
          description={
            action?.type === 'delete'
              ? 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar?'
              : '¿Deseas confirmar esta operación?'
          }
          onConfirm={executeAction}
          confirmText="Sí, continuar"
          cancelText="Cancelar"
        />
      </div>
    </AppLayout>
  );
}
