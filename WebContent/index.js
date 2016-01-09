function ajaxRequest(action, year, state, FIPS, can, callback){
	var request = new XMLHttpRequest;
	var url = "ajaxResponse.php";
	var params = JSON.stringify({
								"action": action,
								"year": year,
								"state": state,  
								"FIPS": FIPS,
								"can": can});
	request.open("POST", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var JSONResults = JSON.parse(request.response);
			var JSONRequest = JSON.parse(params);
			callback(JSONRequest, JSONResults);
		}
		if(request.readyState == 4 && request.status == 500) {

		}
	}
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Accept", "application/json");
	request.send(params);
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
				countyImport = allStatesSVG.contentDocument.importNode(counties[c], true);
				allStatesSVG.contentDocument.getElementById(counties[c].parentNode.id).appendChild(countyImport);
			}
			document.getElementById("countiesSetupButton").parentNode.removeChild(document.getElementById("countiesSetupButton"));
			var counties =  allStatesSVG.contentDocument.getElementsByClassName("county");
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

function showStates(){
	var states = allStatesSVG.contentDocument.getElementsByClassName("state");
	var counties = allStatesSVG.contentDocument.getElementsByClassName("county");
	document.getElementById("2000Results").onclick = function () { setupAllStatesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllStatesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllStatesView("2008") };
	document.getElementById("2012Results").onclick = function () { setupAllStatesView("2012") };
	
	for(var i = 0; i < states.length; i++){
		states[i].onclick = function(){ onClick(this) }
		states[i].onmouseenter = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, x, y);
		}
		states[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, x, y);
		}
		states[i].onmouseleave = function(e){
			mouseLeave(this);
		}
		states[i].style.display = "";
	}
	
	for(var i = 0; i < counties.length; i++){
		counties[i].style.display = "none";
		counties[i].style.fill = "grey";
	}
	resetHeading();
}

function showCounties(){
	var states = allStatesSVG.contentDocument.getElementsByClassName("state");
	var counties =  allStatesSVG.contentDocument.getElementsByClassName("county");
	document.getElementById("2000Results").onclick = function () { setupAllCountiesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllCountiesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllCountiesView("2008") };
	document.getElementById("2012Results").onclick = function () { setupAllCountiesView("2012") };
	
	for(var i = 0; i < counties.length; i++){
		counties[i].onmouseenter = function(e){
			mouseEnter(this);
		}
		counties[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, x, y);
		}
		counties[i].onmouseleave = function(e){
			mouseLeave(this);
		}
		counties[i].style.display = "";
	}
	
	for(var i = 0; i < states.length; i++){
		states[i].style.display = "none";
		states[i].style.fill = "grey";
	}
	resetHeading();
}

function setHeading(year){
	heading.textContent = year + " General Presidential Elections";
}

function resetHeading(){
	heading.textContent = "Select a Year";
	DEM_canidate.textContent = "Player 1";
	DEM_vote.textContent = "123";
	REP_canidate.textContent = "Player 2";
	REP_vote.textContent = "123";
}

function setupAllStatesView(year){
	setHeading(year);
	ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	var states = allStatesSVG.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('FECResultsStateWinnerForYear', year, states.item(i).parentNode.id, 0, 0, colorState);
	}	
}

function setupAllCountiesView(year){
	setHeading(year);
	ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	var counties = allStatesSVG.contentDocument.getElementsByClassName('county');
	for(var i = 0; i < counties.length; i++){
		ajaxRequest('countyWinner', year, counties.item(i).parentNode.id, counties.item(i).id, 0, colorCounty);
	}	
}

function setCanidates(request, result) {
	setResultsWindow(request, result);
}

