ALTER TABLE `settings`
	ADD COLUMN `quoting` DOUBLE(11,2) NULL DEFAULT '0.00' AFTER `treatment`;