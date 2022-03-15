<?php
/* Copyright © 2021 TLA Designs, LLC. All rights reserved. */
class database{

	private $link;
	
	private function openDBConnection(){
		$serverName = "localhost";
        $connectionOptions = array("Database"=>"electionResults",
								   "Uid"=>"electionResults", 
								   "PWD"=>"P@ssw0rd");
		try{
			$this->link = sqlsrv_connect($serverName, $connectionOptions);
		}
		catch(Exception $e){
			print_r(sqlsrv_errors());
		}

		if ($this->link == false){
			print_r(sqlsrv_errors());
		}
		// else{
		// 	foreach(sqlsrv_server_info($this->link) as $key => $value){
		// 		echo $key.":".$value.PHP_EOL;
		// 	};
		// }
	}

	function __construct(){
		$this->openDBConnection();
	}

	function __destruct(){
		sqlsrv_close($this->link);
	}

	function executeSQL($sql){
		try	{
			$result = sqlsrv_query($this->link, $sql);
			if ($result){
				if(sqlsrv_has_rows($result)){
					$array = [];
					while( $row = sqlsrv_fetch_array( $result, SQLSRV_FETCH_ASSOC) ) {
						array_push($array, $row);
				  	}
					return $array;
				}
			}else return sqlsrv_errors();
		}
		catch(Exception $e){
			print_r(e);
		}
	}

	function FEC_AllCandidateTotals($year){
		$sql = "EXEC FEC_AllCandidateTotals @YEAR = ". $year;
		return $this->executeSQL($sql);
	}

	function FEC_AllStateWinners($year){
		$sql = "EXEC FEC_AllStateWinners @YEAR = ". $year;
		return $this->executeSQL($sql);
	}
	
	function FEC_SingleStateAllCandidateTotals($year, $FIPS){
		$sql = "EXEC FEC_SingleStateAllCandidateTotals @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}

	function FEC_SingleStateWinner($year, $FIPS){
		$sql = "EXEC FEC_SingleStateWinner @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}

	function getFIPS($FIPS){
		$sql = "EXEC GetFIPS @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}
	
	function STATES_SingleCountyAllCandidateTotals($year, $FIPS){
		$sql = "EXEC STATES_SingleCountyAllCandidateTotals @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}
	
	function STATES_SingleCountyWinner($year, $FIPS){
		$sql = "EXEC STATES_SingleCountyWinner @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}
	
	function STATES_SingleStateAllCandidateTotals($year, $FIPS){
		$sql = "EXEC STATES_SingleStateAllCandidateTotals @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}

	function STATES_SingleStateAllCountyWinners($year, $FIPS){
		$sql = "EXEC STATES_SingleStateAllCountyWinners @YEAR = ". $year .", @FIPS = ".$FIPS;
		return $this->executeSQL($sql);
	}

	function STATES_AllStatesAllCountyWinners($year){
		$sql = "EXEC STATES_AllStatesAllCountyWinners @YEAR = ". $year;
		return $this->executeSQL($sql);
	}
}
?>