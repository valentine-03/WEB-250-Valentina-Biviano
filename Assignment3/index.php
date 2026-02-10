<!DOCTYPE html>
<html lang="en">
<!--
Valentina Biviano
Web 250
Assignemnt 3
09 Feb. 2026
-->
<head>
    <meta charset="UTF-8">
    <title>Lesson 3 - Requests</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<h1>Lesson 3 - POST Request</h1>

<form method="post" action="">
    <label for="name">Enter your name:</label><br>
    <input type="text" id="name" name="name" required>
    <br><br>
    <input type="submit" value="Submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    echo "<p>Hello, <strong>$name</strong>! Your form was submitted using POST.</p>";
}
?>

</body>
</html>
