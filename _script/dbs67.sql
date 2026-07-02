ALTER TABLE `maintenance`
	ADD COLUMN `selected` INT(11) NULL DEFAULT '0' AFTER `template_id`,
	ADD INDEX `template_id_idx` (`template_id`);
	
ALTER TABLE `maintenance`
	ADD UNIQUE INDEX `unique_semester` (`machineid`, `year`, `semester`, `template_id`);
	
ALTER TABLE `maintenance`
	ADD UNIQUE INDEX `unique_month` (`machineid`, `year`, `month`, `template_id`);
	
ALTER TABLE `maintenance`
	ADD UNIQUE INDEX `unique_week` (`machineid`, `year`, `week`, `template_id`);