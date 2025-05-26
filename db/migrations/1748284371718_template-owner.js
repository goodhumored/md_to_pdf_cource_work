exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE templates
    ADD COLUMN user_id INT;
  `);
  pgm.sql(`
    ALTER TABLE templates
    ADD CONSTRAINT fk_owner FOREIGN KEY (user_id) REFERENCES users (id);
  `);
  pgm.sql(`
    ALTER TABLE templates
    ADD COLUMN public BOOLEAN;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE templates
    DROP CONSTRAINT fk_owner;
  `);
  pgm.sql(`
    ALTER TABLE templates
    DROP COLUMN IF EXISTS user_id;
  `);
  pgm.sql(`
    ALTER TABLE templates
    DROP COLUMN IF EXISTS public;
  `);
};
