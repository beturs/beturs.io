function Meter(canvas, startInterval, goodStrokeHandler, badStrokeHandler) {
    this._ctx = canvas.getContext('2d');
    this._timer = null;
    this._angle = 180;
    this._currentAngle = 180;
    this._direction = true;
    this._successfulHits = 0;
    this._goodStrokeHandler = goodStrokeHandler;
    this._badStrokeHandler = badStrokeHandler;
    this._interval = startInterval || 500;

    var lengthNeedle = canvas.width > canvas.height ? canvas.height - canvas.height * .1 : canvas.width - canvas.width * .1;

    this._needle = new Needle(this._ctx, canvas.width / 2, canvas.height - 15, lengthNeedle);
}

Meter.prototype.draw = function (angle) {
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    this._needle.draw(this._ctx, this._currentAngle);
}

Meter.prototype.startMeter = function () {
    var that = this;
    this._timer = setInterval(function() { 
        if (that._direction && that._currentAngle >= that._angle) {
            that._currentAngle -= 5;
        } else if (!that._direction && that._currentAngle <= that._angle) {
            that._currentAngle += 5;
        } else {
            that.generateNewMovement();
        }
        that.draw();
    }, this._interval);
    $(window).on('keypress', function (e) {
        if (e.which === 32) {
            if (that._angle >= 67 && that._angle <= 113) {
                that.goodStroke();
            } else {
                that.badStroke();
            }
        }
    });
}

Meter.prototype.generateNewMovement = function () {
    var prevAngle = this._angle;
    this._angle = Math.floor((Math.random() * 180) + 0);
    this._direction = this._angle >= prevAngle
}

Meter.prototype.stopMeter = function () {
    clearInterval(this._timer);
    $(window).off('keypress');
}

Meter.prototype.goodStroke = function () {
    this._successfulHits++;
    if (this._successfulHits >= 3 && this._interval >= 5) {
        console.log(this._successfulHits);
        console.log(this._interval);
        this.stopMeter();
        this._interval--;
        this.startMeter();
        this._successfulHits = 0;
    }
    if (this._goodStrokeHandler) {
        this._goodStrokeHandler();
    }
    console.log('Fine stroke');
}

Meter.prototype.badStroke = function () {
    if (this._badStrokeHandler) {
        this._badStrokeHandler();
        document.getElementById('pain').pause();
        document.getElementById('pain').currentTime = 0;
        document.getElementById('pain').play();
    }
    console.log('Bad stroke');
}
