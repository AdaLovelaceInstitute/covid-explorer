function populatePublicationTable(data){
	data.forEach(function(d){
		let html = `<tr><td>${d['title']}</td><td>${d['date']}</td><td><a href="${d['link']}">Read More</a></td></tr>`
		$('#pubtable').append(html)
	});
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
	    	populatePublicationTable(data)
	    },
	 	error:function(e){
	 		console.log(e)
	 	}
	});	
}

let url = 'https://proxy.hxlstandard.org/data.json?dest=data_view&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uiaJOcfw3gwD4F4c3v9n8VKH41JlhxllD5-wxpdY7Oo%2Fedit%23gid%3D1649220862'
loadHXLData(url)