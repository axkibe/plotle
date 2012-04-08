/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                  ,--.         .         .
                                 | `-' ,-. ,-. | , ,-. . |-
                                 |   . | | |   |<  | | | |
                                 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                   '
 The unmoving interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Fabric;
var Path;
var Tree;

var theme;
var system;

/**
| Exports
*/
var Cockpit;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('shell.js needs a browser!'); }

var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var debug         = Jools.debug;
var fixate        = Jools.fixate;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var half          = Fabric.half;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;


/**
| +++Mainboard+++
*/
var Mainboard = function(fw, fh) {
	this.fw            = fw;
	this.fh            = fh;
	var fmx = this.fmx = half(fw);

	this.pnw = new Point(fmx - 512, fh - 60);
	this.pse = new Point(fmx + 512, fh);
	this.width       = 512 * 2;
	this.gradientPC  = new Point(fmx, fh + 450);
	this.gradientR0  = 0;
	this.gradientR1  = 650;

	this._sideButtonWidth = 190;
	this._mTopCurve       = 300;
	this._sideSkew        = 200;
	this._sideCurve       =  60;

	this._sideButtonBX1 = R(this._sideSkew  / 1.4);
	this._sideButtonBY1 = R(this._sideCurve / 1.4);
	this._sideButtonBX2 =  15;
	this._sideButtonBY2 =  50;

	this._highlight       = null;
};

/**
| Paths the mainboards frame
*/
Mainboard.prototype.path = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fmx = this.fmx;
	var tc  = this._mTopCurve;
	var sc  = this._sideCurve;
	var sk  = this._sideSkew;
	var b   = border;

	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + b, pse.y);

	fabric.beziTo(sk, -sc + b, -tc,      0,       fmx,  pnw.y + b);
	fabric.beziTo(tc,       0,  -sk, -sc +b, pse.x - b, pse.y);
};

/**
| Paths the left side button
*/
Mainboard.prototype.pathLeft = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var sbw = this._sideButtonWidth;
	var x1  = this._sideButtonBX1;
	var y1  = this._sideButtonBY1;
	var x2  = this._sideButtonBX2;
	var y2  = this._sideButtonBY2;
	var b    = border;
	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + b, pse.y);
	fabric.beziTo(x1, -y1 + b, -x2, -y2 + b, pnw.x + sbw - b,  pse.y);
};

/**
| Paths the right side button
*/
Mainboard.prototype.pathRight = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var sbw = this._sideButtonWidth;
	var x1  = this._sideButtonBX1;
	var y1  = this._sideButtonBY1;
	var x2  = this._sideButtonBX2;
	var y2  = this._sideButtonBY2;
	var b    = border;
	fabric.beginPath(twist);
	fabric.moveTo(pse.x - b, pse.y);
	fabric.beziTo(-x1, -y1 + b, x2, -y2 + b, pse.x - sbw + b,  pse.y);
};


/**
| Draws the mainboards contents
*/
Mainboard.prototype.draw = function(fabric, user, curSpace, msg) {
	fabric.paint(theme.cockpit.style, this, 'path');

	var stHighlight = theme.cockpit.highlight;
	var stSides     = theme.cockpit.sides;
	var hl          = this._highlight;

	fabric.paint(hl === 'left'  ? stHighlight : stSides, this, 'pathLeft');
	fabric.paint(hl === 'right' ? stHighlight : stSides, this, 'pathRight');

	msg = "This is a message just for testing.";

	var fmx = this.fmx;
	var pnw = this.pnw;
	var pse = this.pse;

	var userX        = pnw.x + 240;
	var spaceX       = fmx;
	var msgX         = pse.x - 450;
	var sideButtonX1 = pnw.x + 135;
	var sideButtonX2 = pse.x - 135;

	var spaceY1      = pse.y - 39;
	var spaceY2      = pse.y - 15;
	var userY1       = pse.y - 34;
	var userY2       = pse.y - 11;
	var msgY1        = pse.y - 20;
	var sideButtonY  = pse.y -  9;


	fabric.fontStyle('14px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
	fabric.fillText('login', sideButtonX1, sideButtonY);
	fabric.fillText('register', sideButtonX2, sideButtonY);

	if (isnon(msg)) {
		fabric.fontStyle('12px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'start', 'alphabetic');
		fabric.fillText(msg, msgX, msgY1);
	}

	if (isnon(curSpace)) {
		fabric.fontStyle('12px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
		fabric.fillText('current space:', spaceX, spaceY1);

		fabric.fontStyle('22px bold  ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
		fabric.fillText(curSpace, spaceX, spaceY2);
	}

	if (isnon(user)) {
		fabric.fontStyle('12px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
		fabric.fillText('Hello ', userX, userY1);

		fabric.fontStyle('18px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
		fabric.fillText(user, userX, userY2);
	}
}

/**
| Returns true if point is on this mainboard
*/
Mainboard.prototype.within = function(fabric, p, area) {
	var pnw = this.pnw;
	var pse = this.pse;

	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) { return false; }
	switch (area) {
	case null:    return fabric.within(this, 'path',      p);
	case 'left':  return fabric.within(this, 'pathLeft',  p);
	case 'right': return fabric.within(this, 'pathRight', p);
	default:      throw new Error('invalid mainboard area');
	}
}


/**
| Sets the highlighted element.
*/
Mainboard.prototype.setHighlight = function(highlight) {
	if (this._highlight !== highlight) { shell.redraw = true; }
	this._highlight = highlight;
}


/**
| +++Loginboard+++
*/
var Loginboard = function(fw, fh) {
	this.fw            = fw;
	this.fh            = fh;
	var fmx = this.fmx = half(fw);

	this.pnw = new Point(fmx - 512, fh - 130);
	this.pse = new Point(fmx + 512, fh);
	this.width       = 512 * 2;
	this.gradientPC  = new Point(fmx, fh + 450);
	this.gradientR0  = 0;
	this.gradientR1  = 650;

	this._sideButtonWidth = 190;
	this._mTopCurve       = 300;
	this._sideSkew        = 200;
	this._sideCurve       =  60;

/*	this._sideButtonBX1 = R(this._sideSkew  / 1.4);
	this._sideButtonBY1 = R(this._sideCurve / 1.4);
	this._sideButtonBX2 =  15;
	this._sideButtonBY2 =  50;*/

	this._highlight       = null;
};

/**
| Paths the loginboards frame
*/
Loginboard.prototype.path = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fmx = this.fmx;
	var tc  = this._mTopCurve;
	var sc  = this._sideCurve;
	var sk  = this._sideSkew;
	var b   = border;

	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + b, pse.y);

	fabric.beziTo(sk, -sc + b, -tc,      0,       fmx,  pnw.y + b);
	fabric.beziTo(tc,       0,  -sk, -sc +b, pse.x - b, pse.y);
};

/**
| Paths the usernames input field.
*/
Loginboard.prototype.pathUsername = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fmx = this.fmx;
	var bo  = border;

	var px  = fmx - 15;
	var py  = this.pse.y - 81;
	var w   = 220;
	var h   = 28;
	var ww  = half(w);
	var hh  = half(h);
	var wwk = R(w * 0.4);
	var wwl = ww - wwk;
	var hhk = R(h * 0.3);
	var hhl = hh - hhk;

	fabric.beginPath(twist);
	fabric.moveTo(                         px + wwk,     py - hh  + bo);
	fabric.beziTo( wwl,     0,    0, -hhl, px + ww - bo, py - hhk);
	fabric.lineTo(                         px + ww - bo, py + hhk);
	fabric.beziTo(   0,   hhl,  wwl,    0, px + wwk,     py + hh - bo);
	fabric.lineTo(                         px - wwk,     py + hh - bo);
	fabric.beziTo(-wwl,     0,    0,  hhl, px - ww + bo, py + hhk);
	// @@ workarounds chrome pixel error
	fabric.lineTo(                         px - ww + bo, py + hhk + 1);
	fabric.lineTo(                         px - ww + bo, py - hhk);
	fabric.beziTo(    0, -hhl, -wwl,    0, px - wwk,     py - hh + bo);
	fabric.lineTo(                         px + wwk,     py - hh + bo);

	//fabric.moveTo(pnwx, pnwy);
	//fabric.lineTo(psex, pnwy);
	//fabric.lineTo(psex, psey);
	//fabric.lineTo(pnwx, psey);
	//fabric.lineTo(pnwx, pnwy);
};

/**
| Draws the mainboards contents
*/
Loginboard.prototype.draw = function(fabric) {
	fabric.paint(theme.cockpit.style, this, 'path');

	var stHighlight = theme.cockpit.highlight;
	var hl          = this._highlight;

	var fmx = this.fmx;
	var pnw = this.pnw;
	var pse = this.pse;

	var sideLabelX = pnw.x + 145;
	var sideLabelY = pse.y -  13;

	var userLabelX = fmx    - 220;
	var userLabelY = pse.y  -  75;
	var passLabelX = fmx    - 220;
	var passLabelY = pse.y  -  40;

	//fabric.fontStyle('22px bold ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
	//fabric.fillText('login', sideLabelX, sideLabelY);

	fabric.fontStyle('16px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'left', 'alphabetic');
	fabric.fillText('username', userLabelX, userLabelY);
	fabric.fillText('password', passLabelX, passLabelY);

	fabric.paint(theme.cockpit.field, this, 'pathUsername');
}

/**
| Returns true if point is on this mainboard
*/
Loginboard.prototype.within = function(fabric, p, area) {
	var pnw = this.pnw;
	var pse = this.pse;

	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) { return false; }
	switch (area) {
	case null:    return fabric.within(this, 'path',      p);
	default:      throw new Error('invalid loginboard area');
	}
}


/**
| Sets the highlighted element.
*/
Mainboard.prototype.setHighlight = function(highlight) {
	if (this._highlight !== highlight) { shell.redraw = true; }
	this._highlight = highlight;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   '
 The unmoving interface.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Cockpit = function() {
	this.fabric      = system.fabric;
	this._state      = null;

	this.$mainboard  = null;
	this.$loginboard = null;

	this._user       = null;
	this._curSpace   = null;
	this._message    = null;
};

/**
| Sends a message over the mainboard.
*/
Cockpit.prototype.message = function(message) {
	this._message = message;
}

/**
| Sets the space name displayed on the mainboard.
*/
Cockpit.prototype.setCurSpace = function(curSpace) {
	this._curSpace = curSpace;
}

/**
| Sets the user greeted on the mainboard
*/
Cockpit.prototype.setUser = function(user, loggedIn) {
	this._user     = user;
	this._loggedIn = loggedIn;
}


/**
| Returns the shape of the mainboard
*/
Cockpit.prototype.mainboard = function(fabric) {
	if (this.$mainboard &&
		this.$mainboard.fw === fabric.width &&
		this.$mainboard.fh === fabric.height)
	{ return this.$mainboard } else
	{ return this.$mainboard = new Mainboard(fabric.width, fabric.height); }
}

/**
| Returns the shape of the loginboard
*/
Cockpit.prototype.loginboard = function(fabric) {
	if (this.$loginboard &&
		this.$loginboard.fw === fabric.width &&
		this.$loginboard.fh === fabric.height)
	{ return this.$loginboard } else
	{ return this.$loginboard = new Loginboard(fabric.width, fabric.height); }
}

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var fabric    = this.fabric;

	switch (this._state) {
	case null :
		this.mainboard(fabric).draw(fabric, this._user, this._curSpace, this._message);
		break;
	case 'login' :
		this.loginboard(fabric).draw(fabric);
		break;
	}
};


/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	var fabric    = this.fabric;
	switch (this._state) {
	case null :
		var mb = this.mainboard(fabric);
		if (!mb.within(fabric, p, null)) {
			mb.setHighlight(null);
			return false;
		}
		system.setCursor('default');
		if (mb.within(fabric, p, 'left')) {
			mb.setHighlight('left');
		} else if (mb.within(fabric, p, 'right')) {
			mb.setHighlight('right');
		} else {
			mb.setHighlight(null);
		}
		break;
	case 'login' :
		break;
	default :
		throw new Error('invalid cockpit state' + this._state);
	}

	return true;
};

/**
| Login button clicked.
*/
Cockpit.prototype.loginButtonClick = function() {
	this._state  = 'login';
	shell.redraw = true;
}

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	var fabric = this.fabric;

	switch(this._state) {
	case null:
		var mb     = this.mainboard(fabric);
		if (!mb.within(fabric, p, null)) { return null; }
		if (mb.within(fabric, p, 'left')) {
			this.loginButtonClick();
			return false;
		}
	case 'login' :
		this._state  = null;
		shell.redraw = true;
		break;
	default :
		throw new Error('invalid cockpit state: ' + this._state);
	}

	return false;
};

})();