function setResultsWindow(request, results){
	var resultsArray = Object.keys(results);
	var column1 = document.getElementById("column1");
	var column2 = document.getElementById("column2");
	while(column1.firstChild){
		column1.removeChild(column1.firstChild);
	}
	while(column2.firstChild){
		column2.removeChild(column2.firstChild);
	}
	for(var i = 0; i < resultsArray.length; i++){
		var canidate = resultsArray[i];
		var canidateVotes = results[canidate];
		var newCanidateDiv = document.createElement("div");
		var newCanidateNameElement = document.createElement("p");
		var newCanidatePartyElement = document.createElement("p");
		var newCanidateVotesElement = document.createElement("p");
		newCanidateDiv.id = canidate;
		newCanidateDiv.className = "canidateResult";
		newCanidateNameElement.className = "canidateName";
		newCanidatePartyElement.className = "partyName";
		newCanidateVotesElement.className = "votes";
		newCanidateVotesElement.style.textAlign = "right";
		newCanidatePartyElement.style.textAlign = "center";
		newCanidateNameElement.textContent = canidate;
		newCanidatePartyElement.textContent = canidate;
		newCanidateVotesElement.textContent = canidateVotes;
		newCanidateDiv.appendChild(newCanidateNameElement);
		newCanidateDiv.appendChild(newCanidatePartyElement);
		newCanidateDiv.appendChild(newCanidateVotesElement);

		if(i >= (resultsArray.length / 2)){
			column2.appendChild(newCanidateDiv);
		}else{
			column1.appendChild(newCanidateDiv);
		}
		ajaxRequest('getCanidate', request['year'], 0, 0, canidate, setCanidateName);
		ajaxRequest('getParty', request['year'], 0, 0, canidate, setPartyName);
	}
}

function setCanidateName (request, result) {
	var canidateNameElement = document.getElementById(request['can']).getElementsByClassName("canidateName")[0];
	canidateNameElement.textContent = result["PFIRST"] + " " + result["PLAST"];
	setHeadingCanidates();
}

function setPartyName (request, result) {
	var canidatePartyNameElement = document.getElementById(request['can']).getElementsByClassName("partyName")[0];
	canidatePartyNameElement.textContent = result['PARTY_NAME'];
}
function setHeadingCanidates(){
	REP_vote.textContent = document.getElementById('REP').getElementsByClassName("votes")[0].textContent;
	DEM_vote.textContent = document.getElementById('DEM').getElementsByClassName("votes")[0].textContent;
	REP_canidate.textContent = document.getElementById('REP').getElementsByClassName("canidateName")[0].textContent;
	DEM_canidate.textContent = document.getElementById('DEM').getElementsByClassName("canidateName")[0].textContent;
}

function colorState(request, results){
	var stateNode = allStatesSVG.contentDocument.getElementById(request['state']).getElementsByClassName("state")[0];
	console.log(results);
	switch (results) {
	case "DEM":
		stateNode.style.fill = "blue";
		break;
	case "REP":
		stateNode.style.fill = "red";
		break;
	default:
		stateNode.style.fill = "grey";
	}
}

function colorCounty(request, results){
	var countyNode = allStatesSVG.contentDocument.getElementById(request['FIPS']);
	switch (results) {
	case "DEM":
		countyNode.style.fill = "blue";
		break;
	case "REP":
		countyNode.style.fill = "red";
		break;
	default:
		countyNode.style.fill = "grey";
	}
}

function mouseEnter(mapObject, x, y){
	mouseOver(mapObject, x, y);
	ajaxRequest('getFIPSName', 0, 0, mapObject.id, 0, setToolTip)
	toolTip.style.display = "block";
}

function mouseOver(mapObject, x, y){
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

function setToolTip(request, response){
	toolTip.innerHTML = response["NAME"];
}

function onClick(target){

}

function showResultsWindow(){
	var resultsButton = document.getElementById("resultsButton");
	var results = document.getElementById("results");
	resultsButton.innerHTML = "Hide Results";
	resultsButton.onclick = function () { hideResultsWindow() };
	results.style.visibility = "visible";
}

function hideResultsWindow(){
	var resultsButton = document.getElementById("resultsButton");
	resultsButton.innerHTML = "Show Results"
	resultsButton.onclick = function () { showResultsWindow() };
	results.style.visibility = "hidden";
}