ALTER TABLE `jobs_log`
	ADD COLUMN `position` INT(11)  NULL DEFAULT '0' AFTER `status_new`,
	ADD COLUMN `position_new` INT(11)  NULL DEFAULT '0' AFTER `position`,
	ADD COLUMN `type` INT(11) NULL DEFAULT '0' COMMENT '0 - status change, 1 - position change' AFTER `ts`;

	
DELIMITER $$
DROP TRIGGER IF EXISTS `jobs_after_update`$$
CREATE TRIGGER `jobs_after_update` AFTER UPDATE ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status, VAR_stock_id, VAR_stock_qty, VAR_type INT(11);
	
	SELECT COUNT(j.id) AS nr, SUM(if(j.STATUS=-2,1,0)) AS ready, SUM(if(j.STATUS>0 or j.status=-1,1,0)) AS progress,  SUM(if(j.STATUS=0,1,0)) AS init
		FROM jobs j JOIN orders o on o.id=j.order_id WHERE j.order_id=new.order_id GROUP BY order_id into VAR_nr, VAR_ready, VAR_progress, VAR_init;
		
	if(VAR_progress>0) then
		set VAR_status = 1;
	elseif(VAR_nr=VAR_ready) then
		set VAR_status = 2;
	elseif(VAR_nr = VAR_init) then
		set VAR_status = 0;
	else
		set VAR_status = 1;
	END IF;
	
	update orders set status= VAR_status where id= new.order_id;
	
	if(NEW.`status`<>OLD.`status`) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new, `position`, `position_new`) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`, OLD.`position`, NEW.`position`);
	END if;
	
	SELECT s.`type` INTO VAR_type FROM jobs_status s WHERE s.id = NEW.`status`;
	
	if(NEW.`position`=0 AND OLD.`status`= NEW.`status` AND VAR_type=1) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new, `position`, `position_new`, `type`) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`, OLD.`position`, NEW.`position`, 1);
	END if;
	
	if(NEW.material_cut_id IS NOT NULL AND OLD.material_cut_id IS null) then
		SELECT stock_id FROM materials_cut WHERE id= NEW.material_cut_id INTO VAR_stock_id;
		update stock set quantity = quantity - NEW.material_qty where id = VAR_stock_id;
		
		SELECT quantity FROM stock where id =VAR_stock_id INTO VAR_stock_qty;
		if(VAR_stock_qty<=0) then 
			update stock set deleted = 1 where id = VAR_stock_id;
		END if;
	end if;
END
$$

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
    	
		if((var_status_new_prev=var_status_old and var_stype_new_prev=var_stype_old and var_stype_new_prev=1 AND var_position=0 AND var_type=0) OR (var_type=1 and var_stype_new_prev=1 AND var_stype_old_prev=1)) then 
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