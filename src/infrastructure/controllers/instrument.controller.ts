import { Controller, Get, Param } from "@nestjs/common";
import { SearchInstrumentsByTextUseCase } from "src/application/use-cases/search-instruments-by-text.usecase";

@Controller('instrument')
export class InstrumentController {
  constructor(
    private readonly searchIntrumentByText: SearchInstrumentsByTextUseCase,
  ) {}

  @Get('search/:textSearch')
  async searchInstrumentsByText(@Param('textSearch') textSearch: string) {
    debugger;
    return this.searchIntrumentByText.execute(textSearch);
  }
}