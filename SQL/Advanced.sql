--efficiently accessing data and maintaining optimal performance.

/* 
    Use different database data access patterns
    Efficiently access data
    Understand data performance optimization practices
    Use software to track database performance
 */
/* Create indexes for performance boost in cases where we are looking for a single value in a large table*/

--How to see what indexes exist on a table
SELECT *
FROM pg_indexes
WHERE tablename = '<table_name>';

--


--How to build an index
CREATE INDEX <index_name> ON <table_name> (<column>)
--E.G

CREATE INDEX customers_last_name_idx ON customers(last_name);

--To examine the size of the customers table change the example:
SELECT pg_size_pretty (pg_total_relation_size('customers'));


 /* Check the size of the DB */
 SELECT pg_size_pretty
(pg_total_relation_size('customers')) -- 13MB or something like that

--A table that is searched regularly might be a good candidate for an index.
--The higher the percentage of a table you are returning the less useful an index becomes.
CREATE INDEX customers_city_idx ON customers(city);

CREATE INDEX customers_last_name_email_address_first_name_idx ON customers (last_name, email_address, first_name);

-- Multicolumn indexes allow for more than one column to be used in combination as an index on a table
CREATE INDEX <index_name> ON <table_name> (<column_name1>, <column_name2>...);

--You can drop an index
DROP INDEX IF EXISTS <index_name>;

--see the size of a database table you can run the script
SELECT pg_size_pretty (pg_total_relation_size('<table_name>'));

/* 
    Some of the benefits and burdens of indexes:
    Increase in speed of searches/filtering
    Increase in storage space
    Increase in runtime for Insert/Update/Delete on impacted indexes.
 */