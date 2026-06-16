ALTER TABLE `orders`
	ADD COLUMN `invoice_sent` INT(11) NULL DEFAULT '0' AFTER `finished`;
	
ALTER TABLE `quoting`
	ADD COLUMN `shipping_type` INT(11) NULL DEFAULT '0' COMMENT '0 - Express, 1- Economy' AFTER `sent_date`,
	ADD COLUMN `lead_time` INT(11) NULL DEFAULT NULL AFTER `transport_cost`;
	
ALTER TABLE `quoting`
	ADD COLUMN `wage` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `transport_cost`;
	
ALTER TABLE `quoting_parts`
	CHANGE COLUMN `price` `price` INT(11) NULL DEFAULT '0' AFTER `cylinder`;
	
CREATE TABLE `clients` (
	`id` VARCHAR(250) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`regcode` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`head_office` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`deleted` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;