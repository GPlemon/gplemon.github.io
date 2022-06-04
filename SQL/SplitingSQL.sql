SELECT *
FROM orders
LIMIT 5;
 
SELECT *
FROM subscriptions
LIMIT 5;
 
SELECT * 
FROM customers
LIMIT 5;

--Combining Tables with SQL -- JOIN
-- First query
SELECT *
FROM orders
JOIN subscriptions
	ON orders.subscription_id = subscriptions.subscription_id;

-- Second query
SELECT *
FROM orders
JOIN subscriptions
	ON orders.subscription_id = subscriptions.subscription_id
WHERE subscriptions.description = 'Fashion Magazine';


-- Inner Joins
SELECT COUNT(*)
FROM newspaper;

SELECT COUNT(*)
FROM online;

SELECT COUNT(*)
FROM newspaper
JOIN online
	ON newspaper.id = online.id;

--Left Joins
SELECT *
FROM table1
LEFT JOIN table2
  ON table1.c2 = table2.c2;

--Cross Join
--Sometimes, we just want to combine all rows of one table with all rows of another table.
SELECT shirts.shirt_color,
   pants.pants_color
FROM shirts
CROSS JOIN pants;


--Union Sometimes we just want to stack one dataset on top of the other.
SELECT *
FROM table1
UNION
SELECT *
FROM table2;

--With Often times, we want to combine two tables, but one of the tables is the result of another calculation.
SELECT customer_id,
   COUNT(subscription_id) AS 'subscriptions'
FROM orders
GROUP BY customer_id;

/* 


    JOIN will combine rows from different tables if the join condition is true.

    LEFT JOIN will return every row in the left table, and if the join condition is not met, NULL values are used to fill in the columns from the right table.

    Primary key is a column that serves a unique identifier for the rows in the table.

    Foreign key is a column that contains the primary key to another table.

    CROSS JOIN lets us combine all rows of one table with all rows of another table.

    UNION stacks one dataset on top of another.

    WITH allows us to define one or more temporary tables that can be used in the final query.



 */