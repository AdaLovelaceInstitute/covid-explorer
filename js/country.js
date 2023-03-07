function init(){
	let iso = getCountry()

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

	let dropdownOptions = []
	let isoCodes2 = []
	data.forEach(function(d){
		if(isoCodes2.indexOf(d['Country ISO3'])==-1){
			isoCodes2.push(d['Country ISO3'])
			dropdownOptions.push({'iso':d['Country ISO3'],'country':d['Country']})
		}
		
	});

	populateCountryDrop(dropdownOptions)
}


function initPage(data){

	$('#countryname').html(data.vaccine_passport[0]['Country'])
	createContextGraph(data)
	processStatusChart(data)
	createAppIcon(data)
	populateQualData(data['qualitative'])
	populateDigitalSkills(data)
	populateVaccineSupply(data.vaccine_supply)
}

function populateVaccineSupply(data){

	if(data.length==0){

		$('#vaccine_supply').html('<p>WHO vaccine tracker does not supply enough details to break down vaccine supply by month</p>')
	} else {
		processData = []
		total = 0
		data.forEach(function(d){

			date = d3.timeParse("%Y-%m-%d")(d['Report Date'])
			total = total + d['Number of doses']/d['Population']
			value = total
			processData.push({'date':date,'value':value})
		})

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

	svg.append('title').text('A graph showing Vaccine supply over time').attr("id","contexttitle")
	let length = data.length
	let maxValue = Math.round(data[length-1].value*10)/10;

	let altText = 'In total the vaccine supply was '+ maxValue + ' vaccines per person.'
	svg.append('desc').text(altText).attr("id","contextdesc")


	let x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6))
      .attr('aria-hidden',"true")

      
    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, data[length-1].value*100])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
       .attr('aria-hidden',"true")


    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", '#BAC8D4')
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) {return x(d.date) })
        .y(function(d) { return y(d.value*100) })
        )




    svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", -40)
	    .attr("x", -40)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Vaccine supply as percent of population (%)")
	    .attr('aria-hidden',"true")

}

function createAppIcon(data){
	$('#ctaappicon').append(appIcon)
	setIcon('#ctaappicon',data['ctas'][0])
	createAppText(data['ctas'][0])
}

function createAppText(data){

	if(data['QR code']=='No'){
		$('#text_qr').addClass('apptextno')
		$('#icon_qr_yes').hide()
	} else if(data['QR code']=='Yes'){
		$('#icon_qr_no').hide()
	} else {
		$('#icon_qr_yes').hide()
		$('#icon_qr_no').css('opacity',0)
		$('#text_qr').addClass('apptextno')
	}

	if(data['Vaccine information']=='No'){
		$('#text_vaccine').addClass('apptextno')
		$('#icon_vaccine_yes').hide()
	} else if(data['Vaccine information']=='Yes'){
		$('#icon_vaccine_no').hide()
	} else {
		$('#icon_vaccine_no').hide()
		$('#text_vaccine').addClass('apptextno')
		$('#icon_vaccine_yes').css('opacity',0)
	}

	if(data['Bluetooth']=='No'){
		$('#text_bluetooth').addClass('apptextno')
		$('#icon_bluetooth_yes').hide()
	} else if(data['Bluetooth']=='Yes'){
		$('#icon_bluetooth_no').hide()
	} else {
		$('#text_bluetooth').addClass('apptextno')
		$('#icon_bluetooth_yes').hide()
		$('#icon_bluetooth_no').css('opacity',0)
	}

	if(data['Location Data']=='No'){
		$('#text_location').addClass('apptextno')
		$('#icon_location_yes').hide()
	} else if(data['Location Data']=='Yes') {
		$('#icon_location_no').hide()
	} else {
		$('#text_location').addClass('apptextno')
		$('#icon_location_yes').hide()
		$('#icon_location_no').css('opacity',0)
	}

	if(data['GAEN API'] =='No'){
		$('#text_gaen').addClass('apptextno')
		$('#icon_gaen_yes').hide()
	} else if(data['GAEN API'] =='Yes'){
		$('#icon_gaen_no').hide()
	} else {
		$('#text_gaen').addClass('apptextno')
		$('#icon_gaen_yes').hide()
		$('#icon_gaen_no').css('opacity',0)
	}

	if(data['Decentralised']=='No'){
		$('#text_decentralised').addClass('apptextno')
		$('#icon_decentralised_yes').hide()
	} else if(data['Decentralised']=='Yes'){
		$('#icon_decentralised_no').hide()
	} else {
		$('#text_decentralised').addClass('apptextno')
		$('#icon_decentralised_yes').hide()
		$('#icon_decentralised_no').css('opacity',0)
	}

	if(data['Centralised']=='No'){
		$('#text_centralised').addClass('apptextno')
		$('#icon_centralised_yes').hide()
	} else if(data['Centralised']=='Yes'){
		$('#icon_centralised_no').hide()
	} else {
		$('#text_centralised').addClass('apptextno')
		$('#icon_centralised_yes').hide()
		$('#icon_centralised_no').css('opacity',0)
	}

	if(data['data_deleted']=='No'){
		$('#text_datadecom').addClass('apptextno')
		$('#icon_datadecom_yes').hide()
	} else if(data['data_deleted']=='Yes'){
		$('#icon_datadecom_no').hide()
	} else {
		$('#text_datadecom').addClass('apptextno')
		$('#icon_datadecom_yes').hide()
		$('#icon_datadecom_no').css('opacity',0)
	}
}

