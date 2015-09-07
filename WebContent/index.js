function showCounties(){
	var states = map.contentDocument.getElementsByClassName("state");
	var counties =  map.contentDocument.getElementsByClassName("county");
	document.getElementById("results").onclick = function () { getCountyResults() };
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
	document.getElementById("results").onclick = function () { getStateResults() };
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
	var states = map.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('stateWinner', states.item(i).parentNode.id, '2000');
	}	
}

function getCountyResults(){
	var counties = map.contentDocument.getElementsByClassName('county');
	for(var i = 0; i < counties.length; i++){
		ajaxRequest('countyWinner', counties.item(i).parentNode.id, '2000', counties.item(i).id);
	}	
}

function countiesSetup(){
	var request = new XMLHttpRequest;
	var url = "images/counties.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {//Call a function when the state changes.
		if(request.readyState == 4 && request.status == 200) {
			var countiesDoc = request.responseXML;
			var counties = countiesDoc.getElementsByClassName("county");
			for (var c = 0; c < counties.length; c++){
				countyImport = map.contentDocument.importNode(counties[c], true);
				if(countyImport){
					console.log("Import " + counties[c].id + " succeeded")
					if(map.contentDocument.getElementById(counties[c].parentNode.id).appendChild(countyImport)){
						console.log("Append " + counties[c].id + " succeeded");
					}else console.log(counties[c].id + " Append Failed");
				}else console.log(counties[c].id + " Import failed");
			}
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
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
	var stateNode = map.contentDocument.getElementById(state);
	switch (response) {
	case '"DEM"':
		stateNode.children[0].style.fill = "blue";
		break;
	case '"REP"':
		stateNode.children[0].style.fill = "red";
		break;
	default:
		console.log(stateNode.id + " not Found");
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
		console.log(stateNode.id + " not Found");
	}
}