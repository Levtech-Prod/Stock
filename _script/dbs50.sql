ALTER TABLE `tool_stock`
	ADD COLUMN `broken_quantity` INT(11) NULL DEFAULT '0' AFTER `quantity`,
	ADD COLUMN `standard_part` INT(11) NULL DEFAULT '0' AFTER `location`;
	
CREATE TABLE `tool_stock_out_log` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`stock_id` INT(11) NULL DEFAULT NULL,
	`userid` INT(11) NULL DEFAULT NULL,
	`quantity` INT(11) NULL DEFAULT NULL,
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`returned` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `stock_id_idx` (`stock_id`) USING BTREE,
	INDEX `returned_idx` (`returned`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

DELIMITER $$
DROP TRIGGER IF EXISTS `tool_stock_out_log_before_update`$$
CREATE TRIGGER `tool_stock_out_log_before_update` BEFORE UPDATE ON `tool_stock_out_log` FOR EACH ROW BEGIN
	if(NEW.quantity<=0) then
		SET NEW.returned = 1;
	END if;
END
$$

DELIMITER ;