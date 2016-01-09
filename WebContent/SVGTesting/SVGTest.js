function gadget1() {
	var stateSVG = map.contentDocument.getElementsByTagName('svg')[0];
	var stateSVGObject = map.contentDocument.getElementsByClassName('main')[0];
	var SVGHeight = map.contentDocument.getElementsByTagName('svg')[0].getAttribute('height');
	var SVGWidth = map.contentDocument.getElementsByTagName('svg')[0].getAttribute('width');
	var SVGViewbox = map.contentDocument.getElementsByTagName('svg')[0].getAttribute('viewBox');
	var newSVGHeight = SVGHeight * 2;
	var newSVGWidth = SVGWidth * 2;
	//var newSVGViewbox = "0 0 " + (SVGWidth / 2) + " " + (SVGHeight / 2) ;
	stateSVG.setAttribute("height", newSVGHeight);
	stateSVG.setAttribute("width", newSVGWidth);
	//stateSVG.setAttribute("transform", "rotate(-45)");
	//stateSVG.setAttribute("viewBox", newSVGViewbox)
	console.log(map.contentDocument.getElementsByClassName('state')[0].getAttribute('height'));
}

function gadget2() {

}

function onLoad() {
	var allStates = map.contentDocument.getElementsByClassName('state');
	for (var i = 0; i < allStates.length; i++) {
		allStates[i].style.visibility = "hidden";
	}
}
