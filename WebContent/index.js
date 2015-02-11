function loadStates(){
  	var states = document.getElementById("map");
  	var SVGDoc = states.contentDocument;
  	var allStates = SVGDoc.getElementById("states");
 	allStates.style.fill = "grey";
 	SVGDoc.getElementById("AL").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("AZ").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("AR").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("CA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("CO").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("CT").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("DC").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("DE").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("FL").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("GA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("ID").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("IA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("IL").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("IN").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("KS").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("KY").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("LA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MD").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("ME").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MI").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MN").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MO").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MS").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("MT").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NC").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("ND").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NE").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NH").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NJ").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NM").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NV").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("NY").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("OH").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("OK").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("OR").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("PA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("RI").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("SC").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("SD").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("TN").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("TX").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("UT").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("VT").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("VA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("WA").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("WI").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("WV").onclick = function(){ newWindow(this) };
 	SVGDoc.getElementById("WY").onclick = function(){ newWindow(this) };
}

function newWindow(target){
	//target.style.fill = "red";
	var newWindow = window.open('http://www.google.com', 
			"mywindow",
			"menubar=0, resizable=0, width=500,height=500");
}

function colorState(state){
	SVGDoc.getElementById(state).style.fill = "red";
}

function ajaxRequest(action, state, year, FIPS){
	var request = new XMLHttpRequest;
	var url = "ajaxResponse.php";
	var params = JSON.stringify({
								"action": action,
								"state": state, 
								"year": year, 
								"FIPS": FIPS});
	request.open("POST", url, true);
	request.onreadystatechange = function() {//Call a function when the state changes.
		if(request.readyState == 4 && request.status == 200) {
		  	var states = document.getElementById("map");
		  	var SVGDoc = states.contentDocument;
			response = request.responseText
			console.debug(response);
			switch (response) {
				case '"DEM"':
					SVGDoc.getElementById(state).style.fill = "blue";
					break;
				case '"REP"':
					SVGDoc.getElementById(state).style.fill = "red";
					break;
//				default: window.alert(response);
			};
		}
		if(request.readyState == 4 && request.status == 500) {
//			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Accept", "application/json");
	request.send(params);
}

function getResults(){
	var statesArray = ["AL","AZ","AR","CA","CO","CT","DE","FL","GA","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WI","WV","WY"];
	for (i = 0; i < statesArray.length; i++){
		ajaxRequest('stateWinner', statesArray[i], '2000');
	}
}
/*
function loadCounties(){
	var mapDoc = document.getElementById("map");
	var SVGDoc = mapDoc.contentDocument;
	var allStates = SVGDoc.getElementById("counties");
	allStates.style.fill = "grey";
	SVGDoc.getElementById("AL").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("AZ").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("AR").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("CA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("CO").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("CT").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("DC").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("DE").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("FL").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("GA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("ID").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("IA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("IL").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("IN").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("KS").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("KY").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("LA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MD").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("ME").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MI").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MN").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MO").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MS").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("MT").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NC").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("ND").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NE").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NH").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NJ").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NM").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NV").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("NY").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("OH").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("OK").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("OR").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("PA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("RI").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("SC").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("SD").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("TN").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("TX").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("UT").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("VT").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("VA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("WA").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("WI").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("WV").onclick = function(){ newWindow(this) };
	SVGDoc.getElementById("WY").onclick = function(){ newWindow(this) };
}


function switchCounties(){
	document.getElementById("map").style.display = "none";
	document.getElementById("map").setAttribute("data", "images/counties.svg");
	document.getElementById("map").style.display = "";
	document.getElementById("map").onLoad = "loadCounties()"
}

function switchStates(){
	document.getElementById("map").style.display = "none";
	document.getElementById("map").setAttribute("data", "images/states.svg");
	document.getElementById("map").style.display = "";
	document.getElementById("map").onLoad = "loadStates()"
}
*/