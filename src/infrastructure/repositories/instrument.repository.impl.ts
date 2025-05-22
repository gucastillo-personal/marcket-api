import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/domain/entities/instrument.entity";
import { InstrumentRepository } from "src/domain/repositories/instrument.repository";
import { Repository } from "typeorm";

export class InstrumentRepositoryImpl implements InstrumentRepository {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}
  
  instrumentIsMoney(instrumentId: number): Promise<boolean> {
    return this.instrumentRepo.createQueryBuilder('instrument')
      .where('instrument.id = :id', { id: instrumentId })
      .andWhere('instrument.type = :type', { type: 'MONEDA' })
      .getCount()
      .then(count => count > 0);
  }
  
  existsById(id: number): Promise<boolean> {
    return this.instrumentRepo
      .createQueryBuilder('instrument')
      .where('instrument.id = :id', { id })
      .getCount()
      .then(count => count > 0);
  }

  async getIntrumentByLikeTiketAndName(textSearch: string): Promise<Instrument[] | null> {
    return this.instrumentRepo
      .createQueryBuilder('instrument')
      .where('instrument.ticker ILIKE :search OR instrument.name ILIKE :search', { search: `%${textSearch}%` })
      .getMany();
  }

}