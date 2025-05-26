exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE title_pages
    ADD COLUMN user_id VARCHAR(100);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE title_pages
    DROP COLUMN IF EXISTS user_id;
  `);
};
