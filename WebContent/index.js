function loadStates(){
  	var states = document.getElementById("map");
  	var SVGDoc = states.contentDocument;
  	var allStates = SVGDoc.getElementById("states");
 	allStates.style.fill = "grey";
 	SVGDoc.getElementById("AL").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("AZ").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("AR").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("CA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("CO").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("CT").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("DC").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("DE").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("FL").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("GA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("ID").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("IA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("IL").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("IN").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("KS").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("KY").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("LA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MD").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("ME").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MI").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MN").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MO").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MS").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("MT").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NC").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("ND").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NE").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NH").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NJ").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NM").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NV").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("NY").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("OH").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("OK").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("OR").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("PA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("RI").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("SC").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("SD").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("TN").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("TX").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("UT").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("VT").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("VA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("WA").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("WI").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("WV").onclick = function(){ redClick(this) };
 	SVGDoc.getElementById("WY").onclick = function(){ redClick(this) };
}

function redClick(target){
	target.style.fill = "red";
}

/*
function loadCounties(){
	var mapDoc = document.getElementById("map");
	var SVGDoc = mapDoc.contentDocument;
	var allStates = SVGDoc.getElementById("counties");
	allStates.style.fill = "grey";
	SVGDoc.getElementById("AL").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("AZ").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("AR").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("CA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("CO").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("CT").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("DC").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("DE").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("FL").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("GA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("ID").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("IA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("IL").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("IN").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("KS").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("KY").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("LA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MD").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("ME").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MI").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MN").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MO").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MS").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("MT").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NC").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("ND").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NE").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NH").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NJ").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NM").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NV").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("NY").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("OH").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("OK").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("OR").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("PA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("RI").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("SC").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("SD").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("TN").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("TX").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("UT").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("VT").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("VA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("WA").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("WI").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("WV").onclick = function(){ redClick(this) };
	SVGDoc.getElementById("WY").onclick = function(){ redClick(this) };
}


function switchCounties(){
	document.getElementById("map").style.display = "none";
	document.getElementById("map").setAttribute("data", "images/counties.svg");
	document.getElementById("map").style.display = "";
	document.getElementById("map").onLoad = "loadCounties()"
}

function switchStates(){
	document.getElementById("map").style.display = "none";
	document.getElementById("map").setAttribute("data", "images/states.svg");
	document.getElementById("map").style.display = "";
	document.getElementById("map").onLoad = "loadStates()"
}
*/