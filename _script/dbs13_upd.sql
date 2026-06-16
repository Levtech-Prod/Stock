ALTER TABLE `orders`
	ADD COLUMN `plan` INT(11) NULL DEFAULT '0' AFTER `deleted`,
	ADD COLUMN `plan_day` INT(11) NULL DEFAULT '1' AFTER `plan`,
	ADD COLUMN `finished` INT(11) NULL DEFAULT '0' AFTER `plan_day`;