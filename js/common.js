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
	if(data['App Launched']=='No' || data['App Launched']=='N/A'){
		$(id).html('<p>No App</p>');
	}
	if(data['QR code']=='No' || data['QR code']=='N/A'){
		$(id + ' #qr').hide();
	}
	if(data['Vaccine information']=='No' || data['Vaccine information']=='N/A'){
		$(id + ' #vaccine').hide();
	}
	if(data['Bluetooth']=='No' || data['Bluetooth']=='N/A'){
		$(id + ' #bluetooth').hide();
	}
	if(data['Location Data']=='No' || data['Location Data']=='N/A'){
		$(id + ' #location').hide();
	}
	if(data['GAEN API'] =='No' || data['GAEN API']=='N/A'){
		$(id + ' #gaen').hide();
	}
	if(data['Decentralised']=='No' || data['Decentralised']=='N/A'){
		$(id + ' #decentralised').hide();
	}
}

function createStatusChart(data,status){
	console.log(data)
	console.log(status)

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
      .attr("stroke",'#1494E7')
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
}

function createStatusText(status){
	status.forEach(function(s,i){
		let text = statusText[s['Status']-1]
		let html = `<li>
			<p>${s['Date of status change']}</p>
			<div class="statusblock"><img src="images/implementation_type_${s['Status']}.svg" width="30"/></div><div class="statustext"><p>${text}</p></div>
		</li>`
		$('#statuschanges').append(html);
	});
}