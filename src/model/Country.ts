export interface Country {
  cca3: string;
  name: { common: string };
  region: string;
  flags: { png: string, svg: string};
  population: number;
  area: number;
  subregion: string;
  capital: string[];
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>
}
