var currentYear;

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

function setupSVG(SVG) {
	var states = SVG.getElementsByClassName("state");
	var counties = SVG.getElementsByClassName("county");
	for(var i = 0; i < states.length; i++){
		states[i].onmouseenter = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y));
		}
		states[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, (x), (y));
		}
		states[i].onmouseleave = function(e){
			mouseLeave(this);
		}
		states[i].onclick = function () {
			onClick(this) 
		}
	}
	for(var i = 0; i < counties.length; i++){
		counties[i].onmouseenter = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y ));
		}
		counties[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, (x), (y));
		}
		counties[i].onmouseleave = function(e){
			mouseLeave(this);
		}
		counties[i].onclick = function () {
			onClick(this) 
		}
	}
}

function setupSingleStateSVG(SVG) {
	var counties = SVG.getElementsByClassName("county");
	for(var i = 0; i < counties.length; i++){
		counties[i].onmouseenter = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y ));
		}
		counties[i].onmousemove = function(e){
			var x = e.clientX;
			var y = e.clientY;
			mouseMove(this, (x), (y));
		}
		counties[i].onmouseleave = function(e){
			mouseLeave(this);
		}
		counties[i].onclick = function () {
		
		}
	}
}

function allStatesSVGLoad(){
	var request = new XMLHttpRequest;
	var url = "images/allStates.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			allStatesSVG.innerHTML = request.responseText;
			setupSVG(allStatesSVG.getElementsByTagName("svg")[0]);
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "text/xml");
	request.setRequestHeader("Accept", "text/xml");
	request.send();
}

function allCountiesSVGLoad(){
	var request = new XMLHttpRequest;
	var url = "images/counties.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var parser = new DOMParser();
			var countiesDoc = parser.parseFromString(request.responseText, "application/xml");
			var counties = countiesDoc.getElementsByClassName("county");
			for (var c = 0; c < counties.length; c++){
				countyImport = document.importNode(counties[c], true);
				document.getElementById(counties[c].parentNode.id).appendChild(countyImport);
			}
			document.getElementById("countiesSetupButton").parentNode.removeChild(document.getElementById("countiesSetupButton"));
			showStates();
			setupSVG(allStatesSVG.getElementsByTagName("svg")[0]);
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "text/xml");
	request.setRequestHeader("Accept", "text/xml");
	request.send();
}

function singleStateSVGLoad(state){
	var request = new XMLHttpRequest;
	var url = "images/states/" + state.parentNode.id + ".svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			leftView.innerHTML = request.responseText;
			resizeSVG(leftView.getElementsByTagName('svg')[0], leftView);
			setupSingleStateSVG(leftView.getElementsByTagName('svg')[0]);
			if (currentYear){
				ajaxRequest('countyWinnersByStateForYear', currentYear, state.parentNode.id, 0, 0, colorAllCountiesInStateView);
				ajaxRequest('stateResultsByCanidate', currentYear, state.parentNode.id, 0, 0, setCanidates);
				ajaxRequest('getFIPSName', 0, 0,  state.id, 0, setStateViewHeader);
			}
			showStateView();
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
	var states = allStatesSVG.getElementsByClassName("state");
	var counties = allStatesSVG.getElementsByClassName("county");
	showHideButton.innerHTML = "Show Counties";
	showHideButton.onclick = function () { showCounties() };
	document.getElementById("2000Results").onclick = function () { setupAllStatesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllStatesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllStatesView("2008") };
	document.getElementById("2012Results").onclick = function () { setupAllStatesView("2012") };
	
	for(var i = 0; i < states.length; i++){
		states[i].style.visibility = "visible";
	}
	
	if (counties){
		for(var i = 0; i < counties.length; i++){
			counties[i].style.visibility = "hidden";
		}
	}
	
	if (currentYear){
		
	}
}

