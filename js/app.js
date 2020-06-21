'use strict';

/* STEP 1 -----------------------------------------

select all inner HTML classes and create const var:
.country.name;
.total-cases;
.new-cases;
.recovered;
.new-recovered;
.deaths;
.new-deaths;

--------------------------------------------------*/

const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".death .new-value");


/* STEP 2 -----------------------------------------
select inner HTML for chart element:
--------------------------------------------------*/

const ctx = document.getElementById("axes_line_chart").getContext("2d");


/* STEP 3 -----------------------------------------
set APP VARIABLES equal to empty string to fect and update data from API:
--------------------------------------------------*/

let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [],
    dates = [];


/* STEP 4 -----------------------------------------
using geoplugin get USERS current country:
--------------------------------------------------*/

let country_code = geoplugin_countryCode();
let user_country;
country_list.forEach(country => {
    if (country.code == country_code) {
        user_country = country.name;
    }
});



/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */

function fetchData(user_country) {



    fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
            "x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
        }
    })

    .then(Response => {
        return Response.json();
    })

    .then(data => {
            dates = Object.keys(data);

            dates.forEach(date => {
                let DATA = data[date];

                app_data.push(DATA);
                cases_list.push(parseInt(DATA.total_cases.replace(/,/g, ""))); /* change object values from string to value integer */
                recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
                deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));

            });

        })
        .then(() => {
            updateUI();
        })
        .catch(error => {
            // alert(JSON.parse(JSON.stringify(error)));
            alert(error);
        })
}



fetchData(user_country);

// CREATE UPDATE UI FUNCTION

function updateUI() {
    updateStats();
    // axesLinearChart();
}

function updateStats() {
    let last_entry = app_data[app_data.length - 3];
    let before_last_entry = app_data[app_data.length - 4];

    country_name_element.innerHTML = last_entry.country_name;

    total_cases_element.innerHTML = last_entry.total_cases || 0;
    new_cases_element.innerHTML = `+ ${(last_entry.new_cases || 0)}`;

    recovered_element.innerHTML = last_entry.total_recovered || 0;
    new_recovered_element.innerHTML = `+ ${parseInt(last_entry.total_recovered.replace(/,/g, "")) - parseInt(before_last_entry.total_recovered.replace(/,/g, ""))}`;


    deaths_element.innerHTML = last_entry.total_deaths || 0;
    new_deaths_element.innerHTML = `+ ${parseInt(last_entry.new_deaths || 0)}`;

}