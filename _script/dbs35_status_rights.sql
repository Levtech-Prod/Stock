CREATE TABLE `jobs_status_rights` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`statusid` INT(11) NOT NULL,
	`userid` INT(11) NOT NULL COMMENT 'users.id',
	`enabled` INT(11) NOT NULL DEFAULT '1',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_jobs_status_rights_jobs_status` (`statusid`) USING BTREE,
	INDEX `FK_jobs_status_rights_users` (`userid`) USING BTREE,
	CONSTRAINT `FK_jobs_status_rights_jobs_status` FOREIGN KEY (`statusid`) REFERENCES `jobs_status` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK_jobs_status_rights_users` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO jobs_status_rights(statusid, userid, enabled)
SELECT  s.id, u.id, 1 FROM users u
JOIN jobs_status s;

DELIMITER $$

DROP TRIGGER IF EXISTS `users_after_insert`$$
CREATE TRIGGER `users_after_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
	INSERT INTO menu_rights
        (`menuid`,
        `userid`,
        `enabled`
		)
    SELECT 
		id,
        NEW.id,
        if(NEW.`admin`,1, 0)
    FROM menu;
    
    INSERT INTO jobs_status_rights
        (`statusid`,
        `userid`,
        `enabled`
		)
    SELECT 
		id,
        NEW.id,
        1
    FROM jobs_status;
END
$$

DROP TRIGGER IF EXISTS `jobs_status_after_insert`$$
CREATE TRIGGER `jobs_status_after_insert` AFTER INSERT ON `jobs_status` FOR EACH ROW BEGIN
	DECLARE done INT DEFAULT 0;
    DECLARE var_userid INT;
    DECLARE mycursor CURSOR FOR 
		SELECT id FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN mycursor;
    mycursor: LOOP
        SET done=0;
	    FETCH mycursor INTO var_userid;
	    IF (done = 1) THEN LEAVE mycursor; 
		END IF;
        INSERT INTO jobs_status_rights
	        (`statusid`,
	        `userid`,
	        `enabled`
			)
	    VALUES( 
			new.id,
	        var_userid,
	        1
		);
    END LOOP mycursor;
    CLOSE mycursor;
END
$$

DELIMITER ;