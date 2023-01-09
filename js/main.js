function init(){
	$('#mapoverlay').hide()
	$('#frame_2').hide()
	$('#frame_3').hide()
	$('#frame_4').hide()
	let height = window.innerHeight-32
	console.log(height)
	$('.level1nav').height(height)
	$('.level2nav').css({'maxHeight':height+'px'});
	$('#frame3viz').css({'maxHeight':height+'px'});
	$('#frame2mapcontainer').css({'maxHeight':height+'px'});
	$('#frame2viz').css({'maxHeight':height+'px'});
	$('#frame4viz').css({'maxHeight':height+'px'});
	$('#frame1viz').css({'maxHeight':height+'px'});
	initDataLoading()

}

function switchFrame(frame,map){
		$('#mapoverlay').hide()
		$('.frame').hide()
		$('#frame_'+frame).show()
		map.invalidateSize()
		$('.topframenav').removeClass('activenav')
		$('#framenav'+frame).addClass('activenav')
}

function initDataFrame1(data,world){

	let keyValues = data.map(function(d){
		return {'key':d['Country ISO3'],'value':d['Quarter'],'date':d['VP Date of introduction']}
	});

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'},{'value':2,'colour':'#d3a522'},{'value':3,'colour':'#ffd139'},{'value':4,'colour':'#ffe89c'}];

	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		data.forEach(function(row){
			console.log(row)
			if(row['Country ISO3']==iso){
				let html = `
					<h6>${row['Country']}</h6>
					<p class="p4">Date of introduction</p>
					<p class="p2">${row['VP Date of introduction']}</p>
					<p class="p4">Name of international VP</p>
					<p class="p2">${row['Name of international VP']}</p>
					<p class="p4">Name of domestic VP</p>
					<p class="p2">${row['Name of domestic VP']}</p>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}
	
	let map = initMap('frame1map',world,[keyValues],colourBands,overlay);

	$('#framenav1').on('click',function(){
		switchFrame(1,map);
	});

	$('#frame1viz').hide();
	$('#frame1legend2').hide()

	$('#frame1navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame1viz').hide()
		$('#frame1map').show()
		$('#frame1navmap').addClass('active2nav')
		$('#frame1navviz').removeClass('active2nav')
		$('#frame1legend2').hide()
		$('#frame1legend1').show()
		map.invalidateSize();
	});

	$('#frame1navviz').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame1map').hide()
		$('#frame1viz').show()
		$('#frame1navmap').removeClass('active2nav')
		$('#frame1navviz').addClass('active2nav')
		$('#frame1legend2').show()
		$('#frame1legend1').hide()
	});

	updateKeyStatsFrame1(data)

	populateViz1(data)
}

function updateKeyStatsFrame1(data){
	keys = [];

	data.forEach(function(d){
		let key = d['Country ISO3']
		if(keys.indexOf(key)==-1){
			keys.push(key)
		}
	})
	console.log(keys)
	let countNotlaunched = 0
	data.forEach(function(d){
		if(d['launched']=='No'){
			countNotlaunched++
		}
	});

	$('#frame1allcountries').html(keys.length)
	$('#frame1launched').html(keys.length-countNotlaunched)
}



function populateViz1(data){
	data.forEach(function(d){
		if(d['Deaths']!=''){
			$('#frame1viz').append('<p>'+d['Country']+'</p>')
			createViz1Chart('#frame1viz',d);
		}
	});
}

function createViz1Chart(id,data){
	let svg = d3.select(id).append("svg").attr("width", 100).attr("height", 120)

	let cases = Math.floor(Math.log10(data['Cases']*100))
	if(cases<0 || cases==0){cases = 0.2}

 	svg.append('text')
    	.attr('x',50)
    	.attr('y',15)
    	.text(data['Country ISO3'])
    	.attr('text-anchor','middle')

	let arc1 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(cases*12.5)
	    .startAngle(-Math.PI/2)
	    .endAngle(0);

	svg.append('path')
	    .attr('d', arc1)
	    .attr('fill','#7C2C77')
	    .attr("transform", "translate(50, 70)")


	let deaths = Math.floor(Math.log10(data['Deaths']*100))
	if(deaths<0 || deaths==0){deaths = 0.2}

	let arc2 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(deaths*12.5)
	    .startAngle(0)
	    .endAngle(Math.PI/2);

	svg.append('path')
	    .attr('d', arc2)
	    .attr('fill','#7C2C77')
	    .attr('opacity',0.75)
	    .attr("transform", "translate(50, 70)")

	let vaccinated = data['Vaccinated']
	

	let arc3 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(vaccinated*50)
	    .startAngle(Math.PI/2)
	    .endAngle(Math.PI);

	svg.append('path')
	    .attr('d', arc3)
	    .attr('fill','#00E1B3')
	    .attr('opacity',0.75)
	    .attr("transform", "translate(50, 70)")

	let fullyVaccinated = data['Fully Vaccinated']


	let arc4 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(fullyVaccinated*50)
	    .startAngle(Math.PI)
	    .endAngle(Math.PI*1.5);

	svg.append('path')
	    .attr('d', arc4)
	    .attr('fill','#00E1B3')
	    .attr("transform", "translate(50, 70)")

}

function initDataFrame2(data,world){

	$('frame2viz').hide();

	let keyValues = [];
	let isoCodes = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3']);
		}
	});
	for(let i =0;i<18;i++){
		keyValues[i]=[]
		isoCodes.forEach(function(iso){
			keyValues[i].push({'key':iso,'value':0});
		});
	}

	keyValues.forEach(function(keyValue,i){
		keyValue.forEach(function(country,j){
			data.forEach(function(d){
				if(d['Country ISO3']==country['key']){
					if(parseInt(d['month'])<i+2){
						country['value']++
					}
					if(!('country' in country)){
						console.log(d)
						keyValues[i][j]['country'] = d['Country name']
					}
				}
			})
		})
	})
	console.log(keyValues)

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#ffe89c'},{'value':2,'colour':'#ffd139'},{'value':3,'colour':'#d3a522'},{'value':4,'colour':'#c43b3d'}];

	let overlay = function(iso){

		let found = false
		$('#mapoverlay').html('<p>Not in dataset</p>')
		keyValues[17].forEach(function(d){
			console.log(d);
			if(d['key']==iso){
				let html = `
					<h6>${d['country']}</h6>
					<p class="p4">Total Policy Changes</p>
					<p class="p2">${d['value']}</p>
				`
				$('#mapoverlay').html(html)
				found = true
			}
		})
		if(found){$('#mapoverlay').show()} else {$('#mapoverlay').hide()}
	}


	let map = initMap('frame2map',world,keyValues,colourBands,overlay);

	map.setLayer(17);

	$('#framenav2').on('click',function(){
		switchFrame(2,map);
	});

	let sliderLabels = ['Jan 21','Feb 21','Mar 21','Apr 21','May 21','Jun 21','Jul 21','Aug 21','Sep 21','Oct 21','Nov 21','Dec 21','Jan 22','Feb 22','Mar 22','Apr 22','May 22','Jun 22']

	$('#dataframe2slider').on('change',function(){
		let layer = $(this).val();
		map.setLayer(layer-1);
		$('#frame2slidervalue').html(sliderLabels[layer-1])
	})

	$('#frame2slidervalue').html(sliderLabels[17])

	$('#frame2viz').hide();
	$('#frame2legend2').hide();

	$('#frame2navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame2viz').hide()
		$('#frame2mapcontainer').show();
		$('#frame2legend1').show();
		$('#frame2legend2').hide();
		$('#frame2navmap').addClass('active2nav')
		$('#frame2navviz').removeClass('active2nav')
		map.invalidateSize();
	});

	$('#frame2navviz').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame2mapcontainer').hide();
		$('#frame2viz').show();
		$('#frame2legend1').hide();
		$('#frame2legend2').show();
		$('#frame2navmap').removeClass('active2nav')
		$('#frame2navviz').addClass('active2nav')
	});

	populateDataFrame2Viz(data)
	updateKeyStatsFrame2(data)
}

function updateKeyStatsFrame2(data){
	
	let counts = [0,0,0,0]
	keys = [];
	data.forEach(function(d){
		let key = d['Country ISO3']
		if(keys.indexOf(key)==-1){
			keys.push(key)
		}
	})
	
	keys.forEach(function(key){
		let countrySet = data.filter(function(d){
			if(d['Country ISO3']==key){
				return true
			} else {
				return false
			}
		})
		console.log(countrySet)
		let policyCount = countrySet.length
		counts[policyCount-1]++
	})
	console.log(keys)
	$('#frame2allcountries').html(keys.length)
	$('#frame21countries').html(counts[0])
	$('#frame22countries').html(counts[1])
	$('#frame23countries').html(counts[2])
	$('#frame24countries').html(counts[3])

}

function populateDataFrame2Viz(data){

	isoCodes = [];
	countryData = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3'])
			countryData.push({'code':d['Country ISO3'],'continent':d['Continent'],'country':d['Country name'],'dates':[]})
		}
		let date = d3.timeParse("%Y-%m-%d")(d['Date of status change'])
		let last = countryData.length
		countryData[last-1]['dates'].push(date)
	});

	countryData.forEach(function(d){
		let countryCode = d['code'].toLowerCase()
		let html = `<div id="country_${countryCode}" class="countrystatusbox"> 
			<p class="p2">${d['code']}</p>
		</div>`
		let continent = d['continent'].toLowerCase().replace(' ','_')

		$('#frame2viz_'+continent).append(html)
		let id=`#country_${countryCode}`
		$(id).on('mouseover',function(e){

			let mouseX = event.pageX
        	let mouseY = event.pageY
        	console.log(mouseX)
        	console.log(window.innerWidth-400)
        	if(mouseX>window.innerWidth-400){
        		mouseX = window.innerWidth-400
        	}
        	if(mouseY>window.innerHeight-400){
        		mouseY = window.innerHeight-400
        	}

			$('#mapoverlay').css('top', mouseY);
			$('#mapoverlay').css('left', mouseX);

			$('#mapoverlay').show()
			let html = `
                <div>
                	<h5>${d['country']}</h5>
                    <ol id="statuschanges"></ol>
                </div>
            `
			$('#mapoverlay').html(html)

			let filteredData = data.filter(function(row){
				console.log(d)
				if(row['Country ISO3'] == d['code']){
					return true
				} else {
					return false
				}
			})
			console.log(filteredData)
			createStatusText(filteredData)

		})
	})

	data.forEach(function(d){
		let countryCode = d['Country ISO3'].toLowerCase()
		let id=`#country_${countryCode}`
		$(id).append('<div class="implementationbox"><span class="p2 implementationtext">'+d['Status']+'</span><img class="implementationimg" src="images/implementation_type_'+d['Status']+'.svg" width="30" ></div>')
		
	})
}

function initDataFrame3(data,world){
	let keyValues = [];
	let isoCodes = []
	data.forEach(function(d){
		if(isoCodes.indexOf(d['Country ISO3'])==-1){
			isoCodes.push(d['Country ISO3'])
		}
	});
	for(let i =0;i<20;i++){
		keyValues[i]=[]
		isoCodes.forEach(function(iso){
			keyValues[i].push({'key':iso,'value':0});
		});
	}

	keyValues.forEach(function(keyValue,i){
		keyValue.forEach(function(country){
			data.forEach(function(d){
				if(d['Country ISO3']==country['key']){
					if(parseInt(d['month'])<i+2){
						country['value']=1
					}
				}
			})
		})
	})

	let total = isoCodes.length
	$('#frame3allcountries').html(total)

	let countriesWithProtest = []
	data.forEach(function(d){
		if(d['month']!=100 && countriesWithProtest.indexOf(d['Country ISO3']==-1)){
			countriesWithProtest.push(d['Country ISO3'])
		}
	});

	let protests = countriesWithProtest.length

	$('#frame3protests').html(protests)

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#FFE89C'},{'value':1,'colour':'#C35414'}]
	console.log(keyValues)
	let map = initMap('frame3map',world,keyValues,colourBands)

	map.setLayer(19)

	$('#framenav3').on('click',function(){
		switchFrame(3,map)
	});

	$('#dataframe3slider').on('change',function(){
		let layer = $(this).val()
		map.setLayer(layer-1)
	})

	$('#frame3viz').hide()

	$('#frame3navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame3viz').hide()
		$('#frame3mapcontainer').show()
		$('#frame3navmap').addClass('active2nav')
		$('#frame3navviz').removeClass('active2nav')
		map.invalidateSize()
	});

	$('#frame3navviz').on('click',function(){
		$('#frame3mapcontainer').hide()
		$('#frame3viz').show()
		$('#frame3navmap').removeClass('active2nav')
		$('#frame3navviz').addClass('active2nav')
	});

	populateProtestTable(data);
}

