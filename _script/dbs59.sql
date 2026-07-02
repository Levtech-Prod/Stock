CREATE TABLE `jobs_work_log` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`job_id` INT(11) NULL DEFAULT NULL,
	`userid` INT(11) NULL DEFAULT NULL,
	`status` INT(11) NULL DEFAULT NULL,
	`start_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	`end_time` TIMESTAMP NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `job_id_idx` (`job_id`) USING BTREE,
	INDEX `status_idx` (`status`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

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
	
	update orders SET `status`= VAR_status where id= new.order_id and `status` NOT IN (3,4);
	
	if(NEW.`status`<>OLD.`status`) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new, `position`, `position_new`) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`, OLD.`position`, NEW.`position`);
	END if;
	
	SELECT s.`type` INTO VAR_type FROM jobs_status s WHERE s.id = NEW.`status`;
	
	if(NEW.`position`=0 AND OLD.`status`= NEW.`status` AND VAR_type=1) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new, `position`, `position_new`, `type`) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`, OLD.`position`, NEW.`position`, 1);
	END if;
	
END
$$

DROP TRIGGER IF EXISTS `jobs_after_insert`$$
CREATE TRIGGER `jobs_after_insert` AFTER INSERT ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status, VAR_stock_id, VAR_stock_qty INT(11);

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
	
	update orders set status= VAR_status where id= new.order_id and `status` NOT IN (3,4);
	
	INSERT INTO jobs_log(job_id, userid, `status`, `status_new`) VALUES (NEW.id, NEW.rec_createdid, null, NEW.`status`);
	
END
$$

DROP TRIGGER IF EXISTS `jobs_after_delete`$$
CREATE TRIGGER `jobs_after_delete` AFTER DELETE ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);
	
	SELECT COUNT(j.id) AS nr, SUM(if(j.STATUS=-2,1,0)) AS ready, SUM(if(j.STATUS>0 or j.status=-1,1,0)) AS progress,  SUM(if(j.STATUS=0,1,0)) AS init
		FROM jobs j JOIN orders o on o.id=j.order_id WHERE j.order_id=old.order_id GROUP BY order_id into VAR_nr, VAR_ready, VAR_progress, VAR_init;
		
	if(VAR_progress>0) then
		set VAR_status = 1;
	elseif(VAR_nr=VAR_ready) then
		set VAR_status = 2;
	elseif(VAR_nr = VAR_init) then
		set VAR_status = 0;
	else
		set VAR_status = 1;
	END IF;
	
	update orders set status= VAR_status where id= old.order_id and `status` NOT IN (3,4);
END
$$

DROP TRIGGER IF EXISTS `jobs_work_log_after_update`$$
CREATE TRIGGER `jobs_work_log_after_update` AFTER UPDATE ON `jobs_work_log` FOR EACH ROW BEGIN
	if(new.start_time IS NOT NULL AND NEW.end_time IS NOT NULL) then
		UPDATE jobs SET working_minutes = working_minutes+ TIMESTAMPDIFF(MINUTE, new.start_time, NEW.end_time) WHERE id=NEW.job_id;
	END if;
END
$$

DROP FUNCTION IF EXISTS `calc_qc_time`$$
CREATE FUNCTION `calc_qc_time`(
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
    DECLARE var_status_old, var_status_new, var_status_old_prev, var_status_new_prev INT(11);
    DECLARE var_ts, var_ts_prev TIMESTAMP;
    DECLARE var_total_minute, c INT DEFAULT 0;
    DECLARE var_minute INT(11);

    SELECT l.ts INTO var_ts_prev FROM jobs_log l
	left join jobs_status s on (s.id = l.status_new)
	WHERE job_id = IN_job_id AND s.`type`=2 ORDER BY l.job_id, ts ASC LIMIT 1;
	
	SELECT l.ts INTO var_ts FROM jobs_log l
	left join jobs_status s on (s.id = l.`status`)
	WHERE job_id = IN_job_id AND s.`type`=2 ORDER BY l.job_id, ts ASC LIMIT 1;
   
	if(var_ts_prev IS NOT NULL and var_ts IS NOT null) then 
     	set var_total_minute = TIMESTAMPDIFF(MINUTE, var_ts_prev, var_ts);
    end if;
	
    RETURN var_total_minute;
END
$$

DELIMITER ;

ALTER TABLE `jobs_status`
	ADD COLUMN `show_message` INT(11) NULL DEFAULT '0' COMMENT '0- nincs uzenet, 1- behuzaskor, 2- kihuzaskor' AFTER `type`,
	ADD COLUMN `message` VARCHAR(500) NULL DEFAULT NULL AFTER `show_message`;
	
CREATE TABLE `qc_types` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `name_idx` (`name`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO `qc_types` (`id`, `name`) VALUES (1, 'Nem volt hiba ');
INSERT INTO `qc_types` (`id`, `name`) VALUES (2, 'Kézi javítás');
INSERT INTO `qc_types` (`id`, `name`) VALUES (3, 'Gépen javítás');
INSERT INTO `qc_types` (`id`, `name`) VALUES (4, 'Újra kellett gyártani');

ALTER TABLE `jobs`
	ADD COLUMN `qc_type` INT(11) NULL DEFAULT NULL AFTER `work_log_id`,
	ADD COLUMN `qc_comment` VARCHAR(500) NULL DEFAULT NULL AFTER `qc_type`;
	
INSERT INTO `menu` (`parent`, `name`, `link`, `level`) VALUES (7, 'Statisztika', 'Statistics', 1);
UPDATE `menu` SET `link`=NULL WHERE  `id`=7;
INSERT INTO `menu` (`parent`, `name`, `link`, `level`) VALUES (7, 'Emberek kihasználtsága', 'Users_stat', 1);

ALTER TABLE `jobs`
	ADD COLUMN `blind_job` INT(11) NULL DEFAULT '0' AFTER `qc_comment`,
	ADD COLUMN `estimate_time` INT(11) NULL DEFAULT '0' AFTER `blind_job`;
	
ALTER TABLE `tool_stock`
	ADD COLUMN `main_param` VARCHAR(250) NULL DEFAULT NULL AFTER `description`;