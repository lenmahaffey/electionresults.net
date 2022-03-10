/* Copyright © 2021 TLA Designs, LLC. All rights reserved. */
var currentYear;
var countiesVisible = false;
function setHeading(year) {
	$("#heading").text(year + " General Presidential Elections")
}

function setupButtons() {
	var years = [2000, 2004, 2008, 2012, 2016]
	years.forEach(function (year) {
		var buttonName = "#" + year + "Results"
		$(buttonName).click(function (e) {
			currentYear = year;
			setHeading(currentYear);
			getResults()
		})
	})

	$("#resultsButton").click(function () {
		$("#resultsWindow").toggle()
		if ($("#resultsWindow:visible").length > 0) {
			$("#resultsButton").text("Hide Totals")
		} else {
			$("#resultsButton").text("Show Totals")
        }
	})

	$("#countiesButton").click(function () {
		this.textContent = (this.textContent == "Show States") ? "Show Counties" : "Show States"
		toggleMap()
	})
	
	$("#modalCloseButton").click(function () {
		$(".modal").toggle()
	})
}

function setupMaps() {
	$.get("assets/img/maps/states.svg", function (data, status) {
		$("#allStatesSVG").html(data.children)

		$(".state").mouseenter(function (e) {
			var x = e.clientX
			var y = e.clientY
			var target = e.currentTarget.id
			setToolTipPosition(x, y)
			setToolTipValue(target);
			$("#toolTip").toggle()
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
			state = e.target.parentNode.parentNode.id
			getSingleStateMap(state)
			$(".modal").toggle()
		})
	})

	$.get("assets/img/maps/counties.svg", function (data, status) {
		addCountiesToSVG(data)
		$(".county").toggle()
		$(".county").mouseenter(function (e) {
			var x = e.clientX
			var y = e.clientY
			var target = e.currentTarget.id
			setToolTipPosition(x, y)
			setToolTipValue(target);
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

function setToolTipValue(target) {
	$.post("assets/scripts/php/ajaxResponse.php", { action: "getFIPS", FIPS: target }, function (result) {
		var data = JSON.parse(result)
		$("#toolTip").text(data[0]["NAME"])
	})
}

function setCandidateResults(data) {
	//Clear previous data
	$("#column1").html("")
	$("#column2").html("")
	for (var i = 0; i < data.length; i++) {
		//get needed values, use an empty string for nulls
		var pFirst = (data[i]["PFIRST"] == null) ? "" : data[i]["PFIRST"] + " "
		var pMid = (data[i]["PMID"] == null) ? "" : data[i]["PMID"] + " "
		var pLast = (data[i]["PLAST"] == null) ? "" : data[i]["PLAST"]
		var party = (data[i]["PARTY"] == null) ? "" : data[i]["PARTY"]
		var votes = (data[i]["VOTES"] == null) ? "" : data[i]["VOTES"]

		//Look for major party candidates and set the heading with them
		if (party == "Democratic Party") {
			$("#DEM_candidate").text(pFirst + pMid + pLast)
			$("#DEM_vote").text(votes.toLocaleString())
		}
		if (party == "Republican Party") {
			$("#REP_candidate").text(pFirst + pMid + pLast)
			$("#REP_vote").text(votes.toLocaleString())
		}

		//Create new canidateRow
		var newElement = document.createElement("div")
		newElement.classList.add("row")

		var CandidateName = document.createElement("div")
		CandidateName.classList.add("CandidateName", "col-4")
		CandidateName.innerText = pFirst + pMid + pLast

		var CandidateParty = document.createElement("div")
		CandidateParty.classList.add("CandidateParty", "col-6", "text-center")
		CandidateParty.innerText = party

		var CandidateVotes = document.createElement("div")
		CandidateVotes.classList.add("CandidateVotes", "col-2", "text-end")
		CandidateVotes.innerText = votes.toLocaleString()

		newElement.appendChild(CandidateName)
		newElement.appendChild(CandidateParty)
		newElement.appendChild(CandidateVotes)

		//Append half the elements to column1 and the other half to column2
		if (i < (data.length / 2)) {
			document.getElementById("column1").appendChild(newElement)
		} else {
			document.getElementById("column2").appendChild(newElement)
        }
    }
}

function setColor(data) {
	if (data['PARTY'] == "Democratic Party") {
		$("#" + data['FIPS_ID']).css({fill: 'blue'})
	}
	if (data['PARTY'] == "Republican Party") {
		$("#" + data['FIPS_ID']).css({ fill: 'red' })
    }
}

function getSingleStateMap(state) {
	url = "assets/img/maps/states/" + state + ".svg"
	$.get(url, function (data, status) {
		$("#stateMap").html(data.children)
		var counties = $("#stateMap").find(".county")
		counties.each(function () {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleCountyWinner", year: currentYear, FIPS: $(this).attr('id') }, function (result) {
				result = JSON.parse(result)
				setColor(result[0])
			})
		})
	})
}

function toggleMap() {
	$(".state").toggle()
	$(".county").toggle()
	if ($(".county:visible").length > 0) {
		countiesVisible = true
	} else {
		countiesVisible = false
    }
	getResults()
}

function getResults() {
	if (countiesVisible == true) {
		$(".state").each(function () {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleStateAllCountyWinners", year: currentYear, FIPS: this.id }, function (result) {
				if (result != "null") {
					result = JSON.parse(result)
					result.forEach(element => setColor(element))
				}
			})
		})
	} else {
		$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllStateWinners", YEAR: currentYear }, function (result) {
			result = JSON.parse(result)
			result.forEach(function (result) {
				setColor(result)
			})
		})
		$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllCandidateTotals", YEAR: currentYear }, function (result) {
			result = JSON.parse(result)
			setCandidateResults(result)
		})
	}
}
//**********************************************************//
//**********************************************************//
//**********************************************************//
//**********************************************************//
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
				ajaxRequest('stateResultsByCandidate', currentYear, state.parentNode.id, 0, 0, setCandidates);
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
	DEM_Candidate.textContent = "";
	DEM_vote.textContent = "";
	REP_Candidate.textContent = "";
	REP_vote.textContent = "";
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
		ajaxRequest('stateResultsByCandidate', year, state[0].parentNode.id, 0, 0, setCandidates);
		ajaxRequest('getFIPSName', 0, 0,  state[0].id, 0, setStateViewHeader);
	} else {
		ajaxRequest('FECResultsByCandidate', year, 0, 0, 0, setCandidates);
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
		ajaxRequest('FECResultsByCandidate', currentYear, 0, 0, 0, setCandidates);
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
		var Candidate = resultsArray[i];
		var CandidateVotes = response[Candidate];
		var newCandidateDiv = document.createElement("div");
		var newCandidateNameElement = document.createElement("div");
		var newCandidateVotesElement = document.createElement("div");
		newCandidateDiv.id = Candidate + "StateView";
		newCandidateDiv.className = "stateCandidateResult";
		newCandidateNameElement.className = "stateCandidateName";
		newCandidateVotesElement.className = "stateVotes";
		newCandidateNameElement.textContent = Candidate;
		newCandidateVotesElement.textContent = CandidateVotes;
		newCandidateDiv.appendChild(newCandidateNameElement);
		newCandidateDiv.appendChild(newCandidateVotesElement);
		columnA.appendChild(newCandidateDiv);
		ajaxRequest('getCandidate', currentYear, 0, 0, Candidate, setStateViewCandidateName);
	}
}

function setStateViewCandidateName(request, response) {
	var CandidateNameElement = document.getElementById(request['can']  + "StateView").getElementsByClassName("stateCandidateName")[0];
	CandidateNameElement.textContent = response["PFIRST"] + " " + response["PLAST"];
}

function setCountyName(request, response){
	if(request['state'] == "LA"){
		countyName.innerHTML = response["NAME"] + " Parish"
	}else{
		countyName.innerHTML = response["NAME"] + " County"
	}
}