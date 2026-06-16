ALTER TABLE `stock`
	ADD COLUMN `diameter` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `height`,
	ADD COLUMN `cylinder` INT(11) NULL DEFAULT '0' AFTER `diameter`;
	
ALTER TABLE `jobs`
	ADD COLUMN `diameter` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `height`,
	ADD COLUMN `cylinder` INT(11) NULL DEFAULT '0' AFTER `diameter`;