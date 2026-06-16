DELIMITER $$

DROP FUNCTION IF EXISTS `calc_machine_using`$$
CREATE FUNCTION `calc_machine_using`(
	`IN_status_id` INT,
	`IN_date` DATE
)
RETURNS varchar(500) CHARSET utf8
LANGUAGE SQL
DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
COMMENT ''
BEGIN
	DECLARE done INT DEFAULT 0;
    DECLARE var_stype_old, var_stype_new, var_stype_old_prev, var_stype_new_prev INT(11);
    DECLARE var_status_old, var_status_new, var_status_old_prev, var_status_new_prev INT(11);
    DECLARE var_ts, var_ts_prev TIMESTAMP;
    DECLARE var_total_minute, c INT DEFAULT 0;
    DECLARE var_minute INT(11);

    DECLARE jlog CURSOR FOR
    SELECT js.`type`, s.`type`, l.`status`, l.status_new, l.ts FROM jobs_log l
	left join jobs_status js on (js.id = l.`status`)
	left join jobs_status s on (s.id = l.status_new)
	left join users u on (u.id = l.userid)
	WHERE  DATE(l.ts) = IN_date AND (l.`status`=IN_status_id OR l.status_new=IN_status_id) ORDER BY l.job_id, ts ASC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN jlog;
	jlog: LOOP
		SET done=0;
        FETCH jlog INTO var_stype_old, var_stype_new, var_status_old, var_status_new, var_ts;
        IF (done = 1) THEN LEAVE jlog; END IF;
    	set c = c+1;
    	
		if(var_status_new_prev=var_status_old) then 
	     	set var_minute = TIMESTAMPDIFF(MINUTE, var_ts_prev, var_ts);
        	set var_total_minute = var_total_minute + var_minute;
	    end if;
	    
        set var_stype_old_prev = var_stype_old;
		set var_stype_new_prev = var_stype_new;
        set var_status_old_prev = var_status_old;
		set var_status_new_prev = var_status_new;
		set var_ts_prev = var_ts;
    END LOOP jlog;
    CLOSE jlog;
    
    RETURN var_total_minute;
	#concat('c:', c, ', old:', var_status_old_prev,', new: ', var_status_new, ', ts: ', CAST(var_ts AS CHAR),', ts_prev: ', CAST(var_ts_prev AS CHAR), ', total: ',var_total_minute);
END
$$

DELIMITER ;