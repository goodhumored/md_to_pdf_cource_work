exports.up = (pgm) => {
  // Добавление колонки thumbnail в таблицу templates
  pgm.sql(`
    ALTER TABLE templates
    ADD COLUMN thumbnail VARCHAR(100);
  `);

  // Добавление колонки thumbnail в таблицу title_pages
  pgm.sql(`
    ALTER TABLE title_pages
    ADD COLUMN thumbnail VARCHAR(100);
  `);

  // Добавление колонки thumbnail в таблицу user_documents
  pgm.sql(`
    ALTER TABLE user_documents
    ADD COLUMN thumbnail VARCHAR(100);
  `);
};

exports.down = (pgm) => {
  // Удаление колонки thumbnail из таблицы user_documents
  pgm.sql(`
    ALTER TABLE user_documents
    DROP COLUMN IF EXISTS thumbnail;
  `);

  // Удаление колонки thumbnail из таблицы title_pages
  pgm.sql(`
    ALTER TABLE title_pages
    DROP COLUMN IF EXISTS thumbnail;
  `);

  // Удаление колонки thumbnail из таблицы templates
  pgm.sql(`
    ALTER TABLE templates
    DROP COLUMN IF EXISTS thumbnail;
  `);
};
