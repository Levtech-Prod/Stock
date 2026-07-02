ALTER TABLE `orders`
	ADD COLUMN `shipping_type` INT(11) NULL DEFAULT '0' COMMENT '0 - Express, 1- Economy' AFTER `invoice_sent`,
	ADD COLUMN `transport_cost` DOUBLE(11,2) NULL DEFAULT '0' AFTER `shipping_type`;