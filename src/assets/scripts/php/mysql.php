<?php
/* Copyright © 2021 TLA Designs, LLC. All rights reserved. */
class database{

	private $link;
	private function openDBConnection(){
		$serverName = "192.168.0.4";
		$userName = "election_results";
		$password = "tfxx1Y.(Tm.z5OUyKK7X";
		$dbName = "election_results";

		try{
			$this->link = mysqli_init();
			$this->link = new mysqli($serverName, $userName, $password, $dbName);
		}
		catch(Exception $e){
			print_r('Connection Error ' . $this->link->connect_errno . ': ' . $this->link->connect_error);
		}

		if ($this->link == false){
			print_r('Connection Error ' . $this->link->connect_errno . ': ' . $this->link->connect_error);
		}
	}

	function __construct(){
		$this->openDBConnection();
	}

	function __destruct(){
		mysqli_close($this->link);
	}

	function executeSQL($sql){
		try	{
			$result = $this->link->query($sql);
			if ($result){
					$array = [];
					while($row = $result->fetch_array(MYSQLI_ASSOC)){
						$array[] = $row;
					}
					$this->link->next_result();
					return $array;
				} else return NULL;
		}
		catch(Exception $e){
			return $e->getMessage();
		}
	}
	function FEC_AllStateWinners($year){
		$sql = "CALL FEC_AllStateWinners(". $year .")";
		$data = $this->executeSQL($sql);
		return $data;
	}
	
	function FEC_AllCandidateTotals($year){
		$sql = "CALL FEC_AllCandidateTotals(". $year .")";
		$data = $this->executeSQL($sql);
		return $data;
	}

	function FEC_SingleStateAllCandidateTotals($year, $FIPS){
		$sql = "CALL FEC_SingleStateAllCandidateTotals(". $year . " ," . $FIPS .")";
		return $this->executeSQL($sql);
	}

	function FEC_SingleStateAllCanidateTotals($year, $FIPS){
		$sql = "CALL FEC_SingleStateAllCanidateTotals(". $year . ", " .$FIPS .")";
		return $this->executeSQL($sql);
	}

	function getFIPS($FIPS){
		$sql = "CALL GetFIPS (". $FIPS .")";
		return $this->executeSQL($sql);
	}

	function STATES_AllStatesAllCountyWinners($year){
		$sql = "CALL STATES_AllStatesAllCountyWinners(". $year .")";
		return $this->executeSQL($sql);
	}

	function STATES_SingleCountyAllCandidateTotals($year, $FIPS){
		$sql = "CALL STATES_SingleCountyAllCandidateTotals(". $year .", ".$FIPS .")";
		return $this->executeSQL($sql);
	}
	
	function STATES_SingleCountyWinner($year, $FIPS){
		$sql = "CALL STATES_SingleCountyWinner(". $year .", ".$FIPS .")";
		return $this->executeSQL($sql);
	}

	function STATES_SingleStateAllCountyWinners($year, $FIPS){
		$sql = "CALL STATES_SingleStateAllCountyWinners(". $year .", ".$FIPS .")";
		return $this->executeSQL($sql);
	}

	function STATES_SingleStateTop2CandidateTotals($year, $FIPS){
		$sql = "CALL STATES_SingleStateTop2CandidateTotals(". $year .", ". $FIPS .")";
		return $this->executeSQL($sql);
	}
}
?>