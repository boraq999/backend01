import { Module } from '@nestjs/common';
import { CashAccountModule } from './cash-accounts/cash-account.module';
import { PaymentTransactionModule } from './payment-transactions/payment-transaction.module';

@Module({
  imports: [CashAccountModule, PaymentTransactionModule],
  exports: [CashAccountModule, PaymentTransactionModule],
})
export class AccountingModule {}
