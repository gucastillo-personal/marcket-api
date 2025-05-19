import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/domain/entities/instrument.entity";
import { InstrumentRepository } from "src/domain/repositories/instrument.repository";
import { Repository } from "typeorm";

export class InstrumentRepositoryImpl implements InstrumentRepository {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  async getIntrumentByLikeTiketAndName(textSearch: string): Promise<Instrument[] | null> {
    return this.instrumentRepo
      .createQueryBuilder('instrument')
      .where('instrument.ticker ILIKE :search OR instrument.name ILIKE :search', { search: `%${textSearch}%` })
      .getMany();
  }

}