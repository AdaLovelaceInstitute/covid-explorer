////////////////////////
//country page functions
////////////////////////

function loadCountryData(iso3){

	let countryData = {
		'vaccinated':[],
		'fully_vaccinated':[],
		'cases':[],
		'deaths':[],
		'vaccine_passport':[],
		'passport_status':[],
		'protests':[],
		'qualitative':[],
		'ctas':{},
		'loaded':5
	}

	function initCountryPage(){
		countryData['loaded'] = countryData['loaded'] - 1
		console.log(countryData['loaded']);
		if(countryData['loaded']>0){
			return;
		}

		console.log(countryData);
	}
	
	let secondaryDataload = function(data){
		countryData['vaccinated'] = data['v'];
		countryData['fully_vaccinated'] = data['fv'];
		countryData['cases'] = data['c'];
		countryData['deaths'] = data['d'];
		initCountryPage()
		
	}

	let secondaryURL = `../data/country_data_secondary/${iso3}.json`

	loadJSONData(secondaryURL,secondaryDataload);

	//vps

	let vaccinepassportLoad =  function(data){
		countryData['vaccine_passport'] = getCountryData(data,iso3)
		initCountryPage()
	}

	let vaccineURL = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D0'

	loadHXLData(vaccineURL,vaccinepassportLoad)

	//vp status

	let vaccineStatusLoad =  function(data){
		countryData['protests'] = getCountryData(data,iso3)
		initCountryPage()
	}

	let vaccineStatusURL = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D1900190177'

	loadHXLData(vaccineStatusURL,vaccineStatusLoad)

	//protests

	let protestLoad =  function(data){
		countryData['passport_status'] = getCountryData(data,iso3)
		initCountryPage()
	}

	let protestURL = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D1038755742'

	loadHXLData(protestURL,protestLoad)

	//ctas

	let ctaLoad =  function(data){
		countryData['ctas'] = getCountryData(data,iso3)
		initCountryPage()
	}

	let ctasURL = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D244037440'

	loadHXLData(protestURL,protestLoad)
}



function getCountryData(data,iso3){
	output = data.filter(function(d){
		if(d['Country ISO3']==iso3){
			return true
		} else {
			return false
		}
	});
	return output
}

////////////////////
//main dash function
////////////////////

function loadData(frame,world){
	if(frame=='frame1'){
		loadFrame1(world)
	}
	if(frame=='frame2'){
		loadFrame2(world)
	}

	if(frame=='frame3'){
		loadFrame3(world)
	}

	if(frame=='frame4'){
		loadFrame4(world)
	}

}

function loadFrame1(world){
	console.log('Loading Frame1')

	let initFrame1 =  function(data){
		console.log('Init frame 1');
		console.log(world)
		initDataFrame1(data,world);
	}

	let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D0'

	loadHXLData(url,initFrame1,world)

}

function loadFrame2(world){
	console.log('Loading Frame2')
	
	let initFrame2 =  function(data,world){
		console.log('Init frame 2');
		console.log(data);
	}

	let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D1900190177'

	loadHXLData(url,initFrame2)

}

function loadFrame3(){
	console.log('Loading Frame3')
	
	let initFrame3 =  function(data){
		console.log('Init frame 3');
		console.log(data);
	}

	let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D1038755742'

	loadHXLData(url,initFrame3)

}

function loadFrame4(){
	console.log('Loading Frame3')
	
	let initFrame4 =  function(data){
		console.log('Init frame 4');
		console.log(data);
	}

	let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D244037440'

	loadHXLData(url,initFrame4)

}

////////////////////
//general functions
////////////////////


function hxlProxyToJSON(input){
	output = [];
	keys = input[0]
	input.forEach(function(row,i){
		if(i>1){
			let dataRow = {}
			row.forEach(function(d,i){
				dataRow[keys[i]] = d
			});
			output.push(dataRow);
		}
	});

    return output;
}

function loadHXLData(url,successfunction){
	console.log('Loading HXL data')
	$.ajax({ 
	    type: 'GET', 
	    url: url,
	    dataType: 'json',
	    success:function(response){
	    	let data = hxlProxyToJSON(response)
	    	console.log(data)
	    	successfunction(data)
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}

function loadJSONData(url,successfunction){
	console.log('Loading HXL data')
	$.ajax({ 
	    type: 'GET', 
	    url: url,
	    dataType: 'json',
	    success:function(response){
	    	console.log(response)
	    	successfunction(response)
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}