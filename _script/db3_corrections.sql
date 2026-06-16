ALTER TABLE `orders`
	DROP COLUMN `quantity`;

ALTER TABLE `materials`
	ADD COLUMN `price` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `density`;
	
ALTER TABLE `jobs`
	DROP COLUMN `stock_id`,
	DROP COLUMN `reduce_stock`;
	
ALTER TABLE `jobs`
	ADD COLUMN `material_unit_price` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `price`,
	ADD COLUMN `rec_createdid` INT(11) NULL DEFAULT NULL AFTER `ts`,
	ADD COLUMN `rec_modifiedid` INT(11) NULL DEFAULT NULL AFTER `rec_createdid`,
	ADD COLUMN `rec_modified` DATETIME NULL DEFAULT NULL AFTER `rec_modifiedid`;
	
ALTER TABLE `orders`
	ADD COLUMN `rec_createdid` INT(11) NULL DEFAULT NULL AFTER `ts`,
	ADD COLUMN `rec_modifiedid` INT(11) NULL DEFAULT NULL AFTER `rec_createdid`,
	ADD COLUMN `rec_modified` DATETIME NULL DEFAULT NULL AFTER `rec_modifiedid`;
	
ALTER TABLE `jobs_status`
	ADD COLUMN `type` INT(11) NULL DEFAULT '0' COMMENT '0- altalanos, 1-cnc gep, 2 -qc' AFTER `sort`;