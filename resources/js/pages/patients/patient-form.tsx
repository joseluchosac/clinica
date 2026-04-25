import { ConfirmDialog } from '@/components/custom/confirm-dialog';
import LocationSelect from '@/components/custom/location-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { dialogConfirmInit } from '@/lib/utils';
import { Identity } from '@/types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Printer, Save, SearchCode, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import dayjs from "dayjs";
import { z } from 'zod';
import { ButtonGroup } from '@/components/ui/button-group';
import { patientSchema } from '@/types/schemas';
import useReniec from '@/hooks/use-reniec';


type Patient = z.infer<typeof patientSchema>;

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
	id: 0,
	nhc: 0,
	entry_at: '',
	identity_code: '01',
	identity_number: '',
	last_name: '',
	first_name: '',
	gender: '' as any,
	birth_date: '',
	location_birth_id: 0,
	location_birth_name: '',
	address: '',
	location_address_id: 0,
	location_address_name: '',
	phone: '',
	updated_at: '',
};

export default function PatientForm({ patientId, identities, onClose }: PatientFormProps) {
	const [loading, setLoading] = useState(false);
	const { data, error, loading: reniecLoading, consultarDni } = useReniec();
	const form = useForm(initForm);
	const [dialogConfirm, setDialogConfirm] = useState(dialogConfirmInit);
	const [action, setAction] = useState<Actions | null>(null);
	const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = patientSchema.safeParse(form.data);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof Patient, string>> = {};
			result.error.issues.forEach((issue) => {
				fieldErrors[issue.path[0] as keyof Patient] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		if (form.data.id) { //si existe id, es update, sino create
			setAction({ type: 'update', data: form.data.id });
			setDialogConfirm({
				...dialogConfirm,
				open: true,
				title: '¿Actualizar paciente?',
				description: '¿Deseas confirmar esta operación?',
			});
		} else {
			setAction({ type: 'create', data: null });
			setDialogConfirm({
				...dialogConfirm,
				open: true,
				title: '¿Registrar paciente?',
				description: '¿Deseas confirmar esta operación?',
			});
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
	const handleImprimirHcClasica = (patientId: number | null) => {
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
	
	const getPatient = (id: number) => {
		axios
			.get(route('patients.data', id)) // tu ruta de controlador
			.then((res) => {
				const { patient } = res.data;
				const dataPatients = {
					id: patient?.id || '',
					nhc: patient?.nhc || '',
					entry_at: patient?.entry_at ? dayjs(patient?.entry_at).format("YYYY-MM-DD HH:mm") : '',
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
					phone: patient?.phone || '',
					updated_at: patient?.updated_at ? dayjs(patient?.updated_at).format("YYYY-MM-DD HH:mm") : '',
				};
				form.setData(dataPatients);
				form.setDefaults(dataPatients); //para que isDirty este en falso
			})
			.finally(() => setLoading(false));
	};

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
		setDialogConfirm({ ...dialogConfirm, open: false });
	};

	const handleRequestIdentity = () => {
		if(form.data.identity_code !== '01') {
			toast.error('Solo se puede solicitar datos para DNI');
			return;
		}
		consultarDni(form.data.identity_number);
	}

	useEffect(() => {
		if (patientId) {
			setLoading(true);
			getPatient(patientId);
		} else {
			// nuevo registro: limpiar datos
			form.setData(initForm);
		}
	}, [patientId]);


	useEffect(() => {
		if(error ){
			toast.error(error);
		}
		if(data){
			form.setData({
				...form.data,
				first_name: data?.first_name || '',
				last_name: `${data?.first_last_name} ${data?.second_last_name}`  || '',
			})
		}
	}, [data, error]);


	return (
		<div className="">
			<Card className="mx-auto max-w-4xl bg-gray-50 dark:bg-gray-800">
				<CardHeader className="bg-blue-300 dark:bg-blue-900 px-4 py-2 rounded-t-md">
					<CardTitle>
						<div className="flex items-center justify-between rounded-md">
								{patientId ? 'Actualizar paciente' : 'Nuevo paciente'}
								<Button variant="ghost" onClick={onClose}>
									<X />
								</Button>
						</div>
					</CardTitle>
					<CardDescription></CardDescription>
				</CardHeader>
				<CardContent className="p-2 lg:p-4">
					<form onSubmit={handleSubmit} className="relative m-2 flex flex-col gap-4" autoComplete="off">
						<FieldGroup className="gap-3">
							<div className="grid gap-3 lg:grid-cols-5">
								{/* NHC */}
								<Field className="gap-1">
									<FieldLabel htmlFor="nhc">NHC</FieldLabel>
									<Input
										style={{ fontSize: '1.1rem' }}
										className="font-bold"
										id="nhc"
										name="nhc"
										disabled
										value={form.data.nhc}
										placeholder="Autogenerado"
									/>
								</Field>
								{/* FECHA DE INGRESO */}
								<Field className="gap-1">
									<FieldLabel htmlFor="entry_at">F. ingreso</FieldLabel>
									<Input id="entry_at" name="entry_at" disabled value={form.data.entry_at} placeholder="Autogenerado" />
								</Field>
								{/* FECHA DE ACTUALIZACIÓN */}
								<Field className="gap-1">
									<FieldLabel htmlFor="updated_at">F. actualización</FieldLabel>
									<Input id="updated_at" name="updated_at" disabled value={form.data.updated_at} placeholder="Autogenerado" />
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
									<ButtonGroup>
										<Input
											autoFocus
											name="identity_number"
											className={form.errors.identity_number ? 'border border-red-400' : ''}
											value={form.data.identity_number}
											onChange={(e) => form.setData({ ...form.data, identity_number: e.target.value })}
										/>
										<Button
											className='px-2'
											type='button'
											variant="outline"
											title='Solicitar datos a REINEC'
											onClick={handleRequestIdentity}
										>
											<SearchCode />
										</Button>
									</ButtonGroup>
									<InputError message={errors.identity_number} />
									<InputError message={form.errors.identity_number} />
								</Field>
							</div>
							<div className="grid gap-4 lg:grid-cols-2">
								{/* APELLIDOS */}
								<Field className="gap-1">
									<FieldLabel htmlFor="last_name">Apellidos</FieldLabel>
									<Input
										style={{ fontSize: '1.1rem' }}
										className={`uppercase ${form.errors.last_name ? 'border border-red-400' : ''}`}
										name="last_name"
										value={form.data.last_name}
										onChange={(e) => form.setData({ ...form.data, last_name: e.target.value.toUpperCase() })}
									/>
									<InputError message={errors.last_name} />
									<InputError message={form.errors.last_name} />
								</Field>
								{/* NOMBRES */}
								<Field className="gap-1">
									<FieldLabel htmlFor="first_name">Nombres</FieldLabel>
									<Input
										style={{ fontSize: '1.1rem' }}
										className={`uppercase ${form.errors.first_name ? 'border border-red-400' : ''}`}
										name="first_name"
										value={form.data.first_name}
										onChange={(e) => form.setData({ ...form.data, first_name: e.target.value.toUpperCase() })}
									/>
									<InputError message={errors.first_name} />
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
										onChange={(e) => form.setData({ ...form.data, gender: e.target.value.toUpperCase() as 'F' | 'M' })}
									/>
									<InputError message={errors.gender} />
									<InputError message={form.errors.gender} />
								</Field>
								{/* FECHA DE NACIMIENTO */}
								<Field className="gap-1 lg:col-span-3">
									<FieldLabel htmlFor="birth_date">F. nacimiento</FieldLabel>
									<Input
										type="date"
										name="birth_date"
										value={form.data.birth_date}
										onChange={(e) => form.setData({ ...form.data, birth_date: e.target.value })}
									/>
									<InputError message={errors.birth_date} />
									<InputError message={form.errors.birth_date} />
								</Field>
								{/* LUGAR DE NACIMIENTO */}
								<Field className="gap-1 lg:col-span-7">
									<LocationSelect
										label="Ubicación de nacimiento"
										option={{
											value: form.data.location_birth_id || 0,
											label: form.data.location_birth_name || '',
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
										className="uppercase"
										name="address"
										value={form.data.address}
										onChange={(e) => form.setData({ ...form.data, address: e.target.value.toUpperCase() })}
									/>
									<InputError message={form.errors.address} />
								</Field>
								{/* LUGAR DE DIRECCION */}
								<Field className="gap-1 lg:col-span-6">
									<LocationSelect
										label="Ubicación de dirección"
										option={{
											value: form.data.location_address_id || 0,
											label: form.data.location_address_name || '',
										}}
										onChange={(opt) => {
											form.setData({
												...form.data,
												location_address_id: opt?.value || 0,
												location_address_name: opt?.label || '',
											});
										}}
									/>
								</Field>
							</div>
							<div className="grid gap-4 lg:grid-cols-2">
								{/* TELEFONO */}
								<Field className="gap-1">
									<FieldLabel htmlFor="phone">Teléfono</FieldLabel>
									<Input
										name="phone"
										value={form.data.phone}
										onChange={(e) => form.setData({ ...form.data, phone: e.target.value })}
									/>
									<InputError message={form.errors.phone} />
								</Field>
							</div>
						</FieldGroup>
							{/* <div className="flex flex-wrap justify-end gap-4 pt-4"> */}
							<div className="flex flex-wrap justify-center lg:justify-end gap-4 pt-4">
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
								<Button type="submit" disabled={form.processing || !form.isDirty}>
									<Save /> {patientId ? 'Actualizar' : 'Guardar'}
								</Button>
							</div>
						{(loading || reniecLoading) && (
							<div className="absolute top-0 right-0 flex size-full items-center gap-6">
								<Spinner className="size-8 w-full" />
							</div>
						)}
					</form>
				</CardContent>
			</Card>
			<ConfirmDialog
				open={dialogConfirm.open}
				onOpenChange={(open) => setDialogConfirm({ ...dialogConfirm, open })}
				title={dialogConfirm.title}
				description={dialogConfirm.description}
				onConfirm={executeAction}
				confirmText={dialogConfirm.confirmText}
				cancelText={dialogConfirm.cancelText}
			/>
		</div>
	);
}
