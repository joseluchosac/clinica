import { useEffect, useState } from "react";
import axios from "axios";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

interface Location {
  id: number;
  location_name: string;
}

interface LocationSelectProps {
  value: number | null;
  onChange: (id: number) => void;
}

export default function LocationSelect({ value, onChange }: LocationSelectProps) {
  const [options, setOptions] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = async (val: string) => {
    if (val.length < 2) return; // evitar consultas muy cortas
    const res = await axios.get(route("locations.search"), { params: { query: val } });
    setOptions(res.data);
    setOpen(true); // abrir lista cuando hay resultados
  };

  const handleSelect = (id: number) => {
    onChange(id);
    setOpen(false); // cerrar lista al seleccionar
    setSearch('');
  };
  
  useEffect(() => {
    handleSearch(search);
  }, [search])
  
  return (
    <Command>
      <CommandInput
        placeholder="Buscar ubicación..."
        onValueChange={algo => setSearch(algo)}
        value={search}
      />
      {open && (
          <CommandList>
            {options.map((opt) => (
              <CommandItem
                key={opt.id}
                onSelect={() => handleSelect(opt.id)}
              >
                {opt.location_name}
              </CommandItem>
            ))}
          </CommandList>
        )}
    </Command>
  );
}
