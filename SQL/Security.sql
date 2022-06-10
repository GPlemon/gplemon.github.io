--SQL Injection Prevention

--There are two main methods for preventing injection attacks: sanitization and prepared statements.
--Sanitization

--Sanitization is the process of removing dangerous characters from user input. When it comes to SQL injections, we would want to escape dangerous characters such as:

/*

 '
;

\--
 */

--Prepared Statements
--Writing prepared statements in backend code is a common, reliable, and secure solution against SQL injections. Prepared statements are nearly foolproof.

--$username= $_GET['user'];
--$stmt = $conn->prepare("SELECT * FROM Users WHERE name = '?'");
--$stmt->bind_param("s", $username);
--$stmt->execute();