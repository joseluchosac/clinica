import { useState } from "react";
import axios from "axios";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxInput,
} from "@/components/ui/combobox";

interface Ubigeo {
  id: number;
  location_name: string;
}

interface UbigeoComboboxProps {
  value: number | null;
  onChange: (id: number) => void;
}

export default function UbigeoCombobox({ value, onChange }: UbigeoComboboxProps) {
  const [options, setOptions] = useState<Ubigeo[]>([]);

  const handleSearch = async (val: string) => {
    if (val.length < 2) return;
    const res = await axios.get(route("ubigeos.search"), { params: { query: val } });
    setOptions(res.data);
  };

  return (
    <Combobox value={value?.toString() ?? ""} onValueChange={(val) => onChange(Number(val))}>
      <ComboboxTrigger>
        <ComboboxInput
          placeholder="Buscar ubicación..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </ComboboxTrigger>
      <ComboboxContent>
        {options.map((opt) => (
          <ComboboxItem key={opt.id} value={opt.id.toString()}>
            {opt.location_name}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}
