$(function(){

var times;

printAttendance("/senate-attendance-statistics-page.html", "https://nytimes-ubiqum.herokuapp.com/congress/113/senate", "missed_votes_pct");
printAttendance("/house-attendance-statistics-page.html", "https://nytimes-ubiqum.herokuapp.com/congress/113/house", "missed_votes_pct");
printAttendance("/senate-party-loyalty-statistics-page.html", "https://nytimes-ubiqum.herokuapp.com/congress/113/senate", "votes_with_party_pct");
printAttendance("/house-party-loyalty-statistics-page.html", "https://nytimes-ubiqum.herokuapp.com/congress/113/house", "votes_with_party_pct");

/*Funciones para printar las tablas según el pathname y el getJSON*/
    
function printAttendance(pageLocation, urlData, paramToOrder){
   if (location.pathname == pageLocation){    
        $.getJSON(urlData, function(datos) {
              printTablesVotes(datos, paramToOrder);
        });
    }
}

/* Función para printar todas las tablas de una página, según los datos y el parámetro a mostrar*/
    
function printTablesVotes(data, paramToOrder) {
    return printarTabla("listParty", createTableParty(data))
     + printarTabla("tableLeast", createTableLeastMost(data, ordenMayorAMenor, paramToOrder))
     + printarTabla("tableMost", createTableLeastMost(data, ordenarMenorAMayor, paramToOrder));
}
    
/*Función printar tabla*/

function printarTabla(location, tableToPrint){
    return document.getElementById(location).innerHTML = tableToPrint;
}

/* Función creación tabla miembros-tabla1-*/

function createTableParty(data){
    var statistics = 
    {
       "members": { 
            "num_republicans": 0,
            "num_democrats": 0,
            "num_independents": 0,
            "num_total": 0,
            "votes_party_republicans_pct": 0,
            "votes_party_democrats_pct": 0,
            "votes_party_independents_pct": 0,
            "votes_party_total_pct": 0 
            
       }
    }

    /* cálculo variables json de la tabla glance*/

    var members = data.results[0].members;
    var listRepub = 0;
    var listDem = 0;
    var listIndep = 0;
    var listVotes = members[0].votes_with_party_pct;
    var sumaVotes_Repub = 0;
    var sumaVotes_Dem = 0;
    var sumaVotes_Indep = 0;

    function sumaTotal(a, b, c) {
        return a+b+c;
    }
    function promedio(a, b) {
        return a / b;
    }

    for (var c = 0; c < members.length; c++) {
        var party = members[c].party;
        var listVotesPct = members[c].votes_with_party_pct;

        if (party == "R") {
            listRepub++;// cuenta las veces que se repite el elemento R
            sumaVotes_Repub += parseFloat(listVotesPct); //parseFloat cambia el número en string a número normal, para poder sumarlo. y el += los suma

        }
        else if (party == "D") {
            listDem++;
            sumaVotes_Dem += parseFloat(listVotesPct);

        }
        else {
            listIndep++;
            sumaVotes_Indep += parseFloat(listVotesPct);
        }

    }

    /* Llenado objeto json tabla glance*/

    statistics.members.num_republicans = listRepub;
    statistics.members.num_democrats = listDem;
    statistics.members.num_independents = listIndep;
    statistics.members.num_total = listRepub + listDem + listIndep;
    statistics.members.votes_party_republicans_pct =  promedio(sumaVotes_Repub, listRepub);
    statistics.members.votes_party_democrats_pct =  promedio(sumaVotes_Dem, listDem);
    statistics.members.votes_party_independents_pct =  promedio(sumaVotes_Indep, listIndep);
    statistics.members.votes_party_total_pct =  sumaTotal(statistics.members.votes_party_republicans_pct, statistics.members.votes_party_democrats_pct, statistics.members.votes_party_independents_pct) / sumaTotal.length;

    /*Creación tabla número miembros y porcentaje votos*/

    var myListParty = document.getElementById("listParty");
    var numMembers = statistics.members;

    /*Creación tabla at a glance*/

    var listPartyContent =  "";
    for (var d = 0; d < members.length; d++) {
        var num_Repub = numMembers.num_republicans;
        var num_Dem = numMembers.num_democrats;
        var num_Indep = numMembers.num_independents;
        var num_Total = numMembers.num_total;
        var votes_Repub = numMembers.votes_party_republicans_pct;
        var votes_Dem = numMembers.votes_party_democrats_pct;
        var votes_Indep = numMembers.votes_party_independents_pct;
        var votes_Total = numMembers.votes_party_total_pct;

        listPartyContent = "<tr>" + 
            "<td>" + "Republican" + "</td>" + 
            "<td>" + num_Repub + "</td>" +
            "<td>" + fijarDecimales(votes_Repub, 2) + "</td>" +
            "</tr>" + 
            "<tr>" + 
            "<td>" + "Democrat" + "</td>" + 
            "<td>" + num_Dem + "</td>" + 
            "<td>" + fijarDecimales(votes_Dem, 2) + "</td>" + 
            "</tr>" + 
            "<tr>" +
            "<td>" + "Independent" + "</td>" + 
            "<td>" + num_Indep + "</td>" + 
            "<td>" + fijarDecimales(votes_Indep, 2) + "</td>" + 
            "</tr>" +
            "<tr>" +
            "<td>" + "Total" + "</td>" + 
            "<td>" + num_Total + "</td>" + 
            "<td>" + fijarDecimales(votes_Total, 2) + "</td>" + 
            "</tr>";
    }
    return listPartyContent;
}

/*Función para poner el numero con decimales*/

function fijarDecimales (number, decimals) {
    return number.toFixed(decimals);
}
    
/*Función para ordenar array por % de votos perdidos de mayor a menor*/

function ordenMayorAMenor(arrayAOrdenar, parameterToOrder){
    
    var arrayOrdenado = arrayAOrdenar.sort (function(a, b) {
        if (a[parameterToOrder] < b[parameterToOrder]) {
            return 1;
        } 
        if (a[parameterToOrder] > b[parameterToOrder]) {
            return -1;
        }
        if (a[parameterToOrder] == b[parameterToOrder]) {
            return 0;
    }
    });
    return arrayOrdenado;
}

/*Función para ordenar array de menor a mayor*/

function ordenarMenorAMayor(arrayAOrdenar, parameterToOrder){
    var arrayOrdenado = arrayAOrdenar.sort(function(a, b) {
        return a[parameterToOrder] - b[parameterToOrder];
    });
    return arrayOrdenado;
}

/*Función calcular porcentaje*/
    
function porcentaje (array, porcentaje) {
    return (array * porcentaje) / 100;
}

/*Función creación de los que pierden más votos-least engaged-y de los menos leales- least loyal-tabla 2 y de las tablas de los que pierden menos votos y los más leales*/

function createTableLeastMost(data, functionOrden, paramToOrder){
    
    var members = data.results[0].members;
    var dataVotesOrder = functionOrden(members, paramToOrder);/*Variable ordenada de mayor a menor por missed votes pct*/
    
    var tableBottom = "";
    for (var e = 0; e < dataVotesOrder.length; e++) {

       if (e > (porcentaje(dataVotesOrder.length, 10))-1) {

           if (dataVotesOrder[e][paramToOrder] != dataVotesOrder[e-1][paramToOrder]) {
               break;
           }
       }
        var firstNames = members[e].first_name;
        var middleNames = members[e].middle_name;
        var lastNames = members[e].last_name;
        var missedVotes = Math.round(porcentaje(members[e].total_votes, dataVotesOrder[e][paramToOrder]));
        var missedVotesPct = dataVotesOrder[e][paramToOrder];

        if (middleNames === null) {
            middleNames = "";
        }

        tableBottom += "<tr>" +
            "<td>" + lastNames + " " + firstNames + " " + middleNames + "</td>" + 
            "<td>" + missedVotes + "</td>" + 
            "<td>" + missedVotesPct + "</td>" + 
            "</tr>";  
    }

    return tableBottom;
}

});


  