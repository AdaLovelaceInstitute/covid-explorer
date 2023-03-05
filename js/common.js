let statusText = [
	'VP not in use or not enforced. Available but not compulsory.',
	'Mandatory for in-bound travellers.',
	'Mandatory for in-bound travellers. Domestic use decided by regional governments.',
	'Not Mandatory for in-bound travellers. Domestic use decided by regional governments.',
	'Mandatory for foreign visitors but not for returning nationals and residents. Domestic use decided by regional governments.',
	'Mandatory for foreign visitors, but not for returning nationals and residents. Domestic use decided at a federal level.',
	'Mandatory Self Isolation for visitors, regardless of possession of Vaccine Passport',
	'Mandatory self isolation for visitors, regardless of possession of Vaccine Passport. Federal Policy for domestic use.'
]

function setIcon(id,data){
	console.log(data);

	console.log(data['App Launched'])

	let implementedText = '';

	if(data['App Launched']=='No'){
		$(id + ' svg').attr('opacity',0)
	} else if(data['App Launched']=='N/A'){
		$(id + ' svg').attr('opacity',0.25)
	}

	if(data['QR code']=='No'){
		$(id + ' #qr').hide();
	} else if(data['QR code']=='N/A'){
		$(id + ' #qr').attr('opacity',0.25);
	} else {
		implementedText+= ' QR Code,'
	}

	if(data['Vaccine information']=='No'){
		$(id + ' #vaccine').hide();
	} else if(data['Vaccine information']=='N/A'){
		$(id + ' #vaccine').attr('opacity',0.25);
	} else {
		implementedText+= ' Vaccine information,'
	}

	if(data['Bluetooth']=='No'){
		$(id + ' #bluetooth').hide();
	} else if(data['Bluetooth']=='N/A'){
		$(id + ' #vaccine').attr('opacity',0.25);
	} else {
		implementedText+= ' Bluetooth,'
	}

	if(data['Location Data']=='No'){
		$(id + ' #location').hide();
	} else if(data['Location Data']=='N/A'){
		$(id + ' #vaccine').attr('opacity',0.25);
	} else {
		implementedText+= ' Location Data,'
	}

	if(data['GAEN API'] =='No'){
		$(id + ' #gaen').hide();
	} else if(data['GAEN API']=='N/A'=='N/A'){
		$(id + ' #vaccine').attr('opacity',0.25);
	} else {
		implementedText+= ' GAEN API,'
	}

	if(data['Decentralised']=='No'){
		$(id + ' #decentralised').hide();
	} else if(data['Decentralised']=='N/A'){
		$(id + ' #vaccine').attr('opacity',0.25);
	} else {
		implementedText+= ' Decentralised Technology,'
	}

	if(data['Centralised']=='Yes'){
		$(id + ' #path16').css('fill','#FFD139');
	} else {
		implementedText+= ' Centralised Technology,'
	}
	console.log(implementedText)
	$(id + ' .implementedtech').html(implementedText)
	return implementedText
}

function createStatusChart(data,status){
	console.log(data)
	console.log(status)
	console.log('status chart')
	let divWidth = 300
	if($('#implementation').length>0){
		divWidth = $('#implementation').width()
	}

	let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width =  divWidth - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	let svg = d3.select("#statusgraph")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")")


  altText = createStatusAltText(data,status)

  svg.append('title').text('Changes in vaccine passport policies').attr("id","contexttitle")
	svg.append('desc').text(altText).attr("id","contextdesc")



	console.log(data);
	let x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.x; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(4))


    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.y; })])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke",'#7c2c77')
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
    )
    console.log(status)

    svg.selectAll('lines')
    	.data(status)
    	.enter()
    	.append('line')
    	.attr('x1',function(d){
    		console.log(d)
    		console.log(x(d))
    		return x(d)
    	})
    	.attr('x2',function(d){
    		return x(d)
    	})
    	.attr('y1',40)
    	.attr('y2',height)
    	.attr('stroke','#000000')
    	.attr('stroke-width','1px')

    svg.selectAll('labels')
    	.data(status)
    	.enter()
    	.append('text')
    	.attr('x',function(d){
    		return x(d)
    	})
    	.attr('y',30)
    	.text(function(d,i){
    		return (i+1)
    	})
    	.attr('dx',-5)

     svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", -40)
	    .attr("x", -40)
	    .style('font-size','10px')
	    .attr("transform", "rotate(-90)")
	    .text("Cases per million (7 day average)");
}

function createStatusText(status){
	status.forEach(function(s,i){
		let text = statusText[s['Status']-1]
		let html = `<li>
			<div class="statuslistbox">
			<p>${s['Date of status change']}</p>
			<div class="statusblock"><img src="images/implementation_type_${s['Status']}.svg" width="30"/></div><div class="statustext"><p>${text}</p></div>
			</div>
		</li>`
		$('#statuschanges').append(html);
	});
}

function createStatusAltText(data,status){

	let changeTextIntro = ['first','second','third','fourth','fifth','sixth','seventh','eigth','ninth']

	let text = ''
	if(status.length==0){
		text = 'There were no changes in vaccine passport restrictions. '
	} else if(status.length==1){
		text = 'There was 1 change in vaccinepassport restriction. '
	} else {
		text = 'There were '+status.length+' changes in passport restriction. '
	}

	let max = d3.max(data,function(d){
		return d.y
	})

	status.forEach(function(s,i){

		let date = s

		let statustext = 'The {{ index }} restriction change happened on {{ date }} when cases were {{ percentpeak }}% of the highest case rate seen and had {{ percentchange }} over the last 14 days. '
		console.log(data)
		console.log(date)
		let caseRate = Math.round(getValueFromKey(date,data)*10)/10

		let percentOfPeak =  Math.round(caseRate/max*100)

		let deltaDate = new Date(date)
		deltaDate.setDate(date.getDate()-14)

		let deltaRate = getValueFromKey(deltaDate,data)

		let percentChange = Math.round((caseRate/deltaRate -1)*100)
		let change = 'not changed significantly'
		if(percentChange>0){
			change = 'risen by ' + percentChange + '%'
		}
		if(percentChange<0){
			change = 'fallen by ' + (percentChange*-1) + '%'
		}

		finaltext = statustext.replace('{{ index }}',changeTextIntro[i]).replace('{{ date }}',date.toDateString()).replace('{{ percentpeak }}',percentOfPeak).replace('{{ percentchange }}',change)

		text += finaltext
	});
	return text
}

function getValueFromKey(date,data){
	let output = 0

	data.forEach(function(d){
		if(d.x.toDateString()==date.toDateString()){

			output = d.y
		}
	})
	return output
}

function populateCountryDrop(data){
	data = data.sort(function(a,b){
		return (a.country > b.country) ? 1 : -1
	})
	data.forEach(function(d){
		let html = `<a class="dropdown-item" href="country.html?iso=${d['iso']}">${d['country']}</a>`
		$('#countrydropdownitems').append(html)
	});
}






