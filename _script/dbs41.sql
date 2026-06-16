INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (11, 'Külön projektek', 'Project', 0);

CREATE TABLE `project_status` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`colour` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`sort` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO `project_status` (`id`, `name`, `colour`, `sort`) VALUES (1, 'Új projektek', '#f7db87', 1);
INSERT INTO `project_status` (`id`, `name`, `colour`, `sort`) VALUES (2, 'Folyamatban', '#f7c574', 2);
INSERT INTO `project_status` (`id`, `name`, `colour`, `sort`) VALUES (3, 'Elakadt', '#ff3636', 3);
INSERT INTO `project_status` (`id`, `name`, `colour`, `sort`) VALUES (4, 'Befejezve', '#3cfa78', 4);

CREATE TABLE `project` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`type` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`target` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`description` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`user` INT(11) NULL DEFAULT NULL,
	`deadline` DATE NULL DEFAULT NULL,
	`comments` VARCHAR(512) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`results` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`status` INT(11) NULL DEFAULT '1',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	`deleted` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `status_idx` (`status`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
