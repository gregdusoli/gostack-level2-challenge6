import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<any> {
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

    const categoriesRepository = getRepository(Category);

    const existingCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existingCategoriesTitle = existingCategories.map(
      (category: Category) => category.title,
    );

    console.log(existingCategoriesTitle);

    return { categories, transactions };
  }
}

export default ImportTransactionsService;
