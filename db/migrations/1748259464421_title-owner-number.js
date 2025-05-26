exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE title_pages
    DROP COLUMN user_id;
  `);
  pgm.sql(`
    ALTER TABLE title_pages
    ADD COLUMN user_id INT;
  `);
  pgm.sql(`
    ALTER TABLE title_pages
    ADD CONSTRAINT fk_owner FOREIGN KEY (user_id) REFERENCES users (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE title_pages
    DROP CONSTRAINT fk_owner;
  `);
  pgm.sql(`
    ALTER TABLE title_pages
    ALTER COLUMN user_id TYPE VARCHAR(100);
  `);
};
