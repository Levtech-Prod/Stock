CREATE TABLE `tool_categs` (
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

CREATE TABLE `tool_categs_param` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`categ_id` INT(11) NOT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`type` INT(11) NULL DEFAULT '1' COMMENT '1-code, 2-type, 3-text, 4-number ',
	`type_values` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`unit` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE,
	INDEX `categ_idx` (`categ_id`) USING BTREE,
	CONSTRAINT `FK_tool_categs_param_tool_categs` FOREIGN KEY (`categ_id`) REFERENCES `tool_categs` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `tool_stock` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`categ_id` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`code` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`quantity` INT(11) NULL DEFAULT '0',
	`location` VARCHAR(250) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`description` VARCHAR(512) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted` INT(11) NULL DEFAULT '0',
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `quantity_idx` (`quantity`) USING BTREE,
	INDEX `location_idx` (`location`) USING BTREE,
	INDEX `deleted_idx` (`deleted`) USING BTREE,
	INDEX `code_idx` (`code`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `tool_stock_param` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`stock_id` INT(11) NOT NULL,
	`param_id` INT(11) NOT NULL,
	`value` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `uniq_idx` (`stock_id`, `param_id`) USING BTREE,
	INDEX `stock_idx` (`stock_id`) USING BTREE,
	INDEX `param_idx` (`param_id`) USING BTREE,
	INDEX `value_idx` (`value`) USING BTREE,
	CONSTRAINT `FK_tool_stock_param_tool_stock` FOREIGN KEY (`stock_id`) REFERENCES `tool_stock` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

DELIMITER $$

DROP TRIGGER IF EXISTS `tool_stock_param_after_insert`$$
CREATE TRIGGER `tool_stock_param_after_insert` AFTER INSERT ON `tool_stock_param` FOR EACH ROW BEGIN
	DECLARE VAR_type INT(11);
	
	SELECT `type` FROM tool_categs_param p WHERE p.id = NEW.param_id into VAR_type;
	
	if(VAR_type=1) then
		UPDATE tool_stock SET `code`= NEW.`value` WHERE id = NEW.stock_id;
	END if;
END
$$

DROP TRIGGER IF EXISTS `tool_stock_param_after_update`$$
CREATE TRIGGER `tool_stock_param_after_update` AFTER UPDATE ON `tool_stock_param` FOR EACH ROW BEGIN
	DECLARE VAR_type INT(11);
	
	SELECT `type` FROM tool_categs_param p WHERE p.id = NEW.param_id into VAR_type;
	
	if(VAR_type=1) then
		UPDATE tool_stock SET `code`= NEW.`value` WHERE id = NEW.stock_id;
	END if;
END
$$

DELIMITER ;