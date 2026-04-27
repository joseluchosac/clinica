import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PatientItem } from '@/types';
import { CircleCheck, CircleX, EllipsisVertical, Eye, Pencil, Printer, Trash } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'

interface MenuItemProps {
  setPatientId: Dispatch<SetStateAction<number | null>>;
  patient: PatientItem;
  setMode: Dispatch<SetStateAction<string>>;
  handleDebug: (id: number | null, value: number) => void;
  handleDelete: (id: number | null) => void;
  can: (permission: string) => boolean;
}

export default function MenuItem({setPatientId, patient, setMode, handleDebug, handleDelete, can }: MenuItemProps) {

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
          title="Editar"
          onClick={() => {
            setTimeout(() => {
              // para espere el cerrado del dropdown
              setPatientId(patient.id);
              setMode('form');
            }, 100);
          }}
        >
          {can('create_patients') || can('update_patients')
            ? (<><Pencil /> Editar</>)
            : (<><Eye /> Mostrar</>)
          }
          
          
        </DropdownMenuItem>
        {can('debug_patients') && (
          <DropdownMenuItem
              title="Depurar"
              onClick={() => {
                setTimeout(() => {
                  handleDebug(patient.id, patient.debugged ? 0 : 1);
                }, 100);
              }}
            >
              <CircleCheck /> {patient.debugged ? 'No depurar' : 'Depurar'}
          </DropdownMenuItem>
        )}
        {can('delete_patients') && (
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
        )}
        {can('print_patients') && (
          <>
            <DropdownMenuItem title="Imprimir HC clásica" onClick={() => imprimirHcClasica(patient.id)}>
              <Printer /> HC clásica
            </DropdownMenuItem>
            <DropdownMenuItem
              title="Imprimir HC clásica"
              onClick={() => imprimirHojaIdentificacion(patient.id)}
            >
              <Printer /> H. identificación
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
