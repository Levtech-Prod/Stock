ALTER TABLE `orders`
	CHANGE COLUMN `status` `status` INT(11) NULL DEFAULT '0' COMMENT '0 - init, 1 - inprogress, 2 - ready, 3-can invoice,  4-closed ' AFTER `description`;
	
ALTER TABLE `jobs`
	ADD COLUMN `position` INT(11) NULL DEFAULT '1' AFTER `archived`;
	
ALTER TABLE `orders`
	ADD COLUMN `init_date` DATE NULL DEFAULT NULL AFTER `deadline`;
	
ALTER TABLE `orders`
	ADD COLUMN `intake_date` DATE NULL DEFAULT NULL AFTER `init_date`;