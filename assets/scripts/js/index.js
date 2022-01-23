/* Copyright © 2019 TLA Designs, LLC. All rights reserved. */
var currentYear;
var lastCountyClicked;
var statesArray = {
		Alabama:"AL",
		Alaska:"AK",
		Arizona:"AZ",
		Arkansas:"AR",
		California:"CA",
		Colorado:"CO",
		Connecticut:"CT",
		Delaware:"DE",
		Florida:"FL",
		Georgia :"GA",
		Hawaii:"HI",
		Iowa:"IA",
		Idaho:"ID",
		Illinois:"IL",
		Indiana:"IN",
		Kansas:"KS",
		Kentucky:"KY",
		Louisiana:"LA",
		Massachusetts:"MA",
		Maryland:"MD",
		Maine:"ME",
		Michigan:"MI",
		Minnesota:"MN",
		Missouri:"MO",
		Mississippi:"MS",
		Montana:"MT",
		'North Carolina':"NC",
		'North Dakota':"ND",
		Nebraska:"NE",
		'New Hampshire':"NH",
		'New Jersey':"NJ",
		'New Mexico':"NM",
		Nevada:"NV",
		'New York':"NY",
		Ohio:"OH",
		Oklahoma:"OK",
		Oregon:"OR",
		Pennsylvania:"PA",
		'Rhode Island':"RI",
		'South Carolina':"SC",
		'South Dakota':"SD",
		Tennessee:"TN",
		Texas:"TX",
		Utah:"UT",
		Vermont:"VT",
		Virginia:"VA",
		Washington:"WA",
		Wisconsin:"WI",
		'West Virginia':"WV",
		Wyoming:"WY"};

function ajaxRequest(action, year, state, FIPS, can, callback){
	var request = new XMLHttpRequest;
	var url = "assets/scripts/php/ajaxResponse.php";
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
	var states = SVG.querySelectorAll('.state')
	var counties = SVG.querySelectorAll('.county')
	for(var i = 0; i < states.length; i++){
		states[i].onmouseenter = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y));
		}
		states[i].onmousemove = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseMove((x), (y));
		}
		states[i].onmouseleave = function(e){
			e = e || window.event;
			mouseLeave(this);
		}
		states[i].onclick = function () {
			onClick(this)
		}
	}
	for(var i = 0; i < counties.length; i++){
		counties[i].onmouseenter = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y ));
		}
		counties[i].onmousemove = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseMove((x), (y));
		}
		counties[i].onmouseleave = function(e){
			e = e || window.event;
			mouseLeave(this);
		}
		counties[i].onclick = function () {
			onClick(this)
		}
	}
}

function setupSingleStateSVG(SVG) {
	var counties = SVG.querySelectorAll('.county')
	for(var i = 0; i < counties.length; i++){
		counties[i].onmouseenter = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseEnter(this, (x), (y ));
		}
		counties[i].onmousemove = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseMove((x), (y));
		}
		counties[i].onmouseleave = function(e){
			e = e || window.event;
			mouseLeave(this);
		}
		counties[i].onclick = function () {
			onClickSingleState(this);
		}
	}
}

function allStatesSVGLoad(){
	var request = new XMLHttpRequest;
	var url = "assets/img/maps/states.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
			allStatesView.innerHTML = request.responseText;
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
	document.getElementById("countiesSetupButton").parentNode.removeChild(document.getElementById("countiesSetupButton"));
	var request = new XMLHttpRequest;
	var url = "assets/img/counties.svg";
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if(request.readyState == 2) {

		}
		if(request.readyState == 4 && request.status == 200) {
			var parser = new DOMParser();
			var countiesDoc = parser.parseFromString(request.responseText, "application/xml");
			var counties = countiesDoc.querySelectorAll('.county')
			for (var c = 0; c < counties.length; c++){
				countyImport = document.importNode(counties[c], true);
				document.getElementById(counties[c].parentNode.id).appendChild(countyImport);
			}
			message.innerHTML = "";
			document.getElementById("showHideButton").style.visibility = "visible";
			showStates();
			setupSVG(allStatesSVG);
		}
		if(request.readyState == 4 && request.status == 500) {
			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "text/xml");
	request.setRequestHeader("Accept", "text/xml");
	request.send();
	message.innerHTML = "Please wait";
}

