INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (1, 'Készlet', 'Stock', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (2, 'Anyagok', 'Materials', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (3, 'Megrendelések', 'Orders', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (4, 'Board', 'Board', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (5, 'Beállítások', 'Jobs_status', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (6, 'Felhasználók', 'Users', 0);
INSERT INTO `menu` (`id`, `name`, `link`, `level`) VALUES (7, 'Statisztika', 'Statistics', 0);

INSERT INTO `stock`.`settings` (`id`) VALUES ('1');

INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `admin`, `created_at`) VALUES (1, 'sadmin', '', '*18A38853AD67E52477A5BDAF0A006D469A41BE2D', '', 1, '0000-00-00 00:00:00');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `admin`, `created_at`) VALUES (2, 'testuser', '', '*3A2EB9C80F7239A4DE3933AE266DB76A7846BCB8', '', 0, '0000-00-00 00:00:00');