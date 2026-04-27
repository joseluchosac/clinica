import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchParamsPatients } from "@/types";
import { Search } from "lucide-react";
import { InertiaFormProps } from "node_modules/@inertiajs/react/types/useForm";
import { Dispatch, FormEvent, SetStateAction } from "react";

interface FilterProps {
  openSearch: boolean;
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
  formFilter: InertiaFormProps<SearchParamsPatients>;
  applyFilter: () => void;
  resetFilter: () => void;
  formFilterInit : SearchParamsPatients
}


export default function Filter({ openSearch, setOpenSearch, formFilter, applyFilter, resetFilter, formFilterInit}: FilterProps) {
  const clearFormFilter = () => {
    formFilter.setData(formFilterInit)
  }
  return (
    <Sheet open={openSearch} onOpenChange={setOpenSearch}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setOpenSearch(true)}>
          <Search /> Buscar
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Búsqueda de pacientes</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <form onSubmit={(e) => { e.preventDefault(); applyFilter(); }} className="mt-4 flex flex-col gap-2">
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
                type="date"
                name="s_birth_date"
                value={formFilter.data.s_birth_date}
                onChange={(e) => formFilter.setData({ ...formFilter.data, s_birth_date: e.target.value })}
              />
            </Field>
            <Field className="gap-1">
              <FieldLabel>Ordenar por</FieldLabel>
              <Select
                value={formFilter.data.o_field}
                onValueChange={(value) => {
                  formFilter.setData({ ...formFilter.data, o_field: value, o_direction: ' ' }) // espacio para que no tome el valor por defecto del backend
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder=""/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=" ">Por defecto</SelectItem> {/* espacio para que no tome el valor por defecto del backend */}
                    <SelectItem value="nhc">NHC</SelectItem>
                    <SelectItem value="last_name">Apellidos</SelectItem>
                    <SelectItem value="first_name">Nombres</SelectItem>
                    <SelectItem value="birth_date">Fecha de nacimiento</SelectItem>
                    {/* <SelectItem value="created_at">Fecha de creación</SelectItem> */}
                    <SelectItem value="entry_at">Fecha de ingreso</SelectItem>
                    <SelectItem value="updated_at">Fecha de actualización</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field className="gap-1">
              <FieldLabel>Dirección</FieldLabel>
              <Select
                disabled={!formFilter.data.o_field?.trim()}
                value={formFilter.data.o_direction}
                onValueChange={(value) => formFilter.setData({ ...formFilter.data, o_direction: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="desc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=" ">Ascendente</SelectItem> {/* espacio para que no tome el valor por defecto del backend */}
                    <SelectItem value="desc">Descendente</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="mt-2 flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={clearFormFilter}>
              Limpiar
            </Button>
            <Button type="submit">Aplicar</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
