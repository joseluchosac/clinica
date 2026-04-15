import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import LocationReactSelect from '@/components/custom/location-react-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Identity } from '@/types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Printer, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Patient {
    id: string;
    nhc: string;
    entry_at: string;
    identity_code: string;
    identity_number: string;
    last_name: string;
    first_name: string;
    gender: string;
    birth_date: string;
    location_birth_id: number;
    location_birth_name: string;
    address: string;
    location_address_id: number;
    location_address_name: string;
    email: string;
    phone: string;
}

interface PatientFormProps {
    patientId: number | null;
    identities: Identity[];
    onClose: () => void;
}

interface Actions {
    type: 'create' | 'update' | 'delete' | null;
    data: any;
}

const initForm: Patient = {
    id: '',
    nhc: '',
    entry_at: '',
    identity_code: '01',
    identity_number: '',
    last_name: '',
    first_name: '',
    gender: '',
    birth_date: '',
    location_birth_id: 0,
    location_birth_name: '',
    address: '',
    location_address_id: 0,
    location_address_name: '',
    email: '',
    phone: '',
};

export default function PatientForm({ patientId, identities, onClose }: PatientFormProps) {
    
    const [loading, setLoading] = useState(false);
    const form = useForm(initForm);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [action, setAction] = useState<Actions | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.data.id) {
            setAction({ type: 'update', data: form.data.id });
        } else {
            setAction({ type: 'create', data: null });
        }
        setOpenConfirm(true);
    };
   
    const imprimirHojaIdentificacion = (patientId: number | null) => {
        // Abrir el PDF en una nueva ventana/pestaña
        if(!patientId) return;
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
    const handleImprimirHcClasica = (patientId: number | null) => {
        // Abrir el PDF en una nueva ventana/pestaña
        if(!patientId) return;
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

    const getPatient = (id: number) => {
        axios
                .get(route('patients.data', id)) // tu ruta de controlador
                .then((res) => {
                    const { patient } = res.data;
                    // console.log(patient)
                    const dataPatients = {
                        id: patient?.id || '',
                        nhc: patient?.nhc || '',
                        entry_at: patient?.entry_at || '',
                        identity_code: patient?.identity_code || '00',
                        identity_number: patient?.identity_number || '',
                        last_name: patient?.last_name || '',
                        first_name: patient?.first_name || '',
                        gender: patient?.gender || '',
                        birth_date: patient?.birth_date || '',
                        location_birth_id: patient?.location_birth_id || 0,
                        location_birth_name: patient?.location_birth?.location_name || '',
                        address: patient?.address || '',
                        location_address_id: patient?.location_address_id || 0,
                        location_address_name: patient?.location_address?.location_name || '',
                        email: patient?.email || '',
                        phone: patient?.phone || '',
                    };
                    form.setData(dataPatients);
                    form.setDefaults(dataPatients); //para que isDirty este en falso
                })
                .finally(() => setLoading(false));
    }

    const executeAction = () => {
        if (action?.type === 'update') {
            form.put(route('patients.update', action.data), {
                onSuccess: () => {
                    toast.success('Paciente actualizado correctamente');
                    form.setDefaults();
                },
                onError: () => {
                    toast.error('Error al actualizar el paciente');
                },
                onFinish: () => {
                    // opcional: limpiar loading, etc.
                },
            });
        } else if (action?.type === 'create') {
            form.post(route('patients.store'), {
                onError: () => {
                    toast.error('Error al registrar el paciente');
                },
            });
        }
        setOpenConfirm(false);
    };

    useEffect(() => {
        if (patientId) {
            setLoading(true);
            getPatient(patientId);
        } else {
            // nuevo registro: limpiar datos
            form.setData(initForm);
        }
    }, [patientId]);

    return (
        <div>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit} className="m-2 flex flex-col gap-4 relative" autoComplete="off">
                        <div className="flex items-center justify-between">
                            <CardTitle>{patientId ? 'Actualizar paciente' : 'Nuevo paciente'}</CardTitle>
                            <div className="mt-2 flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!patientId || form.processing || form.isDirty}
                                    onClick={() => {
                                        imprimirHojaIdentificacion(patientId);
                                    }}
                                >
                                    <Printer /> H identificación
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!patientId || form.processing || form.isDirty}
                                    onClick={() => {
                                        handleImprimirHcClasica(patientId);
                                    }}
                                >
                                    <Printer /> HC clásica
                                </Button>

                                <Button variant="outline" type="button" onClick={onClose}>
                                    <X />
                                    Cerrar
                                </Button>
                                <Button type="submit" disabled={form.processing || !form.isDirty}>
                                    <Save /> {patientId ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </div>
                        </div>
                        <FieldGroup className="gap-3">
                            <div className="grid gap-4 lg:grid-cols-4">
                                {/* NHC */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="nhc">NHC</FieldLabel>
                                    <Input
                                        style={{fontSize: '1.1rem'}}
                                        className='font-bold'
                                        id="nhc" 
                                        name="nhc" 
                                        disabled 
                                        value={form.data.nhc} 
                                        placeholder="Autogenerado" 
                                    />
                                </Field>
                                {/* FECHA DE INGRESO */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="entry_at">Fecha ingreso</FieldLabel>
                                    <Input id="entry_at" name="entry_at" disabled value={form.data.entry_at} placeholder="Autogenerado" />
                                </Field>
                                {/* TIPO DE DOCUMENTO */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="identity_code">Tipo de documento</FieldLabel>
                                    <Select
                                        name="identity_code"
                                        value={form.data.identity_code}
                                        onValueChange={(value) => form.setData({ ...form.data, identity_code: value })}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {identities.map((identity) => (
                                                    <SelectItem key={identity.code} value={identity.code}>
                                                        {identity.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.identity_code} />
                                </Field>
                                {/* NRO DE DOCUMENTO */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="identity_number">Nro. de documento</FieldLabel>
                                    <Input
                                        autoFocus
                                        name="identity_number"
                                        className={form.errors.identity_number ? 'border border-red-400' : ''}
                                        value={form.data.identity_number}
                                        onChange={(e) => form.setData({ ...form.data, identity_number: e.target.value })}
                                    />
                                    <InputError message={form.errors.identity_number} />
                                </Field>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                {/* APELLIDOS */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="last_name">Apellidos</FieldLabel>
                                    <Input
                                        style={{fontSize: '1.1rem'}}
                                        className={`uppercase ${form.errors.last_name ? 'border border-red-400' : ''}`}
                                        name="last_name"
                                        value={form.data.last_name}
                                        onChange={(e) => form.setData({ ...form.data, last_name: e.target.value.toUpperCase() })}
                                    />
                                    <InputError message={form.errors.last_name} />
                                </Field>
                                {/* NOMBRES */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="first_name">Nombres</FieldLabel>
                                    <Input
                                        style={{fontSize: '1.1rem'}}
                                        className={`uppercase ${form.errors.first_name ? 'border border-red-400' : ''}`}
                                        name="first_name"
                                        value={form.data.first_name}
                                        onChange={(e) => form.setData({ ...form.data, first_name: e.target.value.toUpperCase() })}
                                    />
                                    <InputError message={form.errors.first_name} />
                                </Field>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-12">
                                {/* SEXO */}
                                <Field className="gap-1 lg:col-span-2">
                                    <FieldLabel htmlFor="gender">Sexo</FieldLabel>
                                    <Input
                                        className={`uppercase ${form.errors.gender ? 'border border-red-400' : ''}`}
                                        name="gender"
                                        value={form.data.gender}
                                        onChange={(e) => form.setData({ ...form.data, gender: e.target.value.toUpperCase() })}
                                    />
                                    <InputError message={form.errors.gender} />
                                </Field>
                                {/* FECHA DE NACIMIENTO */}
                                <Field className="gap-1 lg:col-span-3">
                                    <FieldLabel htmlFor="birth_date">Fecha de nacimiento</FieldLabel>
                                    <Input
                                        type="date"
                                        name="birth_date"
                                        value={form.data.birth_date}
                                        onChange={(e) => form.setData({ ...form.data, birth_date: e.target.value })}
                                    />
                                    <InputError message={form.errors.birth_date} />
                                </Field>
                                {/* LUGAR DE NACIMIENTO */}
                                <Field className="gap-1 lg:col-span-7">
                                    <LocationReactSelect
                                        label="Ubicación de nacimiento"
                                        option={{
                                            value: form.data.location_birth_id,
                                            label: form.data.location_birth_name,
                                        }}
                                        onChange={(opt) => {
                                            form.setData({ ...form.data, location_birth_id: opt?.value || 0, location_birth_name: opt?.label || '' });
                                        }}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-12">
                                {/* DIRECCION */}
                                <Field className="gap-1 lg:col-span-6">
                                    <FieldLabel htmlFor="address">Dirección</FieldLabel>
                                    <Input
                                        className='uppercase'
                                        name="address" 
                                        value={form.data.address} onChange={(e) => form.setData({ ...form.data, address: e.target.value.toUpperCase() })} 
                                    />
                                    <InputError message={form.errors.address} />
                                </Field>
                                {/* LUGAR DE DIRECCION */}
                                <Field className="gap-1 lg:col-span-6">
                                    <LocationReactSelect
                                        label="Ubicación de dirección"
                                        option={{
                                            value: form.data.location_address_id,
                                            label: form.data.location_address_name,
                                        }}
                                        onChange={(opt) => {
                                            form.setData({ ...form.data, location_address_id: opt?.value || 0, location_address_name: opt?.label || '' });
                                        }}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                {/* CORREO ELECTRONICO*/}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData({ ...form.data, email: e.target.value })}
                                    />
                                    <InputError message={form.errors.email} />
                                </Field>
                                {/* TELEFONO */}
                                <Field className="gap-1">
                                    <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                                    <Input name="phone" value={form.data.phone} onChange={(e) => form.setData({ ...form.data, phone: e.target.value })} />
                                    <InputError message={form.errors.phone} />
                                </Field>
                            </div>
                        </FieldGroup>
                        {loading && (
                            <div className="flex items-center gap-6 size-full absolute top-0 right-0">
                                <Spinner className="size-8 w-full" />
                            </div>
                        )}
                    </form>
                
                </CardContent>
            </Card>
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
        </div>
    );
}
