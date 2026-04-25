import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/custom/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { calcularEdad, dialogConfirmInit, getSearchParams, limpiarObjeto } from '@/lib/utils';
import { BreadcrumbItem, Flash, Identity, PatientItem, SearchParamsPatients } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PatientForm from './patient-form';
import Filter from './components/filter';
import MenuItem from './components/menu-item';
import { useCan } from '@/hooks/use-can';
import FilterBadges from './components/filter-badges';
import dayjs from 'dayjs';

interface LinkProps {
  active: boolean;
  label: string;
  url: string;
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
  request_all: SearchParamsPatients;
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
  const [openSearch, setOpenSearch] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
  const [action, setAction] = useState<Actions | null>(null);
  const can =useCan()
  const page = usePage();
  const { flash } = page.props as { flash?: Flash };
  const formPatient = useForm();
  const formDebug = useForm({ value: 0 });
  const formFilter = useForm<SearchParamsPatients>({
    s_last_name: request_all.s_last_name || '',
    s_first_name: request_all.s_first_name || '',
    s_nhc: request_all.s_nhc || '',
    s_identity_number: request_all.s_identity_number || '',
    s_birth_date: request_all.s_birth_date || '',
    o_field: request_all.o_field || ' ', // espacio para que no tome el valor por defecto del backend
    o_direction: request_all.o_direction || ' ', // espacio para que no tome el valor por defecto del backend
  });
  const searchParams = getSearchParams<SearchParamsPatients>(page.url);

  const applyFilter = () => {
    setOpenSearch(false);
    const queryString = limpiarObjeto(formFilter.data);
    const algo = formFilter.setData
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
      o_field: ' ', // espacio para que no tome el valor por defecto del backend
      o_direction: ' ', // espacio para que no tome el valor por defecto del backend
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
    setDialogConfirm({
      ...dialogConfirm,
      open: true,
      title: '¿Eliminar paciente?',
      description: 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar?'
    });
  };

  const handleDebug = (id: number | null, value: number) => {
    if (!id) return;
    formDebug.setData({ value: value });
    setAction({ type: 'debug', data: id });
    setDialogConfirm({
      ...dialogConfirm,
      open: true,
      title: '¿Modificar depuración?',
      description: '¿Deseas confirmar esta operación?'
    });
  };

  const executeAction = () => {
    if (action?.type === 'delete') {
      formPatient.delete(route('patients.destroy', action.data), {
        onError: () => toast.error('Error al eliminar paciente'),
      });
    } else if (action?.type === 'debug') {
      formDebug.put(route('patients.update.debug-hc', action.data), {
        onError: () => toast.error('Error al modificar depuración'),
      });
    }
    setDialogConfirm({ ...dialogConfirm, open: false });
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
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${mode === 'table' ? '' : 'hidden'}`}>
        {/* <div className="flex justify-end gap-4 py-2"> */}
        <div className="flex flex-col-reverse gap-2 lg:flex-row lg:items-center lg:justify-between">
          <FilterBadges searchParams={searchParams} formFilter={formFilter} applyFilter={applyFilter} />
          <div className='flex gap-2 justify-center'>
            <Button variant="outline" onClick={resetFilter}>
              <RotateCcw /> reset
            </Button>
            {/* SECCION FILTRADO */}
            <Filter
              openSearch={openSearch} 
              setOpenSearch={setOpenSearch} 
              formFilter={formFilter} 
              applyFilter={applyFilter} 
              resetFilter={resetFilter}
            />
            {can('create_patients') && (
              <Button
                onClick={() => {
                  if(!can('create_patients')) return
                  setPatientId(null);
                  setMode('form');
                }}
              >
                <CirclePlus /> Nuevo paciente
              </Button>
            )}

          </div>
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
                </TableRow>
              </TableHeader>
              <TableBody className="text-[0.85rem]">
                {patients.data.length > 0 ? (
                  patients.data.map((patient) => (
                    <TableRow key={patient.id} className={patient.debugged ? 'text-orange-700 dark:text-orange-300' : ''}>
                      <TableCell className="p-1">
                        <MenuItem
                          setPatientId={setPatientId}
                          patient={patient}
                          setMode={setMode}
                          handleDebug={handleDebug}
                          handleDelete={handleDelete}
                        />
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
                      <TableCell className="px-2 py-1 text-nowrap">
                        <div>
                          {dayjs(patient.birth_date).format("DD/MM/YYYY")}
                          {calcularEdad(patient.birth_date) !== null && (
                            <small> ({calcularEdad(patient.birth_date)})</small>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        <div className="max-w-[15vw]">
                          <div className="truncate text-nowrap">{patient.address}</div>
                          <div className="truncate text-nowrap">
                            <small>{patient.location_address_name}</small>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell 
                        className="px-2 py-1 text-nowrap" 
                        title={`CR: ${patient.created_at}\nUP: ${patient.updated_at}`}
                      >
                        {dayjs(patient.entry_at).format("DD/MM/YYYY")}
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
        <Pagination paginationData={patients} />
      </div>

      {/* SECCION FORMULARIO */}
      <div className={`flex h-full flex-col gap-4 rounded-xl p-4 ${mode === 'form' ? '' : 'hidden'}`}>
        {mode === 'form' && <PatientForm patientId={patientId} identities={identities} onClose={() => setMode('table')} />}
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
