ALTER TABLE `jobs`
	ADD COLUMN `handling` VARCHAR(512) NULL DEFAULT NULL AFTER `material_ordered`;
	
ALTER TABLE `jobs`
	ADD INDEX `handling_idx` (`handling`);