import { DatabaseSync } from 'node:sqlite'

export const database = new DatabaseSync(':memory:')

database.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    category_id TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`)

database
  .prepare(
    `
    INSERT INTO categories (id, name)
    VALUES
      ('11111111-1111-4111-8111-111111111111', 'Eletronicos'),
      ('22222222-2222-4222-8222-222222222222', 'Moda'),
      ('33333333-3333-4333-8333-333333333333', 'Casa')
    `,
  )
  .run()

database
  .prepare(
    `
    INSERT INTO products (id, name, price, stock, category_id)
    VALUES
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Notebook Pro 14', 4899.9, 8, '11111111-1111-4111-8111-111111111111'),
      ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Fone Bluetooth', 249.9, 30, '11111111-1111-4111-8111-111111111111'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Camiseta Basica', 79.9, 50, '22222222-2222-4222-8222-222222222222'),
      ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Cafeteira Eletrica', 189.9, 12, '33333333-3333-4333-8333-333333333333')
    `,
  )
  .run()
