function initMap(id,world,keyValues,colourBands,mouseover){
	let map = createMap(id,world,keyValues,colourBands,mouseover)
	return map
}

function createMap(id,worldMap,keyValues,colourBands,mouseover){
	console.log(worldMap);
	const map = L.map(id,{zoomSnap: 0.5}).setView([20, 0], 1.5);

	/*const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);*/

	function getColour(iso3,keyValues) {
		let value = getValue(iso3,keyValues)
		let colour = '#d5e0e8';
		if(value!=null){
			colour = colourBands[0]['colour'];
			colourBands.forEach(function(d,i){
				if(i>0){
					if(value>=d['value']){
						colour = d['colour']
					}
				}
			});
		}
		return colour
	}

	function getValue(key,keyValues){
		let value = null;
		keyValues.forEach(function(d){
			if(key==d['key']){
				value = parseInt(d['value'])
			}
		});
		return value;
	}

	function style(feature) {
		return {
			weight: 1,
			opacity: 1,
			color: 'white',
			fillOpacity: 0.7,
			fillColor: getColour(feature.properties['adm0_a3'],keyValues[0])
		};
	}

	const geojson = L.geoJson(worldMap, {
		style,
		onEachFeature
	}).addTo(map);


	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: function(feature){
				let mouseX = feature.originalEvent.pageX
				let mouseY = feature.originalEvent.pageY
				$('#mapoverlay').css('top', mouseY);
    			$('#mapoverlay').css('left', mouseX);
    			console.log(feature)
				mouseover(feature.target.feature.properties.adm0_a3)
			},
			mouseout: function(){
				//$('#mapoverlay').hide()
			}
		})
	}

	map.setLayer = function(layerNumber){
		let data = keyValues[layerNumber];
		geojson.eachLayer(function(layer){
			iso3 = layer.feature.properties['adm0_a3'];
			layer.setStyle({
		      fillColor: getColour(iso3,data)
		    });
		});
	}

	return map;
}



