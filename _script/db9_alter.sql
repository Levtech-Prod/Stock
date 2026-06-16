ALTER TABLE `orders_po`
	ADD CONSTRAINT `FK_orders_po_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `orders_files`
	ADD CONSTRAINT `FK_orders_files_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;