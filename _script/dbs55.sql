ALTER TABLE `users`
	ADD COLUMN `rfid` VARCHAR(50) NOT NULL DEFAULT '' AFTER `created_at`,
	ADD COLUMN `is_online` INT(11) NOT NULL DEFAULT '0' AFTER `rfid`,
	ADD COLUMN `last_rfid_login` DATETIME NOT NULL AFTER `is_online`,
	ADD COLUMN `ipaddr` VARCHAR(50) NOT NULL DEFAULT '' AFTER `last_rfid_login`;