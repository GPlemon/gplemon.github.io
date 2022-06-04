--SQLite


--------BASICS--------          Data types:  Integer - a whole number. Text - a text string. Date - a date. Real - a decimal number

CREATE TABLE soldiers (   --creates a new table.
  serial NUMBER,
  name STRING,
  age NUMBER
);

INSERT INTO celebs (id, name, age) --adds a new row to a table.
VALUES (1, 'Name', 22);


ALTER TABLE celebs                 --changes an existing table.
ADD COLUMN twitter_handle TEXT;


UPDATE celebs                      --edits a row in a table.
SET twitter_handle = '@taylorswift13' 
WHERE id = 4; 

DELETE FROM celebs                 --deletes rows from a table.
WHERE twitter_handle IS NULL;


SELECT * FROM celebs;               --queries data from a table. 



--Constraints that add information about how a column can be used are invoked after specifying the data type for a column.

CREATE TABLE celebs (
   id INTEGER PRIMARY KEY,                                  --uniquely identify
   name TEXT UNIQUE,                                        --Like PRIMARY KEY except a table can have many different UNIQUE columns.
   date_of_birth TEXT NOT NULL,                             --NOT NULL columns must have a value.
   date_of_death TEXT DEFAULT 'Not Applicable'              --Assumed value
);


--As 

SELECT name AS 'Title', date_of_birth AS 'Born', date_of_death AS 'Died'; --rename a column or table using an alias.

--DISTINCT is used to return unique values in the output.

SELECT DISTINCT tools FROM inventory WHERE tools = 'hammer'; --removes dubplicates from a column.


-- WHERE for a logical expression.
SELECT *
FROM movies
WHERE imdb_rating > 8;

/* 
    = equal to
    != not equal to
    > greater than
    < less than
    >= greater than or equal to
    <= less than or equal to

 */


--LIKE can be a useful operator when you want to compare similar values. 
SELECT * 
FROM movies
WHERE name LIKE 'Se_en'; -- start with 'Se' and end with 'en'


--Like can also be used to compare a value to a pattern.
SELECT * 
FROM movies
WHERE name LIKE 'A%'; --% is a wildcard character that matches zero or more missing letters in the pattern.
/* 
A% matches all movies with names that begin with letter ‘A’
%a matches all movies that end with ‘a’
 */
 SELECT * 
FROM movies 
WHERE name LIKE '%man%'; -- any movie with 'man' will match


--Is Null
SELECT name
FROM movies 
WHERE imdb_rating IS NOT NULL; -- IS NULL or IS NOT NULL


--Between
SELECT *
FROM movies
WHERE year BETWEEN 1990 AND 1999;

SELECT *
FROM movies
WHERE name BETWEEN 'A' AND 'J';

SELECT *
FROM movies
WHERE year BETWEEN 1970 AND 1979
  AND imdb_rating > 8;

--Or

SELECT *
FROM movies
WHERE year > 2014
   OR genre = 'action';

--Order By
SELECT *
FROM movies
ORDER BY name;

SELECT *
FROM movies
WHERE imdb_rating > 8
ORDER BY year DESC;


--Limit
SELECT *
FROM movies
LIMIT 10;

--Limit example
SELECT *
FROM movies
ORDER BY imdb_rating DESC
LIMIT 3;
--


--Case -   It is SQL’s way of handling if-then logic.
SELECT name,
 CASE
  WHEN imdb_rating > 8 THEN 'Fantastic'
  WHEN imdb_rating > 6 THEN 'Poorly Received'
  ELSE 'Avoid at All Costs'
 END
FROM movies;
--case example 2
SELECT name,
 CASE
  WHEN imdb_rating > 8 THEN 'Fantastic'
  WHEN imdb_rating > 6 THEN 'Poorly Received'
  ELSE 'Avoid at All Costs'
 END AS 'Review'
FROM movies;



    --SELECT is the clause we use every time we want to query information from a database.
    --AS renames a column or table.
    --DISTINCT return unique values.
    --WHERE is a popular command that lets you filter the results of the query based on conditions that you specify.
    --LIKE and BETWEEN are special operators.
    --AND and OR combines multiple conditions.
    --ORDER BY sorts the result.
    --LIMIT specifies the maximum number of rows that the query will return.
    --CASE creates different outputs.

--better organization of related information, more efficient storage and faster retrieval. 
--A database schema gives an overview of the purpose of the database and the structure of the data.
CREATE TABLE book (
  title varchar(100),
  isbn varchar(50),
  pages integer,
  price money,
  description varchar(256),
  publisher varchar(100)
);

CREATE TABLE chapter (
  id integer,
  number integer,
  title varchar(50),
  content varchar(1024)
);

CREATE TABLE author (
  name varchar(50),
  bio varchar(100),
  email varchar(20)
);


/* 

Foreign Key Part 1

A foreign key is a key that references a column in another table. 

When we have a situation where one table is related to another table in a database, we may want to bind those tables back together in a query.
 For example, let’s say we have a person table and an email table.
  If we want a list of names and associated emails, we would need to join these tables together.
 
 */
 -- REFERENCES key to another table property.
