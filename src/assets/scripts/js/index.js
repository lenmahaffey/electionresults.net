/* Copyright © 2021 TLA Designs, LLC. All rights reserved. */
var currentYear;
var lastCountyClicked;
var countiesVisible = false;

//formatter to format integers with commas
var formatter = new Intl.NumberFormat('en-US');

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
			if ($(".myModal").is(":visible")) {
				getResultsForModal()
            }
		})
	})

	$("#resultsButton").click(function () {
		$(".resultsContainer").is(":visible") ? $(".resultsContainer").hide() : $(".resultsContainer").show() 
		$(".resultsContainer").is(":visible") ? $("#resultsButton").text("Hide Totals") : $("#resultsButton").text("Show Totals")
	})

	$("#countiesButton").click(function () {
		this.textContent = (this.textContent == "Show States") ? "Show Counties" : "Show States"
		toggleMap()
	})
	
	$("#modalCloseButton").click(function () {
		clearModalCountyTotals()
		lastCountyClicked = ""
		$(".myModal").toggle()
	})
}

function setupMaps() {
	$.get("assets/img/maps/states.svg", function (data, status) {
		$("#mapContainer > svg").html(data.children[0].children)

		$("#mapContainer > svg > g >.state").mouseenter(function (e) {
			var element = $(this)
			var x = e.clientX
			var y = e.clientY
			var target = e.currentTarget.id
			setToolTipPosition(x, y)
			setToolTipValue(target);
			$("#toolTip").toggle()
		})

		$("#mapContainer > svg > g >.state").mousemove(function (e) {
			var x = e.clientX
			var y = e.clientY
			setToolTipPosition(x, y)

		})

		$("#mapContainer > svg > g >.state").mouseleave(function (e) {
			$("#toolTip").toggle()
		})

		$("#mapContainer > svg > g >.state").click(function (e) {
			state = e.target.parentNode.parentNode.id
			getSingleStateMap(state)
		})
	})

	$.get("assets/img/maps/counties.svg", function (data, status) {
		addCountiesToSVG(data)
		$("#mapContainer > svg > g > .county").toggle()
		$("#mapContainer > svg > g > .county").mouseenter(function (e) {
			var x = e.clientX
			var y = e.clientY
			var target = e.currentTarget.id
			setToolTipPosition(x, y)
			setToolTipValue(target);
			$("#toolTip").toggle()
		})

		$("#mapContainer > svg > g > .county").mousemove(function (e) {
			var x = e.clientX;
			var y = e.clientY;
			setToolTipPosition(x, y)
		})

		$("#mapContainer > svg > g > .county").mouseleave(function (e) {
			$("#toolTip").toggle()
		})

		$("#mapContainer > svg > g > .county").click(function (e) {
			var countyID = e.currentTarget.id
			var stateID = e.currentTarget.parentElement.children[0].id
			var state =  e.currentTarget.parentElement.id
			lastCountyClicked = countyID
			getSingleStateMap(state)
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
	//$("#tooltip").css({ top: y - 20 + "px" })
	//$("#tooltip").css({ left: x - 15 + "px" })
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
			$("#DEM_vote").text(formatter.format(votes))
		}
		if (party == "Republican Party") {
			$("#REP_candidate").text(pFirst + pMid + pLast)
			$("#REP_vote").text(formatter.format(votes))
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
		CandidateVotes.innerText = formatter.format(votes)

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

function toggleMap() {
	//$("#allStatesSVG > g > .state").toggle()
	$("#allStatesSVG > g > .county").toggle()
	countiesVisible = !countiesVisible
	getResults()
}

function getResults() {
	if (countiesVisible == true) {
		removeColor()
		$(".state").each(function () {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleStateAllCountyWinners", year: currentYear, FIPS: this.id }, function (result) {
				if (result != null) {
					result = JSON.parse(result)
					result.forEach(element => setColor(element))
				}
			})
		})
	} else {
		$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllStateWinners", YEAR: currentYear }, function (result) {
			if (result != null) {
				result = JSON.parse(result)
				result.forEach(function (result) {
				setColor(result)
				})
			}
		})
	}
	$.post("assets/scripts/php/ajaxResponse.php", { action: "FEC_AllCandidateTotals", YEAR: currentYear }, function (result) {
		result = JSON.parse(result)
		setCandidateResults(result)
	})
}

//Modal functions
function getSingleStateMap(state) {
	var url = "assets/img/maps/states/" + state + ".svg"
	$.get(url, function (data, status) {
		var svg = $(data.children[0])
		var stateAbbr = svg.attr("id")
		var svgGroups = svg.children()
		var modalHeight = $(window).height() - ($("#mapContainer").position().top + $(".resultsContainer").outerHeight(true))
		var mapHeight = modalHeight - ($(".modalHeader").outerHeight(true) + $("#candidates").outerHeight())
		$(svg).addClass(stateAbbr)
		$(svg).attr("id", "modalMap")

		for (var i = 0; i < svgGroups.length; i++) {
			var element = svgGroups[i]
			var id = $(element).attr("id")
			$(element).attr("id", "")
			$(element).addClass(id)
		}
		$("#stateMap").html(data.children[0])
		$(".modalContent").attr("height", modalHeight)
		$(".modalContent").css({ "maxHeight": modalHeight + "px" });
		$("#countyResults").css({ "maxHeight": modalHeight + "px" });
		$(svg).attr("height", mapHeight)
		$(svg).attr("width", $(".modalBody").outerWidth(true) * .5)

		setupModalMap()
		getResultsForModal()
		setModalPosition()
	})
	$(".myModal").toggle()
}

function setupModalMap() {
	$("#modalMap > .county").mouseenter(function (e) {
		var x = e.clientX
		var y = e.clientY
		var target = $(this).attr("class").split(/\s+/)[1]

		setToolTipPosition(x, y)
		setToolTipValue(target);
		$("#toolTip").toggle()
	})

	$("#modalMap > .county").mousemove(function (e) {
		var x = e.clientX;
		var y = e.clientY;
		setToolTipPosition(x, y)
	})

	$("#modalMap > .county").mouseleave(function (e) {
		$("#toolTip").toggle()
	})

	$("#modalMap > .county").click(function (e) {
		var countyID = $(this).attr("class").split(/\s+/)[1]
		lastCountyClicked = countyID
		clearModalCountyTotals()
		$.post("assets/scripts/php/ajaxResponse.php", { action: "getFIPS", FIPS: countyID }, function (result) {
			var data = JSON.parse(result)
			$("#countyName").text(data[0]["NAME"] + " " + data[0]["DESCRIPTION"])
		})
		if (lastCountyClicked) {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleCountyAllCandidateTotals", year: currentYear, FIPS: countyID }, function (result) {
				result = JSON.parse(result)
				result.forEach(element => setModalCountyResults(element))
			})
		}
		else {
			$("#countyResults").text("Click A County")
        }
	})
}

