import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";

@Injectable()
export class SummaryCommand {

    getTotalAvailableToInvest(user :User): number{
        return 10
    }
}