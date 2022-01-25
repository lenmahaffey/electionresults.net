/* Copyright © 2021 TLA Designs, LLC. All rights reserved. */
function setHeading(year) {
	$("#heading").text(year + " General Presidential Elections")
}
function setupButtons() {
	$("#2000Results").click(function (e) {
		year = 2000;
		setHeading(year);
	})

	$("#2004Results").click(function (e) {
		year = 2004;
		setHeading(year);
	})

	$("#2008Results").click(function (e) {
		year = 2008;
		setHeading(year);
	})

	$("#2012Results").click(function (e) {
		year = 2012;
		setHeading(year);
	})

	$("#2016Results").click(function (e) {
		year = 2016;
		setHeading(year);
	})

	$("#resultsButton").click(function () {
		$("#resultsWindow").toggle()
	})

	$("#countiesButton").click(function () {
		console.log("click")
		$(".state").toggle()
		$(".county").toggle()
	})
}

function setupMaps() {
	$.get("assets/img/maps/states.svg", function (data, status) {
		$("#allStatesSVG").html(data.children)

		$(".state").mouseenter(function (e) {
			var x = e.clientX;
			var y = e.clientY;
			setToolTipPosition(x, y)
			$("#toolTip").toggle()
			$("#toolTip").text("ToolTip")

		})

		$(".state").mousemove(function (e) {
			var x = e.clientX;
			var y = e.clientY;
			setToolTipPosition(x, y)

		})

		$(".state").mouseleave(function (e) {
			$("#toolTip").toggle()
		})

		$(".state").click(function (e) {

		})
	})

	$.get("assets/img/maps/counties.svg", function (data, status) {
		addCountiesToSVG(data)
		$(".county").toggle()
		$(".county").mouseenter(function (e) {
			var x = e.clientX;
			var y = e.clientY;
			setToolTipPosition(x, y)
			$("#toolTip").toggle()
		})

		$(".county").mousemove(function (e) {
			var x = e.clientX;
			var y = e.clientY;
			setToolTipPosition(x, y)
		})

		$(".county").mouseleave(function (e) {
			$("#toolTip").toggle()
		})

		$(".county").click(function (e) {

		})
	})
}

function addCountiesToSVG(nodesToAdd) {
	var states = $(".state")
	for (var i = 0; i < states.length; i++) {
		var stateNode = $("#" + states[i].id).parent()
		var countyNodes = nodesToAdd.getElementById(stateNode[0].id).children
		for (var j = 0; j < countyNodes.length; j++) {
			var newNode = countyNodes[j].cloneNode(true)
			stateNode.append(newNode)
        }
    }
}

function setToolTipPosition(x, y) {
	toolTip.style.top = (y - 20) + "px";
	toolTip.style.left = (x + 15) + "px";
}

var currentYear;
var lastCountyClicked;

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

function onClick(target){
	singleStateSVGLoad(target);
	mouseLeave(target);
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