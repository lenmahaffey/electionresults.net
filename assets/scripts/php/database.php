<?php
/* Copyright © 2016 TLA Designs, LLC. All rights reserved. */
class database{

	private $link;

	private function openDBConnection(){
	    $this->link = mysqli_init();
	    $this->link->real_connect('127.0.0.1:3306', 'electionResults', 'P@ssw0rd', 'electionresults');
		//$this->link = new mysqli('localhost', 'election', 'election', 'election');
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
		////$query = $this->link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['FIPS']);
			unset($array['COUNTY']);
			unset($array['COUNTY_TOTAL']);
			$highestVoteCount = max($array);
			$winner = array_search($highestVoteCount, $array);
			return $winner;
		}else return mysqli_error($this->link);
	}

	function FECResultsByCanidate($year){
		$query = "SELECT * FROM " . $year . "_FEC WHERE STATE = 'CAN_TOTAL'";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['STATE']);
			unset($array['STATE_TOTAL']);
			arsort($array);
			foreach($array as &$value){
				$value = number_format($value);
			}
			return $array;
		}else return mysqli_error($this->link);
	}

	function FECResultsByState($year, $state){
		$query = "SELECT * FROM " . $year . "_FEC WHERE STATE='" . $state . "'";
		////$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['TOTAL']);
			foreach ($array as $key=>$value){
				if($value=="0"){
					unset($array[$key]);
				}
			}
			unset($array['STATE']);
			unset($array['STATE_TOTAL']);
			ksort($array);
			arsort($array);
			foreach($array as &$value){
				$value = number_format($value);
			}
			return $array;
		}else return mysqli_error($this->link);
	}

	function FECResultsStateWinnerForYear($year, $state){
		$query = "SELECT * FROM " . $year . "_FEC WHERE STATE='" . $state . "'";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['STATE']);
			unset($array['STATE_TOTAL']);
			$highestVoteCount = max($array);
			$winner = array_search($highestVoteCount, $array);
			return $winner;
		}else return mysqli_error($this->link);
	}

	function FECResultsAllStateWinnersForYear($year, $states){
		$winners = array();
		$i = 0;
		foreach ($states as $state){
			$query = "SELECT * FROM " . $year . "_FEC WHERE STATE='" . $state . "'";
			//$query = $this->$link->prepare($queryString);
			$result = $this->link->query($query);
			if ($result){
				$resultCount = $result->num_rows;
				$result->data_seek($resultCount-1);
				$array = $result->fetch_array(MYSQLI_ASSOC);
				unset($array['STATE']);
				unset($array['STATE_TOTAL']);
				$highestVoteCount = max($array);
				$winner = array_search($highestVoteCount, $array);
				$winners[$i] = array($state => $winner);
				$i++;
			}else return mysqli_error($this->link);
		}
		return $winners;
	}

	function stateResultsByCanidate($year, $state){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['FIPS']);
			unset($array['COUNTY']);
			unset($array['COUNTY_TOTAL']);
			ksort($array);
			arsort($array);
			foreach($array as &$value){
				$value = number_format($value);
			}
			return $array;
		}else return mysqli_error($this->link);
	}

	function countyWinner($year, $state, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result->num_rows !=0){
			$resultCount = $result->num_rows;

			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['FIPS']);
			unset($array['COUNTY']);
			unset($array['COUNTY_TOTAL']);
			$highestVoteCount = max($array);
			$winner = array_search($highestVoteCount, $array);
			return $winner;
		}else return mysqli_error($this->link);
	}

	function allCountyWinners($year, $state, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result->num_rows !=0){
			$resultCount = $result->num_rows;

			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['FIPS']);
			unset($array['COUNTY']);
			unset($array['COUNTY_TOTAL']);
			$highestVoteCount = max($array);
			$winner = array_search($highestVoteCount, $array);
			return $winner;
		}else return mysqli_error($this->link);
	}

	function countyResults($year, $state, $FIPS){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-2);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			unset($array['FIPS']);
			unset($array['COUNTY']);
			unset($array['COUNTY_TOTAL']);
			arsort($array);
			return $array;
		}else return mysqli_error($this->link);
	}

	function getCanidate($year, $can){
		$query = "SELECT * FROM " . $year . "_CAN WHERE PARTY=" ."'$can'";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			return $array;
		}else return mysqli_error($this->link);
	}

	function getParty($year, $party){
		$query = "SELECT * FROM " . $year . "_PAR WHERE PARTY=" . "'$party'";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			return $array;
		}else return mysqli_error($this->link);
	}

	function getAllCanidates($year, $canidates){
		$winners = array();
		$i = 0;
		foreach ($canidates as $canidate){
			$query = "SELECT * FROM " . $year . "_CAN WHERE PARTY=" ."'$canidate'";
			$result = $this->link->query($query);

			if ($result){
				$resultCount = $result->num_rows;
				$result->data_seek($resultCount-1);
				$array = $result->fetch_array(MYSQLI_ASSOC);
				$winners[$canidate] = $array;
				$i++;
			}else return mysqli_error($this->link);
		}
		return $winners;
	}

	function getAllParties($year, $parties){
		$winners = array();
		$i = 0;
		foreach ($parties as $party){
			$query = "SELECT * FROM " . $year . "_PAR WHERE PARTY=" . "'$party'";
			//$query = $this->$link->prepare($queryString);
			$result = $this->link->query($query);
			if ($result){
				$resultCount = $result->num_rows;
				$result->data_seek($resultCount-1);
				$array = $result->fetch_array(MYSQLI_ASSOC);
				$winners[$party] = $array;
				$i++;
			}else return mysqli_error($this->link);
		}
		return $winners;
	}

	function getFIPSName($FIPS){
	    //$query = "SELECT * FROM FIPS WHERE `DESCRIPTION` = 'State'";
	    //print ($query);
		$query = "SELECT * FROM FIPS WHERE FIPS=" . $FIPS;
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$result->data_seek($resultCount-1);
			$array = $result->fetch_array(MYSQLI_ASSOC);
			return $array;
		}else return mysqli_error($this->link);
	}

	function getAllStates(){
	    $query = "SELECT * FROM `FIPS`";
	    //print ($query);
	   //$query = "SELECT * FROM FIPS WHERE FIPS=" . $FIPS;
	    //$query = $this->$link->prepare($queryString);
	    $result = $this->link->query($query);
	    if ($result){
	        $resultCount = $result->num_rows;
	        $result->data_seek($resultCount-1);
	        $array = $result->fetch_array(MYSQLI_ASSOC);
	        return $array;
	    }else return mysqli_error($this->link);
	}

	function countyWinnersByStateForYear($year, $state){
		$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
		//$query = $this->$link->prepare($queryString);
		$result = $this->link->query($query);
		if ($result){
			$resultCount = $result->num_rows;
			$array = $result->fetch_array(MYSQLI_ASSOC);
			$resultsArray = array();
			for ($i = 0; $i < $resultCount; $i++){
				$FIPS = $array['FIPS'];
				unset($array['FIPS']);
				unset($array['COUNTY']);
				unset($array['CAN_TOTAL']);
				unset($array['COUNTY_TOTAL']);
				$highestValue = max($array);
				$key = array_search($highestValue, $array);
				$resultsArray[$FIPS] = $key;
				$result->data_seek($i);
				$array = $result->fetch_array(MYSQLI_ASSOC);
			}
			return $resultsArray;
		}
	}

	function allCountyWinnersByStateForYear($year, $states){
		$winners = array();
		$i = 0;
		foreach ($states as $state){
			$winners[$i] = $this->countyWinnersByStateForYear($year, $state);
			$i++;
		}
		return $winners;
	}

	function getWordpressResultsTableData($year, $state){
		$FECResults = $this->FECResultsByState($year, $state);
		$stateResults = $this->stateResultsByCanidate($year, $state);
		$combinedResults = array();
		if (count($FECResults) >= count($stateResults)){
			foreach($FECResults as $key => $value) {
				$resultsArray = array();
				$resultsArray['FECResults'] = $value;
				if($stateResults[$key]){
					$resultsArray['stateResults'] = $stateResults[$key];
				}else $resultsArray['stateResults'] = '0';
				$combinedResults[$key] = $resultsArray;
			}
		}
		return $combinedResults;
	}
}
?>