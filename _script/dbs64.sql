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

INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (23, NULL, 'Karbantartás', NULL, 0, 0);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (24, 23, 'Gépek', 'Machines', 1, 0);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (25, 23, 'Egyebek', 'Others', 1, 0);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (26, 23, 'Beállítások', 'Machine_settings', 1, 0);
