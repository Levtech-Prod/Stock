DELIMITER $$
DROP TRIGGER IF EXISTS `materials_cut_after_update`$$
CREATE TRIGGER `materials_cut_after_update` AFTER UPDATE ON `materials_cut` FOR EACH ROW BEGIN
	/*if(new.cut=1 AND OLD.cut=0) then
		update stock set quantity = quantity - new.take_qty where id = new.stock_id;
	end if;
	*/
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
	
	update orders set status= VAR_status where id= new.order_id;
	
	INSERT INTO jobs_log(job_id, userid, `status`, `status_new`) VALUES (NEW.id, NEW.rec_createdid, null, NEW.`status`);
	
	if(NEW.material_cut_id IS NOT null) then
		SELECT stock_id FROM materials_cut WHERE id= NEW.material_cut_id INTO VAR_stock_id;
		update stock set quantity = quantity - NEW.material_qty where id = VAR_stock_id;
		
		SELECT quantity FROM stock where id =VAR_stock_id INTO VAR_stock_qty;
		if(VAR_stock_qty<=0) then 
			update stock set deleted = 1 where id = VAR_stock_id;
		END if;
	end if;
END
$$

DROP TRIGGER IF EXISTS `jobs_after_update`$$
CREATE TRIGGER `jobs_after_update` AFTER UPDATE ON `jobs` FOR EACH ROW BEGIN
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
	
	update orders set status= VAR_status where id= new.order_id;
	
	if(NEW.`status`<>OLD.`status`) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`);
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

DELIMITER ;