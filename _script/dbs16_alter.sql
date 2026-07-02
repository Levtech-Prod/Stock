ALTER TABLE `orders`
	ADD COLUMN `plan_order` INT(11) NULL DEFAULT '0' AFTER `plan_day`;