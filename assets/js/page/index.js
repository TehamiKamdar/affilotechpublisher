"use strict";

$(function () {
	chart1();
	chart2();
	chart3();

	// select all on checkbox click
	$("[data-checkboxes]").each(function () {
		var me = $(this),
			group = me.data('checkboxes'),
			role = me.data('checkbox-role');

		me.change(function () {
			var all = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"])'),
				checked = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"]):checked'),
				dad = $('[data-checkboxes="' + group + '"][data-checkbox-role="dad"]'),
				total = all.length,
				checked_length = checked.length;

			if (role == 'dad') {
				if (me.is(':checked')) {
					all.prop('checked', true);
				} else {
					all.prop('checked', false);
				}
			} else {
				if (checked_length >= total) {
					dad.prop('checked', true);
				} else {
					dad.prop('checked', false);
				}
			}
		});
	});



});

function chart1() {
	// Get current date info
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth(); // 0-based
	var monthName = now.toLocaleString('default', { month: 'short' });

	var daysInMonth = new Date(year, month + 1, 0).getDate();

	// Generate data: [{ day: "1", value: ... }, ...]
	var data = Array.from({ length: daysInMonth }, (_, i) => ({
		day: (i + 1).toString(),
		value: Math.floor(Math.random() * 30) + 10
	}));

	// Use animated theme
	am4core.useTheme(am4themes_animated);

	// Create chart instance
	var chart = am4core.create("chart1", am4charts.XYChart);

	// Assign data
	chart.data = data;

	// Create category axis (X)
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "day";
	categoryAxis.title.text = monthName + " " + year;
	categoryAxis.renderer.labels.template.fill = am4core.color("#9aa0ac");
	categoryAxis.renderer.minGridDistance = 20;

	// ✅ Attach scrollbar to the chart itself
	chart.scrollbarX = new am4core.Scrollbar();

	// Create value axis (Y)
	var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.title.text = "Sales";
	valueAxis.renderer.labels.template.fill = am4core.color("#9aa0ac");

	// Create series
	var series = chart.series.push(new am4charts.LineSeries());
	series.dataFields.valueY = "value";
	series.dataFields.categoryX = "day";
	series.name = "High - " + monthName;
	series.strokeWidth = 2;
	series.tooltipText = "[bold]{categoryX}[/]: {valueY}";
	series.tensionX = 0.8; // smooth curve

	// Add bullets
	var bullet = series.bullets.push(new am4charts.CircleBullet());
	bullet.circle.radius = 4;
	bullet.circle.fill = am4core.color("#6777EF");
	bullet.circle.strokeWidth = 2;

	// Style line color
	series.stroke = am4core.color("#6777EF");

	// Add legend
	chart.legend = new am4charts.Legend();
	chart.legend.position = "top";
	chart.legend.align = "right";

	// Enable chart cursor
	chart.cursor = new am4charts.XYCursor();
}


function chart2() {
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end



	// Create chart instance
	var chart = am4core.create("chart2", am4charts.RadarChart);

	// Add data
	chart.data = [{
		"category": "Not Joined",
		"value": 80,
		"full": 100
	}, {
		"category": "Pending",
		"value": 35,
		"full": 100
	}, {
		"category": "Rejected",
		"value": 92,
		"full": 100
	}, {
		"category": "Approved",
		"value": 68,
		"full": 100
	}];

	// Make chart not full circle
	chart.startAngle = -90;
	chart.endAngle = 180;
	chart.innerRadius = am4core.percent(20);

	// Set number format
	chart.numberFormatter.numberFormat = "#.#'%'";

	// Create axes
	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "category";
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.grid.template.strokeOpacity = 0;
	categoryAxis.renderer.labels.template.horizontalCenter = "right";
	categoryAxis.renderer.labels.template.fontWeight = 500;
	categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
		return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
	});
	categoryAxis.renderer.minGridDistance = 10;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.renderer.grid.template.strokeOpacity = 0;
	valueAxis.min = 0;
	valueAxis.max = 100;
	valueAxis.strictMinMax = true;
	valueAxis.renderer.labels.template.fill = am4core.color("#9aa0ac");

	// Create series
	var series1 = chart.series.push(new am4charts.RadarColumnSeries());
	series1.dataFields.valueX = "full";
	series1.dataFields.categoryY = "category";
	series1.clustered = false;
	series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
	series1.columns.template.fillOpacity = 0.08;
	series1.columns.template.cornerRadiusTopLeft = 20;
	series1.columns.template.strokeWidth = 0;
	series1.columns.template.radarColumn.cornerRadius = 20;

	var series2 = chart.series.push(new am4charts.RadarColumnSeries());
	series2.dataFields.valueX = "value";
	series2.dataFields.categoryY = "category";
	series2.clustered = false;
	series2.columns.template.strokeWidth = 0;
	series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
	series2.columns.template.radarColumn.cornerRadius = 20;

	series2.columns.template.adapter.add("fill", function (fill, target) {
		return chart.colors.getIndex(target.dataItem.index);
	});

	// Add cursor
	chart.cursor = new am4charts.RadarCursor();
}

