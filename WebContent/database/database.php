<?php

class database{

	private $link;
	
	private function openDBConnection(){
		$this->link = new mysqli('localhost', 'election', 'election', 'election');
		if ($this->link->connect_errno){
			die('Connection Error ' . $this->link->connect_errno . ': ' . $this->link->connect_error);
		}
	}
	
	function __construct(){
		$this->openDBConnection();
	}
	
	function __destruct(){
		mysqli_close($this->link);
	}
		
	function stateWinner($state, $year){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
		
		$result->data_seek($resultCount-1);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		$highestVoteCount = max($row);
		$winner = array_search($highestVoteCount, $row);
		return $winner;
	}
	
	function countyWinner($state, $year, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
	
		$result->data_seek($resultCount-1);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		$highestVoteCount = max($row);
		$winner = array_search($highestVoteCount, $row);
		return $winner;
	}
	
	function countyName($state, $year, $FIPS){
		$query = "SELECT COUNTY FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		$result = $this->link->query($query);
		$row = $result->fetch_array(MYSQLI_NUM);
		return $row;
	}
	
	function stateResultsFederal($state, $year){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
		
		$result->data_seek($resultCount-1);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		return $row;
	}
	
	function stateResultsState($state, $year){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
	
		$result->data_seek($resultCount-2);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		return $row;
	}
	
	function countyResultsFederal($state, $year, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
	
		$result->data_seek($resultCount-1);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		return $row;
	}
	
	function countyResultsState($state, $year, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		$result = $this->link->query($query);
		$resultCount = $result->num_rows;
	
		$result->data_seek($resultCount-2);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	
		unset($row['FIPS']);
		unset($row['COUNTY']);
		unset($row['COUNTY_TOTAL']);
		return $row;
	}

}
?>