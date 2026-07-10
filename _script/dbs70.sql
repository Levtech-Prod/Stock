ALTER TABLE `orders`
	CHANGE COLUMN `status` `status` INT(11) NULL DEFAULT '0' COMMENT '0 - init, 1 - inprogress, 2 - ready, 3-can invoice, 4-closed , 5- canceled' AFTER `description`;
	
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
	
	update orders SET `status`= VAR_status where id= new.order_id and `status` NOT IN (3,4,5);
	
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
	
	update orders set status= VAR_status where id= new.order_id and `status` NOT IN (3,4,5);
	
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
	
	update orders set status= VAR_status where id= old.order_id and `status` NOT IN (3,4,5);
END
$$