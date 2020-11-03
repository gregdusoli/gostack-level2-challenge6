import { Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';
// import TransactionsRepository from '../repositories/TransactionsRepository';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  return response.json({ ok: true });
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({ title, value, type });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  return response.json({ ok: true });
});

transactionsRouter.post('/import', async (request, response) => {
  return response.json({ ok: true });
});

export default transactionsRouter;
