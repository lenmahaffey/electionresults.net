<?php
include 'database.php';
$db = new database;
$year = "2004";
$party = "REP";
$can = "REP";
$query0 = $db->FECResultsByState("2016", "AZ");
echo count($query0) . PHP_EOL;
print_r($query0);
/*
$statesArray = array("AL","AZ","AR","CA","CO","CT","DE","FL","GA","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WI","WV","WY");
$canidateArray = array("REP","DEM","REF1","LIB","CON1","GRN","SCA","PFP","SOC","SWP1","SWP2","NONE","IND23","PRO2","IND6","IND4","IND1","PC","IND5","IND31","IND47","IND21","PRO1","IND14","IND46","IND28","IND43","IND9","IND34","IND30","IND11","IND32","IND27","IND39","IND12","IND36","IND25","IND37","IND44","IND38","IND41","IND2","IND40","IND7","IND35","IND42","IND45","IND8","N","IND29","IND18","IND33","IND20","IND26","IND24","IND48","IND16","IND10","IND49","IND17","IND3","IND22","IND19","IND13","IND15");
$allStates = array("Alabama",
"Alaska",
"Arizona",
"Arkansas",
"California",
"Colorado",
"Connecticut",
"Delaware",
"District of Columbia",
"Florida",
"Georgia",
"Hawaii",
"Idaho",
"Illinois",
"Indiana",
"Iowa",
"Kansas",
"Kentucky",
"Louisiana",
"Maine",
"Maryland",
"Massachusetts",
"Michigan",
"Minnesota",
"Mississippi",
"Missouri",
"Montana",
"Nebraska",
"Nevada",
"New Hampshire",
"New Jersey",
"New Mexico",
"New York",
"North Carolina",
"North Dakota",
"Ohio",
"Oklahoma",
"Oregon",
"Pennsylvania",
"Rhode Island",
"South Carolina",
"South Dakota",
"Tennessee",
"Texas",
"Utah",
"Vermont",
"Virginia",
"Washington",
"West Virginia",
"Wisconsin",
"Wyoming");

foreach ($allStates as $state) {
    //print $state . PHP_EOL;
    $path =  ("/users/bozziley/desktop/states/$state");
    mkdir($path);
}
*/

//$jsonStates = json_encode($statesArray);
//$array =  $db->countyResults("2000", "AL", "01001");
//echo "Check" . PHP_EOL;
//var_dump($jsonStates) . PHP_EOL;
//$query = "SELECT * FROM " . $year . "_PAR WHERE PARTY=" . "'$party'";

/*
//$JSONquery = json_encode($query);
//echo count ($canidateArray) . PHP_EOL;

//echo $query;
//print_r($query);
*/
?>