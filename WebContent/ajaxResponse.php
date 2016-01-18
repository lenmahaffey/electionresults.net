<?php
include_once 'database/database.php';
$db = new database;
$request = json_decode(file_get_contents('php://input'), true);
$reply = NULL;
$action = $request["action"];

switch($action) {
	case "stateWinner" : 
		if($reply = $db->stateWinner($request["state"], $request["year"]));
		break;
		
	case "countyWinner" : 
		$reply = $db->countyWinner($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "FECResultsStateWinnerForYear" : 
		$reply = $db->FECResultsStateWinnerForYear($request["year"], $request["state"]); 
		break;
		
	case "stateResultsByCanidate" : 
		$reply = $db->stateResultsByCanidate($request["state"], $request["year"]); 
		break;
		
	case "countyResults" : 
		$reply = $db->countyResults($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "FECResultsByCanidate" :
		$reply = $db->FECResultsByCanidate($request["year"]);
		break;
		
	case "getCanidate" :
		$reply = $db->getCanidate($request["year"], $request["can"]);
		break;
		
	case "getFIPSName" :
		$reply = $db->getFIPSName($request["FIPS"]);
		break;
		
	case "getParty" :
		$reply = $db->getParty($request["year"], $request["can"]);
		break;
		
	case "countyWinnersByStateForYear" :
		$reply = $db->countyWinnersByStateForYear($request["year"], $request["state"]);
		break;
		
	default: echo "Switch Failure for: " . $action;
}

$response = json_encode($reply);

echo $response;

?>