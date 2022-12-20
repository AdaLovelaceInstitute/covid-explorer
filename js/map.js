function initMap(id,world,keyValues,colourBands){
	let map = createMap(id,world,keyValues,colourBands)
	return map
}

function createMap(id,worldMap,keyValues,colourBands){
	console.log(worldMap);
	const map = L.map(id).setView([0, 0], 2);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

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
		console.log(feature.properties['adm0_a3'],keyValues[0]);
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColour(feature.properties['adm0_a3'],keyValues[0])
		};
	}

	const geojson = L.geoJson(worldMap, {
		style
		//onEachFeature
	}).addTo(map);

	/*function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}*/

	map.setLayer = function(layerNumber){
		let data = keyValues[layerNumber];
		geojson.eachLayer(function(layer){
			console.log(layer)
			iso3 = layer.feature.properties['adm0_a3'];
			layer.setStyle({
		      fillColor: getColour(iso3,keyValues[layerNumber])
		    });
		});
	}

	return map;
}



