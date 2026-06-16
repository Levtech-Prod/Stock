ALTER TABLE `tool_stock_out_log`
	ADD COLUMN `comment` VARCHAR(1000) NULL DEFAULT NULL AFTER `returned`;