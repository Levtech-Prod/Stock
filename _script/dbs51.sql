ALTER TABLE `quoting_parts`
	ADD COLUMN `unique_wage` DOUBLE(11,2) NULL DEFAULT NULL AFTER `wage`;