ALTER TABLE `jobs`
	ADD COLUMN `material_type` INT(11) NULL DEFAULT '0' COMMENT '0-need order, 1-own stock' AFTER `material_ordered`,
	ADD COLUMN `material_cut_id` INT(11) NULL DEFAULT NULL AFTER `material_type`,
	ADD COLUMN `material_qty` INT(11) NULL DEFAULT NULL AFTER `material_cut_id`;
	
CREATE TABLE `materials_cut` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`stock_id` INT(11) NOT NULL,
	`squantity` INT(11) NULL DEFAULT NULL,
	`take_qty` INT(11) NULL DEFAULT NULL,
	`width_qty` INT(11) NULL DEFAULT NULL,
	`cwidth` DOUBLE(11,1) NULL DEFAULT '0.0',
	`length_qty` INT(11) NULL DEFAULT NULL,
	`clength` DOUBLE(11,1) NULL DEFAULT '0.0',
	`height_qty` INT(11) NULL DEFAULT NULL,
	`cheight` DOUBLE(11,1) NULL DEFAULT '0.0',
	`cut` INT(11) NULL DEFAULT '0',
	`ts` TIMESTAMP NULL DEFAULT current_timestamp(),
	`rec_createdid` INT(11) NULL DEFAULT NULL,
	`rec_modifiedid` INT(11) NULL DEFAULT NULL,
	`rec_modified` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `rec_modified_idx` (`rec_modified`) USING BTREE,
	INDEX `cut_idx` (`cut`) USING BTREE,
	INDEX `stock_idx` (`stock_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

ALTER TABLE `jobs`
	ADD INDEX `cut_id_idx` (`material_cut_id`),
	ADD INDEX `material_type_idx` (`material_type`);
	
INSERT INTO `stock`.`menu` (`name`, `link`) VALUES ('Vágás', 'Cut');

DELIMITER $$
DROP TRIGGER IF EXISTS `materials_cut_after_update`$$
CREATE TRIGGER `materials_cut_after_update` AFTER UPDATE ON `materials_cut` FOR EACH ROW BEGIN
	if(new.cut=1) then
		update stock set quantity = quantity - new.take_qty where id = new.stock_id;
	end if;
END
$$

DELIMITER ;