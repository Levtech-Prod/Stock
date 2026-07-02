ALTER TABLE `users`
	ADD COLUMN `manager` INT(11) NOT NULL DEFAULT '0' AFTER `price_right`;