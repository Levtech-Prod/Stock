ALTER TABLE `orders`
	ADD COLUMN `comments` VARCHAR(500) NULL AFTER `finished`;