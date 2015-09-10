function showCounties(){
	var states = map.contentDocument.getElementsByClassName("state");
	var counties =  map.contentDocument.getElementsByClassName("county");
	document.getElementById("2000Results").onclick = function () { getCountyResults("2000") };
	document.getElementById("2004Results").onclick = function () { getCountyResults("2004") };
	document.getElementById("2008Results").onclick = function () { getCountyResults("2008") };
	document.getElementById("2012Results").onclick = function () { getCountyResults("2012") };
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "none";
	}
	
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "";
		counties[i].onclick = function(){ redClick(this) };
	}
}

function showStates(){
	var states = map.contentDocument.getElementsByClassName("state");
	var counties = map.contentDocument.getElementsByClassName("county");
	document.getElementById("2000Results").onclick = function () { getStateResults("2000") };
	document.getElementById("2004Results").onclick = function () { getStateResults("2004") };
	document.getElementById("2008Results").onclick = function () { getStateResults("2008") };
	document.getElementById("2012Results").onclick = function () { getStateResults("2012") };
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "";
		states[i].onclick = function(){ redClick(this) };
	}
	
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "none";
	}
}

function redClick(target){
	target.style.fill = "red";
}

function getStateResults(year){
	setHeader(year);
	var states = map.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('stateWinner', states.item(i).parentNode.id, year);
	}	
}

function getCountyResults(year){
	setHeader(year);
	var counties = map.contentDocument.getElementsByClassName('county');
	for(var i = 0; i < counties.length; i++){
		ajaxRequest('countyWinner', counties.item(i).parentNode.id, year, counties.item(i).id);
	}	
}

function countiesSetup(){
	var request = new XMLHttpRequest;
	var url = "images/counties.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var parser = new DOMParser();
			var countiesDoc = parser.parseFromString(request.responseText, "application/xml");
			var counties = countiesDoc.getElementsByClassName("county");
			for (var c = 0; c < counties.length; c++){
				countyImport = map.contentDocument.importNode(counties[c], true);
				map.contentDocument.getElementById(counties[c].parentNode.id).appendChild(countyImport);
			}
			document.getElementById("countiesSetupButton").parentNode.removeChild(document.getElementById("countiesSetupButton"));
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "text/xml");
	request.setRequestHeader("Accept", "text/xml");
	request.send();
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
			switch (action) {
			case "stateWinner" :
				colorState(request.responseText, state);
				break;
			case "countyWinner" :
				colorCounty(request.responseText, state, FIPS);
				break;
			default:
				console.log(action);
			}
		}
		if(request.readyState == 4 && request.status == 500) {
//			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Accept", "application/json");
	request.send(params);
}

function colorState(response, state){
	var stateNode = map.contentDocument.getElementById(state).getElementsByClassName("state")[0];
	switch (response) {
	case '"DEM"':
		stateNode.style.fill = "blue";
		break;
	case '"REP"':
		stateNode.style.fill = "red";
		break;
	default:
		stateNode.style.fill = "grey";
	}
}

function colorCounty(response, state, FIPS){
	var countyNode = map.contentDocument.getElementById(FIPS);
	switch (response) {
	case '"DEM"':
		countyNode.style.fill = "blue";
		break;
	case '"REP"':
		countyNode.style.fill = "red";
		break;
	default:
		countyNode.style.fill = "grey";
	}
}

function setHeader(year){
	//console.log(document.getElementById("heading").innerHTML);
	document.getElementById("heading").innerHTML = year + " General Presidential Elections";
};