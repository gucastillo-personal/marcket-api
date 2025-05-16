import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PortfolioSummaryDTO } from '../dto/porfolio.summary.dto';
import { SummaryCommand } from '../../domain/bussines/summary.command';

@Injectable()
export class GetSummaryByUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject()
    private readonly summaryCommand: SummaryCommand,
  ) {}

  async execute(userId: string) :  Promise<PortfolioSummaryDTO | null>{
    const user = await this.userRepository.findById(Number(userId));

     if(!user){
        return null
     }

    const totalAvailableToInvest = this.summaryCommand.getTotalAvailableToInvest(user)
    const result = new PortfolioSummaryDTO(userId, totalAvailableToInvest) 
    return result
  }
}
