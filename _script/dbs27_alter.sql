ALTER TABLE `jobs`
	ADD COLUMN `comments` VARCHAR(500) NULL AFTER `status`;
	
ALTER TABLE `jobs`
	ADD COLUMN `stp` VARCHAR(250) NULL DEFAULT NULL AFTER `image`;
	
ALTER TABLE `quoting_parts`
	CHANGE COLUMN `price` `price` DOUBLE(11,2) NULL DEFAULT '0' AFTER `cylinder`,
	ADD COLUMN `wage` INT(11) NULL DEFAULT '0' AFTER `price`;