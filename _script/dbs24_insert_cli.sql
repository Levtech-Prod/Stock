INSERT INTO clients (id)
SELECT client_name FROM (
    SELECT DISTINCT client_name FROM quoting 
    UNION 
    SELECT DISTINCT client_name FROM orders 
    ) c ORDER BY `client_name` ASC