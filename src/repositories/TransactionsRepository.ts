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

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sumerise = (type: string): number => {
      return transactions
        .map(el => (el.type === type ? Number(el.value) : 0))
        .reduce((acc, cur) => Number(acc + cur), 0);
    };

    const income = sumerise('income');
    const outcome = sumerise('outcome');
    const total = Number(income - outcome);

    return { income, outcome, total };
  }

  public async all(): Promise<AllTransactionsDto> {
    const transactions = await this.find();
    const balance = await this.getBalance();

    return {
      balance,
      transactions,
    };
  }
}

export default TransactionsRepository;
