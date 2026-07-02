CREATE TABLE `handlings` (
	`id` VARCHAR(250) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
	`deleted` INT(11) NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

DELIMITER $$
CREATE PROCEDURE `utils_split_string`(
	IN `in_text` TEXT,
	IN `in_del` VARCHAR(10),
	IN `in_key` INT
)
LANGUAGE SQL
DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
COMMENT ''
BEGIN
    /*
    DOCUMENTATION : http://www.codingforums.com/archive/index.php/t-188227.html
    ENHANCEMENT : renamed parts and usage of memory table
    USAGE:
        CALL utils_split_ids ('1,2,3', ',', 1); // allways use 1 as the first key
        CALL utils_split_ids ('3;4;5', ';', 2);
        # Will return both key results.
            SELECT `value` FROM `tmp_split_string` WHERE `key` IN (1, 2);
        # Will return an individual key set.
            SELECT `value` FROM `tmp_split_string` WHERE `key`=1;

        # usage in sql
            CALL utils_split_ids ('1;2;3', ',', 1); // allways use 1 as the first key
            SELECT `id`, `name`
            From `SomeTable`
            WHERE `id` IN (SELECT `value` FROM `tmp_split_string` WHERE `key`=1);

        # usage in complex sql (note that u have two keys 1 and 2 for the two subselects)
            CALL utils_split_ids ('1,2,3', ',', 1);
            CALL utils_split_ids ('3;4;5', ';', 2);
            SELECT `id`, `name`
            From `SomeTable`
            WHERE `id` IN (SELECT `value` FROM `tmp_split_string` WHERE `key`=1) && `SomeField` IN (SELECT `value` FROM `tmp_split_string` WHERE `key`=2);
    */
    DECLARE current_pos INT DEFAULT 1;
    DECLARE current_str TEXT;
    DECLARE remaining_str TEXT;
    DECLARE delimiter_len TINYINT UNSIGNED;
    IF in_key = 1 THEN
        DROP TEMPORARY TABLE IF EXISTS `tmp_split_string`;
        CREATE TEMPORARY TABLE IF NOT EXISTS `tmp_split_string` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `value` VARCHAR(256),
            `key` INT
        ) ENGINE=MEMORY;
    ELSE
        CREATE TEMPORARY TABLE IF NOT EXISTS `tmp_split_string` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `value` VARCHAR(256),
        `key` INT
        ) ENGINE=MEMORY;
    END IF;
    IF (SELECT COUNT(*) FROM `tmp_split_string` WHERE `key`=in_key) > 0 THEN
        DROP TEMPORARY TABLE IF EXISTS `tmp_split_string`;
        CREATE TEMPORARY TABLE IF NOT EXISTS `tmp_split_string` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `value` VARCHAR(256),
        `key` INT
        ) ENGINE=MEMORY;
#        DELETE FROM tmp_split_string WHERE `key`=in_key;
    END IF;
    SET remaining_str = in_text;
    SET delimiter_len = CHAR_LENGTH (in_del);
    WHILE remaining_str != '' && current_pos > 0 DO
        SET current_pos = INSTR (remaining_str, in_del);
        IF current_pos = 0 THEN
            SET current_str = remaining_str;
        ELSE
            SET current_str = LEFT(remaining_str, current_pos - 1);
        END IF;
        IF current_str != '' THEN
            INSERT INTO `tmp_split_string`
                (`value`, `key`)
            VALUES
                (current_str, in_key);
        END IF;
        SET remaining_str = SUBSTRING(remaining_str, current_pos + delimiter_len);
    END WHILE;
    
    SELECT `value` FROM `tmp_split_string` WHERE `key`=in_key;
END
$$

DELIMITER ;