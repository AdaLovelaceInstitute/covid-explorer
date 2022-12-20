function init(){
	initListeners();
	initDataLoading();
}

function initListeners(){
	$('.topframenav').on('click',function(){
		let frameID = $(this).attr('data-id')
		$('.frame').hide();
		$('#'+frameID).show();

		console.log('Nav to frame ' + frameID)
	});	
}

function initDataFrame1(data,world){

	let keyValues = data.map(function(d){
		return {'key':d['Country ISO3'],'value':d['Quarter']}
	});

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'},{'value':2,'colour':'#d3a522'},{'value':3,'colour':'#ffd139'},{'value':4,'colour':'#ffe89c'}];
	
	let map = initMap('frame1map',world,[keyValues],colourBands);
}

function initDataFrame2(data){
	let keyValues = data.map(function(d){
		return {'key':d['Country ISO3'],'value':d['Quarter']}
	});

	let colourBands = [{'value':'none','colour':'#bac8d4'},{'value':0,'colour':'#bac8d4'},{'value':1,'colour':'#c43b3d'},{'value':2,'colour':'#d3a522'},{'value':3,'colour':'#ffd139'},{'value':4,'colour':'#ffe89c'}];

}

function initDataLoading(data,map){
	$.ajax({ 
	    type: 'GET', 
	    url: '../data/world_slim.json',
	    dataType: 'json',
	    success:function(response){
	    	console.log(response);
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