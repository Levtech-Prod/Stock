DELIMITER $$

DROP TRIGGER IF EXISTS `orders_after_insert`$$
CREATE TRIGGER `orders_after_insert` AFTER INSERT ON `orders` FOR EACH ROW BEGIN
	INSERT INTO clients (id) VALUES (NEW.client_name)
  	ON DUPLICATE KEY UPDATE id= NEW.client_name;
END
$$

DROP TRIGGER IF EXISTS `quoting_after_insert`$$
CREATE TRIGGER `quoting_after_insert` AFTER INSERT ON `quoting` FOR EACH ROW BEGIN
	INSERT INTO clients (id) VALUES (NEW.client_name)
  	ON DUPLICATE KEY UPDATE id= NEW.client_name;
END
$$

DELIMITER ;