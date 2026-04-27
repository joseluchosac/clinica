import HeadingSmall from "@/components/heading-small";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/app_settings/layout";
import { BreadcrumbItem, Flash } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { Transition } from "@headlessui/react";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Configuración de pacientes',
    href: '/config/patients',
  },
];

type PatientsProps = {
  correlativeNhc: {
    name: string;
    value: number;
    updated_at: string;
  };
  maxNhc: number | undefined;
}

export default function Patients({ correlativeNhc, maxNhc }: PatientsProps) {
  const page = usePage()
  const { flash } = page.props as { flash?: Flash };

  const patientForm = useForm({
    value: correlativeNhc.value || '',
  });

  const patientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      patientForm.patch(route('app-settings.correlative-nhc.update'));
  };

  useEffect(() => {
    if (flash?.resp?.action == 'correlativeNhcUpdate') {
      if (flash?.resp?.type == 'success') {
        toast.success(flash?.resp?.msg);
      } else if (flash?.resp?.type == 'error') {
        toast.error(flash?.resp?.msg);
      }
    }
  }, [flash])
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Autonumaración de HC" description={`Modifique la autonumeración de las historias clínicas, se sugiere ${maxNhc ? maxNhc + 1 : 1}`} />
           <form
            onSubmit={patientFormSubmit}
            className="space-y-6"
          >
            <div className="grid gap-2">
              <Label>Siguiente Nhc</Label>
              <Input
                type="number"
                id="name"
                className="mt-1 block w-full"
                value={patientForm.data.value}
                onChange={(e) => patientForm.setData('value', e.target.value)}
                required
              />

              <InputError className="mt-2" message={patientForm.errors.value} />
            </div>



            <div className="flex items-center gap-4">
              <Button
                // disabled={processing}
              >Guardar</Button>
            </div>
          </form>
        </div>

      </SettingsLayout>
    </AppLayout>
  )
}
