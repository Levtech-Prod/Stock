ALTER TABLE `jobs`
	ADD COLUMN `calibration` INT(11) NULL DEFAULT '0' AFTER `cylinder`;
	
ALTER TABLE `settings`
	ADD COLUMN `treatment` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `wage`;
	
ALTER TABLE `quoting_parts`
	ADD COLUMN `weight` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `wage`;
	
ALTER TABLE `quoting_parts`
	ADD COLUMN `surface` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `post_price`;

ALTER TABLE `jobs`
	ADD COLUMN `weight` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `handling`,
	ADD COLUMN `post_price` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `weight`,
	ADD COLUMN `surface` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `post_price`;