function showCounties(){
	var states = allStatesSVG.getElementsByClassName("state");
	var counties =  allStatesSVG.getElementsByClassName("county");
	showHideButton.innerHTML = "Show States";
	showHideButton.onclick = function () { showStates() };
	document.getElementById("2000Results").onclick = function () { setupAllCountiesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllCountiesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllCountiesView("2008") };
	document.getElementById("2012Results").onclick = function () { setupAllCountiesView("2012") };

	for(var i = 0; i < states.length; i++){
		states[i].style.visibility = "hidden";
	}
	
	if (counties){
		for(var i = 0; i < counties.length; i++){
			counties[i].style.visibility = "visible";
			counties[i].style.fill = "grey";
		}
	}
	
	if (currentYear){
		for(var i = 0; i < states.length; i++){
			ajaxRequest('countyWinnersByStateForYear', currentYear, states.item(i).parentNode.id, 0, 0, colorAllCountiesByState);
		}
	}
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
	currentYear = year;
	if (leftView.hasChildNodes()) {
		var state = leftView.getElementsByTagName('svg')[0].getElementsByClassName('state');
		var counties = leftView.getElementsByTagName('svg')[0].getElementsByClassName('county');
		for(var i = 0; i < counties.length; i++){
			ajaxRequest('countyWinner', year, counties.item(i).parentNode.id, counties.item(i).id, 0, colorStateViewCounty);
		}
		ajaxRequest('stateResultsByCanidate', year, state[0].parentNode.id, 0, 0, setCanidates);
		ajaxRequest('getFIPSName', 0, 0,  state[0].id, 0, setStateViewHeader);
	}else {
		setHeading(year);
		ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	}
	var states = allStatesSVG.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('FECResultsStateWinnerForYear', year, states.item(i).parentNode.id, 0, 0, colorState);
	}	
}

function setupAllCountiesView(year){
	currentYear = year;
	if (leftView.hasChildNodes()){
		var state = leftView.getElementsByTagName('svg')[0].getElementsByClassName('state');
		var counties = leftView.getElementsByTagName('svg')[0].getElementsByClassName('county');
		for(var i = 0; i < counties.length; i++){
			ajaxRequest('countyWinner', year, counties.item(i).parentNode.id, counties.item(i).id, 0, colorStateViewCounty);
		}	
		ajaxRequest('stateResultsByCanidate', year, state[0].parentNode.id, 0, 0, setCanidates);
		ajaxRequest('getFIPSName', 0, 0,  state[0].id, 0, setStateViewHeader);
	}else {
		setHeading(year);
		ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	}
	
	var counties = allStatesSVG.getElementsByClassName('state');
	for(var i = 0; i < counties.length; i++){
		ajaxRequest('countyWinnersByStateForYear', year, counties.item(i).parentNode.id, 0, 0, colorAllCountiesByState);
	}
	
	var states = allStatesSVG.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('FECResultsStateWinnerForYear', year, states.item(i).parentNode.id, 0, 0, colorState);
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
	var stateNode = allStatesSVG.getElementsByTagName("svg")[0].getElementById(request['state']).getElementsByClassName('state')[0];
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

function colorCounty(SVGObject, winner){
	switch (winner) {
	case "DEM":
		SVGObject.style.fill = "blue";
		break;
	case "REP":
		SVGObject.style.fill = "red";
		break;
	default:
		SVGObject.style.fill = "grey";
	}
}

function colorAllCountiesByState(request, results){
	for(var key in results){
		var countyNode = allStatesSVG.getElementsByTagName("svg")[0].getElementById(key);
		switch (results[key]) {
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
}

function colorStateViewCounty(request, results){
	var countyNode = leftView.getElementsByTagName("svg")[0].getElementById(request['FIPS']);
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
	toolTip.style.top = (y + 15) + "px";
	toolTip.style.left = (x) + "px";
}

function mouseLeave(mapObject){
	toolTip.style.display = "none";
}

function mouseMove(mapObject, x, y){
	toolTip.style.top = (y + 15) + "px";
	toolTip.style.left = (x) + "px";
}

function setToolTip(request, response){
	toolTip.innerHTML = response["NAME"];
}

function onClick(target){
	singleStateSVGLoad(target);
	mouseLeave(target);
}

function showResultsWindow(){
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

function showStateView() {
	stateView.style.visibility = "visible";
}

function hideStateView() {
	setHeading(currentYear);
	ajaxRequest('FECResultsByCanidate', currentYear, 0, 0, 0, setCanidates);
	stateView.style.visibility = "hidden"
	while(leftView.firstChild){
		leftView.removeChild(leftView.firstChild);
	}
}

function resizeSVG(SVG, window) {
	var SVGHeight = SVG.getAttribute("height");
	var SVGWidth = SVG.getAttribute("width");
	var windowHeight = window.clientHeight;
	var windowWidth = window.clientWidth;
	var widthRatio = (windowWidth / SVGWidth).toFixed(2);
	var heightRatio = (windowHeight / SVGHeight).toFixed(2);
	var newHeight;
	var newWidth;
	SVG.setAttribute("width", windowWidth);
	SVG.setAttribute("height", windowHeight);
}

function colorAllCountiesInStateView(request, results) {
	for(key in results){
		colorCounty(leftView.getElementsByTagName('svg')[0].getElementById(key), results[key]);
	}
}

function setStateViewHeader(request, response) {
	console.log(response)
	heading.textContent = currentYear + " " + response['NAME'] +" General Presidential Elections";
}