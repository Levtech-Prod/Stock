ALTER TABLE `menu`
	ADD COLUMN `parent` INT(11) NULL DEFAULT NULL AFTER `id`;

INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (12, NULL, 'Szerszám leltár', NULL, 0);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (13, 12, 'Készlet', 'Tool_stock', 1);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (14, 12, 'Kivétel', 'Tool_out', 1);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (15, 12, 'Bevitel', 'Tool_in', 1);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (16, 12, 'Rendelés', 'Tool_order', 1);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (17, 12, 'Termelés', 'Tool_production', 1);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`) VALUES (18, 12, 'Beállítások', 'Tool_settings', 1);