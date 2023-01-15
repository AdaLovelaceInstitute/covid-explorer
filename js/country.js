function init(){
	let iso = getCountry()
	console.log(iso)
	$('#content').hide()
	loadCountryData(iso);
}

function getCountry(){

	let url_string = window.location.href
	let url = new URL(url_string)
	let iso = url.searchParams.get('iso')
	if(iso==null){
		iso='ARG'
	}
	return iso
}

function populateCountryMenu(data){
	$('.loader').hide()
	$('#content').show()
	console.log('menu')
	console.log(data);
	let dropdownOptions = []
	let isoCodes2 = []
	data.forEach(function(d){
		if(isoCodes2.indexOf(d['Country ISO3'])==-1){
			isoCodes2.push(d['Country ISO3'])
			dropdownOptions.push({'iso':d['Country ISO3'],'country':d['Country']})
		}
		
	});
	console.log(dropdownOptions)
	populateCountryDrop(dropdownOptions)
}


function initPage(data){
	console.log(data);
	$('#countryname').html(data.vaccine_passport[0]['Country'])
	createContextGraph(data)
	processStatusChart(data)
	createAppIcon(data)
	populateQualData(data['qualitative'])
	populateDigitalSkills(data)
	populateVaccineSupply(data.vaccine_supply)
}

function populateVaccineSupply(data){
	console.log(data);
	if(data.length==0){
		console.log('no vaccine data')
		$('#vaccine_supply').html('<p>WHO vaccine tracker does not supply enough details to break down vaccine supply by month</p>')
	} else {
		processData = []
		total = 0
		data.forEach(function(d){
			console.log(d)
			date = d3.timeParse("%Y-%m-%d")(d['Report Date'])
			total = total + d['Number of doses']/d['Population']
			value = total
			processData.push({'date':date,'value':value})
		})
		console.log(processData)
		createSupplyGraph(processData)
	}
}

function createSupplyGraph(data){
	let margin = {top: 10, right: 45, bottom: 30, left: 60},
    width = $('#implementation').width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	let svg = d3.select("#vaccine_supply")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")")


	let x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6))

      let length = data.length
    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, data[length-1].value*100])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

      console.log(data)
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", '#BAC8D4')
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { console.log(d);return x(d.date) })
        .y(function(d) { return y(d.value*100) })
        )




    svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", -40)
	    .attr("x", -40)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Vaccine supply as percent of population (%)");

}

function createAppIcon(data){
	$('#ctaappicon').append(appIcon)
	setIcon('#ctaappicon',data['ctas'][0])
	createAppText(data['ctas'][0])
}

function createAppText(data){

	if(data['QR code']=='No' || data['QR code']=='N/A'){
		$('#text_qr').addClass('apptextno')
		$('#icon_qr_yes').hide()
	} else {
		$('#icon_qr_no').hide()
	}

	if(data['Vaccine information']=='No' || data['Vaccine information']=='N/A'){
		$('#text_vaccine').addClass('apptextno')
		$('#icon_vaccine_yes').hide()
	} else {
		$('#icon_vaccine_no').hide()
	}

	if(data['Bluetooth']=='No' || data['Bluetooth']=='N/A'){
		$('#text_bluetooth').addClass('apptextno')
		$('#icon_bluetooth_yes').hide()
	} else {
		$('#icon_bluetooth_no').hide()
	}

	if(data['Location Data']=='No' || data['Location Data']=='N/A'){
		$('#text_location').addClass('apptextno')
		$('#icon_location_yes').hide()
	} else {
		$('#icon_location_no').hide()
	}

	if(data['GAEN API'] =='No' || data['GAEN API']){
		$('#text_gaen').addClass('apptextno')
		$('#icon_gaen_yes').hide()
	} else {
		$('#icon_gaen_no').hide()
	}

	if(data['Decentralised']=='No' || data['Decentralised']=='N/A'){
		$('#text_decentralised').addClass('apptextno')
		$('#icon_decentralised_yes').hide()
	} else {
		$('#icon_decentralised_no').hide()
	}

	if(data['Centralised']=='No' || data['Centralised']=='N/A'){
		$('#text_centralised').addClass('apptextno')
		$('#icon_centralised_yes').hide()
	} else {
		$('#icon_centralised_no').hide()
	}
}

