import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PatientItem } from '@/types';
import { CircleCheck, CircleX, EllipsisVertical, Pencil, Printer, Trash } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'

interface MenuItemProps {
  setPatientId: Dispatch<SetStateAction<number | null>>;
  patient: PatientItem;
  setMode: Dispatch<SetStateAction<string>>;
  handleDebug: (id: number | null, value: number) => void;
  handleDelete: (id: number | null) => void;
}

export default function MenuItem({setPatientId, patient, setMode, handleDebug, handleDelete }: MenuItemProps) {

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
  return (
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
            setTimeout(() => { // para espere el cerrado del dropdown
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
  )
}
