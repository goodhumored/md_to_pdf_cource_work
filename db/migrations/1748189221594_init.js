exports.up = (pgm) => {
  // Создание таблицы пользователей
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
users (
  id SERIAL,
  username VARCHAR(20) UNIQUE,
  password_hash VARCHAR(64),
  PRIMARY KEY (id)
);
`);

  // Создание таблицы титульных листов
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  title_pages (
    id UUID UNIQUE,
    name VARCHAR(100),
    filename VARCHAR(100),
    PRIMARY KEY (id)
  );
  `);

  // Создание таблицы документов
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  user_documents (
    id UUID UNIQUE,
    owner_id INT,
    name VARCHAR(100),
    pdf_file_name VARCHAR(100),
    md_file_name VARCHAR(100),
    title_page_id UUID,
    template_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users (id),
    CONSTRAINT fk_title_page FOREIGN KEY (title_page_id) REFERENCES title_pages (id),
    CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES templates (id)
  );
  `);

  // Создание таблицы шаблонов
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  templates (
    id UUID UNIQUE,
    name VARCHAR(100),
    filename VARCHAR(100),
    PRIMARY KEY (id)
  );
  `);

  // Создание таблицы сессий
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  sessions (
    id UUID UNIQUE,
    user_id INT,
    last_used TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);
};

exports.down = (pgm) => {
  // Удаление таблиц в обратном порядке (учитываем зависимости)
  pgm.sql(`DROP TABLE IF EXISTS sessions;`);
  pgm.sql(`DROP TABLE IF EXISTS templates;`);
  pgm.sql(`DROP TABLE IF EXISTS user_documents;`);
  pgm.sql(`DROP TABLE IF EXISTS title_pages;`);
  pgm.sql(`DROP TABLE IF EXISTS users;`);
};
