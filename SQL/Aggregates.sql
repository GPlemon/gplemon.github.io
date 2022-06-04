--Calculations performed on multiple rows of a table are called aggregates.

COUNT() --Counts the number of rows in a table.
SUM() --Sums the values of a column.
AVG() --Calculates the average of a column.
MAX() / MIN() --the largest/smallest value
AVG() --the average of the values in a column
ROUND(): --round the values in the column


SELECT COUNT(*)
FROM table_name;


-- SQL also allows you to filter which groups to include and which to exclude. 
SELECT year,
   genre,
   COUNT(name)
FROM movies
GROUP BY 1, 2
HAVING COUNT(name) > 10;

SELECT price, 
   ROUND(AVG(downloads)),
   COUNT(*)
FROM fake_apps
GROUP BY price;

/* 5 to 12
6 1
7 2
8 3
9 4
10 5
11 6
12 7hrs */

--It returns the total amount of downloads for each genre.
SELECT genre,
   SUM(downloads)
FROM kindle
GROUP BY genre;

/* 

    order_id
    customer_id
    customer_name
    customer_address
    subscription_id
    subscription_description
    subscription_monthly_price
    subscription_length
    purchase_date


 */