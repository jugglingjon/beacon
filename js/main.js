var main = {

	startScan: function(){
		$('.start-scan').hide();
		$('.loader').show();
		$('.dir-text').text('Searching for beacon...');
		app.initialize();
		
	},
	
	setToQuestion:function(){
		app.stop();
		$('.content').html('<div class="back-btn" onclick="main.setToStartScan();">Back</div><p class="dir-text">This is some question text.</p>');
		
	},
	setToStartScan:function(){
		var html = '';
		html += '<p class="dir-text">Push the button below to start scanning for an iBeacon.</p>';
		html += '<div class="start-scan" onclick="main.startScan();">Start Scan</div>';
		html += '<div class="loader"></div> ';
		$('.content').html(html);
		$('.start-scan').show();
		$('.loader').hide();
	},



};

