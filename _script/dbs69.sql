ALTER TABLE `jobs`
	ADD COLUMN `material_received` INT(11) NULL DEFAULT '0' AFTER `material_ordered`;

ALTER TABLE `jobs`
	ADD COLUMN `arm1` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `diameter`,
	ADD COLUMN `arm2` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `arm1`,
	ADD COLUMN `right_angle` INT(11) NULL DEFAULT '0' AFTER `cylinder`;
	
ALTER TABLE `quoting_parts`
	ADD COLUMN `arm1` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `diameter`,
	ADD COLUMN `arm2` DOUBLE(11,1) NULL DEFAULT '0.0' AFTER `arm1`,
	ADD COLUMN `right_angle` INT(11) NULL DEFAULT '0' AFTER `cylinder`;