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
  `material_unit_price` double(11,2) DEFAULT '0.00',
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs: ~6 rows (approximately)
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` (`id`, `order_id`, `name`, `quantity`, `materialid`, `width`, `length`, `height`, `price`, `material_unit_price`, `material_price`, `material_ordered`, `description`, `image`, `status`, `ts`, `rec_createdid`, `rec_modifiedid`, `rec_modified`) VALUES
	(11, 1, 'test calc', 1, 1, 100.0, 200.0, 300.0, 100.00, 13.00, 93.60, 0, NULL, 'wallpapers-hd-37.jpg', 3, '2023-08-07 15:04:53', 1, 1, '2023-08-11 09:55:32'),
	(12, 1, 'test 2 calc', 2, 2, 305.0, 600.0, 200.0, 100.00, 7.00, 92.23, 0, 'wfqwfq', NULL, 3, '2023-08-07 15:11:02', 1, 1, '2023-08-11 10:06:13'),
	(13, 1, 'wfqf', 2, 1, 60.0, 40.0, 50.0, 30.00, 11.00, 1.58, 0, NULL, NULL, 3, '2023-08-07 16:00:33', 1, 1, '2023-08-11 10:05:33'),
	(14, 1, 'wqfq', 1, 1, 30.0, 10.0, 60.0, 20.00, 10.00, 0.22, 0, NULL, 'wallpapers-hd-37.jpg', 3, '2023-08-08 10:03:57', 1, 1, '2023-08-11 10:05:45'),
	(15, 2, 'weqfwq', 1, 1, 60.0, 70.0, 30.0, 30.00, 10.00, 1.51, 0, NULL, NULL, 3, '2023-08-10 15:59:49', 1, 1, '2023-08-10 15:05:48'),
	(16, 2, 'fwwq', 2, 1, 60.0, 80.0, 30.0, 200.00, 10.00, 1.73, 0, NULL, NULL, 3, '2023-08-11 10:55:15', 1, 1, '2023-08-11 09:58:50');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;

-- Dumping structure for table stock.jobs_files
CREATE TABLE IF NOT EXISTS `jobs_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_files: ~2 rows (approximately)
/*!40000 ALTER TABLE `jobs_files` DISABLE KEYS */;
INSERT INTO `jobs_files` (`id`, `job_id`, `name`, `ts`) VALUES
	(9, 11, 'a_1691409893.pdf', '2023-08-07 15:04:53'),
	(10, 14, 'a_1691478237.pdf', '2023-08-08 10:03:57');
/*!40000 ALTER TABLE `jobs_files` ENABLE KEYS */;

