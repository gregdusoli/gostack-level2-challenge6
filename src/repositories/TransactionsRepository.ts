import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface AllTransactionsDto {
  transactions: Transaction[];
  balance: Balance;
}

interface CreateTransactionDto {
  title: string;
  value: number;
  type: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { transactions } = await this.all();

    const sumerise = (type: string): number => {
      return transactions
        .map(el => (el.type === type ? el.value : 0))
        .reduce((acc, cur) => acc + cur, 0);
    };

    const income = sumerise('income');
    const outcome = sumerise('outcome');

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public async all(): Promise<AllTransactionsDto> {
    const transactions = await this.find();

    return {
      transactions,
      balance: await this.getBalance(),
    };
  }
}

export default TransactionsRepository;