function getResultsForModal() {
	var classArray = $("#modalMap > .state").attr("class").split(/\s+/);
	var stateFIPS = classArray[classArray.length - 1]
	clearModalCountyTotals()
	clearModalCandidates()
	if (currentYear) {
		$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleStateTop2CandidateTotals", year: currentYear, FIPS: stateFIPS }, function (result) {
			result = JSON.parse(result)
			setModalCandidateResults(result)
		})
		$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleStateAllCountyWinners", year: currentYear, FIPS: stateFIPS }, function (result) {
			result = JSON.parse(result)
			result.forEach(element => setModalMapColor(element))
		})
		if (lastCountyClicked) {
			$.post("assets/scripts/php/ajaxResponse.php", { action: "STATES_SingleCountyAllCandidateTotals", year: currentYear, FIPS: lastCountyClicked }, function (result) {
				result = JSON.parse(result)
				result.forEach(element => setModalCountyResults(element))
			})
		}
		else {
			$("#countyResults").text("Click A County")
			$("#countyResults").addClass("text-center")
		}
	}
	else {
		$("#countyResults").text("Click A Year")
		$("#countyResults").addClass("text-center")
    }

	$.post("assets/scripts/php/ajaxResponse.php", { action: "getFIPS", FIPS: stateFIPS }, function (result) {
		var data = JSON.parse(result)
		$(".modalTitle").text(data[0]["NAME"])
	})
}

function setModalPosition(state) {
	var modalTopPosition = $("#mapContainer").position().top + 5
	$(".myModal").css({ top: modalTopPosition })
}

function setModalMapColor(data) {
	if (data['PARTY'] == "Democratic Party") {
		$("#modalMap > ." + data['FIPS_ID']).css("fill", "blue")
	}
	if (data['PARTY'] == "Republican Party") {
		$("#modalMap > ." + data['FIPS_ID']).css("fill", "red")
	}
}

function setModalCountyResults(data) {
	var resultsDiv = $("countyResults")
	var pFirst = (data["PFIRST"] == null) ? "" : data["PFIRST"] + " "
	var pMid = (data["PMID"] == null) ? "" : data["PMID"] + " "
	var pLast = (data["PLAST"] == null) ? "" : data["PLAST"]
	var party = (data["PARTY"] == null) ? "" : data["PARTY"]
	var votes = (data["VOTES"] == null) ? "" : data["VOTES"]

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

	document.getElementById("countyResults").appendChild(newElement)
}

function setModalCandidateResults(data) {
	//Clear previous data

	for (var i = 0; i < data.length; i++) {
		//get needed values, use an empty string for nulls
		var pFirst = (data[i]["PFIRST"] == null) ? "" : data[i]["PFIRST"] + " "
		var pMid = (data[i]["PMID"] == null) ? "" : data[i]["PMID"] + " "
		var pLast = (data[i]["PLAST"] == null) ? "" : data[i]["PLAST"]
		var party = (data[i]["PARTY"] == null) ? "" : data[i]["PARTY"]
		var votes = (data[i]["VOTES"] == null) ? "" : data[i]["VOTES"]

		//Look for major party candidates and set the heading with them
		if (party == "Democratic Party") {
			$("#modal_DEM_candidate").text(pFirst + pMid + pLast)
			$("#modal_DEM_vote").text(formatter.format(votes))
		}
		if (party == "Republican Party") {
			$("#modal_REP_candidate").text(pFirst + pMid + pLast)
			$("#modal_REP_vote").text(formatter.format(votes))
		}
	}
}

function clearModalCountyTotals() {
	document.getElementById("countyResults").innerHTML = ""
	document.getElementById("countyName").innerHTML = ""
}

function clearModalCandidates() {
	document.getElementById("modal_DEM_candidate").innerHTML = ""
	document.getElementById("modal_DEM_vote").innerHTML = ""
	document.getElementById("modal_REP_candidate").innerHTML = ""
	document.getElementById("modal_REP_vote").innerHTML = ""
}