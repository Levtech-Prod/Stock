UPDATE `stock`.`menu` SET `name`='Adminisztráció', `link`=NULL WHERE  `id`=5;

INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (21, 5, 'Beállítások', 'Jobs_status', 1, 0);
INSERT INTO `menu` (`id`, `parent`, `name`, `link`, `level`, `disabled`) VALUES (22, 5, 'Számlázás', 'Invoices', 1, 0);

CREATE TABLE `invoices` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`serial` VARCHAR(50) NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`nr` VARCHAR(250) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`date` DATE NOT NULL,
	`amount` DOUBLE(10,2) NOT NULL DEFAULT '0.00',
	`client_name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`invoice_file` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