function singleStateSVGLoad(state){
	var request = new XMLHttpRequest;
	var url = "assets/img/maps/states/" + state.parentNode.id + ".svg";
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
	var states = allStatesSVG.querySelectorAll('.state')
	var counties = allStatesSVG.querySelectorAll('.county')
	showHideButton.innerHTML = "Show Counties";
	showHideButton.onclick = function () { showCounties() };
	document.getElementById("2000Results").onclick = function () { setupAllStatesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllStatesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllStatesView("2008") };
    document.getElementById("2012Results").onclick = function () { setupAllStatesView("2012") };
    document.getElementById("2016Results").onclick = function () { setupAllStatesView("2016") };

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
	var states = allStatesSVG.querySelectorAll('.state')
	var counties =  allStatesSVG.querySelectorAll('.county')
	showHideButton.innerHTML = "Show States";
	showHideButton.onclick = function () { showStates() };
	document.getElementById("2000Results").onclick = function () { setupAllCountiesView("2000") };
	document.getElementById("2004Results").onclick = function () { setupAllCountiesView("2004") };
	document.getElementById("2008Results").onclick = function () { setupAllCountiesView("2008") };
    document.getElementById("2012Results").onclick = function () { setupAllCountiesView("2012") };
    document.getElementById("2016Results").onclick = function () { setupAllCountiesView("2016") };

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
		var states = allStatesSVG.querySelectorAll('.state');
		var statesList = new Array();
		for(var i = 0; i < states.length; i++){
			statesList[i] = states.item(i).parentNode.id;
		}
		ajaxRequest('FECResultsByCanidate', currentYear, 0, 0, 0, setCanidates);
		ajaxRequest('allCountyWinnersByStateForYear', currentYear, statesList, 0, 0, colorAllCounties);
		ajaxRequest('FECResultsAllStateWinnersForYear', currentYear, statesList, 0, 0, colorAllStates);
	}
}

function setHeading(year){
	heading.textContent = year + " General Presidential Elections";
}

function resetHeading(){
	heading.textContent = "Select a Year";
	DEM_canidate.textContent = "";
	DEM_vote.textContent = "";
	REP_canidate.textContent = "";
	REP_vote.textContent = "";
}

function setupAllStatesView(year){
	currentYear = year;
	setHeading(year);
	var states = allStatesSVG.querySelectorAll('.state');
	var statesList = new Array();
	for(var i = 0; i < states.length; i++){
		statesList[i] = states.item(i).parentNode.id;
	}
	ajaxRequest('FECResultsAllStateWinnersForYear', year, statesList, 0, 0, colorAllStates);
	if (leftView.hasChildNodes()) {
		var state = leftView.getElementsByTagName('svg')[0].querySelectorAll('.state');
		var counties = leftView.getElementsByTagName('svg')[0].querySelectorAll('.county');
		for(var i = 0; i < counties.length; i++){
			ajaxRequest('countyWinner', year, counties.item(i).parentNode.id, counties.item(i).id, 0, colorStateViewCounty);
		}
		if(lastCountyClicked) {
			ajaxRequest('countyResults', year, state[0].parentNode.id, lastCountyClicked.id, 0, setCountyResults);
		}
		ajaxRequest('stateResultsByCanidate', year, state[0].parentNode.id, 0, 0, setCanidates);
		ajaxRequest('getFIPSName', 0, 0,  state[0].id, 0, setStateViewHeader);
	} else {
		ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	}
}

function setupAllCountiesView(year){
	currentYear = year;
	setHeading(year);
	var states = allStatesSVG.querySelectorAll('.state');
	var statesList = new Array();
	for(var i = 0; i < states.length; i++){
		statesList[i] = states.item(i).parentNode.id;
	}
	ajaxRequest('allCountyWinnersByStateForYear', year, statesList, 0, 0, colorAllCounties);
	ajaxRequest('FECResultsAllStateWinnersForYear', year, statesList, 0, 0, colorAllStates);
	if (leftView.hasChildNodes()){
		var state = leftView.getElementsByTagName('svg')[0].querySelectorAll('.state');
		var counties = leftView.getElementsByTagName('svg')[0].querySelectorAll('.county');
		for(var i = 0; i < counties.length; i++){
			ajaxRequest('countyWinner', year, counties.item(i).parentNode.id, counties.item(i).id, 0, colorStateViewCounty);
		}
		if(lastCountyClicked) {
			ajaxRequest('countyResults', year, state[0].parentNode.id, lastCountyClicked.id, 0, setCountyResults);
		}
		ajaxRequest('stateResultsByCanidate', year, state[0].parentNode.id, 0, 0, setCanidates);
		ajaxRequest('getFIPSName', 0, 0,  state[0].id, 0, setStateViewHeader);
	} else {
		ajaxRequest('FECResultsByCanidate', year, 0, 0, 0, setCanidates);
	}
}

function setCanidates(request, result) {
	setResultsWindow(request, result);
}

function setResultsWindow(request, results){
	var canidatesArray = new Array();
	var partiesArray = new Array();
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
		newCanidatePartyElement.className = "PARTY_NAME";
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
		canidatesArray[i] = canidate;
		partiesArray[i] = canidate;
	}
	ajaxRequest('getAllCanidates', request['year'], 0, 0, canidatesArray, setAllCanidateNames);
	ajaxRequest('getAllParties', request['year'], 0, 0, partiesArray, setAllPartyNames);
}

