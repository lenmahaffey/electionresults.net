function showCounties(){
	map.style.display = "none";
	map.setAttribute("data", "images/counties.svg");
	map.style.display = "";
}

function showStates(){
	map.style.display = "none";
	map.setAttribute("data", "images/states.svg");
	map.style.display = "";
}

function getResults(){
	states = map.contentDocument.getElementsByClassName('state');
	for(var i = 0; i < states.length; i++){
		ajaxRequest('stateWinner', states.item(i).id, '2000');
	}	
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
		  	var states = document.getElementById("map");
		  	var SVGDoc = states.contentDocument;
			response = request.responseText
			console.debug(response);
			switch (response) {
				case '"DEM"':
					SVGDoc.getElementById(state).style.fill = "blue";
					break;
				case '"REP"':
					SVGDoc.getElementById(state).style.fill = "red";
					break;
//				default: window.alert(response);
			};
		}
		if(request.readyState == 4 && request.status == 500) {
//			alert('FAIL');
		}
	}
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Accept", "application/json");
	request.send(params);
}