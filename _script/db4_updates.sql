CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`phone` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`admin` INT(11) NOT NULL DEFAULT '0',
	`created_at` DATETIME NOT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `menu` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`link` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`level` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `menu_rights` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`menuid` INT(11) NOT NULL,
	`userid` INT(11) NOT NULL COMMENT 'sys_clients.id',
	`enabled` INT(11) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_menu_rights` (`menuid`) USING BTREE,
	INDEX `userid_idx` (`userid`) USING BTREE,
	CONSTRAINT `FK_menu_rights` FOREIGN KEY (`menuid`) REFERENCES `menu` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK_menu_rights_users` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `jobs_log` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`job_id` INT(11) NULL DEFAULT NULL,
	`userid` INT(11) NULL DEFAULT NULL,
	`status` INT(11) NULL DEFAULT NULL,
	`status_new` INT(11) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `orders_files` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`order_id` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL,
	`private` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `settings` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`wage` DOUBLE(11,2) NULL DEFAULT '0.00',
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
