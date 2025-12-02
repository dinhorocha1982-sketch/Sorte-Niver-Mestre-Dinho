export interface Palpite {
  bicho: string;
  grupo: number;
  dezenas: number[];
  milhares: number[];
}

export interface CruzDoDia {
  cabeca: number;
  bracos: number[];
  milhares: number[];
}

export interface AnimalData {
  id: number;
  nome: string;
  dezenas: number[];
}

export interface DreamReading {
  bicho: string;
  grupo: number;
  dezenas: number[];
  milhar: string;
  explicacao: string;
}