CREATE TABLE person (
id integer PRIMARY KEY,
name varchar(20),
age integer
);

CREATE TABLE email (
email varchar(20) PRIMARY KEY,
person_id integer REFERENCES person(id),
storage integer,
price money
);



SELECT column_one AS alias_one, column_two AS alias_two
FROM table_one
JOIN table_two
ON table_one.primary_key = table_two.foreign_key



--One-to-One Relationship
--a row of table A is associated with exactly one row of table B and vice-versa. 
CREATE TABLE driver (
    license_id char(20) PRIMARY KEY,
    name varchar(20),
    address varchar(100),
    date_of_birth date
);      
 
CREATE TABLE license (
    id integer PRIMARY KEY,
    state_issued varchar(20),
    date_issued date,
    date_expired  date,
    --
    license_id char(20) REFERENCES driver(license_id) UNIQUE

); 

--One-to-Many Relationship  one parent many children
CREATE TABLE page (
  id integer PRIMARY KEY,
  chapter_id integer REFERENCES chapter(id),
  content text,
  header varchar(20),
  footer varchar(20)
);

ALTER TABLE chapter
DROP COLUMN content;

SELECT
  constraint_name, table_name, column_name
FROM
  information_schema.key_column_usage
WHERE
  table_name = 'page';

INSERT INTO book VALUES (
  'Learn PostgreSQL',
  '0-9673-4537-5',
  100,
  2.99,
  'Dive into Postgres for Beginners',
  'Codecademy Publishing'
);

INSERT INTO book VALUES (
  'Postgres Made Easy',
  '0-3414-4116-3',
  255,
  5.99,
  'Learn Postgres the Easy Way',
  'Codecademy Press'
);

INSERT INTO chapter VALUES (
  1,
  '0-9673-4537-5',
  1,
  'Chapter 1'
);

INSERT INTO chapter VALUES (
  2,
  '0-3414-4116-3',
  1,
  'Chapter 1'
);

INSERT INTO page VALUES (
  1,
  1,
  'Chapter 1 Page 1',
  'Page 1 Header',
  'Page 1 Footer'
);

INSERT INTO page VALUES (
  2,
  1,
  'Chapter 1 Page 2',
  'Page 2 Header',
  'Page 2 Footer'
);

INSERT INTO page VALUES (
  3,
  2,
  'Chapter 1 Page 1',
  'Page 1 Header',
  'Page 1 Footer'
);

INSERT INTO page VALUES (
  4,
  2,
  'Chapter 1 Page 2',
  'Page 2 Header',
  'Page 2 Footer'
);

SELECT
    book.title as book_title, chapter.title as chapter_title, page.content as page_content
FROM
    book
JOIN
    chapter
ON
    book.isbn = chapter.book_isbn 
JOIN
    page
ON
    chapter.id = page.chapter_id;

--Many-to-Many Relationship  I.E, two or more one-to-many relationships
CREATE TABLE books_authors (
  book_isbn varchar(50) REFERENCES book(isbn),
  author_email varchar(20) REFERENCES author(email),
  PRIMARY KEY (book_isbn, author_email)
);

SELECT
  constraint_name, table_name, column_name
FROM
  information_schema.key_column_usage
WHERE
  table_name = 'books_authors';


--What is a trigger? The trigger is mostly used for maintaining the integrity of the information on the database.”

SELECT *
FROM customers;

UPDATE customers
SET years_old = 42
WHERE last_name = 'Hall';

SELECT *
FROM customers;

CREATE OR REPLACE FUNCTION check_account_update() RETURNS TRIGGER AS $$
    BEGIN
        NEW.active:= 1;
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

--trigger example

CREATE TRIGGER insert_trigger
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE PROCEDURE insert_function();

SELECT * FROM customers;

INSERT INTO customers (first_name, last_name)
VALUES ('John', 'Doe');

SELECT * FROM customers;
-- trigger example
SELECT * FROM customers;

CREATE TRIGGER each_statement_trigger
  AFTER UPDATE ON customers
  FOR EACH STATEMENT
  EXECUTE PROCEDURE statement_function();

UPDATE customers
SET years_old = years_old + 1;

SELECT * FROM customers;

--trigger example
CREATE TRIGGER insert_trigger_low
BEFORE INSERT ON clients
FOR EACH ROW
WHEN (NEW.total_spent < 1000)
EXECUTE PROCEDURE not_a_high_spender();

CREATE TRIGGER update_alpha
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_first();

CREATE TRIGGER update_bravo
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_second();

SELECT *
FROM orders
ORDER BY order_id;

UPDATE orders
SET quantity = 5
WHERE order_id = 1234;

SELECT *
FROM orders
ORDER BY order_id;

/* Removing Triggers */

DROP TRIGGER <trigger_name> ON <table_name>;
DROP TRIGGER insert_trigger ON customers;
SELECT * FROM information_schema.triggers; --check if trigger exists