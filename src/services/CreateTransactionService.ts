// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDto {
  title: string;
  value: number;
  type: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
  }: RequestDto): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkBalance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > checkBalance.total) {
      throw new Error('insufficient funds');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
