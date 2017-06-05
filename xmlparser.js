var xmldoc;
var txt_grr;
var matricula = null;


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
	xmldoc = xml.responseXML;
}

var disc_undef = [];
var last_mat;
function parse_aluno(aluno) {
	/* child 29 <COD_ATIV_CURRIC> */
	var cod_disc = aluno.childNodes[29].firstChild.nodeValue;
	var situacao;
	var tmp;

	/* child 27 <SITUACAO> */
	situacao = aluno.childNodes[27].firstChild.nodeValue;

	/*
	 * Fix name, in case name does follow valid syntaxe.
	 */
	if( situacao === "Matrícula" )
		situacao = "Matriculado";
	else if( situacao === "Aprovado" )
		situacao = "Aprovado";
	else if( situacao === "Reprovado por Frequência"
			 || situacao === "Reprovado por nota"
			 || situacao === "Reprovado sem nota" )
		situacao = "Reprovado";
	else if( situacao === "Equivalência de Disciplina")
		situacao = "Equivale";
	else situacao = "Nulo";

	disc_td = document.getElementById(cod_disc);
	if( disc_td === null ) {
		disc_undef.push(cod_disc);
	} else {
		if( situacao !== "Nulo" ) {
			var lcd = last_mat[cod_disc];
			var y = parseInt(aluno.childNodes[19].firstChild.nodeValue);
			var s = aluno.childNodes[25].firstChild.nodeValue[0];

			if( lcd == undefined ) {
				last_mat[cod_disc] = {year: y, sem: parseInt(s)};
			} else {
				console.log(cod_disc, last_mat[cod_disc].year, y, last_mat[cod_disc].sem, s);
				if( last_mat[cod_disc].year < y || (last_mat[cod_disc].year == y && last_mat[cod_disc].sem > s) ) {
					disc_td.classList.toggle("Aprovado", false);
					disc_td.classList.toggle("Reprovado", false);
					disc_td.classList.toggle("Equivale", false);
					disc_td.classList.toggle("Matriculado", false);
				} else return;
			}

			disc_td.classList.toggle(situacao, true);
		}
	}
}

function remove_class_situation() {
	var lst_td = document.getElementsByTagName("td");

	for( i = 0; i < lst_td.length; ++i ) {
		lst_td[i].classList.toggle("Aprovado", false);
		lst_td[i].classList.toggle("Reprovado", false);
		lst_td[i].classList.toggle("Equivale", false);
		lst_td[i].classList.toggle("Matriculado", false);
	}
}

function btn_Click_Search() {
	if( xmldoc == undefined ) {
		alert("Erro, xmldoc!");
		return;
	}

	remove_class_situation();

	matricula = txt_grr.value;
	var alunos = xmldoc.getElementsByTagName("ALUNO");
	var aluno;
	var count = 0;
	last_mat = new Object();
	for( i = 0; i < alunos.length; ++i ) {
		aluno = alunos[i];
		if( aluno.childNodes[3].firstChild.nodeValue === matricula ) {
			parse_aluno(aluno);
			count++;
		}
	}

	if( count === 0 ) {
		alert("Código: '" + matricula + "' não encontrado!");
		matricula = null;
		return;
	}

	if( disc_undef.length > 0 ) alert("Disciplina(s) não localizadas:\n" + disc_undef);
}

function txt_grr_KeyPress(event) {
	var input = event.which || event.KeyCode;

	if( input === 13 )
		btn_Click_Search();
}

function get_info_last_mat(cod_disc) {
	var grr_val;
	var result = { cod_disc: "", disc_name: "", year: 0, sem: "", score: 0.0, freq: 0.0 };

	if( matricula == null ) {
		grr_val = txt_grr.value;
		if( grr_val === "" ) return;
	}else grr_val = matricula;

	var alunos = xmldoc.getElementsByTagName("ALUNO");
	var aluno;
	var year;
	for( i = 0; i < alunos.length; ++i ) {
		aluno = alunos[i];
		if( aluno.childNodes[3].firstChild.nodeValue === grr_val
			&& aluno.childNodes[29].firstChild.nodeValue === cod_disc ) {
			year = parseInt(aluno.childNodes[19].firstChild.nodeValue);
			if( result.year < year ) {
				result.cod_disc = cod_disc;
				result.disc_name = aluno.childNodes[31].firstChild.nodeValue;
				result.year = year;
				result.score = aluno.childNodes[21].firstChild.nodeValue;
				result.sem = aluno.childNodes[25].firstChild.nodeValue;
				result.freq = parseFloat(aluno.childNodes[47].firstChild.nodeValue);
			}
		}
	}

	return result;
}

