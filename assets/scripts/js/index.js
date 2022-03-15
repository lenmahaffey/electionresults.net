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

function removeColor() {
	$("g").css({ fill: 'grey' })
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
		removeColor()
		$(".state").each(function () {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleStateAllCountyWinners", year: currentYear, FIPS: this.id }, function (result) {
				if (result != "null") {
					result = JSON.parse(result)
					result.forEach(element => setColor(element))
				}
			})
		})
		//$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_AllStatesAllCountyWinners", year: currentYear }, function (result) {
		//	result = JSON.parse(result)
		//	result.forEach(function (result) {
		//		setColor(result)
		//	})
		//})
	} else {
		$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllStateWinners", YEAR: currentYear }, function (result) {
			result = JSON.parse(result)
			result.forEach(function (result) {
				setColor(result)
			})
		})
	}
	$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllCandidateTotals", YEAR: currentYear }, function (result) {
		result = JSON.parse(result)
		setCandidateResults(result)
	})
}