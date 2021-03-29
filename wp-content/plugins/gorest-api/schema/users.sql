CREATE TABLE IF NOT EXISTS `wp_tensorgo`.`wp_gorest_users`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(250) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Transgender') NULL DEFAULT NULL,
    `status` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `thumbnail` TEXT NULL DEFAULT NULL,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;