CREATE TABLE IF NOT EXISTS `quoting_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `colour` varchar(50) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

INSERT INTO `quoting_status` (`id`, `name`, `colour`, `sort`) VALUES
	(1, 'Új ajánlat kérés', '#ffffc9', 1),
	(2, 'Előkészítve', '#f7c574', 2),
	(3, 'Jóvá hagyva', '#b8ffcc', 3),
	(4, 'Elküldve', '#99d3ff', 4),
	(5, 'Utánkövetve', '#33beff', 5),
	(6, 'Megkaptuk', '#3cfa78', 6),
	(7, 'Elveszítettük', '#ff3636', 7);
	
CREATE TABLE `quoting` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL,
	`client_name` VARCHAR(250) NULL DEFAULT NULL,
	`status` INT(11) NULL DEFAULT '1',
	`start_date` DATE NULL DEFAULT NULL,
	`sent_date` DATE NULL DEFAULT NULL,
	`price` DATE NULL DEFAULT NULL,
	`description` VARCHAR(512) NULL DEFAULT NULL,
	`deleted` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`),
	INDEX `start_date_idx` (`start_date`),
	INDEX `sent_date_idx` (`sent_date`),
	INDEX `client_name_idx` (`client_name`),
	INDEX `status_idx` (`status`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `quoting_files` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`quoting_id` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `FK_quoting_files_quoting` (`quoting_id`),
	CONSTRAINT `FK_quoting_files_quoting` FOREIGN KEY (`quoting_id`) REFERENCES `quoting` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `quoting_parts` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`quoting_id` INT(11) NOT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL,
	`quantity` INT(11) NULL DEFAULT NULL,
	`materialid` INT(11) NULL DEFAULT NULL,
	`width` DOUBLE(11,1) NULL DEFAULT '0.0',
	`length` DOUBLE(11,1) NULL DEFAULT '0.0',
	`height` DOUBLE(11,1) NULL DEFAULT '0.0',
	`diameter` DOUBLE(11,1) NULL DEFAULT '0.0',
	`cylinder` INT(11) NULL DEFAULT '0',
	`price` DOUBLE(11,2) NULL DEFAULT '0.00',
	`material_unit_price` DOUBLE(11,2) NULL DEFAULT '0.00',
	`material_price` DOUBLE(11,2) NULL DEFAULT '0.00',
	`handling` VARCHAR(512) NULL DEFAULT NULL,
	`description` VARCHAR(512) NULL DEFAULT NULL,
	`image` VARCHAR(250) NULL DEFAULT NULL,
	`stp` VARCHAR(250) NULL DEFAULT NULL,
	`pdf` VARCHAR(250) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	`archived` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `FK_parts_quoting` (`quoting_id`),
	INDEX `handling_idx` (`handling`(255)),
	INDEX `rec_modified_idx` (`rec_modified`),
	INDEX `archived_idx` (`archived`),
	CONSTRAINT `FK_parts_quoting` FOREIGN KEY (`quoting_id`) REFERENCES `quoting` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

