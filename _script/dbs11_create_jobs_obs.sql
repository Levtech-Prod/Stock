CREATE TABLE `jobs_observations` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`job_id` INT(11) NULL DEFAULT NULL,
	`observation` LONGTEXT NULL,
	`deleted` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	INDEX `FK_jobs_observations_jobs` (`job_id`),
	CONSTRAINT `FK_jobs_observations_jobs` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;