
// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    
	// Prevent screen bounce
	$(document).bind('touchmove', function (e) {
		e.preventDefault();
	});
}

var flightForCheckin;
var flightForDetails;
var ffNum = null;
var customerData = null;
var login = false;
var boardingPasses = new Array();

$('#tripDetail').live('pagebeforeshow', function () {
	var seg = flightForDetails.segments[0];
	$('#tripDetail-title').text(seg.from + ' to ' + seg.to);
	$('#tripDetail-flightNum').text(seg.flightNum);
	$('#tripDetail-depart').text(seg.departDate + ' at ' + seg.time);
	$('#tripDetail-seat').text(seg.seat);
	seg = flightForDetails.segments[0];
	$('#tripDetail-return-title').text(seg.from + ' to ' + seg.to);
	$('#tripDetail-return-flightNum').text(seg.flightNum);
	$('#tripDetail-return-depart').text(seg.departDate + ' at ' + seg.time);
	$('#tripDetail-return-seat').text(seg.seat);

});

$('#boardingPass').live('pagebeforeshow', function () {

	var currentseg = flightForCheckin.segments[flightForCheckin.currentSegment];

	$('#boardingpass-cnum').text(flightForCheckin.cNum);
	$('#boardingpass-passenger').text(customerData.firstName + ' ' + customerData.lastName);
	$('#boardingpass-seat').text(currentseg.seat);
	$('#boardingpass-gate').text(currentseg.gate);
	$('#boardingpass-depart').text(currentseg.time);
	var flight = currentseg.flightNum + ':' + currentseg.from + ' to ' + currentseg.to;
	$('#boardingpass-flight').text(flight);

});

$('#home').live('pageshow', function () {

	if (!login) {
		$.mobile.changePage("#logon", { transition: "flip" });
		$('#login').submit(function () {
			$(this).hide();
			login = true;
			logOn($('#userName').val(), $('#pwd').val(), function (ff, success) {
				if (success) {

					ffNum = ff;
					getDataforFF(ffnum, function (data) {
						customerData = data;
						$('#ffname').text(data.firstName);
						$('#ffnum').text(data.ffNum);
						$('#currentStatus').text(data.status);
						$('#miles').text(data.miles);
						$('#numberOfFlights').text('(' + data.flights.length + ')');
						var flightList = $('#myTripsListView');
						for (var i in data.flights) {
							var flight = data.flights[i];
							var currentSegment = flight.segments[flight.currentSegment];
							flightList.append('<li id="' + flight.id + '"><a href="#tripDetail">' + currentSegment.from + ' to ' + currentSegment.to + '</a></li>');
							var item = $('#' + flight.id, flightList);
							item.data('flight', flight);
							if (flight.timeToCheckIn) {

								item.addClass('checkIn');
								$('a', item).attr('href', '#checkIn');
							}
							else {
								item.addClass('tripDetail');
							}
						}
						$.mobile.changePage('#home', { transition: 'flip' });

					});
				}
			});
			return false;
		});
	}
});

$('.tripDetail').live('click', function () {
	var item = $(this);
	console.log(item.attr('id'));
	flightForDetails = item.data('flight');
});

$('.checkIn').live('click', function () {
	var item = $(this);
	console.log(item.attr('id'));
	flightForCheckin = item.data('flight');
});

$('#checkIn').live('pageshow', function (event) {
	var currentseg = flightForCheckin.segments[flightForCheckin.currentSegment];
	var seat = currentseg.seat;
	var flight = currentseg.flightNum + ':' + currentseg.from + ' to ' + currentseg.to;
	$('#checkIn-flight').text(flight);
	$('#checkIn-seat').text(seat);
});

$('#seatPicker').live('pageshow', function (event) {
	var el = $('#seatMapPickerContainer', this);
	var seat = flightForCheckin.segments[flightForCheckin.currentSegment].seat;
	drawSeatMap(el, seat);

});

$('#seatPicker').live('pagebeforehide', function (event) {
	flightForCheckin.segments[flightForCheckin.currentSegment].seat = getselectedSeat();
});