function populateProtestTable(data){
	data.forEach(function(d){
		if(parseInt(d['month'])!=100){
			let html = `<tr><td>${d['Country']}</td><td>${d['Date']}</td><td>${d['Protest Notes']}</td><td><a href="${d['Link']}" target="_blank">Read more</a></td></tr>`
			$('#frame3protesttable').append(html);
		}
	});
}

function initDataFrame4(data,world){
	keyValues = [];
	keys = ['App Launched','Vaccine information','QR code','Bluetooth','Location Data','GAEN API','Centralised','Decentralised','Decommissioned and relevant data have been deleted']

	keys.forEach(function(key,i){
		newValues = []
		data.forEach(function(d){
			let value = null;

			if(d[key]=='No'){
				value = 0
			}
			if(d[key]=='Yes'){
				value = 1
			}
			newValues.push({'key':d['Country ISO3'],'value':value})
		})
		keyValues.push(newValues)
	})

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#C35414'}];

	let map = initMap('frame4map',world,keyValues,colourBands);

	$('#framenav4').on('click',function(){
		switchFrame(4,map)
	});

	$('#frame4legend2').hide()
	$('#frame4viz').hide()

	$('#frame4navmap').on('click',function(){
		$('#mapoverlay').hide()
		$('#frame4viz').hide();
		$('#frame4map').show();
		$('#frame4navmap').addClass('active2nav')
		$('#frame4navviz').removeClass('active2nav')
		$('#frame4legend1').show()
		$('#frame4legend2').hide()
		map.invalidateSize();
	});

	$('#frame4navviz').on('click',function(){
		$('#frame4map').hide();
		$('#frame4viz').show();
		$('#frame4navmap').removeClass('active2nav')
		$('#frame4navviz').addClass('active2nav')
		$('#frame4legend1').hide()
		$('#frame4legend2').show()
	});

	populateFrame4Menu(keys,map)
	populateFrame4Viz(data)
	populateFrame4KeyStats(data)
}

