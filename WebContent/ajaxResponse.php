<?php
/* Copyright © 2016 TLA Designs, LLC. All rights reserved. */
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
		$reply = $db->countyWinner($request["year"], $request["state"], $request["FIPS"]); 
		break;
	
	case "allCountyWinners" :
		$reply = $db->allCountyWinners($request["year"], $request["state"], $request["FIPS"]);
		break;
		
	case "FECResultsStateWinnerForYear" : 
		$reply = $db->FECResultsStateWinnerForYear($request["year"], $request["state"]); 
		break;
	
	case "FECResultsAllStateWinnersForYear" :
		$reply = $db->FECResultsAllStateWinnersForYear($request["year"], $request["state"]);
		break;
		
	case "stateResultsByCanidate" : 
	    $reply = $db->stateResultsByCanidate($request["year"], $request["state"]); 
		break;
		
	case "countyResults" : 
	    $reply = $db->countyResults($request["year"], $request["state"], $request["FIPS"]); 
		break;
		
	case "FECResultsByCanidate" :
		$reply = $db->FECResultsByCanidate($request["year"]);
		break;
		
	case "getCanidate" :
		$reply = $db->getCanidate($request["year"], $request["can"]);
		break;
	
	case "getParty" :
		$reply = $db->getParty($request["year"], $request["can"]);
		break;

	case "getAllCanidates" :
		$reply = $db->getAllCanidates($request["year"], $request["can"]);
		break;
	
	case "getAllParties" :
		$reply = $db->getAllParties($request["year"], $request["can"]);
		break;
	
	case "getFIPSName" :
		$reply = $db->getFIPSName($request["FIPS"]);
		break;
		
	case "countyWinnersByStateForYear" :
		$reply = $db->countyWinnersByStateForYear($request["year"], $request["state"]);
		break;
		
	case "allCountyWinnersByStateForYear" :
		$reply = $db->allCountyWinnersByStateForYear($request["year"], $request["state"]);
		break;
	
	case "getWordpressResultsTableData" :
		$reply = $db->getWordpressResultsTableData($request["year"], $request["state"]);
		break;
		
	default: echo "Switch Failure for: " . $action;
}

$response = json_encode($reply);

echo $response;

?>