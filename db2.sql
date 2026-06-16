-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.25-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for stock
CREATE DATABASE IF NOT EXISTS `stock` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `stock`;

-- Dumping structure for table stock.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `name` varchar(250) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `materialid` int(11) DEFAULT NULL,
  `width` double(11,1) DEFAULT '0.0',
  `length` double(11,1) DEFAULT '0.0',
  `height` double(11,1) DEFAULT '0.0',
  `price` double(11,2) DEFAULT '0.00',
  `material_price` double(11,2) DEFAULT '0.00',
  `material_ordered` int(11) DEFAULT '0',
  `description` varchar(512) DEFAULT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `reduce_stock` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE,
  KEY `FK_jobs_orders` (`order_id`),
  KEY `status_idx` (`status`),
  CONSTRAINT `FK_jobs_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs: ~0 rows (approximately)
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;

-- Dumping structure for table stock.jobs_files
CREATE TABLE IF NOT EXISTS `jobs_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_files: ~0 rows (approximately)
/*!40000 ALTER TABLE `jobs_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs_files` ENABLE KEYS */;

-- Dumping structure for table stock.jobs_status
CREATE TABLE IF NOT EXISTS `jobs_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `colour` varchar(50) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_status: ~3 rows (approximately)
/*!40000 ALTER TABLE `jobs_status` DISABLE KEYS */;
INSERT INTO `jobs_status` (`id`, `name`, `colour`, `sort`) VALUES
	(-2, 'Kész', '#96ff69', 1000),
	(-1, 'Szünet', '#d9d330', 0),
	(0, 'Kezdeti', '#ff0000', -1);
/*!40000 ALTER TABLE `jobs_status` ENABLE KEYS */;

-- Dumping structure for table stock.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `client_name` varchar(250) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0 - init, 1 - inprogress, 2 - ready',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(11) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`),
  KEY `start_date_idx` (`start_date`),
  KEY `deadline_idx` (`deadline`),
  KEY `client_name_idx` (`client_name`),
  KEY `status_idx` (`status`),
  KEY `delivery_date_idx` (`delivery_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.orders: ~0 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for procedure stock.cli_order_generic
DELIMITER //
CREATE PROCEDURE `cli_order_generic`(
	IN `table_name` VARCHAR(255),
	IN `rec_id` INTEGER,
	IN `direction` TEXT,
	IN `rank_field` VARCHAR(255),
	IN `filter_field0` VARCHAR(255),
	IN `filter_field1` VARCHAR(255),
	IN `filter_field2` VARCHAR(255)
)
    MODIFIES SQL DATA
    DETERMINISTIC
BEGIN
## solve same ord .... SELECT `ord`, COUNT(`id`) cnt FROM cli_custom_types GROUP BY `ord` HAVING `cnt` > 1;


    #usage call cli_order_generic('cli_custom_types',11,'up','ord','sys_clientid','type','')
    DECLARE filter_select text;
    DECLARE filter_into text;
    DECLARE filter_where text;
    DECLARE ordering VARCHAR(64);
    DECLARE comp VARCHAR(4);

    /*GET DE CURRENT RECORD TO REORDER*/
    set filter_select=CONCAT(',`',rank_field,'` ');
    if (filter_field0<>'') then set filter_select = CONCAT(filter_select,',`',filter_field0,'` '); end if;
    if (filter_field1<>'') then set filter_select = CONCAT(filter_select,',`',filter_field1,'` '); end if;
    if (filter_field2<>'') then set filter_select = CONCAT(filter_select,',`',filter_field2,'` '); end if;
    set filter_into=', @VAR_rank1 ';
    if (filter_field0<>'') then set filter_into = CONCAT(filter_into,', @filter_field0 '); end if;
    if (filter_field1<>'') then set filter_into = CONCAT(filter_into,', @filter_field1 '); end if;
    if (filter_field2<>'') then set filter_into = CONCAT(filter_into,', @filter_field2 '); end if;

    set @filter_field0 = NULL; set @filter_field1 = NULL; set @filter_field2 = NULL;
    SET @rec_id = rec_id;
    set @VAR_id2=NULL; set @VAR_rank2=NULL;
    SET @sql0 = CONCAT('SELECT `id` ', filter_select,
                    'INTO @VAR_id1 ',filter_into,
                    'FROM `',table_name,'` ',
                    'WHERE id = @rec_id');
/*call Log(@sql0, '');*/
    PREPARE stmt0 FROM @sql0;
    EXECUTE stmt0;


    /*SEARCH FOR THE NEW RANK*/
    set filter_where=' ';
    if (@filter_field0 is not null) then set filter_where = CONCAT(filter_where,' and `',filter_field0,'` = "',@filter_field0,'" '); end if;
    if (@filter_field1 is not null) then set filter_where = CONCAT(filter_where,' and `',filter_field1,'` = "',@filter_field1,'" '); end if;
    if (@filter_field2 is not null) then set filter_where = CONCAT(filter_where,' and `',filter_field2,'` = "',@filter_field2,'" '); end if;

    if (lower(direction)='up') then
        set ordering=' DESC ';
        set comp=' < ';
    else
        set ordering=' ASC ';
        set comp=' > ';
    end if;

    set @VAR_id2=NULL; set @VAR_rank2=NULL;
    SET @sql1 = CONCAT('SELECT `id`, `',rank_field,'` ',
                    'INTO @VAR_id2, @VAR_rank2 ',
                    'FROM `',table_name,'` ',
                    'WHERE `',rank_field,'`',comp,' "',@VAR_rank1,'" ',filter_where,
                    'ORDER BY `',rank_field,'` ',ordering,
                    'LIMIT 1');
/*call Log(@sql1, '');*/
    PREPARE stmt1 FROM @sql1;
    EXECUTE stmt1;

    if (@VAR_rank1 >= 0 && @VAR_rank2 >= 0) then
        SET @sql2 = CONCAT('UPDATE `',table_name,'` SET `',rank_field,'` = ? WHERE `id` = ?');
#call Log(@sql2, '');
        PREPARE stmt2 FROM @sql2;
        EXECUTE stmt2 USING  @VAR_rank2, @VAR_id1;
        EXECUTE stmt2 USING  @VAR_rank1, @VAR_id2;
    DEALLOCATE PREPARE stmt2;
    end if;

    DEALLOCATE PREPARE stmt0;
    DEALLOCATE PREPARE stmt1;
END//
DELIMITER ;

-- Dumping structure for trigger stock.jobs_after_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `jobs_after_delete` AFTER DELETE ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);
	
	if(old.reduce_stock=1) then
		update stock set quantity=quantity+old.quantity where id=old.stock_id;
	end if;
	
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
	
	update orders set status= VAR_status where id= old.order_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger stock.jobs_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `jobs_after_insert` AFTER INSERT ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);
	
	if(new.reduce_stock=1) then
		update stock set quantity=quantity-new.quantity where id=new.stock_id;
	end if;

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
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger stock.jobs_after_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `jobs_after_update` AFTER UPDATE ON `jobs` FOR EACH ROW BEGIN
	DECLARE VAR_nr, VAR_ready, VAR_progress, VAR_init, VAR_status INT(11);

	if(new.reduce_stock=1 and old.reduce_stock=0) then
		update stock set quantity=quantity-new.quantity where id=new.stock_id;
	end if;
	
	if(new.reduce_stock=1 and old.reduce_stock=1) then
		update stock set quantity=quantity+old.quantity-new.quantity where id=new.stock_id;
	end if;
	
	if(new.reduce_stock=0 and old.reduce_stock=1) then
		update stock set quantity=quantity+old.quantity where id=new.stock_id;
	end if;
	
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
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