function populateFrame4KeyStats(data){
	let total = data.length
	let count = getKeyStats(data,'Centralised');
	$('#frame4centralised').html(count+'/'+total);
	count = getKeyStats(data,'Decentralised');
	$('#frame4decentralised').html(count+'/'+total);
	count = getKeyStats(data,'Vaccine information');
	$('#frame4vaccine').html(count+'/'+total);
	count = getKeyStats(data,'QR code');
	$('#frame4qr').html(count+'/'+total);
	count = getKeyStats(data,'Bluetooth');
	$('#frame4bluetooth').html(count+'/'+total);
	count = getKeyStats(data,'Location Data');
	$('#frame4location').html(count+'/'+total);
	count = getKeyStats(data,'GAEN API');
	$('#frame4gaen').html(count+'/'+total);

}

function getKeyStats(data,key){
	count = 0
	data.forEach(function(d){
		if(d[key]=='Yes'){
			count++
		}
	});
	return count
}

function populateFrame4Menu(keys,map){
	keys.forEach(function(key,i){
		let html = `<div><p><input type="radio" name="frame4layer" value="${i}" class="frame4nav"> ${key}</p></div>`
		if(i==0){
			html = `<div><p><input type="radio" name="frame4layer" value="${i}" class="frame4nav" checked> ${key}</p></div>`
		}
		
		$('#frame4layers').append(html)
	});

	$('.frame4nav').on('click',function(){
		let layer = $('input[name="frame4layer"]:checked').val()
		console.log(layer);
		map.setLayer(layer)
	});
}

function populateFrame4Viz(data){
	data.forEach(function(d,i){
		let html = `<div class="col-md-2 col-3">
			<p>${d['Country name']}</p>
			<div id="app_${d['Country ISO3']}" class="appiconviz">${appIcon}</div>
		</div>`
		let continent = d['Continent'].toLowerCase().replace(' ','_')
		$('#frame4viz_'+continent).append(html);
		setIcon('#app_'+d['Country ISO3'],d)
	});
}

function initDataLoading(data,map){
	$.ajax({ 
	    type: 'GET', 
	    url: '../data/world_slim.json',
	    dataType: 'json',
	    success:function(response){
			loadData('frame1',response);
			loadData('frame2',response);
			loadData('frame3',response);
			loadData('frame4',response);
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}

init();
