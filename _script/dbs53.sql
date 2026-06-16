ALTER TABLE `menu`
	ADD COLUMN `disabled` INT NULL DEFAULT '0' AFTER `level`;

UPDATE `stock`.`menu` SET `disabled`=1 WHERE  `id`=10;

ALTER TABLE `jobs`
	ADD COLUMN `order_date` DATE NULL DEFAULT NULL AFTER `material_ordered`,
	CHANGE COLUMN `material_type` `material_type` INT(11) NULL DEFAULT '-1' COMMENT '0-need order, 1-own stock, -1 -undefined' AFTER `order_date`;
	
UPDATE jobs SET material_type = -1 WHERE material_ordered = 0;