function chart3() {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chart3", am4maps.MapChart);
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(20, 20, 20, 20);

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.geodata = am4geodata_worldLow;

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#cccccc");
    polygonTemplate.stroke = am4core.color("#000000");
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.nonScalingStroke = true;

    // Remove default hover fill
    polygonTemplate.states.removeKey("hover");

    var highlightedCountries = [
      { id: "PK", name: "Pakistan", color: "#FF5733", advertisers: 120 },
      { id: "US", name: "United States", color: "#33FF57", advertisers: 300 },
      { id: "CN", name: "China", color: "#3357FF", advertisers: 250 },
      { id: "RU", name: "Russia", color: "#FF33A1", advertisers: 150 },
      { id: "BR", name: "Brazil", color: "#FFC300", advertisers: 180 },
      { id: "IN", name: "India", color: "#A133FF", advertisers: 220 },
      { id: "ZA", name: "South Africa", color: "#33FFF6", advertisers: 90 },
      { id: "AU", name: "Australia", color: "#FF8F33", advertisers: 110 },
      { id: "DE", name: "Germany", color: "#33FF99", advertisers: 160 },
      { id: "GB", name: "United Kingdom", color: "#FF3333", advertisers: 140 }
    ];

    polygonSeries.events.once("inited", function () {
      highlightedCountries.forEach(function (country) {
        var polygon = polygonSeries.getPolygonById(country.id);
        if (polygon) {
          polygon.fill = am4core.color(country.color);
          polygon.tooltipText = country.name + ": " + country.advertisers + " Advertisers";

          // Add hover state *only* for highlighted countries
          var hs = polygon.states.create("hover");
          hs.properties.fill = am4core.color(country.color); // or any hover color you prefer
        }
      });
    });
  });
}


function chart4() {
	var options = {
		chart: {
			height: 250,
			type: 'area',
			toolbar: {
				show: false
			},

		},
		colors: ['#999b9c', '#4CC2B0'], // line color
		fill: {
			colors: ['#999b9c', '#4CC2B0'] // fill color
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth'
		},
		markers: {
			colors: ['#999b9c', '#4CC2B0'] // marker color
		},
		series: [{
			name: 'series1',
			data: [31, 40, 28, 51, 22, 64, 80]
		}, {
			name: 'series2',
			data: [11, 32, 67, 32, 44, 52, 41]
		}],
		legend: {
			show: false,
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],
			labels: {
				style: {
					colors: "#9aa0ac"
				}
			},
		},
		yaxis: {
			labels: {
				style: {
					color: "#9aa0ac"
				}
			}
		},
	}

	var chart = new ApexCharts(
		document.querySelector("#chart4"),
		options
	);

	chart.render();

}

var swiper = new Swiper(".mySwiper", {
	slidesPerView: "auto", // Cards in a row
	spaceBetween: 20,
	loop: true,
	autoplay: {
		delay: 3000, // 3 seconds
		disableOnInteraction: true
	},
	pagination: {
		el: ".swiper-pagination",
		clickable: true
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev"
	}
});