function setCanidateName (request, result) {
	var canidateNameElement = document.getElementById(request['can']).getElementsByClassName("canidateName")[0];
	canidateNameElement.textContent = result["PFIRST"] + " " + result["PLAST"];
	setHeadingCanidates();
}

function setAllCanidateNames (request, result) {
	var resultsArray = request['can'];
	for (var i = 0; i < resultsArray.length; i++){
		var canidateNameElement = document.getElementById(resultsArray[i]).getElementsByClassName("canidateName")[0];
		canidateNameElement.textContent = result[resultsArray[i]].PFIRST + " " + result[resultsArray[i]].PLAST;
	}
	setHeadingCanidates();
}

function setPartyName (request, result) {
	var canidatePartyNameElement = document.getElementById(request['can']).getElementsByClassName("PARTY_NAME")[0];
	canidatePartyNameElement.textContent = result['PARTY_NAME'];
}

function setAllPartyNames (request, result) {
	var resultsArray = request['can'];
	for (var i = 0; i < resultsArray.length; i++){
		var canidatePartyNameElement = document.getElementById(resultsArray[i]).getElementsByClassName("PARTY_NAME")[0];
		canidatePartyNameElement.textContent = result[resultsArray[i]].PARTY_NAME;
	}
}

function setHeadingCanidates(){
	REP_vote.textContent = document.getElementById('REP').getElementsByClassName("votes")[0].textContent;
	DEM_vote.textContent = document.getElementById('DEM').getElementsByClassName("votes")[0].textContent;
	REP_canidate.textContent = document.getElementById('REP').getElementsByClassName("canidateName")[0].textContent;
	DEM_canidate.textContent = document.getElementById('DEM').getElementsByClassName("canidateName")[0].textContent;
}


