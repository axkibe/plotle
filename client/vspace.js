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
VSpace = function(twig, path) {
	this.twig        = twig;
	this.path        = path;
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

	// remove the focus if the focussed item is removed.
	var focus = this.focusedVItem();
	if (focus) {
		if (!is(vv[focus.key])) {
			if (shell.selection.active &&
				shell.selection.sign1.path.get(-4) === focus.key)
			{ shell.selection.deselect(true); }

			this.setFocus(null);
		}
	}
	shell.redraw = true;
};


/**
| Returns the entity of path
*/
VSpace.prototype.getEntity = function(path) {
	if (path.get(0) !== 'welcome') /* TODO */ { return null; }
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
	case Action.FLOATMENU :
		action.floatmenu.draw();
		break;
	case Action.ITEMMENU :
		action.itemmenu.draw();
		break;
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
	if (focus === vitem) { return; }

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

	switch(action && action.type) {
	case null : break;
	case Action.FLOATMENU :
		if (isnon(action.floatmenu.within(p))) {
			// mouse floated on float menu
			system.setCursor('default');
			return true;
		}
		break;
	case Action.ITEMMENU :
		if (isnon(action.itemmenu.within(p))) {
			// mouse floated on item menu
			system.setCursor('default');
			return true;
		}
		break;
	}

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
	if (focus && focus.withinItemMenu(pp)) {
		shell.startAction(Action.RELBIND, focus, p);
		system.setCursor('default');
		shell.redraw = true;
		return true;
	}

	// see if one item was targeted
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.dragstart(pp, shift, ctrl)) return true;
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
	var pan  = this.fabric.pan;
	var pp   = p.sub(pan);
	var action;

	// clicked the tab of the focused item?
	var focus = this.focusedVItem();
	if (focus && focus.withinItemMenu(pp)) {
		action = shell.startAction(Action.ITEMMENU, null, pp);
		var labels = {n : 'Remove'};
		action.itemmenu = new OvalMenu(focus.getOvalSlice().pm.add(pan), theme.itemmenu, labels);
		shell.redraw = true;
		return;
	}

	// clicked some item?
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.click(pp)) return true;
	}

	// otherwhise pop up the float menu
	action = shell.startAction(Action.FLOATMENU, null, p);
	action.floatmenu = new OvalMenu(p, theme.ovalmenu, this._floatMenuLabels);
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
| Mouse button down event.
*/
VSpace.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;
	var pnw, md, key;

	switch (action && action.type) {
	case null :
		break;
	case Action.FLOATMENU :
		var fm = action.floatmenu;
		md = fm.within(p);
		shell.stopAction();

		if (!md) break;
		switch(md) {
		case 'n' : // note
			var nw = theme.note.newWidth;
			var nh = theme.note.newHeight;
			pnw = fm.p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
			key = peer.newNote(this.path, new Rect(pnw, pnw.add(nw, nh)));
			var vnote = this.vv[key];
			this.setFocus(vnote);
			break;
		case 'ne' : // label
			pnw = fm.p.sub(this.fabric.pan);
			pnw = pnw.sub(theme.label.createOffset);
			key = peer.newLabel(this.path, pnw, 'Label', 20);
			var vlabel = this.vv[key];
			this.setFocus(vlabel);
			break;
		}
		shell.redraw = true;
		return false;
	case Action.ITEMMENU :
		var im = action.itemmenu;
		md = im.within(p);
		shell.stopAction();

		if (!im) break;
		switch(md) {
		case 'n': // remove
			var item = this.focusedVItem();
			this.setFocus(null);
			peer.removeItem(item.path);
			break;
		default :
			break;
		}
		shell.redraw = true;
		return false;
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
	if (path.get(0) !== 'welcome') throw new Error('currently space must be "welcome"'); // TODO

	var vnode = this;
	for (var a = 1; a < plen; a++) {
		vnode = vnode.vv[path.get(a)];
	}
	return vnode;
};

})();
