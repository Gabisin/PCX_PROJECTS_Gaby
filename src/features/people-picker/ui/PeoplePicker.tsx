import * as React from "react";
import { Search, X, Loader2, User as UserIcon } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Input } from "@shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import type { Person, PeopleSearchFn } from "@features/people-picker/model/types";

export interface PeoplePickerProps {
  /** Pessoas já seleccionadas. */
  value: Person[];
  onChange: (people: Person[]) => void;
  /** Chamada à fonte real (Graph/SharePoint/API) — mantém o kit sem dependências de infra. */
  search: PeopleSearchFn;
  placeholder?: string;
  /** false = seleccionar só uma pessoa (ex.: atribuir responsável). */
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * People-picker genérico — presente nas 3 apps de origem para escolher
 * requerentes, aprovadores e responsáveis. Pesquisa com debounce,
 * mostra estado de carregamento e "sem resultados" (heurísticas 1 e 6),
 * e permite remover uma selecção sem confirmação extra (heurística 3).
 */
export function PeoplePicker({
  value,
  onChange,
  search,
  placeholder = "Pesquisar pessoa por nome ou email…",
  multiple = true,
  disabled,
  className,
}: PeoplePickerProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Person[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Query vazia: não há nada a pesquisar. Não limpamos `results` aqui — a
    // lista só é renderizada quando `query.trim()` é verdadeiro (ver JSX),
    // por isso resultados antigos ficam simplesmente escondidos até à
    // próxima pesquisa, sem precisar de um setState extra neste efeito.
    if (!query.trim()) return;
    let cancelled = false;
    // setIsLoading fica dentro do callback do debounce (não corre logo ao
    // montar o efeito) — só mostra "a pesquisar" quando o pedido arranca
    // de facto, 300ms depois do utilizador parar de escrever.
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setIsLoading(true);
      try {
        const people = await search(query);
        if (!cancelled) setResults(people);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, search]);

  React.useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(person: Person) {
    if (value.some((p) => p.id === person.id)) return;
    onChange(multiple ? [...value, person] : [person]);
    setQuery("");
    setIsOpen(false);
  }

  function remove(id: string) {
    onChange(value.filter((p) => p.id !== id));
  }

  const selectableResults = results.filter((r) => !value.some((v) => v.id === r.id));

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((person) => (
            <Badge key={person.id} tone="neutral" className="pl-1">
              <Avatar className="size-4">
                <AvatarImage src={person.avatarUrl} alt="" />
                <AvatarFallback className="text-[9px]">{initials(person.name)}</AvatarFallback>
              </Avatar>
              {person.name}
              <button
                type="button"
                onClick={() => remove(person.id)}
                aria-label={`Remover ${person.name}`}
                disabled={disabled}
                className="rounded-full hover:bg-foreground/10"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {(multiple || value.length === 0) && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            disabled={disabled}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-8"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="people-picker-listbox"
          />
        </div>
      )}

      {isOpen && query.trim() && (
        <ul
          id="people-picker-listbox"
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-card p-1 text-card-foreground shadow-md"
        >
          {isLoading && (
            <li className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> A pesquisar…
            </li>
          )}
          {!isLoading && selectableResults.length === 0 && (
            <li className="px-2 py-2 text-sm text-muted-foreground">Sem resultados para "{query}"</li>
          )}
          {!isLoading &&
            selectableResults.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => select(person)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={person.avatarUrl} alt="" />
                    <AvatarFallback>
                      {person.name ? initials(person.name) : <UserIcon className="size-3" aria-hidden="true" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col">
                    <span>{person.name}</span>
                    {person.email && <span className="text-xs text-muted-foreground">{person.email}</span>}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
