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

                             ,,--.          . .-,--' .
                             |`, | .  , ,-. |  \|__  |  ,-. . , , ,-. ,-.
                             |   | | /  ,-| |   |    |  | | |/|/  |-' |
                             `---' `'   `-^ `' `'    `' `-' ' '   `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Makes a double oval with 6 segments.


      a1      |----->|
      a2      |->|   '
              '  '   '           b2
          ..-----.. .' . . . . . A
        ,' \  n  / ','       b1  |
       , nw .---. ne , . . . A   |
 pc>   |---(  +  )---| . . . v . v
       ' sw `---' se '
        `. /  s  \ .'
          ``-----''             outside = null

 pc:     center
 a1,b1:  width and height of inner oval
 a2,b2:  width and height of outer oval
 segs: which segments to include

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Fabric;
var Jools;
var Point;
var Rect;

/**
| Exports
*/
var OvalFlower = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug        = Jools.debug;
var fixate       = Jools.fixate;
var half         = Jools.half;
var immute       = Jools.immute;
var is           = Jools.is;
var isnon        = Jools.isnon;
var lazyFixate   = Jools.lazyFixate;
var log          = Jools.log;
var magic        = Fabric.magic;
var max          = Math.max;
var min          = Math.min;
var ro           = Math.round;

OvalFlower = function(pc, dimensions, segs) {
	this.pc = pc;
	this.a1 = dimensions.a1;
	this.a2 = dimensions.a2;
	this.b1 = dimensions.b1;
	this.b2 = dimensions.b2;

	this.gradientPC = pc;
	this.gradientR0 = 0;
	this.gradientR1 = max(this.a2, this.b2);
	this.segs = segs;
	immute(this);
};

/**
| Makes the OvalFlower path.
*/
OvalFlower.prototype.path = function(fabric, border, twist, pan, segment) {
	var pc   = this.pc;
	var pcx  = pc.x + pan.x;
	var pcy  = pc.y + pan.y;
	var segs = this.segs;
	var a1   = this.a1;
	var b1   = this.b1;
	var a2   = this.a2;
	var b2   = this.b2;
	var bo   = border;

	var m    = magic;
	var am1  = m * this.a1;
	var bm1  = m * this.b1;
	var am2  = m * this.a2;
	var bm2  = m * this.b2;

	fabric.beginPath(twist);
	// inner oval
	if (segment === null || segment === 'c') {
		fabric.moveTo(                       pcx - a1 + bo, pcy);
		fabric.beziTo(  0, -bm1, -am1,    0, pcx,           pcy - b1 + bo);
		fabric.beziTo( am1,   0,    0, -bm1, pcx + a1 - bo, pcy);
		// @@ workaround chrome pixel error
		fabric.lineTo(                       pcx + a1 - bo, pcy - 1);
		fabric.beziTo(  0,  bm1,  am1,    0, pcx,           pcy + b1 - bo);
		fabric.beziTo(-am1,   0,    0,  bm1, pcx - a1 + bo, pcy);
	}

	// outer oval
	if (segment === null || segment === 'outer') {
		fabric.moveTo(                       pcx - a2 + bo, pcy);
		fabric.beziTo(  0, -bm2, -am2,    0, pcx,           pcy - b2 + bo);
		fabric.beziTo( am2,   0,    0, -bm2, pcx + a2 - bo, pcy);
		// @@ workaround chrome pixel error
		fabric.lineTo(                       pcx + a2 - bo, pcy - 1);
		fabric.beziTo(  0,  bm2,  am2,    0, pcx,           pcy + b2 - bo);
		fabric.beziTo(-am2,   0,    0,  bm2, pcx - a2 + bo, pcy);
	}

	var bs  = half(b2 - b1 - 0.5);
	var bss = half(b2 - b1) - 2;
	var bms =  ro((b2 - b1) / 2 * m);
	var odbg = segment === null && false; // <- to see all remove && false

	if (segment === 'n' || odbg) {
		var pny = pcy - b1 - bs;
		fabric.moveTo(                       pcx - a1 + bo, pny);
		fabric.beziTo(  0, -bms, -am1,    0, pcx,           pny - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pcx + a1 - bo, pny);
		fabric.beziTo(  0,  bms,  am1,    0, pcx,           pny + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pcx - a1 + bo, pny);
	}
	if (segment === 'ne' || odbg) {
		var pney = pcy - bs;
		var pnex = pcx + ro(a2 * m);
		fabric.moveTo(                       pnex - a1 + bo, pney);
		fabric.beziTo(  0, -bms, -am1,    0, pnex,           pney - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pnex + a1 - bo, pney);
		fabric.beziTo(  0,  bms,  am1,    0, pnex,           pney + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pnex - a1 + bo, pney);
	}
	if (segment === 'se' || odbg) {
		var psey = pcy + bs;
		var psex = pcx + ro(a2 * m);
		fabric.moveTo(                       psex - a1 + bo, psey);
		fabric.beziTo(  0, -bms, -am1,    0, psex,           psey - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, psex + a1 - bo, psey);
		fabric.beziTo(  0,  bms,  am1,    0, psex,           psey + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, psex - a1 + bo, psey);
	}
	if (segment === 's' || odbg) {
		var psy = pcy + b1 + bs;
		fabric.moveTo(                       pcx - a1 + bo, psy);
		fabric.beziTo(  0, -bms, -am1,    0, pcx,           psy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pcx + a1 - bo, psy);
		fabric.beziTo(  0,  bms,  am1,    0, pcx,           psy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pcx - a1 + bo, psy);
	}
	if (segment === 'sw' || odbg) {
		var pswy = pcy + bs;
		var pswx = pcx - ro(a2 * m);
		fabric.moveTo(                       pswx - a1 + bo, pswy);
		fabric.beziTo(  0, -bms, -am1,    0, pswx,           pswy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pswx + a1 - bo, pswy);
		fabric.beziTo(  0,  bms,  am1,    0, pswx,           pswy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pswx - a1 + bo, pswy);
	}
	if (segment === 'nw' || odbg) {
		var pnwy = pcy - bs;
		var pnwx = pcx - ro(a2 * m);
		fabric.moveTo(                       pnwx - a1 + bo, pnwy);
		fabric.beziTo(  0, -bms, -am1,    0, pnwx,           pnwy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pnwx + a1 - bo, pnwy);
		fabric.beziTo(  0,  bms,  am1,    0, pnwx,           pnwy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pnwx - a1 + bo, pnwy);
	}
};

/**
| Returns the segment the point is within.
*/
OvalFlower.prototype.within = function(fabric, pan, p) {
	// @@ quick null if out of box.
	if (!fabric.within(this, 'path', pan, p, 'outer')) { return null; }
	if (isnon(this.segs.c ) && fabric.within(this, 'path', pan, p, 'c' )) { return 'c';  }
	if (isnon(this.segs.n ) && fabric.within(this, 'path', pan, p, 'n' )) { return 'n';  }
	if (isnon(this.segs.ne) && fabric.within(this, 'path', pan, p, 'ne')) { return 'ne'; }
	if (isnon(this.segs.se) && fabric.within(this, 'path', pan, p, 'se')) { return 'se'; }
	if (isnon(this.segs.e ) && fabric.within(this, 'path', pan, p, 'e' )) { return 's';  }
	if (isnon(this.segs.sw) && fabric.within(this, 'path', pan, p, 'sw')) { return 'sw'; }
	if (isnon(this.segs.nw) && fabric.within(this, 'path', pan, p, 'nw')) { return 'nw'; }
	return 'gap';
};

})();
