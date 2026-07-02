ALTER TABLE `jobs_log`
	ADD INDEX `job_id_idx` (`job_id`),
	ADD INDEX `status_idx` (`status`),
	ADD INDEX `status_new_idx` (`status_new`);
