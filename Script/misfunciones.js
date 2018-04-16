/* creación loop de la tabla*/
$(function () {

    var times;

    if (location.pathname == "/senate_data.html") {

        $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function (datos) {

            createCongressTable(datos);

        });
    } else if (location.pathname == "/house-page.html") {

        $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function (datos) {

            createCongressTable(datos);

        });
    }

    function createCongressTable(data) {

        var members = data.results[0].members;

        var tableContent = "";
        for (var a = 0; a < members.length; a++) {

            var firstNames = members[a].first_name;
            var middleNames = members[a].middle_name;
            var lastNames = members[a].last_name;
            var party = members[a].party;
            var state = members[a].state;
            var yearsInOffice = members[a].seniority;
            var votes = members[a].votes_with_party_pct;
            var url = members[a].url;

            if (middleNames === null) {
                middleNames = "";
            }


            tableContent += "<tr>" +
                "<td>" + "<a href=" + url + ">" + lastNames + " " + firstNames + " " + middleNames + "</a>" + "</td>" +
                "<td class='party'>" + party + "</td>" +
                "<td class='method'>" + state + "</td>" +
                "<td>" + yearsInOffice + "</td>" +
                "<td>" + votes + "</td>" +
                "</tr>";

        }

        $("#senate-data").html(tableContent);

    }

    /* Funcionamiento filtro by party y filtro by state*/


    $("#filterForm").on("change", function () { //para todos los elementos del elemento con id=filterForm, sobre los que haga click, o sea, sobre los que cambien de estado, me aplicas esta funcion.

        var parties = $("input[name='filterStatus']:checked") //para todos los input filterStatus checados
            .map(function () {
                return $(this).val();
            }) //los cambias y aplicas la funcion de retornar su valor
            .get(); //y los consigues, o sea, me los guardas
        var states = $("#filterByState").val(); //guarda el valor del elemento filterByState cambiado de estado (o sea, checkado)

        $("#senate-data tr").each(function () { //para cada uno de los tr del id senate-data se aplica la siguiente función

            var party = $(this).find(".party").text(); //en cada tr, encuentra los elementos con clase party y coge su texto
            var partySelected = parties.length === 0 || parties.includes(party); //si la variable parties es 0, o sea, no hay ningun input checado o la variable parties incluye la variable party, o sea los inputs checados contienen los valores, devuelve un true (para cada tr, si el texto de la variable party es igual al valor de la variable parties, devuelve un true para cada tr)
            var state = $(this).find(".method").text();
            var stateSelected = states.includes(state) || states == "all";

            var both = partySelected && stateSelected;

            $(this).toggle(both); //sólo se muestran los valores true de la variable partySelected, o sea, de los inputs checados
        });
    });
});
