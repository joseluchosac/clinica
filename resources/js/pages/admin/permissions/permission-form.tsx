import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dialogConfirmInit } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Form {
  id: number | null;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface Actions {
  type: 'create' | 'update' | 'delete' | null;
  data: any;
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Permisos',
    href: '/admin/permissions',
  },
  {
    title: 'Edición',
    href: '/admin/permissions/permission-form',
  },
];

const formInit: Form = {
  id: null,
  name: '',
};

export default function PermissionForm({ ...props }: { permission: Permission | undefined }) {
  const { permission } = props;
  const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
  const [action, setAction] = useState<Actions | null>(null);
  const form = useForm(formInit);

  const hadleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.data.id) {
      setAction({ type: 'update', data: form.data.id });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Actualizar permiso?',
        description: '¿Deseas confirmar esta operación?'
      });
    } else {
      setAction({ type: 'create', data: null });
      setDialogConfirm({
        ...dialogConfirm,
        open: true,
        title: '¿Registrar permiso?',
        description: '¿Deseas confirmar esta operación?'
      });
    }

  };

  const executeAction = () => {
    if (action?.type === 'update') {
      form.put(route('admin.permissions.update', action.data), {
        onError: () => {
          toast.error('Error al actualizar el permiso');
        },
      }) 
    } else if (action?.type === 'create') {
      form.post(route('admin.permissions.store'), {
        onError: () => {
          toast.error('Error al registrar el permiso');
        },
      });
    }
    setDialogConfirm({ ...dialogConfirm, open: false });
  };

  useEffect(() => {
    if(permission){
      form.setData({
        ...form.data,
        id: permission.id,
        name: permission.name,
      });
    }
  }, [permission]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permisos" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card>
          <CardContent>
            <form onSubmit={hadleSubmit}>
              <div className="flex flex-col items-center gap-4 my-4 md:flex-row md:justify-between">
                <CardTitle>{form.data.id ? 'Actualizar permiso' : 'Nuevo permiso'}</CardTitle>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={route('admin.permissions.index')}>
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
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej. read_patients"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                  />
                  <InputError message={form.errors.name} />
                </Field>
              </FieldGroup>
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
