import { Inject, Injectable } from "@nestjs/common";
import { InstrumentRepository } from "src/domain/repositories/instrument.repository";

@Injectable()
export class SearchInstrumentsByTextUseCase {
  constructor(
    @Inject('InstrumentRepository')
    private readonly instrumentRepo: InstrumentRepository,
  ) {}

  async execute(textSearch: string) {
    return this.instrumentRepo.getIntrumentByLikeTiketAndName(textSearch);
  }
}