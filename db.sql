-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Szerver verzió:               10.1.25-MariaDB - mariadb.org binary distribution
-- Szerver OS:                   Win32
-- HeidiSQL Verzió:              10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Adatbázis struktúra mentése a stock.
DROP DATABASE IF EXISTS `stock`;
CREATE DATABASE IF NOT EXISTS `stock` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `stock`;

-- Struktúra mentése tábla stock. materials
DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL DEFAULT '',
  `code` varchar(50) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- Az adatok exportálása nem lett kiválasztva.

-- Struktúra mentése tábla stock. stock
DROP TABLE IF EXISTS `stock`;
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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- Az adatok exportálása nem lett kiválasztva.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