-- Dumping structure for table stock.jobs_log
CREATE TABLE IF NOT EXISTS `jobs_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `status_new` int(11) DEFAULT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_log: ~31 rows (approximately)
/*!40000 ALTER TABLE `jobs_log` DISABLE KEYS */;
INSERT INTO `jobs_log` (`id`, `job_id`, `userid`, `status`, `status_new`, `ts`) VALUES
	(1, 12, 1, 0, -1, '2023-08-08 12:10:34'),
	(2, 12, 1, -1, -2, '2023-08-08 12:10:36'),
	(3, 12, 1, -2, -1, '2023-08-08 12:11:35'),
	(4, 13, 1, 0, 1, '2023-08-08 12:30:52'),
	(5, 14, 1, 0, 2, '2023-08-08 12:30:58'),
	(6, 12, 1, -1, 1, '2023-08-08 12:31:01'),
	(7, 11, 1, 0, 2, '2023-08-08 12:31:03'),
	(8, 13, 1, 1, -1, '2023-08-08 12:39:01'),
	(9, 12, 1, 1, -1, '2023-08-08 12:39:03'),
	(10, 11, 1, 2, -1, '2023-08-08 12:39:12'),
	(11, 14, 1, 2, -1, '2023-08-08 12:39:18'),
	(12, 11, 1, -1, 1, '2023-08-10 11:07:36'),
	(13, 14, 1, -1, 2, '2023-08-10 11:07:37'),
	(14, 13, 1, -1, 2, '2023-08-10 11:07:38'),
	(15, 12, 1, -1, 2, '2023-08-10 11:07:40'),
	(16, 12, 1, 2, 3, '2023-08-10 11:19:37'),
	(17, 13, 1, 2, 3, '2023-08-10 11:19:37'),
	(18, 14, 1, 2, 3, '2023-08-10 11:19:38'),
	(19, 11, 1, 1, 3, '2023-08-10 11:19:40'),
	(24, 15, 1, NULL, 0, '2023-08-10 15:59:49'),
	(25, 15, 1, 0, 1, '2023-08-10 16:00:00'),
	(26, 15, 1, 1, 2, '2023-08-10 16:05:09'),
	(27, 15, 1, 2, 3, '2023-08-10 16:06:58'),
	(28, 16, 1, NULL, 0, '2023-08-10 10:55:15'),
	(29, 16, 1, 0, 1, '2023-08-10 10:55:26'),
	(30, 11, 1, 1, 3, '2023-08-11 10:55:32'),
	(31, 14, 1, 1, 3, '2023-08-11 10:55:33'),
	(32, 12, 1, 1, 3, '2023-08-11 10:55:38'),
	(33, 13, 1, 1, 3, '2023-08-11 10:55:40'),
	(34, 16, 1, 1, 2, '2023-08-11 07:58:47'),
	(35, 16, 1, 2, 3, '2023-08-11 10:58:50');
/*!40000 ALTER TABLE `jobs_log` ENABLE KEYS */;

-- Dumping structure for table stock.jobs_status
CREATE TABLE IF NOT EXISTS `jobs_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `colour` varchar(50) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT '0' COMMENT '0- altalanos, 1-cnc gep, 2 -qc',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.jobs_status: ~5 rows (approximately)
/*!40000 ALTER TABLE `jobs_status` DISABLE KEYS */;
INSERT INTO `jobs_status` (`id`, `name`, `colour`, `sort`, `type`) VALUES
	(-2, 'Kész', '#96ff69', 1000, 0),
	(-1, 'Szünet', '#d9d330', 0, 0),
	(0, 'Kezdeti', '#ff0000', -1, 0),
	(1, 'Cnc gep 1', '#1c2ca6', 3, 1),
	(2, 'Cnc gep 2', '#965796', 3, 1),
	(3, 'QC', '#24e6f0', 4, 2);
/*!40000 ALTER TABLE `jobs_status` ENABLE KEYS */;

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
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` (`id`, `name`, `code`, `density`, `price`) VALUES
	(1, 'alu', '987', 1200, 10.00),
	(2, 'Vas', '652', 360, 7.00);
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;

-- Dumping structure for table stock.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `level` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.menu: ~6 rows (approximately)
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES
	(1, 'Készlet', 'Stock', 0),
	(2, 'Anyagok', 'Materials', 0),
	(3, 'Megrendelések', 'Orders', 0),
	(4, 'Board', 'Board', 0),
	(5, 'Státuszok', 'Jobs_status', 0),
	(6, 'Felhasználók', 'Users', 0),
	(7, 'Statisztika', 'Statistics', 0);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.menu_rights: ~13 rows (approximately)
/*!40000 ALTER TABLE `menu_rights` DISABLE KEYS */;
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
	(13, 6, 2, 0),
	(15, 7, 1, 1),
	(16, 7, 2, 0);
/*!40000 ALTER TABLE `menu_rights` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.orders: ~11 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `name`, `start_date`, `delivery_date`, `deadline`, `client_name`, `description`, `status`, `ts`, `rec_createdid`, `rec_modifiedid`, `rec_modified`, `deleted`) VALUES
	(1, 'aaa', '2023-07-20', '2023-07-30', '2023-07-29', 'abcd', 'teszt', 1, '2023-07-20 11:16:22', NULL, 1, '2023-08-08 09:05:40', 0),
	(2, 'qfqwfg', '2023-08-02', '2023-08-10', '2023-08-26', 'cdef', 'eegqegq', 1, '2023-08-02 10:00:42', 1, 1, '2023-08-02 09:00:42', 0),
	(3, 'wegwwefg', '2023-08-02', '2023-08-11', '2023-08-12', 'wefdr', 'wqff', 0, '2023-08-02 10:03:55', 1, 1, '2023-08-02 09:05:31', 1),
	(4, 'efewf', '2023-08-02', '2023-08-13', '2023-08-14', 'cdef', 'efqwqwef', 0, '2023-08-02 10:05:25', 1, 1, '2023-08-02 09:05:29', 1),
	(5, 'qwefwq', '2023-08-02', '2023-08-11', '2023-08-12', 'cdef', 'qfww', 0, '2023-08-02 10:05:56', 1, 1, '2023-08-02 09:05:56', 0),
	(6, 'fqwew', '2023-08-02', '2023-08-19', '2023-08-20', 'abcd', 'qwfqw', 0, '2023-08-02 10:07:14', 1, 1, '2023-08-02 09:07:14', 0),
	(7, 'qweggw', '2023-08-02', NULL, '2023-08-26', 'wefdr', 'ewg', 0, '2023-08-02 10:08:45', 1, 1, '2023-08-02 09:08:45', 0),
	(8, 'wqf', '2023-08-02', NULL, '2023-08-18', 'abcd', NULL, 0, '2023-08-02 10:15:45', 1, 1, '2023-08-02 09:15:45', 0),
	(9, 'eqg', '2023-08-02', NULL, '2023-08-25', 'abcd', NULL, 0, '2023-08-02 10:17:15', 1, 1, '2023-08-02 09:17:15', 0),
	(10, 'fwqqwf', '2023-08-08', NULL, '2023-08-11', 'abcd', NULL, 0, '2023-08-08 10:06:23', 1, 1, '2023-08-08 09:06:23', 0),
	(11, 'fqwwqfqw', '2023-08-08', NULL, '2023-08-31', 'cdef', NULL, 0, '2023-08-08 10:07:24', 1, 1, '2023-08-08 09:07:24', 0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for table stock.orders_files
CREATE TABLE IF NOT EXISTS `orders_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `private` int(11) DEFAULT '0',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `name_idx` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.orders_files: ~7 rows (approximately)
/*!40000 ALTER TABLE `orders_files` DISABLE KEYS */;
INSERT INTO `orders_files` (`id`, `order_id`, `name`, `private`, `ts`) VALUES
	(1, 1, 'cashreg_1690895406.txt', 1, '2023-08-01 16:10:06'),
	(4, 5, 'browser_id_1690959966.txt', 0, '2023-08-02 10:06:06'),
	(5, 6, 'browser_id_1690960067.txt', 0, '2023-08-02 10:07:58'),
	(6, 9, 'Acordul pacientului informat_1690960636.pdf', 1, '2023-08-02 10:17:17'),
	(7, 10, 'a_1691478383.pdf', 0, '2023-08-08 10:06:23'),
	(8, 11, 'a_1691478444.pdf', 0, '2023-08-08 10:07:24'),
	(9, 11, '783px-Test-Logo.svg_1691478742.png', 1, '2023-08-08 10:12:22');
