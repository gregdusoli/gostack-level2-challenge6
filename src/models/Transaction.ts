import { uuid } from 'uuidv4';

export enum TransactionType {
  'income',
  'outcome',
}

class Transaction {
  id: string;

  title: string;

  value: number;

  type: string;

  category_id?: string;

  created_at?: Date;

  updated_at?: Date;

  constructor({ title, value, type }: Omit<Transaction, 'id'>) {
    this.id = uuid();
    this.title = title;
    this.value = value;
    this.type = type;
  }
}

export default Transaction;
