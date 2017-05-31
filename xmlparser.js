var xmldoc;


function loadXMLDoc()
{
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			GetXMLDoc(this);
		}
	};

	xmlhttp.open("GET", "alunos.xml", true);
	xmlhttp.send();
}

function GetXMLDoc(xml)
{
	var i, discs;

	xmldoc = xml.responseXML;
	discs = xmldoc.getElementsByTagName("COD_ATIV_CURRIC");
	for( i = 0; i < discs.length; ++i ) {
		console.log(discs[i].firstChild.nodeValue);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	loadXMLDoc();
});
