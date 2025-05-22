import { OrderParams } from "./order-params.interface";

export interface OrderValidationStrategy {
    validate(order: OrderParams): Promise<boolean>;
  }