function get_history(cod_disc) {
	var grr_val;
	var results = new Array();

	if( matricula == null ) {
		grr_val = txt_grr.value;
		if( grr_val === "" ) return;
	}else grr_val = matricula;

	var alunos = xmldoc.getElementsByTagName("ALUNO");
	var aluno;
	for( i = 0; i < alunos.length; ++i ) {
		aluno = alunos[i];
		if( aluno.childNodes[3].firstChild.nodeValue === grr_val
			&& aluno.childNodes[29].firstChild.nodeValue === cod_disc ) {
			var result = new Object();

			result.cod_disc = cod_disc;
			result.disc_name = aluno.childNodes[31].firstChild.nodeValue;
			result.year = parseInt(aluno.childNodes[19].firstChild.nodeValue);
			result.score = parseFloat(aluno.childNodes[21].firstChild.nodeValue);
			result.sem = aluno.childNodes[25].firstChild.nodeValue;
			result.freq = parseFloat(aluno.childNodes[47].firstChild.nodeValue);
			results.push(result);
		}
	}

	return results;
}

function PopUpResult(res) {
	var str =
		"    Código: " + res.cod_disc + "<br>" +
		"Disciplina: " + res.disc_name + "<br>" +
		"       Ano: " + res.year + "<br>" +
		"  Semestre: " + res.sem + "<br>" +
		"      Nota: " + res.score + "<br>" +
		"Frequencia: " + res.freq.toFixed(2);
	;

	document.getElementById('myModal-content').innerHTML = str;
	document.getElementById('myModal').style.display = "block";
}


function PopUpResultHistory(results) {
	var str = "";

	for( i = 0; i < results.length; ++i ) {
		str += "Código: " + results[i].cod_disc + "<br>" +
			"Disciplina: " + results[i].disc_name + "<br>" +
			"Ano: " + results[i].year + "<br>" +
			"Semestre: " + results[i].sem + "<br>" +
			"Nota: " + results[i].score.toFixed(2) + "<br>" +
			"Frequencia: " + results[i].freq.toFixed(2) + "<br><br>";
	}
	document.getElementById('myModal-content').innerHTML = str;
	document.getElementById('myModal').style.display = "block";
}

function get_cod_disc(target) {

	if( target instanceof HTMLDivElement )
		return target.firstChild.nodeValue;
	else
		return target.id;
}

function tbl_MouseDown(event) {
	var cod_disc;
	var res;

	cod_disc = get_cod_disc(event.target);
	if( event.button == 0 ) {
		res = get_info_last_mat(cod_disc);
		if( res ) PopUpResult(res);
	}else if( event.button == 2 ) {
		res = get_history(cod_disc);
		if( res ) PopUpResultHistory(res);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	loadXMLDoc();
	txt_grr = document.getElementById("txt_grr");
});
document.oncontextmenu = function() { return false; }
document.getElementById("btn_search").addEventListener('click', btn_Click_Search, true);
document.getElementById("txt_grr").addEventListener('keypress', txt_grr_KeyPress, true);
document.getElementById("main_grade").addEventListener('mousedown', tbl_MouseDown, true);
document.getElementById("opt_grade").addEventListener('mousedown', tbl_MouseDown, true);
document.getElementById("tg_grade").addEventListener('mousedown', tbl_MouseDown, true);
document.getElementById("old_grade").addEventListener('mousedown', tbl_MouseDown, true);

document.getElementsByClassName("close")[0].onclick = function() {
	document.getElementById('myModal').style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	var modal = document.getElementById('myModal');

    if (event.target == modal) {
        modal.style.display = "none";
    }
}
