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

                                   ,.   ,. .---.
                                   `|  /   \___  ,-. ,-. ,-. ,-.
                                    | /        \ | | ,-| |   |-'
                                    `'     `---' |-' `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                 '
 The visual of a space.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Action;
var Fabric;
var Jools;
var OvalMenu;
var Path;

var shell;
var system;
var theme;
var peer;

var VNote;
var VLabel;
var VRelation;

/**
| Exports
*/
var VSpace = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .           .          .
 \___  |-. ,-. ,-. |- ,-. . . |- ,-.
     \ | | | | |   |  |   | | |  `-.
 `---' ' ' `-' '   `' `-' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var debug     = Jools.debug;
var immute    = Jools.immute;
var is        = Jools.is;
var isnon     = Jools.isnon;
var log       = Jools.log;
var half      = Fabric.half;
var Line      = Fabric.Line;
var Point     = Fabric.Point;
var Rect      = Fabric.Rect;

/**
| Constructor
*/
VSpace = function(twig, path, access) {
	this.twig        = twig;
	this.path        = path;
	this.access      = access;
	this.key         = path.get(-1);
	this.fabric      = new Fabric(system.fabric);
	this.zoom        = 1; // @@
	var vv = this.vv = {};

	for (var k in twig.copse) {
		vv[k] = this.createVItem(twig.copse[k], k);
	}

	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
};

/**
| Updates v-vine to match a new twig.
*/
VSpace.prototype.update = function(tree, chgX) {
	var twig = tree.root.copse[this.key];

	// no change?
	if (this.twig === twig) { return; }

	this.twig = twig;

	var vo = this.vv;
	var vv = this.vv = {};
	var copse = twig.copse;
	for(var k in copse) {
		var sub = twig.copse[k];
		var o = vo[k];
		if (is(o)) {
			if (o.twig !== sub) {
				o.update(sub);
			}
			vv[k] = o;
		} else {
			vv[k] = this.createVItem(sub, k);
		}
	}

	// removeis the focus if the focussed item is removed.
	var caret = shell.caret;
	var csign = caret.sign;
	
	if (caret.visec === 'space' &&
		csign && csign.path &&
		csign.path.get(0) === this.key &&
		!isnon(vv[csign.path.get(1)])
	) {
		if (shell.selection.active &&
			shell.selection.sign1.path.get(-4) === csign.path.get(1))
		{ shell.selection.deselect(true); }

		this.setFocus(null, null);
	}
	shell.redraw = true;
};


/**
| Returns the entity of path
*/
VSpace.prototype.getEntity = function(path) {
	if (path.get(0) !== this.key) {
		throw new Error('getting entity of not current space',
			path.get(0), '!=', this.key
		);
	}
	return this.vv[path.get(1)] || null;
};

/**
| Returns the focused item.
*/
VSpace.prototype.focusedVItem = function() {
	var caret = shell.caret;
	if (caret.visec !== 'space') { return null; }
	return this.getEntity(caret.sign.path);
};

/**
| Creates a new visual representation of an item.
*/
VSpace.prototype.createVItem = function(twig, k) {
	var ipath = new Path(this.path, '++', k);
	switch (twig.type) {
	case 'Note'     : return new VNote    (twig, ipath, this);
	case 'Label'    : return new VLabel   (twig, ipath, this);
	case 'Relation' : return new VRelation(twig, ipath, this);
	default : throw new Error('unknown type: '+twig.type);
	}
};

/**
| Redraws the complete space.
*/
VSpace.prototype.draw = function() {
	var twig  = this.twig;

	for(var r = twig.length - 1; r >= 0; r--) {
		this.vAtRank(r).draw(this.fabric);
	}

	var focus = this.focusedVItem();
	if (focus) { focus.drawHandles(this.fabric); }

	var action = shell.action;
	switch (action && action.type) {
	case Action.RELBIND :
		var av  = action.vitem;
		var av2 = action.vitem2;
		var target = av2 ? av2.getZone() : action.move.sub(this.fabric.pan);
		var arrow = Line.connect(av.getZone(), 'normal', target, 'arrow');
		if (av2) av2.highlight(this.fabric);
		arrow.draw(this.fabric, theme.relation.style);
		break;
	}
};

/**
| Draws the caret.
*/
VSpace.prototype.drawCaret = function() {
	this.vget(shell.caret.sign.path, -1).drawCaret();
};

/**
| Sets the focused item or blurs it if vitem is null
*/
VSpace.prototype.setFocus = function(vitem) {
	var focus = this.focusedVItem();
	if (focus && focus === vitem) { return; }

	var caret = shell.caret;

	if (vitem) {
		var vdoc = vitem.vv.doc;

		caret = shell.setCaret(
			'space',
			{
				path : vdoc.vAtRank(0).textPath(),
				at1  : 0
			}
		);

		caret.show();
		peer.moveToTop(vitem.path);
	} else {
		shell.setCaret(null, null); // TODO only one null
	}
};

/**
| Returns the vtwig at rank 'rank'.
|
| @@: put in a common prototype for all visuals with ranks?
*/
VSpace.prototype.vAtRank = function(rank) {
	return this.vv[this.twig.ranks[rank]];
};

/**
| Mouse wheel
*/
VSpace.prototype.mousewheel = function(p, dir, shift, ctrl) {
	var twig = this.twig;

	var pp = p.sub(this.fabric.pan);
	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		var vitem = this.vAtRank(r);
		if (vitem.mousewheel(pp, dir)) { return true; }
	}

	// @@ zooming.
	return true;
};

/**
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
VSpace.prototype.mousehover = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	var focus = this.focusedVItem();
	if (focus) {
		// @@ move into items
		if (focus.withinItemMenu(pp)) {
			system.setCursor('pointer');
			return true;
		}

		var com = focus.checkItemCompass(pp);
		if (com) {
			system.setCursor(com+'-resize');
			return true;
		}
	}

	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.mousehover(pp)) { return true; }
	}
	// no hits
	system.setCursor('crosshair');
	return true;
};

/**
| Starts an operation with the mouse button held down.
*/
VSpace.prototype.dragstart = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var focus = this.focusedVItem();

	// see if the itemmenu of the focus was targeted
	if (this.access == 'rw' && focus && focus.withinItemMenu(pp)) {
		shell.startAction(Action.RELBIND, focus, p);
		system.setCursor('default');
		shell.redraw = true;
		return true;
	}

	// see if one item was targeted
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.dragstart(pp, shift, ctrl, this.access)) return true;
	}

	// otherwise do panning
	shell.startAction(Action.PAN, null, pp);
	system.setCursor('crosshair');
	return true;
};

/**
| A mouse click.
*/
VSpace.prototype.click = function(p, shift, ctrl) {
	var self = this;
	var pan  = this.fabric.pan;
	var pp   = p.sub(pan);
	var action;

	// clicked the tab of the focused item?
	var focus = this.focusedVItem();
	if (focus && focus.withinItemMenu(pp)) {
		var labels = {n : 'Remove'};
		shell.setMenu(new OvalMenu(
			system.fabric,
			focus.getOvalSlice().pm.add(pan),
			theme.ovalmenu,
			labels,
			function(entry, p) {
				self.itemMenuSelect(entry, p, focus);
			}
		));
		shell.redraw = true;
		return;
	}

	// clicked some item?
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.click(pp)) return true;
	}

	// otherwhise pop up the float menu
	shell.setMenu(new OvalMenu(
		system.fabric,
		p,
		theme.ovalmenu,
		this._floatMenuLabels,
		function(entry, p) {
			self.floatMenuSelect(entry, p);
		}
	));

	system.setCursor('default');
	this.setFocus(null);
	shell.redraw = true;
	return true;
};

/**
| Stops an operation with the mouse button held down.
*/
VSpace.prototype.dragstop = function(p, shift, ctrl) {
	var action = shell.action;
	var pp = p.sub(this.fabric.pan);
	if (!action) throw new Error('Dragstop without action?');

	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		action.vitem.dragstop(p);
		break;
	case Action.RELBIND:
		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			var vitem = this.vAtRank(r);
			if (vitem.dragstop(pp)) break;
		}
		break;
	}
	shell.stopAction();
	return true;
};

/**
| Moving during an operation with the mouse button held down.
*/
VSpace.prototype.dragmove = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch(action.type) {
	case Action.PAN :
		this.fabric.pan = p.sub(action.start);
		shell.redraw = true;
		return true;
	case Action.RELBIND :
		action.vitem2 = null;
		action.move = p;
		shell.redraw = true;

		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			var vitem = this.vAtRank(r);
			if (vitem.dragmove(pp)) return true;
		}
		return true;
	default :
		action.vitem.dragmove(pp);
		return true;
	}
};

/**
| An entry of the float menu has been selected
*/
VSpace.prototype.floatMenuSelect = function(entry, p) {
	var pnw, key;

	switch(entry) {
	case 'n' : // note
		var nw = theme.note.newWidth;
		var nh = theme.note.newHeight;
		pnw = p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
		key = peer.newNote(this.path, new Rect(pnw, pnw.add(nw, nh)));
		var vnote = this.vv[key];
		this.setFocus(vnote);
		break;
	case 'ne' : // label
		pnw = p.sub(this.fabric.pan);
		pnw = pnw.sub(theme.label.createOffset);
		key = peer.newLabel(this.path, pnw, 'Label', 20);
		var vlabel = this.vv[key];
		this.setFocus(vlabel);
		break;
	}
};
		
/**
| An entry of the item menu has been selected
*/
VSpace.prototype.itemMenuSelect = function(entry, p, focus) {
	switch(entry) {
	case 'n': // remove
		this.setFocus(null);
		peer.removeItem(focus.path);
		break;
	}
};

/**
| Mouse button down event.
*/
VSpace.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;
	var pnw, md, key;

	if (this.access == 'ro') {
		this.dragstart(p, shift, ctrl);
		return 'drag';
	}

	var focus = this.focusedVItem();
	if (focus) {
		if (focus.withinItemMenu(p)) return 'atween';
		var com = focus.checkItemCompass(pp);
		if (com) {
			// resizing
			action = shell.startAction(Action.ITEMRESIZE, focus, pp);
			action.align = com;
			action.startZone = focus.getZone();
			system.setCursor(com+'-resize');

			return 'drag';
		}
	}

	return 'atween';
};

/**
| Text input
*/
VSpace.prototype.input = function(text) {
	var caret = shell.caret;
	if (!caret.sign) return;
	this.vget(caret.sign.path, -1).input(text);
};

/**
| User pressed a special key.
*/
VSpace.prototype.specialKey = function(key, shift, ctrl) {
	var caret = shell.caret;
	if (!caret.sign) return;
	this.vget(caret.sign.path, -1).specialKey(key, shift, ctrl);
};

/**
| Returns the visual node the path points to.
*/
VSpace.prototype.vget = function(path, plen) {
	/**/ if (!is(plen)) { plen  = path.length; }
	else if (plen < 0)  { plen += path.length; }
	/**/ if (plen <= 0) { throw new Error('cannot vget path of length <= 0'); }
	if (path.get(0) !== this.key) {
		throw new Error('cannot get path of not current space',
			path.get(0), '!=', this.key
		);
	}

	var vnode = this;
	for (var a = 1; a < plen; a++) {
		vnode = vnode.vv[path.get(a)];
	}
	return vnode;
};

})();
