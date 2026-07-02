ALTER TABLE `jobs`
	ADD COLUMN `archived` INT(11) NULL DEFAULT '0' AFTER `rec_modified`,
	ADD INDEX `rec_modified_idx` (`rec_modified`),
	ADD INDEX `archived_idx` (`archived`);