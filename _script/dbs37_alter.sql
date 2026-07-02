DELIMITER $$
DROP TRIGGER IF EXISTS `materials_cut_after_delete`$$
CREATE TRIGGER `materials_cut_after_delete` AFTER DELETE ON `materials_cut` FOR EACH ROW BEGIN
	update stock set quantity = quantity + OLD.take_qty, deleted = if(quantity + OLD.take_qty>0, 0, 1) where id = OLD.stock_id;
END
$$

DELIMITER ;