-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.37-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


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
  `image` varchar(250) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rec_createdid` int(11) DEFAULT NULL,
  `rec_modifiedid` int(11) DEFAULT NULL,
  `rec_modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE,
  KEY `FK_jobs_orders` (`order_id`),
  KEY `status_idx` (`status`),
  CONSTRAINT `FK_jobs_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs: ~7 rows (approximately)
INSERT INTO `jobs` (`id`, `order_id`, `name`, `quantity`, `materialid`, `width`, `length`, `height`, `price`, `material_price`, `material_ordered`, `description`, `image`, `status`, `ts`, `rec_createdid`, `rec_modifiedid`, `rec_modified`) VALUES
	(1, 1, 'valami', 1, 1, 60.0, 70.0, 50.0, 30.00, 30.00, 0, NULL, NULL, -1, '2023-07-20 08:17:50', NULL, 1, '2023-07-28 18:16:49'),
	(2, 1, 'meg valami', 2, 2, 5.0, 5.0, 3.0, 30.00, 30.00, 0, NULL, NULL, 0, '2023-07-20 08:56:26', NULL, NULL, NULL),
	(4, 1, 'teszt3', 1, 1, 30.0, 50.0, 20.0, 50.00, 15.00, 0, 'teszt3', NULL, -2, '2023-07-27 17:00:49', NULL, 1, '2023-07-28 18:16:50'),
	(5, 1, 'teszt4', 2, 1, 50.0, 80.0, 40.0, 80.00, 30.00, 1, 'test4', NULL, 0, '2023-07-27 17:03:48', NULL, NULL, NULL),
	(6, 1, 'teszt5', 1, 2, 20.0, 10.0, 60.0, 0.00, 20.00, 0, NULL, NULL, -2, '2023-07-27 17:05:49', NULL, 1, '2023-07-28 18:16:51'),
	(7, 1, 'teszt6', 1, 1, 0.0, 0.0, 0.0, 0.00, 0.00, 0, NULL, NULL, -1, '2023-07-27 17:06:22', NULL, 1, '2023-07-28 18:16:52'),
	(8, 1, 'teszt 8', 1, 1, 300.0, 400.0, 200.0, 288.00, 10.00, 0, NULL, NULL, 0, '2023-07-28 15:28:47', 1, 1, '2023-07-28 17:28:47'),
	(9, 1, 'teszt 9', 1, 2, 50.0, 20.0, 30.0, 0.08, 7.00, 0, NULL, NULL, 0, '2023-07-28 16:06:10', 1, 1, '2023-07-28 18:06:10'),
	(10, 1, 'tesz 10', 1, 1, 0.0, 0.0, 0.0, 0.00, 10.00, 0, NULL, '18bm4efsnlo.jpg', -1, '2023-07-28 16:12:52', 1, 1, '2023-07-28 18:16:57');

-- Dumping structure for table stock.jobs_files
CREATE TABLE IF NOT EXISTS `jobs_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_files: ~6 rows (approximately)
INSERT INTO `jobs_files` (`id`, `job_id`, `name`, `ts`) VALUES
	(2, 2, '643522a971abc_1690476908.pdf', '2023-07-27 16:55:08'),
	(3, 4, 'work_tmp_1690477273.txt', '2023-07-27 17:01:47'),
	(4, 4, 'Export_1690477310.pdf', '2023-07-27 17:01:50'),
	(5, 7, 'Export_1690477585.pdf', '2023-07-27 17:06:26'),
	(6, 7, 'IMG_20230103_181531_1690477587.jpg', '2023-07-27 17:06:28'),
	(7, 8, '18bm4efsnlo_1690558127.jpg', '2023-07-28 15:28:47'),
	(8, 9, 'Export_1690560372.pdf', '2023-07-28 16:06:14');

