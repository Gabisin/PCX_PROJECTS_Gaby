export interface Person {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

/** Função de pesquisa injectada - o kit não conhece Graph/SharePoint; cada projecto liga a sua fonte (entities/user/api). */
export type PeopleSearchFn = (query: string) => Promise<Person[]>;
