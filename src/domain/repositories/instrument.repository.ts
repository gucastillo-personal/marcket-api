import { Instrument } from "../entities/instrument.entity";

export interface InstrumentRepository {
   getIntrumentByLikeTiketAndName(textSearch: string): Promise<Instrument[] | null>;
   existsById(id: number): Promise<boolean>;
}