//current and previous population search
var populationPrev;
var populationCurr = 0;

//get list of available countries
function getCountry() {
	$.ajax({
		url: "http://api.population.io:80/1.0/countries",
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.countries.length; i++) {
				$("#countryList").append("<option value ='" + data.countries[i] + "'>" + data.countries[i] + "</option");
			}
			getPop();
		}
	})
}

//get population
function getPop() {
	m = $("#month").val();
	y = $("#year").val();
	c = $("#countryList :selected").text();

	$.ajax({
		url: "http://api.population.io:80/1.0/population/" + c + "/" + y + "-" + m + "-01/",
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			$(".section1").html("Population of <strong>" + c + "</strong> on <strong>" + data.total_population.date + "</strong>");
			$(".section2").html("Current Population of <strong>" + c + "</strong>" + "</strong>");
			populationPrev = populationCurr;
			populationCurr = data.total_population.population;

			var c1 = new countUp("countOn", populationPrev, populationCurr, 0, 0.5);
			c1.start();

			getCurrPop();
		}
	})

}

//get current population
function getCurrPop() {
	var d = new Date();
	var curHour = d.getHours();
	var curMin = d.getMinutes();

	//find hours until next day
	hoursUntil = 24 - (curHour + 1);

	//find minutes until next hour;
	minutesUntil = 60 - curMin;

	//convert into seconds
	hoursUntil = ((hoursUntil * 60) * 60);
	minutesUntil = minutesUntil * 60;

	totalTime = hoursUntil + minutesUntil;

	c = $("#countryList :selected").text();
	$.ajax({
		url: "http://api.population.io:80/1.0/population/" + c + "/today-and-tomorrow/",
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			//count from todays population to tommorows population
			//duration is the total seconds from now until tommorow
			var c1 = new countUp("currentCount", data.total_population[0].population, data.total_population[1].population, 0, totalTime);
			
			c1.start();

		}
	})
}

//on page load
$(document).ready(function() {
	getCountry();
	
	
	$("select").change(function() {
		getPop();
	});

	$("#countryList").change(function() {
		getCurrPop();
	});

});