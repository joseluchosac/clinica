import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { limpiarObjeto } from '@/lib/utils';
import { BreadcrumbItem, Flash, Identity } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CircleCheck, CirclePlus, CircleX, EllipsisVertical, Pencil, Printer, RotateCcw, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PatientForm from './patient-form';



interface LinkProps {
  active: boolean;
  label: string;
  url: string;
}

interface PatientItem {
  id: number | null;
  nhc: string;
  last_name: string;
  first_name: string;
  identity_name: string;
  identity_number: string;
  birth_date: string;
  address: string;
  location_address_name: string;
  entry_at: string;
  debugged: number;
  created_at: string;
  updated_at: string;
}

interface PatientPagination {
  data: PatientItem[];
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
  patients: PatientPagination;
  identities: Identity[];
  filters: FilterProps;
  request_all: {
    s_last_name: string;
    s_first_name: string;
    s_nhc: string;
    s_identity_number: string;
    s_birth_date: string;
  };
}

interface Actions {
  type: 'create' | 'update' | 'delete' | 'debug' | null;
  data: any;
}



const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pacientes',
    href: '/patients/index',
  },
];

export default function Index({ patients, identities, request_all }: IndexProps) {
  const [mode, setMode] = useState('table');
  const {flash} = usePage<{flash?: Flash}>().props;
  const [openSearch, setOpenSearch] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [action, setAction] = useState<Actions | null>(null);

  const formFilter = useForm({
    s_last_name: request_all.s_last_name || '',
    s_first_name: request_all.s_first_name || '',
    s_nhc: request_all.s_nhc || '',
    s_identity_number: request_all.s_identity_number || '',
    s_birth_date: request_all.s_birth_date || '',
  });

  const formPatient = useForm();

  const formDebug = useForm({ value: 0 });

  const handleSubmitFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenSearch(false);
    const queryString = limpiarObjeto(formFilter.data);
    router.get(route('patients.index'), queryString, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const resetFilter = () => {
    formFilter.setData({
      s_last_name: '',
      s_first_name: '',
      s_nhc: '',
      s_identity_number: '',
      s_birth_date: '',
    });
    router.get(
      route('patients.index'),
      {}, // request payload
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handleDelete = (id: number | null) => {
    if (!id) return;
    setAction({ type: 'delete', data: id });
    setOpenConfirm(true);
  };

  const handleDebug = (id: number | null, value: number) => {
    if (!id) return;
    formDebug.setData({ value: value });
    setAction({ type: 'debug', data: id });
    setOpenConfirm(true);
  };

  const executeAction = () => {
    // console.log('confirmada la acción ' + action?.type)
    if (action?.type === 'delete') {
      formPatient.delete(route('patients.destroy', action.data), {
        onError: () => toast.error('Error al eliminar paciente'),
      });
    } else if (action?.type === 'debug') {
      formDebug.put(route('patients.update.debug-hc', action.data), {
        onError: () => toast.error('Error al modificar depuración'),
      });
    }
    setOpenConfirm(false);
  };

  const imprimirHcClasica = (patientId: number | null) => {
    // Abrir el PDF en una nueva ventana/pestaña
    if (!patientId) return;
    const ventanaPdf = window.open(route('pdf.hc-clasica', patientId), '_blank');

    // Esperar a que el PDF cargue y luego ejecutar impresión
    if (ventanaPdf) {
      ventanaPdf.onload = function () {
        // Esperar un momento para que el PDF termine de renderizar
        setTimeout(() => {
          ventanaPdf.print();
        }, 500);
      };
    }
  };

  const imprimirHojaIdentificacion = (patientId: number | null) => {
    // Abrir el PDF en una nueva ventana/pestaña
    if (!patientId) return;
    const ventanaPdf = window.open(route('pdf.hoja-identificacion', patientId), '_blank');

    // Esperar a que el PDF cargue y luego ejecutar impresión
    if (ventanaPdf) {
      ventanaPdf.onload = function () {
        // Esperar un momento para que el PDF termine de renderizar
        setTimeout(() => {
          ventanaPdf.print();
        }, 500);
      };
    }
  };

  useEffect(() => {
    if (flash?.resp?.action == 'storePatient') {
      if (flash?.resp?.type == 'success') {
        toast.success('Paciente registrado correctamente');
        setPatientId(flash?.resp?.data?.id || null);
      } else if (flash?.resp?.type == 'error') {
        toast.error(flash?.resp?.msg);
        setPatientId(flash?.resp?.data?.id || null);
      }
    }
    if (flash?.resp?.action == 'destroyPatient') {
      toast.success('Paciente eliminado correctamente');
      // setPatientId(flash?.resp?.data?.id || null);
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pacientes" />

      {/* SECCION TABLA */}
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl px-4 pt-4 pb-2 ${mode === 'table' ? '' : 'hidden'}`}>
        <div className="flex justify-end gap-4 py-2">
          <Button variant="outline" onClick={resetFilter}>
            <RotateCcw /> reset
          </Button>
          {/* SECCION FILTRADO */}
          <Sheet open={openSearch} onOpenChange={setOpenSearch}>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={() => setOpenSearch(true)}>
                <Search /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtro de pacientes</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmitFilter} className="mt-4 flex flex-col gap-2">
                <FieldGroup className="gap-3">
                  <Field className="gap-1">
                    <FieldLabel>Apellidos</FieldLabel>
                    <Input
                      autoFocus
                      type="search"
                      name="s_last_name"
                      value={formFilter.data.s_last_name}
                      onChange={(e) => formFilter.setData({ ...formFilter.data, s_last_name: e.target.value })}
                    />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel>Nombres</FieldLabel>
                    <Input
                      type="search"
                      name="s_first_name"
                      value={formFilter.data.s_first_name}
                      onChange={(e) => formFilter.setData({ ...formFilter.data, s_first_name: e.target.value })}
                    />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel>NHC</FieldLabel>
                    <Input
                      type="search"
                      name="s_nhc"
                      value={formFilter.data.s_nhc}
                      onChange={(e) => formFilter.setData({ ...formFilter.data, s_nhc: e.target.value })}
                    />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel>Identidad</FieldLabel>
                    <Input
                      type="search"
                      name="s_identity_number"
                      value={formFilter.data.s_identity_number}
                      onChange={(e) => formFilter.setData({ ...formFilter.data, s_identity_number: e.target.value })}
                    />
                  </Field>
                  <Field className="gap-1">
                    <FieldLabel>F. Nac</FieldLabel>
                    <Input
                      type="search"
                      name="s_birth_date"
                      value={formFilter.data.s_birth_date}
                      onChange={(e) => formFilter.setData({ ...formFilter.data, s_birth_date: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
                <div className="mt-2 flex justify-center gap-4">
                  <Button type="button" variant="outline" onClick={resetFilter}>
                    Limpiar
                  </Button>
                  <Button type="submit">Filtrar</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Button
            onClick={() => {
              setPatientId(null);
              setMode('form');
            }}
          >
            <CirclePlus /> Nuevo paciente
          </Button>
        </div>

        <div className="grow overflow-hidden">
          <ScrollArea className="h-full rounded-md border">
            <Table>
              <TableHeader className="bg-blue-700">
                <TableRow >
                  <TableHead className="p-2"></TableHead>
                  <TableHead className="px-6 text-blue-100">NHC</TableHead>
                  <TableHead className="p-2 text-blue-100">APELLIDOS</TableHead>
                  <TableHead className="p-2 text-blue-100">NOMBRES</TableHead>
                  <TableHead className="p-2 text-blue-100">DOC IDENTIDAD</TableHead>
                  <TableHead className="p-2 text-blue-100">F NAC</TableHead>
                  <TableHead className="p-2 text-blue-100">DIRECCION</TableHead>
                  <TableHead className="p-2 text-blue-100">F ING</TableHead>
                  <TableHead className="p-2 text-blue-100">F CRE</TableHead>
                  <TableHead className="p-2 text-blue-100">F UPD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[0.85rem]">
                {patients.data.length > 0 ? (
                  patients.data.map((patient) => (
                    <TableRow key={patient.id} className={patient.debugged ? 'text-orange-700 dark:text-orange-300' : ''}>
                      <TableCell className="p-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="px-2">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              title="Eliminar"
                              onClick={() => {
                                setTimeout(() => {
                                  // para espere el cerrado del dropdown
                                  setPatientId(patient.id);
                                  setMode('form');
                                }, 100);
                              }}
                            >
                              <Pencil /> Editar
                            </DropdownMenuItem>

                            {patient.debugged ? (
                              <DropdownMenuItem
                                title="Depurar"
                                onClick={() => {
                                  setTimeout(() => {
                                    handleDebug(patient.id, 0);
                                  }, 100);
                                }}
                              >
                                <CircleCheck /> No depurar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                title="Depurar"
                                onClick={() => {
                                  setTimeout(() => {
                                    handleDebug(patient.id, 1);
                                  }, 100);
                                }}
                              >
                                <CircleX /> Depurar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              title="Eliminar"
                              onClick={() => {
                                setTimeout(() => {
                                  // para espere el cerrado del dropdown
                                  handleDelete(patient.id);
                                }, 100);
                              }}
                            >
                              <Trash /> Eliminar
                            </DropdownMenuItem>
                            <DropdownMenuItem title="Imprimir HC clásica" onClick={() => imprimirHcClasica(patient.id)}>
                              <Printer /> HC clásica
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              title="Imprimir HC clásica"
                              onClick={() => imprimirHojaIdentificacion(patient.id)}
                            >
                              <Printer /> H. identificación
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>API</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        <Button
                          className="cursor-pointer text-[0.85rem] font-bold tracking-wider text-blue-800 dark:text-blue-300"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPatientId(patient.id);
                            setMode('form');
                          }}
                        >
                          {patient.nhc}
                        </Button>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-nowrap">{patient.last_name}</TableCell>
                      <TableCell className="px-2 py-1 text-nowrap">{patient.first_name}</TableCell>
                      <TableCell className="px-2 py-1 text-nowrap">
                        {patient.identity_number}{' '}
                        <small>{patient.identity_name ? '(' + patient.identity_name + ')' : ''}</small>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-nowrap">{patient.birth_date}</TableCell>
                      <TableCell className="px-2 py-1">
                        <div className="max-w-[15vw]">
                          <div className="truncate text-nowrap">{patient.address}</div>
                          <div className="truncate text-nowrap">
                            <small>{patient.location_address_name}</small>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-nowrap" title={patient.entry_at}>{patient.entry_at}</TableCell>
                      <TableCell className="px-2 py-1 text-nowrap" title={patient.created_at}>{patient.created_at}</TableCell>
                      <TableCell className="px-2 py-1 text-nowrap" title={patient.updated_at}>{patient.updated_at}</TableCell>
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
        <Pagination patients={patients} />
      </div>

      {/* SECCION FORMULARIO */}
      <div className={`flex h-full flex-col gap-4 rounded-xl p-4 ${mode === 'form' ? '' : 'hidden'}`}>
        {mode === 'form' && <PatientForm patientId={patientId} identities={identities} onClose={() => setMode('table')} />}
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
