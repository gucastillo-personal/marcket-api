import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PortfolioSummaryDTO } from '../dto/porfolio.summary.dto';
import { SummaryCommand } from '../../domain/bussines/summary.command';
import { OrderRepository } from 'src/domain/repositories/order.repository';


@Injectable()
export class GetSummaryByUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject()
    private readonly summaryCommand: SummaryCommand,
    @Inject('OrderRepository')
    private readonly orderRepo: OrderRepository,
  ) {}

  async execute(userId: string) :  Promise<PortfolioSummaryDTO | null>{
    const user = await this.userRepository.findById(Number(userId));
    const orders = await this.orderRepo.findByUserId(Number(userId));

     if(!user){
        return null
     }

    const totalAvailableToInvest = this.summaryCommand.getTotalAvailableToInvest(orders)
    const currentValueAccount = await this.summaryCommand.getCurrentValueAccount(orders)
    const assets = await this.summaryCommand.getAssets(orders)
    const result = new PortfolioSummaryDTO(userId, totalAvailableToInvest) 
    result.setEmail(user.email ?? '');
    result.setAccountNumber(user.accountNumber ?? '');
    result.setCurrentValueAccount(currentValueAccount);
    result.setAssets(assets);
    return result
  }
}
