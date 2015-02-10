<?php
include_once 'database.php';

$db = new database;

$result = $db->stateWinner('AL', '2000');

$json = json_encode($result);

echo $json;

?>
