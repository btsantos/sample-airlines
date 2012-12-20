var airlinesData = function(timeToLoad) {
	this.busyTime = timeToLoad || 1000;
};

airlinesData.prototype = function() {
	var ffInfo = {
		firstName: 'Jaxon', lastName: 'Daniels', ffNum: '12345678', status: 'Diamond', miles: 55555,
    
		flights: [
			{
				id: 1111, cNum: 'ABCDED',timeToCheckIn:true,currentSegment:0,
				segments: [
					{ from: 'SEA', to: 'BOS', departDate: '6/1/2012', time: '5:00PM', flightNum: '111', seat: '5A', gate: 'C10' },
					{ from: 'BOS', to: 'SEA', departDate: '6/11/2012', time: '4:00PM', flightNum: '122', seat: '5D', gate: 'A1' }
				]
			},{
				id: 1112, cNum: 'DSLEMS', timeToCheckIn: false,currentSegment:0,
				segments: [
					{ from: 'SEA', to: 'SAN', departDate: '6/13/2012', time: '5:00PM', flightNum: '113', seat: '5A', gate: 'D10' },
					{ from: 'SAN', to: 'SEA', departDate: '6/17/2012', time: '4:00PM', flightNum: '124', seat: '5D', gate: 'B1' }
				]
			}
		]
	},
    
	getDataforFF = function(id, callback) {
		fauxAjax(function () {
			callback(ffInfo);
		}, 'getting your data ...', this);
	},
    
	logOn = function (uid, pwd, callback) {
		fauxAjax(function () {
			callback('12345678', true);
		}, 'logging you in ...', this);
	},
    
	fauxAjax = function fauxAjax(func, text, thisObj) {
		$.mobile.loading('show', { theme: 'a', textVisible: true, text:text });
		window.setTimeout(function () {
			$.mobile.loading('hide');
			func();
           
		}, thisObj.busyTime);
	};
    
	return{
		logOn:logOn,
		getDataforFF:getDataforFF
	}
}();