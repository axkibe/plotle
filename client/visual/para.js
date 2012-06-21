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

                                   .-,--.
                                    '|__/ ,-. ,-. ,-.
                                    ,|    ,-| |   ,-|
                                    `'    `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A visual paragraph representation

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Para     = null;

/**
| Imports
*/
var Caret;
var Fabric;
var Jools;
var Measure;
var Sign;
var Path;
var Point;
var config;
var shell;
var system;
var theme;
var View;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var limit         = Jools.limit;
var log           = Jools.log;
var max           = Math.max;
var min           = Math.min;
var ro            = Math.round;


/**
| Constructor.
*/
Para = function(twig, path) {
	if (twig.type !== 'Para')
		{ throw new Error('type error'); }

	this.twig = twig;
	this.path = path;
	this.key  = path.get(-1);

	// caching
	this.$fabric = null;
	this.$flow   = null;
};

/**
| Updates v-vine to match a new twig.
*/
Para.prototype.update = function(twig) {
	this.twig    = twig;
	this.$flow   = null;
	this.$fabric = null;
};

/**
| Force clears all caches.
*/
Para.prototype.knock = function() {
	this.$fabric = null;
	this.$flow   = null;
};

/**
| (re)flows the paragraph, positioning all chunks.
*/
Para.prototype.getFlow = function() {
	var item      = shell.$space.get(this.path, -2);
	var doc       = item.$graph.doc;
	var flowWidth = item.getFlowWidth();
	var fontsize  = doc.getFontSize();

	var flow  = this.$flow;
	// TODO go into subnodes instead
	var text = this.twig.text;

	if (!config.debug.noCache && flow &&
		flow.flowWidth === flowWidth &&
		flow.fontsize  === fontsize
	) return flow;

	if (shell.caret.path && shell.caret.path.equals(this.path)) {
		// remove caret cache if its within this flow.
		// TODO change
		shell.caret.cp$line  = null;
		shell.caret.cp$token = null;
	}

	// builds position informations.
	flow  = this.$flow = [];
	var spread = 0;  // width really used.

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = fontsize;
	Measure.setFont(doc.getFontSize(), doc.getFont());
	var space = Measure.width(' ');
	var line = 0;
	flow[line] = { a: [], y: y, o: 0 };

	//var reg = !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);
	var reg = (/(\s*\S+|\s+$)\s?(\s*)/g);

	for(var ca = reg.exec(text); ca !== null; ca = reg.exec(text)) {
		// a token is a word plus following hard spaces
		var token = ca[1] + ca[2];
		var w = Measure.width(token);
		xw = x + w + space;

		if (flowWidth > 0 && xw > flowWidth) {
			if (x > 0) {
				// soft break
				if (spread < xw) spread = xw;
				x = 0;
				xw = x + w + space;
				y += ro(doc.getFontSize() * (1 + theme.bottombox));
				line++;
				flow[line] = {a: [], y: y, o: ca.index};
			} else {
				// horizontal overflow
				// console.log('HORIZONTAL OVERFLOW'); // TODO
			}
		}
		flow[line].a.push({
			x: x,
			w: w,
			o: ca.index,
			t: token
		});

		x = xw;
	}
	if (spread < xw) spread = xw;

	flow.height = y;
	flow.flowWidth = flowWidth;
	flow.spread = spread;
	flow.fontsize = fontsize;
	return flow;
};

/**
| Returns the offset closest to a point.
|
| point: the point to look for
*/
Para.prototype.getPointOffset = function(point) {
	var flow = this.getFlow();
	var para = this.para;
	var doc = shell.$space.get(this.path, -1);
	Measure.setFont(doc.getFontSize(), doc.getFont());

	var line;
	for (line = 0; line < flow.length; line++) {
		if (point.y <= flow[line].y)
			{ break; }
	}
	if (line >= flow.length) line--;

	return this.getLineXOffset(line, point.x);
};

