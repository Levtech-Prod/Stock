ALTER TABLE `jobs`
	ADD COLUMN `late` INT(11) NULL DEFAULT '0' AFTER `estimate_time`,
	ADD COLUMN `late_comment` VARCHAR(500) NULL DEFAULT NULL AFTER `late`;
	
CREATE TABLE `machines` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`image` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `maintenance_templates` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`machineid` INT(11) NOT NULL,
	`type` INT(11) NULL DEFAULT NULL COMMENT '1 - week, 2 - month, 3 - semester ',
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`description` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `type_idx` (`type`) USING BTREE,
	INDEX `machineid_idx` (`machineid`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `maintenance` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`machineid` INT(11) NOT NULL,
	`year` INT(11) NOT NULL,
	`week` INT(11) NULL DEFAULT NULL,
	`month` INT(11) NULL DEFAULT NULL,
	`semester` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`description` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`template_id` INT(11) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `machineid_idx` (`machineid`) USING BTREE,
	INDEX `year_idx` (`year`) USING BTREE,
	INDEX `week_idx` (`week`) USING BTREE,
	INDEX `month_idx` (`month`) USING BTREE,
	INDEX `semester_idx` (`semester`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO `menu` (`parent`, `name`, `link`, `level`, `disabled`) VALUES (7, 'Késések', 'Late_stat', 1, 0);