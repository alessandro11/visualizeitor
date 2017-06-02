var xmldoc;
var txt_grr;


/*_______________________________________________________________________*/
function loadXMLDoc() {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if( this.readyState == 4 && this.status == 200 ) {
			GetXMLDoc(this);
		}
	};

	xmlhttp.open("GET", "alunos.xml", true);
	xmlhttp.send();
}

function GetXMLDoc(xml) {
	var i, discs;

	xmldoc = xml.responseXML;
	/*
	discs = xmldoc.getElementsByTagName("COD_ATIV_CURRIC");
	for( i = 0; i < discs.length; ++i ) {
		console.log(discs[i].firstChild.nodeValue);
	}
	*/
}

function btn_Click_Search() {
	if( xmldoc === undefined ) {
		alert("Erro, xmldoc!");
		return;
	}

	var grr = txt_grr.value;
	var alunos = xmldoc.getElementsByTagName("ALUNO");
	var aluno;
	var cod_dic;

	for( i = 0; i < alunos.length; ++i ) {
		aluno = alunos[i];
		if( aluno.childNodes[3].firstChild.nodeValue === grr ) {
			cod_dic = alunos[i].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstChild.nodeValue;
			console.log(cod_dic);
		}
	}
}


document.addEventListener("DOMContentLoaded", function(event) {
	loadXMLDoc();
	txt_grr = document.getElementById("txt_grr");
});
document.getElementById("btn_search").addEventListener("click", btn_Click_Search, true);
