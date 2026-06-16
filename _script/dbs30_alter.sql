DELIMITER $$
DROP TRIGGER IF EXISTS `quoting_after_update`$$
CREATE TRIGGER `quoting_after_update` AFTER UPDATE ON `quoting` FOR EACH ROW BEGIN
	update quoting_parts set price = (wage/60)*new.wage where quoting_id = new.id;
END
$$

DELIMITER ;