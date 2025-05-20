exports.up = (pgm) => {
  // Создание таблицы ps_aors
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
users (
  id SERIAL,
  username VARCHAR(20) UNIQUE,
  password_hash VARCHAR(64),
  PRIMARY KEY (id)
);
`);

  // Создание таблицы ps_auths
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  title_pages (
    id UUID UNIQUE,
    name VARCHAR(100),
    filename VARCHAR(100),
    PRIMARY KEY (id)
  );
  `);

  // Создание таблицы ps_endpoints
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
};

  // Создание таблицы ps_endpoints
  pgm.sql(`
CREATE TABLE IF NOT EXISTS
  templates (
    id UUID UNIQUE,
    name VARCHAR(100),
    filename VARCHAR(100),
    PRIMARY KEY (id)
  );
  `);
};

exports.down = (pgm) => {
  // Удаление таблиц в обратном порядке (учитываем зависимости)
  pgm.sql(`DROP TABLE IF EXISTS ps_endpoints;`);
  pgm.sql(`DROP TABLE IF EXISTS ps_auths;`);
  pgm.sql(`DROP TABLE IF EXISTS ps_aors;`);
};
