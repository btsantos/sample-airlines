var seatMapDrawing = function(){};

seatMapDrawing.prototype = function(){

    var images = new Array(),
    canvasId = 'seatMapCanvas',
    ctx=null,
    rows = 20,
    seatNumbers = ['A', 'B', 'C', 'D', 'E', 'F'],
    seat=null,
    seatsvg = "<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='20px' height='20px' viewBox='0 0 20 20' enable-background='new 0 0 20 20' xml:space='preserve'><rect x='0.5' y='0.5' fill='#FFFFFF' stroke='red' stroke-linejoin='round' stroke-miterlimit='20' width='19' height='18'/><rect x='3.5' y='17.5' fill='#FFFFFF' stroke='red' stroke-linejoin='round' stroke-miterlimit='20' width='13' height='2'/><rect x='2.042' y='4.417' fill='none' width='15.688' height='12.729'/><text transform='matrix(1 0 0 1 6.46 12.9365)' font-family='MyriadPro-Regular' color='red' style='display:none;' font-size='12'>X</text></svg>",
        
    getselectedSeat = function() {
        return seat;
    },
    
    drawSeatMap = function (el, currentSeat) {
        if (currentSeat != null) {
            seat = currentSeat;
        }
        var w = el.parent().parent().width();
        var h = el.parent().parent().height()-75;
        el.empty();
        var canvas = el.append('<canvas id="' + canvasId + '" height="' + h + '" width="' + w + '"></canvas>');
        ctx = $('#' + canvasId)[0].getContext('2d');
    
        $(canvas).on("vclick",function (e) {
            var x = Math.floor((e.pageX - $(this).offset().left));
            var y = Math.floor((e.pageY - $(this).offset().top));
            var hit = hitTest(x, y);
            if (hit !== null) {
                selectSeat(hit);
            }
        });
    
        ctx.fillStyle = "rgba(127,127,127,.8)";
        ctx.fillRect(30, 0, w - 80, h);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(40, 0, w - 100, h);
        ctx.font = "1em Helvetica";
        ctx.fillStyle = "rgba(0,0,0,1)";
        var y = 20;
        var x = 50;
        var offset = 30;
        for (var i in seatNumbers) {
            var newx = (x + (offset * i));
            if (i >= 2) {
                x = 90;
            }
            ctx.fillText(seatNumbers[i], newx, y);
        }
        x = 45;
        y = 30;
        for (var s in seatNumbers) {
            for (var i = 0; i < rows; i++) {
                var r = (i + 5);
                var num = seatNumbers[s];
                var sn = r  + num;
                var imageObj = new Image();
                var iy = (y + (i * offset));
                var img = $(imageObj);
                img.data('x', x);
                img.data('y', iy);
                img.data('seatn', sn);
                var io = getImageForSeat(r, num);
                img.data('seatstate', io.state);
                images.push(img);
                imageObj.onload = function () {
                    var timg = this;
                    var tjimg = $(timg);
                    var lx = tjimg.data('x');
                    var ly = tjimg.data('y');
                    var lsn = tjimg.data('seatn');
                    ctx.drawImage(timg, lx, ly);
                    if (seat !== null && tjimg.data('seatn') === seat) {
                        selectSeatByImg(tjimg);
                    }
                };
                imageObj.src = io.svg;
    
            }
            if (s == 2) {
                x = x + (40);
            }
            x = x + (30);
        }
      
    
    },
    
    selectSeatByNum = function (seatNum) {
    
        $(images).each(function () {
            var img = $(this);
            var selected = img.data('selected');
            if (selected) {
                img.data('selected', false);
                clearSeat(img);
            }
            if (img.data('seatn') === seatNum) {
                selectSeatByImg(img);
            }
        });
        
    },
    
    getImageForSeat = function (row, num) {
        var ret = { state: 'occupied', svg: '' };
        var lsvg = seatsvg;
        if (row != 5) {
            lsvg = lsvg.replace('red', 'rgba(127,127,127,.4)').replace('red', 'rgba(127,127,127,.4)').replace('display:none', 'display:block');
            ret.state = 'occupied';
        }
        else {
            ret.state = 'available';
        }
        ret.svg = "data:image/svg+xml;base64," + btoa(lsvg);
        return ret;
    },
    
    hitTest = function (x, y) {
        for (var i in images) {
            var img = $(images[i]);
            var ix = img.data('x');
            var iy = img.data('y'); 
            if ((x > ix && y > iy) && (x < (ix + 20) && y < (iy + 20))) {
                var state = img.data('seatstate');
                if (state !== 'occupied') {
                    $(images).each(function () {
                        var selected = $(this).data('selected');
                        if (selected) {
                            $(this).data('selected', false);
                            clearSeat($(this));
                        }
                    });
                    img.data('selected', true);
                    selectedSeat = img;
                    seat = img.data('seatn');
                    return { x: ix, y: iy };
                }
            }
        }
        return null;
    },
    
    selectSeatByImg = function (img) {    img.data('selected', true);
    
        var x = $(img).data('x');
        var y = $(img).data('y');
        selectSeat({ x: x, y: y });
    },
    
    selectSeat = function (pt) {
        ctx.fillStyle = "rgba(255,0,0,.3)";
        ctx.fillRect(pt.x, pt.y, 20, 20);
    },
    
    clearSeat = function (img) {
        var x = $(img).data('x');
        var y = $(img).data('y');
        ctx.clearRect(x, y, 20, 20);
        ctx.drawImage(img[0], x, y);
    };
    
    return{
        drawSeatMap:drawSeatMap,
        getselectedSeat:getselectedSeat
    }
    
    
    }();
