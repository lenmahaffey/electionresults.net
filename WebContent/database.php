<?php

function stateWinner($state, $year, $link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
	$result = $link->query($query);
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

function stateResultsFederal($state, $year, $link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
	$result = $link->query($query);
	$resultCount = $result->num_rows;
	
	$result->data_seek($resultCount-1);
	$row = $result->fetch_array(MYSQLI_ASSOC);
	
	unset($row['FIPS']);
	unset($row['COUNTY']);
	unset($row['COUNTY_TOTAL']);
	return $row;
}

function stateResultsState($state, $year, $link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES";
	$result = $link->query($query);
	$resultCount = $result->num_rows;

	$result->data_seek($resultCount-2);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	unset($row['FIPS']);
	unset($row['COUNTY']);
	unset($row['COUNTY_TOTAL']);
	return $row;
}

function countyWinner($state, $year, $county ,$link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $county;
	$result = $link->query($query);
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

function countyResultsFederal($state, $year, $FIPS, $link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
	$result = $link->query($query);
	$resultCount = $result->num_rows;

	$result->data_seek($resultCount-1);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	unset($row['FIPS']);
	unset($row['COUNTY']);
	unset($row['COUNTY_TOTAL']);
	return $row;
}

function countyResultsState($state, $year, $FIPS, $link){
	$query = "SELECT * FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
	$result = $link->query($query);
	$resultCount = $result->num_rows;

	$result->data_seek($resultCount-2);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	unset($row['FIPS']);
	unset($row['COUNTY']);
	unset($row['COUNTY_TOTAL']);
	return $row;
}

function countyName($state, $year, $FIPS, $link){
	$query = "SELECT COUNTY FROM " . $year . "_" . $state . "_PRES WHERE FIPS=" . $FIPS;
	$result = $link->query($query);
	$row = $result->fetch_array(MYSQLI_NUM);
	return $row;
}