DROP TRIGGER `quoting_after_update`;

ALTER TABLE `users`
	ADD INDEX `rfid_idx` (`rfid`),
	ADD INDEX `is_online_idx` (`is_online`),
	ADD INDEX `last_rfid_login_idx` (`last_rfid_login`),
	ADD INDEX `ipaddr_idx` (`ipaddr`);

ALTER TABLE `users`
	ADD INDEX `multi_idx` (`rfid`, `is_online`, `ipaddr`, `last_rfid_login`) USING BTREE;