/**
| Returns the offset in flowed line number and x coordinate.
*/
Para.prototype.getLineXOffset = function(line, x) {
	var flow = this.getFlow();
	var fline = flow[line];
	var ftoken = null;
	for (var token = 0; token < fline.a.length; token++) {
		ftoken = fline.a[token];
		if (x <= ftoken.x + ftoken.w)
			{ break; }
	}
	if (token >= fline.a.length) ftoken = fline.a[--token];

	if (!ftoken) { return 0; }

	var dx   = x - ftoken.x;
	var text = ftoken.t;

	var x1 = 0, x2 = 0;
	var a;
	for(a = 0; a < text.length; a++) {
		x1 = x2;
		x2 = Measure.width(text.substr(0, a));
		if (x2 >= dx) { break; }
	}

	if (dx - x1 < x2 - dx && a > 0) a--;
	return ftoken.o + a;
};

/**
| Text has been inputted.
*/
Para.prototype.input = function(text) {
    var reg   = /([^\n]+)(\n?)/g;
	var para  = this;
	var item  = shell.$space.get(para.path, -2);
	var doc   = item.$graph.doc;

    for(var rx = reg.exec(text); rx !== null; rx = reg.exec(text)) {
		var line = rx[1];
		shell.peer.insertText(para.textPath(), shell.caret.sign.at1, line);
        if (rx[2]) {
			shell.peer.split(para.textPath(), shell.caret.sign.at1);
			para = doc.atRank(doc.twig.rankOf(para.key) + 1);
		}
    }
	item.scrollCaretIntoView();
};

