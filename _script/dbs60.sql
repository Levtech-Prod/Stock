CREATE TABLE `quoting_observations` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`quoting_id` INT(11) NULL DEFAULT NULL,
	`observation` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`deleted` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_quoting_observations_quoting` (`quoting_id`) USING BTREE,
	CONSTRAINT `FK_quoting_observations_quoting` FOREIGN KEY (`quoting_id`) REFERENCES `quoting` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `quoting_log` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`quoting_id` INT(11) NULL DEFAULT NULL,
	`userid` INT(11) NULL DEFAULT NULL,
	`status` INT(11) NULL DEFAULT NULL,
	`status_new` INT(11) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `quoting_id_idx` (`quoting_id`) USING BTREE,
	INDEX `status_idx` (`status`) USING BTREE,
	INDEX `status_new_idx` (`status_new`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `orders_observations` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`order_id` INT(11) NULL DEFAULT NULL,
	`observation` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`deleted` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_orders_observations_orders` (`order_id`) USING BTREE,
	CONSTRAINT `FK_orders_observations_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

DELIMITER $$
DROP TRIGGER IF EXISTS `quoting_after_insert`$$
CREATE TRIGGER `quoting_after_insert` AFTER INSERT ON `quoting` FOR EACH ROW BEGIN
	INSERT INTO clients (id) VALUES (NEW.client_name)
  	ON DUPLICATE KEY UPDATE id= NEW.client_name;
  	
  	INSERT INTO quoting_log(quoting_id, userid, `status`, `status_new`) VALUES (NEW.id, NEW.rec_createdid, null, NEW.`status`);
END
$$

DROP TRIGGER IF EXISTS `quoting_after_update`$$
CREATE TRIGGER `quoting_after_update` AFTER UPDATE ON `quoting` FOR EACH ROW BEGIN
	if(NEW.`status`<>OLD.`status`) then
		INSERT INTO quoting_log(quoting_id, userid, `status`, status_new) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`);
	END if;
END
$$

DELIMITER ;

ALTER TABLE `orders`
	ADD COLUMN `user_count` INT(11) NULL DEFAULT NULL AFTER `transport_cost`;