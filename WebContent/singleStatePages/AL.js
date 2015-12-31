function resizeSVG(){
	var AL = document.getElementById("AL");
	var SVG= AL.contentDocument.getElementsByTagName("svg")[0];
	var height = (SVG.getAttribute("height")) * 2;
	var width = (SVG.getAttribute("width")) * 2;
	var viewbox = SVG.getAttribute("viewbox");
	var newViewBox = "0 0" + width + " " + height;
	console.log(SVG);
	console.log(height);
	console.log(width);
	SVG.setAttribute("height", height);
	SVG.setAttribute("width", width);
	SVG.setAttribute("viewbox", newViewBox);
	console.log(SVG);
//	console.log(newViewBox);
}