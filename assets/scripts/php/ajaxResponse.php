<?php
/* Copyright © 2019 TLA Designs, LLC. All rights reserved. */
include_once 'database.php';
$db = new database;
$reply = NULL;
switch($_POST['action']) {

	case "FEC_AllCandidateTotals" :
		$reply = $db->FEC_AllCandidateTotals($_POST["YEAR"]);
		break;

	case "FEC_AllStateWinners" :
		$reply = $db->FEC_AllStateWinners($_POST["YEAR"]);
		break;

	case "FEC_SingleStateAllCandidateTotals" :
		$reply = $db->FEC_SingleStateAllCandidateTotals($_POST["YEAR"], $_POST["FIPS"]);
		break;

	case "FEC_SingleStateWinner" :
		$reply = $db->FEC_SingleStateWinner($_POST["YEAR"], $_POST["FIPS"]);
		break;

	case "getFIPS" :
		$reply = $db->getFIPS($_POST["FIPS"]);
		break;

	case "STATES_SingleCountyAllCandidateTotals" :
		$reply = $db->STATES_SingleCountyAllCandidateTotals($_POST["year"], $_POST["FIPS"]);
		break;

	case "STATES_SingleCountyWinner" :
	    $reply = $db->STATES_SingleCountyWinner($_POST["year"], $_POST["FIPS"]);
		break;

	case "STATES_SingleStateAllCandidateTotals" :
	    $reply = $db->STATES_SingleStateAllCandidateTotals($_POST["year"], $_POST["state"], $_POST["FIPS"]);
		break;

	case "STATES_SingleStateAllCountyWinners" :
		$reply = $db->STATES_SingleStateAllCountyWinners($_POST["year"], $_POST["FIPS"]);
		break;

	case "STATES_AllStatesAllCountyWinners" :
		$reply = $db->STATES_AllStatesAllCountyWinners($_POST["year"]);
		break;

	default: $reply =  "Unknown Action: " . $_POST['action'];
}

$response = json_encode($reply);

echo $response;

?>