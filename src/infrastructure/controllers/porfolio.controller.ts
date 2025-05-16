import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PortfolioSummaryDTO } from 'src/application/dto/porfolio.summary.dto';
import { GetSummaryByUserUseCase } from 'src/application/use-cases/get-summary-by-user.usecase';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly getSummaryByUserIdUseCase: GetSummaryByUserUseCase,
  ) {}

  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string): Promise<PortfolioSummaryDTO | null> {
    return this.getSummaryByUserIdUseCase.execute(userId)
  }
}