/**
| Handles a special key
| TODO split into smaller functions
*/
Para.prototype.specialKey = function(key, shift, ctrl) {
	var caret  = shell.caret;
	var para   = this.para;
	var select = shell.selection;
	var item   = shell.$space.get(this.path, -2);
	var doc    = item.$graph.doc;
	var ve, at1, flow;
	var r, x;

	if (ctrl) {
		switch(key) {
		case 'a' :
			var v0 = doc.atRank(0);
			var v1 = doc.atRank(doc.twig.length - 1);

			select.sign1 = new Sign({ path: v0.textPath(), at1: 0 });
			select.sign2 = new Sign({ path: v1.textPath(), at1: v1.twig.text.length });
			select.active = true;
			shell.setCaret('space', select.sign2);
			system.setInput(select.innerText());
			caret.show();
			item.poke();
			shell.redraw = true;
			return true;
		}
	}

	if (!shift && select.active) {
		switch(key) {
		case 'down'      :
		case 'end'       :
		case 'left'      :
		case 'pageup'    :
		case 'pagedown'  :
		case 'pos1'      :
		case 'right'     :
		case 'up'        :
			select.deselect();
			shell.redraw = true;
			break;
		case 'backspace' :
		case 'del'       :
			select.remove();
			shell.redraw = true;
			key = null;
			break;
		case 'enter'     :
			select.remove();
			shell.redraw = true;
			break;
		}
	} else if (shift && !select.active) {
		switch(key) {
		case 'backup'   :
		case 'down'     :
		case 'end'      :
		case 'left'     :
		case 'pagedown' :
		case 'pos1'     :
		case 'right'    :
		case 'up'       :
			select.sign1 = caret.sign;
			item.poke();
		}
	}

	switch(key) {
	case  'backspace' :
		if (caret.sign.at1 > 0) {
			shell.peer.removeText(this.textPath(), caret.sign.at1 - 1, 1);
		} else {
			r = doc.twig.rankOf(this.key);
			if (r > 0) {
				ve = doc.atRank(r - 1);
				shell.peer.join(ve.textPath(), ve.twig.text.length);
			}
		}
		item.scrollCaretIntoView();
		break;
	case 'enter' :
		shell.peer.split(this.textPath(), caret.sign.at1);
		item.scrollCaretIntoView();
		break;
	case 'pageup' :
		item.scrollPage(true);
		break;
	case 'pagedown' :
		item.scrollPage(false);
		break;
	case 'end' :
		caret = shell.setCaret(
			'space',
			{
				path : this.textPath(),
				at1  : this.twig.text.length
			}
		);
		break;
	case 'pos1' :
		caret = shell.setCaret(
			'space',
			{
				path : this.textPath(),
				at1  : 0
			}
		);
		item.scrollCaretIntoView();
		break;
	case 'left' :
		if (caret.sign.at1 > 0) {
			caret = shell.setCaret(
				'space',
				{
					path : this.textPath(),
					at1  : caret.sign.at1 - 1
				}
			);
		} else {
			r = doc.twig.rankOf(this.key);
			if (r > 0) {
				ve = doc.atRank(r - 1);
				caret = shell.setCaret(
					'space',
					{
						path : ve.textPath(),
						at1  : ve.twig.text.length
					}
				);
			}
		}
		item.scrollCaretIntoView();
		break;
	case 'up' :
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.$pos.x;

		if (caret.flow$line > 0) {
			// stay within this para
			at1 = this.getLineXOffset(caret.flow$line - 1, x);
			caret = shell.setCaret(
				'space',
				{
					path : this.textPath(),
					at1  : at1
				},
				x
			);
		} else {
			// goto prev para
			r = doc.twig.rankOf(this.key);
			if (r > 0) {
				ve = doc.atRank(r - 1);
				at1 = ve.getLineXOffset(ve.getFlow().length - 1, x);
				caret = shell.setCaret(
					'space',
					{
						path : ve.textPath(),
						at1  : at1
					},
					x
				);
			}
		}
		item.scrollCaretIntoView();
		break;
	case 'right' :
		if (caret.sign.at1 < this.twig.text.length) {
			caret = shell.setCaret(
				'space',
				{
					path : this.textPath(),
					at1  : caret.sign.at1 + 1
				}
			);
		} else {
			r = doc.twig.rankOf(this.key);
			if (r < doc.twig.length - 1) {
				ve = doc.atRank(r + 1);

				caret = shell.setCaret(
					'space',
					{
						path : ve.textPath(),
						at1  : 0
					}
				);
			}
		}
		item.scrollCaretIntoView();
		break;
	case 'down' :
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.$pos.x;

		if (caret.flow$line < flow.length - 1) {
			// stays within this para
			at1 = this.getLineXOffset(caret.flow$line + 1, x);
			caret = shell.setCaret(
				'space',
				{
					path: this.textPath(),
					at1: at1
				},
				x
			);
		} else {
			// goto next para
			r = doc.twig.rankOf(this.key);
			if (r < doc.twig.length - 1) {
				ve = doc.atRank(r + 1);
				at1 = ve.getLineXOffset(0, x);
				caret = shell.setCaret(
					'space',
					{
						path : ve.textPath(),
						at1  : at1
					},
					x
				);
			}
		}
		item.scrollCaretIntoView();
		break;
	case 'del' :
		if (caret.sign.at1 < this.twig.text.length) {
			shell.peer.removeText(this.textPath(), caret.sign.at1, 1);
		} else {
			r = doc.twig.rankOf(this.key);
			if (r < doc.twig.length - 1) {
				shell.peer.join(this.textPath(), this.twig.text.length);
			}
		}
		break;
	}


	if (shift) {
		switch(key) {
		case 'end'   :
		case 'pos1'  :
		case 'left'  :
		case 'up'    :
		case 'right' :
		case 'down'  :
			select.active = true;
			select.sign2 = caret.sign;
			system.setInput(select.innerText());
			item.poke();
			shell.redraw = true;
			break;
		}
	}

	caret.show();
	shell.redraw = true; // TODO might be optimized
};

/**
| Return the path to the .text attribute if this para.
| TODO use lazyFixate.
*/
Para.prototype.textPath = function() {
	if (this._textPath) return this._textPath;
	return (this._textPath = new Path(this.path, '++', 'text'));
};

/**
| Returns the height of the para
*/
Para.prototype.getHeight = function() {
	var flow = this.getFlow();
	var doc = shell.$space.get(this.path, -1);
	return flow.height + ro(doc.getFontSize() * theme.bottombox);
};

