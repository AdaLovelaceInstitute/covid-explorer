function populateCountryMenu(data){
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
	populateCountryDrop(dropdownOptions)
}

function loadHXLData(url){
	console.log('Loading HXL data')
	$.ajax({ 
	    type: 'GET', 
	    url: url,
	    dataType: 'json',
	    success:function(response){
	    	let data = hxlProxyToJSON(response)
	    	console.log(data)
	    	populateCountryMenu(data)
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D0'
loadHXLData(url)