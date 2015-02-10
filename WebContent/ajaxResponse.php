<?php
include_once 'database.php';
$db = new database;
$request = json_decode(file_get_contents('php://input'), true);
$reply = NULL;
$action = $request["action"];

switch($action) {
	case "stateWinner": 
		$reply = $db->stateWinner($request["state"], $request["year"]);
		break;
		
	case "countyWinner": 
		$reply = $db->countyWinner($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "countyName":
		$reply = $db->countyName($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "stateResultsFederal": 
		$reply = $db->stateResultsFederal($request["state"], $request["year"]); 
		break;
		
	case "stateResultsState": 
		$reply = $db->stateResultsState($request["state"], $request["year"]); 
		break;
		
	case "countyResultsFederal": 
		$reply = $db->countyResultsFederal($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "countyResultsState": 
		$reply = $db->countyResultsState($request["state"], $request["year"], $request["FIPS"]); 
		break;

	default: echo "Switch Failure for: " . $action;
}

$response = json_encode($reply);

echo $response;

?>