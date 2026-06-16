DELIMITER $$

DROP TRIGGER IF EXISTS `quoting_parts_after_update`$$
CREATE TRIGGER `quoting_parts_after_update` AFTER UPDATE ON `quoting_parts` FOR EACH ROW BEGIN
	/*if(NEW.handling IS NOT NULL) then
		CALL utils_split_string(NEW.handling,',',1);
	
		INSERT INTO handlings (id)
		SELECT `value` FROM `tmp_split_string` WHERE `key`=1
		ON DUPLICATE KEY UPDATE deleted=deleted;
	END if;*/
	#Not allowed to return a result set from a trigger
END
$$

DROP TRIGGER IF EXISTS `quoting_parts_after_insert`$$
CREATE TRIGGER `quoting_parts_after_insert` AFTER INSERT ON `quoting_parts` FOR EACH ROW BEGIN
	/*if(NEW.handling IS NOT NULL) then
		CALL utils_split_string(NEW.handling,',',1);
	
		INSERT INTO handlings (id)
		SELECT `value` FROM `tmp_split_string` WHERE `key`=1
		ON DUPLICATE KEY UPDATE deleted=deleted;
	END if;*/
END
$$

DROP TRIGGER IF EXISTS `jobs_after_insert`$$
CREATE TRIGGER `jobs_after_insert` AFTER INSERT ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);

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
	
	INSERT INTO jobs_log(job_id, userid, `status`, `status_new`) VALUES (NEW.id, NEW.rec_createdid, null, NEW.`status`);
	
	/*if(NEW.handling IS NOT NULL) then
		CALL utils_split_string(NEW.handling,',',1);
	
		INSERT INTO handlings (id)
		SELECT `value` FROM `tmp_split_string` WHERE `key`=1
		ON DUPLICATE KEY UPDATE deleted=deleted;
	END if;*/
END
$$

DROP TRIGGER IF EXISTS `jobs_after_update`$$
CREATE TRIGGER `jobs_after_update` AFTER UPDATE ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);
	
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
		INSERT INTO jobs_log(job_id, userid, `status`, status_new) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`);
	END if;
	
	/*if(NEW.handling IS NOT NULL) then
		CALL utils_split_string(NEW.handling,',',1);
	
		INSERT INTO handlings (id)
		SELECT `value` FROM `tmp_split_string` WHERE `key`=1
		ON DUPLICATE KEY UPDATE deleted=deleted;
	END if;*/
END
$$

DELIMITER ;