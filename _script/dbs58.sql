ALTER TABLE `jobs`
	ADD COLUMN `in_work` INT(11) NULL DEFAULT '0' AFTER `position`,
	ADD COLUMN `working_minutes` INT(11) NULL DEFAULT '0' AFTER `in_work`,
	ADD COLUMN `work_log_id` INT(11) NULL DEFAULT NULL AFTER `working_minutes`;

UPDATE jobs SET working_minutes = calc_work_hours(id) + 0;