function populateQualData(data){

	data.forEach(function(d){

		let html = `<tr><td><p>${d['Type']}</p></td><td><p>${d['Text']}</p></td><td><p><a href="${d['Link']}" target="_blank">Read More</a></p></td></tr>`
		$('#qualtable').append(html)
	});
	if(data.length==0){
		$('#entries').html('<p>No entries in database</p>')
	}
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


	let x = d3.scaleTime()
      .domain([d3.timeParse("%Y-%m-%d")('2021-01-01'),d3.timeParse("%Y-%m-%d")('2021-12-31')])
      .range([ 0, width ]);


  let dateString = implementation['VP Date of introduction']
  let implDate = d3.timeParse("%Y-%m-%d")(dateString)
  let implX = x(implDate)





	// append the svg object to the body of the page

	let svgTop = d3.select("#contextgraph")
	  .append("svg")


	altText = altTextForImplementationGraph(implDate,data);
	console.log(altText)

	

	let svg = svgTop
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")")


	//svg.attr('aria-labelledby',"contexttitle contextdesc")

	svg.append('title').text('Vaccine Passport Implemntation in the context of case data and vaccination rates').attr("id","contexttitle")
	svg.append('desc').text(altText).attr("id","contextdesc")

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6))
      .attr('aria-hidden',"true")


    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data[1].data, function(d) { return +d.y; })])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
       .attr('aria-hidden',"true")

    let y2 = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);

    svg.append("g")
   	  .attr('transform', 'translate(' + (width) + ', 0)')
      .call(d3.axisRight(y2))
      .attr('aria-hidden',"true")


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
	    .text("Cases per million (7 day average)")
	    .attr('aria-hidden',"true")

	 	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width+35)
	    .attr("x", -70)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Vaccination rate (%)")
	    .attr('aria-hidden',"true")

}

function altTextForImplementationGraph(date,data){
	let text = `A graph showing cases numbers and vaccination rates for 2021 and the date of vaccine passport introduction on {{ imp_date }}.
	At the time of introduction the single dose vaccination rate was {{ vaccinationrate }}% with the fully vaccinated rate being {{ fullyvaccinated }}%.
	The case rate per million was {{ caserate }}. This is {{ percentofpeak }}% of the 2021 peak.
	Compared to 14 days before the case rate had {{ change }}.`
	if(date==null){
		text = 'A graph showing cases numbers and vaccination rates for 2021. There was no digital vaccine passport implemented.'
	} else {
		let imp_date = date.toDateString()
		let vaccinationRate = Math.round(getValueFromKey(date,data[2].data) )
		let fullyVaccinated = Math.round(getValueFromKey(date,data[3].data))
		let caseRate = Math.round(getValueFromKey(date,data[1].data)*10)/10
		let max = d3.max(data[1].data,function(d){
			return d.y
		})

		let percentOfPeak =  Math.round(caseRate/max*100)

		let deltaDate = new Date(date)
		deltaDate.setDate(date.getDate()-14)

		let deltaRate = getValueFromKey(deltaDate,data[1].data)

		let percentChange = Math.round((caseRate/deltaRate -1)*100)
		let change = 'not changed significantly'
		if(percentChange>0){
			change = 'risen by ' + percentChange + '%'
		}
		if(percentChange<0){
			change = 'fallen by ' + (percentChange*-1) + '%'
		}

		text = text.replace('{{ imp_date }}',imp_date).replace('{{ vaccinationrate }}',vaccinationRate).replace('{{ fullyvaccinated }}',fullyVaccinated).replace('{{ caserate }}',caseRate).replace('{{ percentofpeak }}',percentOfPeak).replace('{{ change }}',change)
	}
	return text
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