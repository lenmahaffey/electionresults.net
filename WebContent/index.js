function showStates(){
	var states = map.contentDocument.getElementsByClassName("state");
	var counties = map.contentDocument.getElementsByClassName("county");
	document.getElementById("2000Results").onclick = function () { getStateResults("2000") };
	document.getElementById("2004Results").onclick = function () { getStateResults("2004") };
	document.getElementById("2008Results").onclick = function () { getStateResults("2008") };
	document.getElementById("2012Results").onclick = function () { getStateResults("2012") };
	toolTip.style.display = "none";
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "";
		states[i].onclick = function(){ onClick(this) }
		states[i].onmouseenter = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, x, y);
		};
		states[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, x, y);
		};
		states[i].onmouseleave = function(e){
			mouseLeave(this);
		};
	}
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "none";
	}
	resetHeading();
}

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
		counties[i].onmouseenter = function(e){
			mouseEnter(this);
		};
		
		counties[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, x, y);
		};
		
		counties[i].onmouseleave = function(e){
			mouseLeave(this);
		};
	}
	resetHeading();
}

function onClick(target){
	mouseLeave();
	var stateWindow = document.getElementById("overlay");
	stateSetup(target.parentNode.id);
	//stateMap.setAttribute("data", "images/states/" + target.parentNode.id + ".svg")
}

function stateSetup(state){
	console.log(state);
	var request = new XMLHttpRequest;
	var url = "singleStatePages/" + state + ".html";
	console.log(url);
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			stateContent.innerHTML = request.responseText;
			stateWindow.style.visibility = "visible"
			console.log(request.responseText);
		}
		if(request.readyState == 4 && request.status == 500) {
			console.log("fail");
		}
	}
	request.setRequestHeader("Content-type", "text/html");
	request.setRequestHeader("Accept", "text/html");
	request.send();
}

function hideStateWindow(){
	var stateWindow = document.getElementById("overlay");
	stateWindow.style.visibility = "hidden"
}
function getStateResults(year){
	setHeader(year);
	ajaxRequest('FECResultsByCanidate', 0, year);
	var states = map.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('FECResultsStateWinnerForYear', states.item(i).parentNode.id, year);
	}	
}

function getCountyResults(year){
	setHeader(year);
	ajaxRequest('FECResultsByCanidate', 0, year);
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
			var counties =  map.contentDocument.getElementsByClassName("county");
			for(var i = 0; i < counties.length; i++){
				counties[i].style.display = "none";
			}
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "text/xml");
	request.setRequestHeader("Accept", "text/xml");
	request.send();
}

function ajaxRequest(action, state, year, FIPS, can){
	var request = new XMLHttpRequest;
	var url = "ajaxResponse.php";
	var params = JSON.stringify({
								"action": action,
								"state": state, 
								"year": year, 
								"FIPS": FIPS,
								"can": can});
	request.open("POST", url, true);
	request.onreadystatechange = function() {//Call a function when the state changes.
		if(request.readyState == 4 && request.status == 200) {
			switch (action) {
			case "FECResultsStateWinnerForYear" :
				colorState(request.responseText, state);
				break;
			case "stateWinner" :
				colorState(request.responseText, state);
				break;
			case "countyWinner" :
				colorCounty(request.responseText, state, FIPS);
				break;
			case "FECResultsByCanidate" :
				setVotes(request.response, year);
				break;
			case "getCanidate" :
				setCanidate(request.response);
				break;
			case "getFIPSName" :
				setToolTip(request.response);
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
	heading.textContent = year + " General Presidential Elections";
};

function setVotes(results, year){
	var JSONResults = JSON.parse(results);
	REP_vote.textContent = JSONResults.REP;
	DEM_vote.textContent = JSONResults.DEM;
	ajaxRequest("getCanidate", 0, year,  0, "REP");
	ajaxRequest("getCanidate", 0, year,  0, "DEM");
}

function setCanidate(results){
	var JSONResults = JSON.parse(results);
	var votes = document.getElementById(JSONResults["PARTY"] + "_vote").textContent;
	document.getElementById(JSONResults["PARTY"]).textContent = JSONResults["PFIRST"] + " " + JSONResults["PLAST"];
	var div = document.createElement('div');
	div.id = JSONResults["PARTY"] + "_vote";
	div.style.textAlign = "left";
	div.textContent = votes;
	if (JSONResults["PARTY"] == "DEM"){
		div.style.textAlign = "right";
	}
	if (JSONResults["PARTY"] == "REP"){
		div.style.textAlign = "left";
	}
	document.getElementById(JSONResults["PARTY"]).appendChild(div);
}

function mouseEnter(mapObject, x, y){
	mouseOver(mapObject, x, y);
	ajaxRequest('getFIPSName', 0, 0, mapObject.id)
	toolTip.style.display = "block";
}
function mouseOver(mapObject, x, y){
//	toolTip.style.display = "block";
	toolTip.style.top = (y + 75) + "px";
	toolTip.style.left = (x) + "px";
}

function mouseLeave(mapObject){
	toolTip.style.display = "none";
}

function mouseMove(mapObject, x, y){
	toolTip.style.top = (y + 75) + "px";
	toolTip.style.left = (x) + "px";
}

function setToolTip(response){
	var JSONResults = JSON.parse(response);
	toolTip.innerHTML = JSONResults["NAME"];
}

function resetHeading(){
	heading.textContent = "Select a Year";
	
	DEM.textContent = "Player 1";
	var DEM_div = document.createElement('div');
	DEM_div.id = "DEM_vote";
	DEM_div.style.textAlign = "right";
	DEM_div.textContent = "123";
	DEM.appendChild(DEM_div);
	
	REP.textContent = "Player 2";
	var REP_div = document.createElement('div');
	REP_div.id = "REP_vote";
	REP_div.style.textAlign = "left";
	REP_div.textContent = "123";
	REP.appendChild(REP_div);
}