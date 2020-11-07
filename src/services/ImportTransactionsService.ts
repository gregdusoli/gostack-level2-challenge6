import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<any> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);

    const transactionsReadStream = fs.createReadStream(filePath);

    const parses = csvParse({ from_line: 2 });
    const parseCSV = transactionsReadStream.pipe(parses);

    const transactions: Omit<Transaction, 'id'>[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existingCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existingCategoriesTitles = existingCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existingCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existingCategories];

    const importedTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => String(category.title) === String(transaction.category),
        ),
      })),
    );

    await transactionsRepository.save(importedTransactions);

    await fs.promises.unlink(filePath);

    return { newCategories, importedTransactions };
  }
}

export default ImportTransactionsService;
