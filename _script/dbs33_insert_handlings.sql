SET @all_handlings=(SELECT group_concat(handling) AS handling FROM (
SELECT DISTINCT handling FROM jobs 
UNION 
SELECT DISTINCT handling FROM quoting_parts 
) h WHERE h.handling IS NOT null ORDER BY `handling` ASC);

CALL utils_split_string(@all_handlings,',',1);

INSERT INTO handlings (id)
SELECT `value` FROM `tmp_split_string` WHERE `key`=1
ON DUPLICATE KEY UPDATE deleted=deleted;