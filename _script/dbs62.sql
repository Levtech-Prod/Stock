ALTER TABLE `settings`
	ADD COLUMN `invoice_nr` INT NULL DEFAULT '1' AFTER `quoting`;
	
ALTER TABLE `orders`
	ADD COLUMN `invoice_file` VARCHAR(500) NULL DEFAULT NULL AFTER `user_count`;
	
ALTER TABLE `clients`
	ADD COLUMN `invoice_info` VARCHAR(500) NULL DEFAULT NULL AFTER `head_office`;