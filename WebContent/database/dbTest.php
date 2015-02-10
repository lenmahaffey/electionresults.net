<?php
include 'database.php';

//Make a connection to database
$link = new mysqli('localhost', 'election', 'election', 'election');

//Check database connection
if ($link->connect_errno){
	die('Connect Error: ' . $link->connect_errno . ' ' . $link->connect_error);
}

$ALWinner = countyName('AL', '2000', '01001', $link);
echo $ALWinner[0];

//var_dump($ALWinner);
/*
$year = "2000";
$state = "TX";

$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
$result = $link->query($query);
$resultCount = $result->num_rows . PHP_EOL;

$result->data_seek($resultCount-1);
$row = $result->fetch_array(MYSQLI_ASSOC);

unset($row['FIPS']);
unset($row['COUNTY']);
unset($row['COUNTY_TOTAL']);
$biggestWinner = max($row);
var_dump($biggestWinner); 


*/
?>