-- Dumping structure for table stock.jobs_log
CREATE TABLE IF NOT EXISTS `jobs_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_log: ~0 rows (approximately)

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
INSERT INTO `jobs_status` (`id`, `name`, `colour`, `sort`) VALUES
	(-2, 'Kész', '#96ff69', 1000),
	(-1, 'Szünet', '#d9d330', 0),
	(0, 'Kezdeti', '#ff0000', -1);

-- Dumping structure for table stock.materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL DEFAULT '',
  `code` varchar(50) DEFAULT '',
  `density` int(11) DEFAULT '0',
  `price` double(11,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.materials: ~2 rows (approximately)
INSERT INTO `materials` (`id`, `name`, `code`, `density`, `price`) VALUES
	(1, 'alu', '987', 1200, 10.00),
	(2, 'Vas', '652', 360, 7.00);

-- Dumping structure for table stock.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `level` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.menu: ~6 rows (approximately)
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES
	(1, 'Készlet', 'Stock', 0),
	(2, 'Anyagok', 'Materials', 0),
	(3, 'Megrendelések', 'Orders', 0),
	(4, 'Board', 'Board', 0),
	(5, 'Státuszok', 'Jobs_status', 0),
	(6, 'Felhasználók', 'Users', 0);

-- Dumping structure for table stock.menu_rights
CREATE TABLE IF NOT EXISTS `menu_rights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menuid` int(11) NOT NULL,
  `userid` int(11) NOT NULL COMMENT 'sys_clients.id',
  `enabled` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_menu_rights` (`menuid`) USING BTREE,
  KEY `userid_idx` (`userid`) USING BTREE,
  CONSTRAINT `FK_menu_rights` FOREIGN KEY (`menuid`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_menu_rights_users` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.menu_rights: ~12 rows (approximately)
INSERT INTO `menu_rights` (`id`, `menuid`, `userid`, `enabled`) VALUES
	(1, 1, 1, 1),
	(2, 2, 1, 1),
	(3, 3, 1, 1),
	(4, 4, 1, 1),
	(5, 5, 1, 1),
	(6, 6, 1, 1),
	(8, 1, 2, 0),
	(9, 2, 2, 0),
	(10, 3, 2, 1),
	(11, 4, 2, 1),
	(12, 5, 2, 0),
	(13, 6, 2, 0);

-- Dumping structure for table stock.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `client_name` varchar(250) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0 - init, 1 - inprogress, 2 - ready',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rec_createdid` int(11) DEFAULT NULL,
  `rec_modifiedid` int(11) DEFAULT NULL,
  `rec_modified` datetime DEFAULT NULL,
  `deleted` int(11) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`),
  KEY `start_date_idx` (`start_date`),
  KEY `deadline_idx` (`deadline`),
  KEY `client_name_idx` (`client_name`),
  KEY `status_idx` (`status`),
  KEY `delivery_date_idx` (`delivery_date`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.orders: ~1 rows (approximately)
INSERT INTO `orders` (`id`, `name`, `start_date`, `delivery_date`, `deadline`, `client_name`, `description`, `status`, `ts`, `rec_createdid`, `rec_modifiedid`, `rec_modified`, `deleted`) VALUES
	(1, 'aaa', '2023-07-20', '2023-07-30', '2023-07-29', 'abcd', 'teszt', 1, '2023-07-20 08:16:22', NULL, NULL, NULL, 0);

-- Dumping structure for table stock.stock
CREATE TABLE IF NOT EXISTS `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materialid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT '0',
  `width` double(11,1) DEFAULT '0.0',
  `length` double(11,1) DEFAULT '0.0',
  `height` double(11,1) DEFAULT '0.0',
  `shelf` varchar(250) DEFAULT '',
  `description` varchar(512) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_stock_materials` (`materialid`),
  KEY `quantity_idx` (`quantity`),
  KEY `width_idx` (`width`),
  KEY `length_idx` (`length`),
  KEY `height_idx` (`height`),
  KEY `shelf_idx` (`shelf`),
  KEY `description_idx` (`description`(255)),
  KEY `deleted_idx` (`deleted`),
  CONSTRAINT `FK_stock_materials` FOREIGN KEY (`materialid`) REFERENCES `materials` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.stock: ~2 rows (approximately)
INSERT INTO `stock` (`id`, `materialid`, `quantity`, `width`, `length`, `height`, `shelf`, `description`, `ts`, `deleted`) VALUES
	(1, 1, 5, 70.0, 80.0, 60.0, '1', NULL, '2023-07-20 08:16:57', 0),
	(2, 2, 1, 50.0, 60.0, 30.0, '3', 'ewg', '2023-07-28 15:12:11', 0);

-- Dumping structure for table stock.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `admin` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `admin`, `created_at`) VALUES
	(1, 'sadmin', '', '*18A38853AD67E52477A5BDAF0A006D469A41BE2D', '', 1, '0000-00-00 00:00:00'),
	(2, 'testuser', '', '*3A2EB9C80F7239A4DE3933AE266DB76A7846BCB8', '', 0, '0000-00-00 00:00:00');

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

-- Dumping structure for trigger stock.users_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
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
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