function colorState(request, results){
	var stateNode = allStatesSVG.getElementById(request['state']).querySelectorAll('.state')[0];
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

function colorAllStates(request, results){
	for(var i = 0; i < results.length; i++){
		var stateArray = results[i];
		for (var state in stateArray){
			var stateNode = allStatesSVG.getElementById(state).querySelectorAll('.state')[0];
			switch (stateArray[state]) {
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

function colorAllCounties(request, results){
	for(var i = 0; i < results.length; i++){
		var stateArray = results[i];
		for (var state in stateArray){
			var countyNode = allStatesSVG.getElementById(state);
			if(countyNode){
				switch (stateArray[state]) {
					case "DEM":
						countyNode.style.fill = "blue";
						break;
					case "REP":
						countyNode.style.fill = "red";
						break;
					default:
						countyNode.style.fill = "grey";
						break;
				}
			}
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

function mouseEnterTable(can, x, y){
	mouseOver(mapObject, x, y);
	ajaxRequest('getCanidate', 0, 0, mapObject.id, 0, setToolTip)
	toolTip.style.display = "block";
}

function mouseOver(mapObject, x, y){
	toolTip.style.top = (y + 15) + "px";
	toolTip.style.left = (x) + "px";
}

function mouseLeave(mapObject){
	toolTip.style.display = "none";
}

function mouseMove(x, y){
	toolTip.style.top = (y + 15) + "px";
	toolTip.style.left = (x) + "px";
}

function setToolTip(request, response){
	if (response == null){
		toolTip.textContent = "unknown";
	}else toolTip.textContent = response["NAME"];
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
	allStatesSVG.style.pointerEvents = "none";
	stateView.style.visibility = "visible";
	stateView.style.pointerEvents = "auto";
}

function hideStateView() {
	if (currentYear){
		setHeading(currentYear);
		ajaxRequest('FECResultsByCanidate', currentYear, 0, 0, 0, setCanidates);
	}else {
		resetHeading();
	}
	stateView.style.visibility = "hidden"
	allStatesSVG.style.pointerEvents = "auto";
	while(leftView.firstChild){
		leftView.removeChild(leftView.firstChild);
	}
	while(columnA.firstChild){
		columnA.removeChild(columnA.firstChild);
	}
	countyName.innerHTML = "Click a county";
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
	heading.textContent = currentYear + " " + response['NAME'] +" General Presidential Elections";
}

function onClickSingleState(mapObject){
	lastCountyClicked = mapObject;
	if(currentYear){
		ajaxRequest('countyResults', currentYear, mapObject.parentNode.id, mapObject.id, 0, setCountyResults)
		ajaxRequest("getFIPSName", 0, mapObject.parentNode.id, mapObject.id, 0, setCountyName);
	}else{
		countyName.innerHTML = "Select a year then click a county"
	}
}

function setCountyResults(request, response){
	var resultsArray = Object.keys(response);
	while(columnA.firstChild){
		columnA.removeChild(columnA.firstChild);
	}
	for(var i = 0; i < resultsArray.length; i++){
		var canidate = resultsArray[i];
		var canidateVotes = response[canidate];
		var newCanidateDiv = document.createElement("div");
		var newCanidateNameElement = document.createElement("div");
		var newCanidateVotesElement = document.createElement("div");
		newCanidateDiv.id = canidate + "StateView";
		newCanidateDiv.className = "stateCanidateResult";
		newCanidateNameElement.className = "stateCanidateName";
		newCanidateVotesElement.className = "stateVotes";
		newCanidateNameElement.textContent = canidate;
		newCanidateVotesElement.textContent = canidateVotes;
		newCanidateDiv.appendChild(newCanidateNameElement);
		newCanidateDiv.appendChild(newCanidateVotesElement);
		columnA.appendChild(newCanidateDiv);
		ajaxRequest('getCanidate', currentYear, 0, 0, canidate, setStateViewCanidateName);
	}
}

function setStateViewCanidateName(request, response) {
	var canidateNameElement = document.getElementById(request['can']  + "StateView").getElementsByClassName("stateCanidateName")[0];
	canidateNameElement.textContent = response["PFIRST"] + " " + response["PLAST"];
}

function setCountyName(request, response){
	if(request['state'] == "LA"){
		countyName.innerHTML = response["NAME"] + " Parish"
	}else{
		countyName.innerHTML = response["NAME"] + " County"
	}
}

function setTable(request, response) {
	var tableDiv = document.createElement('div');
	tableDiv.id = "tableDiv";
	var table = document.createElement('table');
	table.id = "resultsTable";
	var headingRow = document.createElement('tr');
	headingRow.id = 'headingRow';
	var stateRow = document.createElement('tr');
	stateRow.id = 'stateRow';
	var FECRow = document.createElement('tr');
	FECRow.id = 'FECRow';
	for (var i = 0; i < Object.keys(response).length; i++){
		var newHeading = document.createElement('th');
		newHeading.innerHTML = Object.keys(response)[i];
		newHeading.setAttribute('class', Object.keys(response)[i]);
		newHeading.onmouseenter = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseEnterTable(this, (x), (y));
		}
		newHeading.onmousemove = function(e){
			e = e || window.event;
			var x = e.clientX;
			var y = e.clientY;
			mouseMove((x), (y));
		}
		newHeading.onmouseleave = function(e){
			e = e || window.event;
			mouseLeaveTable(this);
		}
		var newStateResult = document.createElement('td');
		newStateResult.setAttribute('class', Object.keys(response)[i]);
		newStateResult.innerHTML = response[Object.keys(response)[i]].stateResults
		var newFECResult = document.createElement('td');
		newFECResult.setAttribute('class', Object.keys(response)[i]);
		newFECResult.innerHTML = response[Object.keys(response)[i]].FECResults
		if (newFECResult.textContent != newStateResult.textContent){
			newFECResult.style.background = "red";
			newStateResult.style.background = "red";
		}else {
			//newFECResult.style.background = "green";
			//newStateResult.style.background = "green";
		}
		headingRow.appendChild(newHeading);
		stateRow.appendChild(newStateResult);
		FECRow.appendChild(newFECResult);

	}
	table.appendChild(headingRow);
	table.appendChild(stateRow);
	table.appendChild(FECRow);
	tableDiv.appendChild(table);
	document.body.appendChild(tableDiv);
	for (var i = 0; i < headingRow.children.length; i++){
		ajaxRequest('getCanidate', request['year'], 0, 0, headingRow.children[i].textContent, setTableCanidateName);
	}
}

function setTableCanidateName(reqeust, response){
	document.getElementsByClassName(response['PARTY'])[0].textContent = response['PLAST'];
}

function mouseEnterTable(can, x, y){
	mouseOverTable(x, y);
	var page = getPageName();
	ajaxRequest('getCanidate', page.year, 0, 0, can.className, setTableToolTip)
	toolTip.style.display = "block";
}

function setTableToolTip(request, response){
	toolTip.textContent = response["PFIRST"] + " " + response["PLAST"];
}
function mouseOverTable(x, y){
	toolTip.style.top = (y + 15) + "px";
	toolTip.style.left = (x) + "px";
}

function mouseLeaveTable(){
	toolTip.style.display = "none";
}

function getPageName() {
	var title = document.title.split(" ");
	var year = title[0];
	if (title[1] == "West"){
		var state = title[1] + ' ' + title[2];
		state = statesArray[state];
	} else var state = statesArray[title[1]];
	var pageData = new Object;
	pageData.state = state;
	pageData.year = year;
	return pageData;
}