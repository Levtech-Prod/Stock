DELIMITER $$
DROP FUNCTION IF EXISTS `calc_workingdays`$$
CREATE FUNCTION `calc_workingdays`(
	`DATEFROM` DATE,
	`DATETO` DATE
)
RETURNS int(11)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
  DECLARE actualdate  DATE;
  DECLARE workingdays INTEGER;
  DECLARE chdate  DATE;
  DECLARE op INT(11) DEFAULT -1;

  SET WORKINGDAYS = 0;
  
if(DATEFROM > DATETO) then
	SET chdate = DATEFROM;
	SET DATEFROM = DATETO;
	SET DATETO = chdate;
	SET op = 1;
END if;

SET actualdate = DATEFROM;

dateloop:
  LOOP

    IF (actualdate > DATETO) THEN
      LEAVE dateloop;
    END IF;

    IF (dayofweek(actualdate) = 7 or dayofweek(actualdate) = 1) THEN
      SET WORKINGDAYS = WORKINGDAYS + 1;
    END IF;

    SET actualdate = adddate(actualdate, INTERVAL 1 DAY);

  END LOOP dateloop;

  RETURN (WORKINGDAYS*op);
END
$$

DELIMITER ;