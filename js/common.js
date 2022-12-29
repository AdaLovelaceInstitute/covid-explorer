

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
	if(data['GAEN API'] =='No' || data['GAEN API']){
		$(id + ' #gaen').hide();
	}
	if(data['Decentralised']=='No' || data['Decentralised']=='N/A'){
		$(id + ' #decentralised').hide();
	}
}