function populateQualData(data){
	console.log(data);
	data.forEach(function(d){
		console.log(d);
		let html = `<tr><td><p>${d['Type']}</p></td><td><p>${d['Text']}</p></td><td><p><a href="${d['Link']}" target="_blank">Read More</a></p></td></tr>`
		$('#qualtable').append(html)
	});
}

function populateDigitalSkills(data){
	$('#digitalscore').html(data['ctas'][0]['digital skills']);
	$('#digitalrank').html(data['ctas'][0]['digital skills rank']);
}

function createContextGraph(data){
	let output = [{'colour':'#7c2c77','data':[]},{'colour':'#7c2c77','data':[]},{'colour':'#00E1B3','data':[]},{'colour':'#00E1B3','data':[]}]
	
	let keys = ['deaths','cases','vaccinated','fully_vaccinated']

	$('#introdate').html(data.vaccine_passport[0]['VP Date of introduction'])

	keys.forEach(function(key,i){
		data[key].forEach(function(d){
			if(d.v!='' && d.d>'2020-12-31' && d.d<'2022-01-01'){
				let date = d3.timeParse("%Y-%m-%d")(d.d)
				let value = parseFloat(d.v)
				output[i].data.push({'x':date,'y':value})
			}
		});
	});

	createImplmentationGraph(output,data.vaccine_passport[0])
}

function createImplmentationGraph(data,implementation){
	let margin = {top: 10, right: 45, bottom: 30, left: 60},
    width = $('#implementation').width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	let svg = d3.select("#contextgraph")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")")


	let x = d3.scaleTime()
      .domain([d3.timeParse("%Y-%m-%d")('2021-01-01'),d3.timeParse("%Y-%m-%d")('2021-12-31')])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6))


    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data[1].data, function(d) { return +d.y; })])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    let y2 = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);

    svg.append("g")
   	  .attr('transform', 'translate(' + (width) + ', 0)')
      .call(d3.axisRight(y2));


    svg.append("path")
      .datum(data[1].data)
      .attr("fill", "none")
      .attr("stroke", data[0].colour)
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )

   	/*svg.append("path")
      .datum(data[1].data)
      .attr("fill", "none")
      .attr("stroke", data[1].colour)
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )
    .attr('opacity',0.50)*/

   	svg.append("path")
      .datum(data[2].data)
      .attr("fill", "none")
      .attr("stroke", data[2].colour)
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y2(d.y) })
        )
    .attr('opacity',0.50)

   	svg.append("path")
      .datum(data[3].data)
      .attr("fill", "none")
      .attr("stroke", data[3].colour)
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y2(d.y) })
        )

    let dateString = implementation['VP Date of introduction']
    let implDate = d3.timeParse("%Y-%m-%d")(dateString)
    let implX = x(implDate)

    svg.append("line")
    	.attr('x1',implX)
    	.attr('x2',implX)
    	.attr('y1',y2(0))
    	.attr('y2',y2(100))
    	.attr('stroke','#000000')
    	.attr('stroke-width','1px')

    svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", -40)
	    .attr("x", -40)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Cases per million (7 day average)");

	 	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width+35)
	    .attr("x", -70)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Vaccination rate (%)");
}

function processStatusChart(data){
	let output = []
	data['cases'].forEach(function(d){
		if(d.v!=''){
			let date = d3.timeParse("%Y-%m-%d")(d.d);
			let value = parseFloat(d.v);
			output.push({'x':date,'y':value});
		}
	});

	let status = []

	data['passport_status'].forEach(function(d){
		status.push(d3.timeParse("%Y-%m-%d")(d['Date of status change']))
	});

	createStatusChart(output,status)
	createStatusText(data['passport_status'])
}

init()