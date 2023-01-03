function init(){
	$('#frame_2').hide()
	$('#frame_3').hide()
	$('#frame_4').hide()
	initDataLoading()

}

function switchFrame(frame,map){
		$('.frame').hide()
		$('#frame_'+frame).show()
		map.invalidateSize()
		$('.topframenav').removeClass('activenav')
		$('#framenav'+frame).addClass('activenav')
}

function initDataFrame1(data,world){

	let keyValues = data.map(function(d){
		return {'key':d['Country ISO3'],'value':d['Quarter']}
	});

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'},{'value':2,'colour':'#d3a522'},{'value':3,'colour':'#ffd139'},{'value':4,'colour':'#ffe89c'}];
	
	let map = initMap('frame1map',world,[keyValues],colourBands);

	$('#framenav1').on('click',function(){
		switchFrame(1,map);
	});

	$('#frame1viz').hide();

	$('#frame1navmap').on('click',function(){
		$('#frame1viz').hide()
		$('#frame1map').show()
		$('#frame1navmap').addClass('active2nav')
		$('#frame1navviz').removeClass('active2nav')
		map.invalidateSize();
	});

	$('#frame1navviz').on('click',function(){
		$('#frame1map').hide();
		$('#frame1viz').show();
		$('#frame1navmap').removeClass('active2nav')
		$('#frame1navviz').addClass('active2nav')
	});

	updateKeyStatsFrame1(data)

	populateViz1(data)
}

function updateKeyStatsFrame1(data){

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
	let svg = d3.select(id).append("svg").attr("width", 100).attr("height", 100)

	let cases = Math.floor(Math.log10(data['Cases']*100))
	if(cases<0 || cases==0){cases = 0.2}

	let arc1 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(cases*12.5)
	    .startAngle(-Math.PI/2)
	    .endAngle(0);

	svg.append('path')
	    .attr('d', arc1)
	    .attr('fill','#1494E7')
	    .attr("transform", "translate(50, 50)")


	let deaths = Math.floor(Math.log10(data['Deaths']*100))
	if(deaths<0 || deaths==0){deaths = 0.2}

	let arc2 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(deaths*12.5)
	    .startAngle(0)
	    .endAngle(Math.PI/2);

	svg.append('path')
	    .attr('d', arc2)
	    .attr('fill','#1494E7')
	    .attr('opacity',0.75)
	    .attr("transform", "translate(50, 50)")

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
	    .attr("transform", "translate(50, 50)")

	let fullyVaccinated = data['Fully Vaccinated']


	let arc4 = d3.arc()
	    .innerRadius(0)
	    .outerRadius(fullyVaccinated*50)
	    .startAngle(Math.PI)
	    .endAngle(Math.PI*1.5);

	svg.append('path')
	    .attr('d', arc4)
	    .attr('fill','#00E1B3')
	    .attr("transform", "translate(50, 50)")

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
		keyValue.forEach(function(country){
			data.forEach(function(d){
				if(d['Country ISO3']==country['key']){
					if(parseInt(d['month'])<i+2){
						country['value']++
					}
				}
			})
		})
	})

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#ffe89c'},{'value':2,'colour':'#ffd139'},{'value':3,'colour':'#d3a522'},{'value':4,'colour':'#c43b3d'}];

	let map = initMap('frame2map',world,keyValues,colourBands);

	map.setLayer(17);

	$('#framenav2').on('click',function(){
		switchFrame(2,map);
	});

	$('#dataframe2slider').on('change',function(){
		let layer = $(this).val();
		map.setLayer(layer-1);
	})

	$('#frame2viz').hide();

	$('#frame2navmap').on('click',function(){
		$('#frame2viz').hide();
		$('#frame2mapcontainer').show();
		$('#frame2legend1').show();
		$('#frame2legend2').hide();
		$('#frame2navmap').addClass('active2nav')
		$('#frame2navviz').removeClass('active2nav')
		map.invalidateSize();
	});

	$('#frame2navviz').on('click',function(){
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
			countryData.push({'code':d['Country ISO3'],'continent':d['Continent'],'country':d['Country name']})
		}
	});
	countryData.forEach(function(d){
		let countryCode = d['code'].toLowerCase()
		let html = `<div id="country_${countryCode}" class="countrystatusbox"> 
			<p class="p2">${d['code']}</p>
		</div>`
		let continent = d['continent'].toLowerCase().replace(' ','_')

		$('#frame2viz_'+continent).append(html)
	})

	data.forEach(function(d){
		let countryCode = d['Country ISO3'].toLowerCase()
		let id=`#country_${countryCode}`
		$(id).append('<div class="implementationbox"><span class="p2 implementationtext">'+d['Status']+'</span><img class="implementationimg" src="images/implementation_type_'+d['Status']+'.svg" width="30" ></div>')
	});
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

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'}];
	
	let map = initMap('frame3map',world,keyValues,colourBands);

	map.setLayer(19)

	$('#framenav3').on('click',function(){
		switchFrame(3,map)
	});

	$('#dataframe3slider').on('change',function(){
		let layer = $(this).val()
		map.setLayer(layer-1)
	})

	$('#frame3navmap').on('click',function(){
		$('#frame3viz').hide()
		$('#frame3mapcontainer').show()
		map.invalidateSize()
	});

	$('#frame3navviz').on('click',function(){
		$('#frame3mapcontainer').hide()
		$('#frame3viz').show()
	});

	populateProtestTable(data);
}

function populateProtestTable(data){
	data.forEach(function(d){
		let html = `<tr><td>${d['Country']}</td><td>${d['Date']}</td><td>${d['Protest Notes']}</td></tr>`
		$('#frame3protesttable').append(html);
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

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#009933'}];

	let map = initMap('frame4map',world,keyValues,colourBands);

	$('#framenav4').on('click',function(){
		switchFrame(4,map)
	});

	$('#frame4navmap').on('click',function(){
		$('#frame4viz').hide();
		$('#frame4map').show();
		map.invalidateSize();
	});

	$('#frame4navviz').on('click',function(){
		$('#frame4map').hide();
		$('#frame4viz').show();
	});

	populateFrame4Menu(keys,map)
	populateFrame4Viz(data)
}

function populateFrame4Menu(keys,map){
	keys.forEach(function(key,i){
		let html = `<div><button class="frame4navbutton btn" data-layer="${i}">${key}</button></div>`
		$('#frame4nav').append(html)
	});

	$('.frame4navbutton').on('click',function(){
		let layer = $(this).attr('data-layer')
		map.setLayer(layer)
	});
}

function populateFrame4Viz(data){
	data.forEach(function(d,i){
		let html = `<div class="col-md-2 col-3">
			<p>${d['Country name']}</p>
			<div id="app_${d['Country ISO3']}">${appIcon}</div>
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
