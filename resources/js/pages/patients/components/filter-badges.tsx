import { Badge } from "@/components/ui/badge";
import { SearchParamsPatients } from "@/types";
import { CircleX } from "lucide-react";
import { InertiaFormProps } from "node_modules/@inertiajs/react/types/useForm";
import { useEffect, useState } from "react";

interface FilterBadgesProps {
  searchParams: SearchParamsPatients;
  formFilter: InertiaFormProps<SearchParamsPatients>;
  applyFilter: () => void;
}


export default function FilterBadges({ searchParams, formFilter, applyFilter }: FilterBadgesProps) {
  
  const [privado, setPrivado] = useState(false);

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'order') {
        formFilter.setData({ ...formFilter.data, o_field: ' ', o_direction: ' ' });
      }else{
        formFilter.setData({ ...formFilter.data, [`s_${field}`]: '' });
      }
    }
    setPrivado(true);
  }

  const ordenCampo = () => {
    const campos = {
      'last_name': 'Apellidos',
      'first_name': 'Nombres',
      'nhc': 'NHC',
      'identity_number': 'Doc. Identidad',
      'birth_date': 'F. Nac',
      'updated_at': 'F. Act',
      'entry_at': 'F. Ingreso',
    };
    return campos[searchParams.o_field as keyof typeof campos] || searchParams.o_field;
    // return searchParams[field];
  }

  useEffect(() => {
    if (!privado) return;
    applyFilter();
    setPrivado(false);
  }, [formFilter.data]);

  return (
    <div className='flex flex-wrap gap-2 justify-center'>
      {searchParams.s_last_name && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="last_name"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Apellidos: {searchParams.s_last_name}
        </Badge>
      )}
      {searchParams.s_first_name && (
        <Badge 
          className='bg-amber-500 cursor-pointer'
          data-name="first_name"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Nombres: {searchParams.s_first_name}
        </Badge>
      )}
      {searchParams.s_nhc && (
        <Badge 
          className='bg-amber-500 cursor-pointer'
          data-name="nhc"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> NHC: {searchParams.s_nhc}
        </Badge>
      )}
      {searchParams.s_identity_number && (
        <Badge 
          className='bg-amber-500 cursor-pointer'
          data-name="identity_number"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Doc. Identidad: {searchParams.s_identity_number}
        </Badge>
      )}
      {searchParams.s_birth_date && (
        <Badge 
          className='bg-amber-500 cursor-pointer'
          data-name="birth_date"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> F. Nac: {searchParams.s_birth_date}
        </Badge>
      )}
      {(searchParams.o_field && searchParams.o_field.trim() !== '') && (
        <Badge 
          className='bg-fuchsia-600 cursor-pointer'
          data-name="order"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Orden: {ordenCampo()} {searchParams.o_direction === 'asc' ? '↑' : searchParams.o_direction === 'desc' ? '↓' : ''}
        </Badge>
      )}
    </div>
  )
}