/**
| Draws the paragraph in its cache and returns it.
*/
Para.prototype.draw = function(fabric, view, pnw) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var flow   = this.getFlow();
	var width  = flow.spread * view.zoom;
	var doc    = shell.$space.get(this.path, -1);
	var height = this.getHeight() * view.zoom;
	var $f     = this.$fabric;

	// cache hit?
	if (config.debug.noCache ||
		!$f ||
		$f.width  !== width  ||
		$f.height !== height ||
		view.zoom !== $f.$zoom
	) {
		// TODO: work out exact height for text below baseline
		$f = this.$fabric = new Fabric(width, height);
		$f.scale(view.zoom);
		$f.$zoom = view.zoom;
		$f.setFont(doc.getFontSize(), doc.getFont(), 'black', 'start', 'alphabetic');
    
		// draws text into the fabric
		for(var a = 0, aZ = flow.length; a < aZ; a++) {
			var line = flow[a];
			for(var b = 0, bZ = line.a.length; b < bZ; b++) {
				var chunk = line.a[b];
				$f.fillText(
					chunk.t,
					chunk.x,
					line.y
				);
			}
		}
	}

	fabric.drawImage($f, pnw);
};

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| flowPos$: if set, writes flow$line and flow$token to
|           the flow position used.
|
| TODO change to multireturn.
| TODO rename
*/
Para.prototype.getOffsetPoint = function(offset, flowPos$) {
	// TODO cache position
	var twig = this.twig;
	var doc  = shell.$space.get(this.path, -1);
	Measure.setFont(doc.getFontSize(), doc.getFont());
	var text = twig.text;
	var flow = this.getFlow();
	var a;

	// TODO improve loops
	var al = flow.length - 1;
	for (a = 1; a < flow.length; a++) {
		if (flow[a].o > offset) {
			al = a - 1;
			break;
		}
	}
	var line = flow[al];

	var at = line.a.length - 1;
	for (a = 1; a < line.a.length; a++) {
		if (line.a[a].o > offset) {
			at = a - 1;
			break;
		}
	}
	var token = line.a[at];
	if (!token) { token = { x: 0, o : 0 }; }

	if (flowPos$) {
		flowPos$.flow$line  = al;
		flowPos$.flow$token = at;
	}

	// TODO use token. text instead.
	var px = ro(token.x + Measure.width(text.substring(token.o, offset)));
	var py = line.y;

	return new Point(px, py);
};

/**
| Returns the caret position relative to the doc.
*/
Para.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var item    = shell.$space.get(this.path, -2);
	var doc     = item.$graph.doc;
	var fs      = doc.getFontSize();
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1, shell.caret);

	var s = ro(p.y + descend);
	var n = s - ro(fs + descend);
	var	x = p.x - 1;

	return immute({ s: s, n: n, x: x });
};


/**
| Draws the caret if its in this paragraph.
*/
Para.prototype.drawCaret = function(view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var caret = shell.caret;
	var item  = shell.$space.get(this.path, -2);
	var doc   = item.$graph.doc;
	var zone  = item.getZone();
	var cpos  = caret.$pos  = this.getCaretPos();
	var pnw   = doc.getPNW(this.key);
	var sbary = item.scrollbarY;
	var sy    = sbary ? ro(sbary.getPos()) : 0;

	var cyn = limit(0, cpos.n + pnw.y - sy, zone.height);
	var cys = limit(0, cpos.s + pnw.y - sy, zone.height);
	var cx  = cpos.x + pnw.x;

	var ch  = ro((cys - cyn) * view.zoom);
	if (ch === 0) { return; }

	var cp = view.point(cx + zone.pnw.x, cyn + zone.pnw.y);
	shell.caret.$screenPos = cp;

	if (Caret.useGetImageData) {
		shell.caret.$save = shell.fabric.getImageData(cp.x, cp.y, 3, ch + 2);
	} else {
		// paradoxically this is often way faster, especially on firefox
		shell.caret.$save = new Fabric(shell.fabric.width, shell.fabric.height);
		shell.caret.$save.drawImage(shell.fabric, 0, 0);
	}

	shell.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, ch);
};

})();
