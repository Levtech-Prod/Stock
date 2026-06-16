DELIMITER $$

DROP TRIGGER IF EXISTS `menu_after_insert`$$
CREATE TRIGGER `menu_after_insert` AFTER INSERT ON `menu` FOR EACH ROW BEGIN
	DECLARE done INT DEFAULT 0;
    DECLARE var_userid INT;
    DECLARE var_admin INT;
    DECLARE mycursor CURSOR FOR 
		SELECT id, admin FROM users;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN mycursor;
    mycursor: LOOP
        SET done=0;
	    FETCH mycursor INTO var_userid, var_admin;
	    IF (done = 1) THEN LEAVE mycursor; 
		END IF;
        INSERT INTO menu_rights
	        (`menuid`,
	        `userid`,
	        `enabled`
			)
	    VALUES( 
			new.id,
	        var_userid,
	        if(var_admin, 1, 0)
		);
    END LOOP mycursor;
    CLOSE mycursor;
END
$$

DELIMITER ;

INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (8, 'Hét tervező', 'Plan', 0);
