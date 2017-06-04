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

var disc_undef = [];
function parse_aluno(aluno) {
	var cod_disc = aluno.childNodes[29].firstChild.nodeValue;
	var situacao;

	if( aluno.childNodes[53].firstChild === null )
		return;

	situacao = aluno.childNodes[53].firstChild.nodeValue;
	/*
	 * Fix name, in case name does follow valid syntaxe.
	 */
	if( situacao === "Repr. Freq" ) situacao = "Reprovado";
	if( situacao === "Disp. c/nt" ) situacao = "Dispensa";
	if( situacao === "Tr. Total") situacao = "Tr_total";
	disc_td = document.getElementById(cod_disc);
	if( disc_td === null ) {
		disc_undef.push(cod_disc);
	} else {
		disc_td.classList.toggle(situacao, true);
	}
}

function remove_class_situation() {
	var lst_td = document.getElementsByTagName("td");

	for( i = 0; i < lst_td.length; ++i ) {
		a = lst_td[i];
		lst_td[i].classList.toggle("Aprovado", false);
		lst_td[i].classList.toggle("Reprovado", false);
		lst_td[i].classList.toggle("Equivale", false);
	}
}

function btn_Click_Search() {
	if( xmldoc === undefined ) {
		alert("Erro, xmldoc!");
		return;
	}

	remove_class_situation();

	var grr = txt_grr.value;
	var alunos = xmldoc.getElementsByTagName("ALUNO");
	var aluno;
	var cod_dic;
	var count = 0;

	for( i = 0; i < alunos.length; ++i ) {
		aluno = alunos[i];
		if( aluno.childNodes[3].firstChild.nodeValue === grr ) {
			parse_aluno(aluno);
			count++;
		}
	}

	if( count === 0 ) {
		alert("Código: '" + grr + "' não encontrado!");
		return;
	}

	if( disc_undef.length > 0 ) alert("Disciplina(s) não localizadas:\n" + disc_undef);
}

function txt_grr_KeyPress(event) {
	var input = event.which || event.KeyCode;

	if( input === 13 )
		btn_Click_Search();
}

document.addEventListener("DOMContentLoaded", function(event) {
	loadXMLDoc();
	txt_grr = document.getElementById("txt_grr");
});
document.getElementById("btn_search").addEventListener("click", btn_Click_Search, true);
document.getElementById("txt_grr").addEventListener("keypress", txt_grr_KeyPress, true);