/*!40000 ALTER TABLE `orders_files` ENABLE KEYS */;

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
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` (`id`, `materialid`, `quantity`, `width`, `length`, `height`, `shelf`, `description`, `ts`, `deleted`) VALUES
	(1, 1, 5, 70.0, 80.0, 60.0, '1', NULL, '2023-07-20 11:16:57', 0),
	(2, 2, 1, 50.0, 60.0, 30.0, '3', 'ewg', '2023-07-28 18:12:11', 0);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;

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
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `admin`, `created_at`) VALUES
	(1, 'sadmin', '', '*18A38853AD67E52477A5BDAF0A006D469A41BE2D', '', 1, '0000-00-00 00:00:00'),
	(2, 'testuser', '', '*3A2EB9C80F7239A4DE3933AE266DB76A7846BCB8', '', 0, '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for procedure stock.cli_order_generic
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `cli_order_generic`(
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

-- Dumping structure for function stock.calc_work_hours
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `calc_work_hours`(
	`IN_job_id` INT





) RETURNS varchar(500) CHARSET utf8
    READS SQL DATA
    DETERMINISTIC
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
	WHERE l.job_id=IN_job_id ORDER BY ts ASC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN jlog;
	jlog: LOOP
		SET done=0;
        FETCH jlog INTO var_stype_old, var_stype_new, var_status_old, var_status_new, var_ts;
        IF (done = 1) THEN LEAVE jlog; END IF;
    	set c = c+1;
    	
		if(var_status_new_prev=var_status_old and var_stype_new_prev=var_stype_old and var_stype_new_prev=1) then 
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
	
	INSERT INTO jobs_log(job_id, userid, `status`, `status_new`) VALUES (NEW.id, NEW.rec_createdid, null, NEW.`status`);
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
	
	if(NEW.`status`<>OLD.`status`) then
		INSERT INTO jobs_log(job_id, userid, `status`, status_new) VALUES (NEW.id, NEW.rec_modifiedid, old.`status`, NEW.`status`);
	END if;
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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
