export interface CountryDetail {
    flags: { png: string };
    name: { common: string };
    population: number;
    area: number;
    region: string;
    subregion: string;
    capital: string[];
    languages: Record<string, string>;
    currencies: Record<string, { name: string; symbol: string }>
}
