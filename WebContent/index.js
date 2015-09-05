function showCounties(){
	var states = document.getElementById("map").contentDocument.getElementsByClassName("state");
	var counties = document.getElementById("map").contentDocument.getElementsByClassName("county");
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "none";
	}
	
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "";
		counties[i].onclick = function(){ redClick(this) };
	}
}

function showStates(){
	var states = document.getElementById("map").contentDocument.getElementsByClassName("state");
	var counties = document.getElementById("map").contentDocument.getElementsByClassName("county");
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "";
		states[i].onclick = function(){ redClick(this) };
	}
	
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "none";
	}
}

function redClick(target){
	console.log("click");
	target.style.fill = "red";
}

function getStateResults(){
	states = map.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('stateWinner', states.item(i).id, '2000');
	}	
}

function getCountyResults(){
	states = map.contentDocument.getElementsByClassName('county');
	for(var i = 0; i < states.length; i++){
		//console.log(states.item(i).parentNode.id);
		ajaxRequest('countyWinner', states.item(i).parentNode.id, '2000', states.item(i).id);
	}	
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
			colorCounty(request.responseText, state, FIPS);
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
	switch (response) {
	case '"DEM"':
		document.getElementById('map').contentDocument.getElementById(state).style.fill = "blue";
		break;
	case '"REP"':
		document.getElementById('map').contentDocument.getElementById(state).style.fill = "red";
		break;	
	}
}

function colorCounty(response, state, FIPS){
	switch (response) {
	case '"DEM"':
		document.getElementById('map').contentDocument.getElementById(FIPS).style.fill = "blue";
		break;
	case '"REP"':
		document.getElementById('map').contentDocument.getElementById(FIPS).style.fill = "red";
		break;	
	}
}