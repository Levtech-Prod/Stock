DELIMITER $$
DROP FUNCTION IF EXISTS `calc_work_hours`$$
CREATE FUNCTION `calc_work_hours`(
	`IN_job_id` INT
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
    DECLARE var_status_old, var_status_new, var_status_old_prev, var_status_new_prev, var_position, var_position_new, var_position_prev, var_position_new_prev, var_type INT(11);
    DECLARE var_ts, var_ts_prev TIMESTAMP;
    DECLARE var_total_minute, c INT DEFAULT 0;
    DECLARE var_minute INT(11);

    DECLARE jlog CURSOR FOR
    SELECT js.`type`, s.`type`, l.`status`, l.status_new, l.ts, l.`position`, l.position_new, l.`type` FROM jobs_log l
	left join jobs_status js on (js.id = l.`status`)
	left join jobs_status s on (s.id = l.status_new)
	left join users u on (u.id = l.userid)
	WHERE l.job_id=IN_job_id ORDER BY ts ASC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN jlog;
	jlog: LOOP
		SET done=0;
        FETCH jlog INTO var_stype_old, var_stype_new, var_status_old, var_status_new, var_ts, var_position, var_position_new, var_type;
        IF (done = 1) THEN LEAVE jlog; END IF;
    	set c = c+1;
    	
		if((var_status_new_prev=var_status_old and var_stype_new_prev=var_stype_old and var_stype_new_prev=1 AND var_position=0 /*AND var_type=0*/) OR (var_type=1 AND var_stype_new_prev=1 AND var_stype_old_prev=1)) then 
	     	set var_minute = TIMESTAMPDIFF(MINUTE, var_ts_prev, var_ts);
        	set var_total_minute = var_total_minute + var_minute;
	    end if;
	    
        set var_stype_old_prev = var_stype_old;
		set var_stype_new_prev = var_stype_new;
        set var_status_old_prev = var_status_old;
		set var_status_new_prev = var_status_new;
		set var_ts_prev = var_ts;
		SET var_position_prev = var_position;
		SET var_position_new = var_position_new_prev;
    END LOOP jlog;
    CLOSE jlog;
    
    RETURN var_total_minute;
	#concat('c:', c, ', old:', var_status_old_prev,', new: ', var_status_new, ', ts: ', CAST(var_ts AS CHAR),', ts_prev: ', CAST(var_ts_prev AS CHAR), ', total: ',var_total_minute);
END
$$

DELIMITER ;

