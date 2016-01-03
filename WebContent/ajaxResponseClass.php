<?php
include_once 'database/database.php';

class ajaxReply {
	public $request;
	private $reply, $db, $action;
	
	function __construct(){
		$this->db = new database;
	}
	
	function __destruct(){
		$this->db = NULL;
	}
	
	function stateWinner($state, $year){
		if($reply = $db->stateWinner($request["state"], $request["year"])){
			$response = json_encode($reply);
			echo $response;
		}
	}
	
}
	
$action = $request["action"];

switch($action) {
	case "stateWinner" : 
		if($reply = $db->stateWinner($request["state"], $request["year"]));
		break;
		
	case "countyWinner" : 
		$reply = $db->countyWinner($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "countyName" :
		$reply = $db->countyName($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "FECResultsStateWinnerForYear" : 
		$reply = $db->FECResultsStateWinnerForYear($request["year"], $request["state"]); 
		break;
		
	case "stateResultsState" : 
		$reply = $db->stateResultsState($request["state"], $request["year"]); 
		break;
		
	case "countyResultsFederal" : 
		$reply = $db->countyResultsFederal($request["state"], $request["year"], $request["FIPS"]); 
		break;
		
	case "countyResultsState" : 
		$reply = $db->countyResultsState($request["state"], $request["year"], $request["FIPS"]); 
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
		
	default: echo "Switch Failure for: " . $action;
}

$response = json_encode($reply);

echo $response;

?>