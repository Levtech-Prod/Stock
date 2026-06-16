ALTER TABLE `orders`
	ADD COLUMN `quoting_id` INT(11) NULL DEFAULT NULL AFTER `deleted`;
	
ALTER TABLE `quoting`
	ADD COLUMN `order_id` INT(11) NULL DEFAULT NULL AFTER `deleted`;
	
ALTER TABLE `quoting`
	CHANGE COLUMN `price` `transport_cost` DOUBLE(11,2) NULL DEFAULT '0' AFTER `sent_date`;
	
ALTER TABLE `quoting_parts`
	ADD COLUMN `post_price` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `price`;