var iBeacon = (function()
{
	// Application object.
	var iBeacon = {};

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	iBeacon.initialize = function()
	{
		console.log('initializing iBeacon');
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(iBeacon.onDeviceReady()) },
			false);
	};

	iBeacon.onDeviceReady  = function()
	{
		// Start tracking beacons!
		iBeacon.startScan();
	
		// Display refresh timer.
		//setInterval(iBeacon.displayBeaconList(), 1000);
	};


	iBeacon.startScan = function()
	{
		function onBeaconsRanged(beaconInfo)
		{
			console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				
				
				// Insert beacon into table of found beacons.
				// Filter out beacons with invalid RSSI values.
				var beacon = beaconInfo.beacons[i];
				if (beacon.rssi < 0)
				{
					beacon.timeStamp = Date.now();
					var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
					beacons[key] = beacon;
				}
				main.check_for_beacon(beacon);
			}
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		estimote.beacons.requestAlwaysAuthorization();

		// Start ranging beacons.
		estimote.beacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			onError);
		
		return {
			onBeaconsRanged:onBeaconsRanged,
			onError:onError
		};
	};

	iBeacon.displayBeaconList = function()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();

		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			console.log(beacon);
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				// Create tag to display beacon data.
				var element = $(
					'<li>'
					+	'Major: ' + beacon.major + '<br />'
					+	'Minor: ' + beacon.minor + '<br />'
					+	iBeacon.proximityHTML(beacon)
					+	iBeacon.distanceHTML(beacon)
					+	iBeacon.rssiHTML(beacon)
					+ '</li>'
				);

				$('#found-beacons').iBeaconend(element);
			}
		});
	};
	iBeacon.check_for_beacon_in_range = function (range,beacon){
		
		
		if(beacon.distance <= range){
				
				return true;
		}
	
		
		return false;
		
	};
	
	iBeacon.proximityHTML = function(beacon)
	{
		var proximity = beacon.proximity;
		if (!proximity) { return ''; }

		var proximityNames = [
			'Unknown',
			'Immediate',
			'Near',
			'Far'];

		return 'Proximity: ' + proximityNames[proximity] + '<br />';
	};

	iBeacon.distanceHTML = function(beacon)
	{
		var meters = beacon.distance;
		if (!meters) { return ''; }

		var distance =
			(meters > 1) ?
				meters.toFixed(3) + ' m' :
				(meters * 100).toFixed(3) + ' cm';

		if (meters < 0) { distance = '?'; }

		return 'Distance: ' + distance + '<br />'
	};

	iBeacon.rssiHTML = function (beacon)
	{
		var beaconColors = [
			'rgb(214,212,34)', // unknown
			'rgb(215,228,177)', // mint
			'rgb(165,213,209)', // ice
			'rgb(45,39,86)', // blueberry
			'rgb(200,200,200)', // white
			'rgb(200,200,200)', // transparent
		];

		// Get color value.
		var color = beacon.color || 0;
		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);
		var rgb = beaconColors[color];

		// Map the RSSI value to a width in percent for the indicator.
		var rssiWidth = 1; // Used when RSSI is zero or greater.
		if (beacon.rssi < -100) { rssiWidth = 100; }
		else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }
		// Scale values since they tend to be a bit low.
		rssiWidth *= 1.5;

		var html =
			'RSSI: ' + beacon.rssi + '<br />'
			+ '<div style="background:' + rgb + ';height:20px;width:'
			+ 		rssiWidth + '%;"></div>'

		return html;
	};

	return iBeacon;
})();

//iBeacon.initialize();
