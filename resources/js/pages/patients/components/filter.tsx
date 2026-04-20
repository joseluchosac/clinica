import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { InertiaFormProps } from "node_modules/@inertiajs/react/types/useForm";
import { Dispatch, FormEvent, SetStateAction } from "react";

interface FilterProps {
  openSearch: boolean;
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
  formFilter: InertiaFormProps<{
    s_last_name: string;
    s_first_name: string;
    s_nhc: string;
    s_identity_number: string;
    s_birth_date: string;
  }>;
  handleSubmitFilter: (e: FormEvent<HTMLFormElement>) => void;
  resetFilter: () => void
}


export default function Filter({ openSearch, setOpenSearch, formFilter, handleSubmitFilter, resetFilter}: FilterProps) {
  return (
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
  );
}
