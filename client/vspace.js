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
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
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
var Line;
var OvalMenu;
var Path;
var Point;
var Rect;
var shell;
var system;
var theme;
var View;
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
var debug  = Jools.debug;
var immute = Jools.immute;
var is     = Jools.is;
var isnon  = Jools.isnon;
var half   = Jools.half;
var log    = Jools.log;
var ro     = Math.round;

/**
| Constructor
*/
VSpace = function(twig, path, access) {
	this.twig        = twig;
	this.path        = path;
	this.access      = access;
	this.key         = path.get(-1);
	this.fabric      = system.fabric;

	this.$view       = new View(Point.zero, 0);

	Jools.keyNonGrata(this, '$pan');

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
	var twig   = this.twig;
	var $view  = this.$view;

	for(var r = twig.length - 1; r >= 0; r--) {
		this.vAtRank(r).draw(this.fabric, $view);
	}

	var focus = this.focusedVItem();
	if (focus) { focus.drawHandles(this.fabric, $view); }

	var $action = shell.$action;
	switch ($action && $action.type) {
	case Action.RELBIND :
		var av  = this.vget($action.itemPath);
		var av2 = $action.item2Path ? this.vget($action.item2Path) : null;
		var target = av2 ? av2.getZone() : $view.depoint($action.move);
		var arrow = Line.connect(av.getZone(), 'normal', target, 'arrow');
		if (av2) av2.highlight(this.fabric, $view);
		arrow.draw(this.fabric, $view, theme.relation.style);
		break;
	}
};

/**
| Force-clears all caches.
*/
VSpace.prototype.knock = function() {
	for(var r = this.twig.length - 1; r >= 0; r--)
		{ this.vAtRank(r).knock(); }
};

/**
| Draws the caret.
*/
VSpace.prototype.drawCaret = function() {
	this.vget(shell.caret.sign.path, -1).drawCaret(this.$view);
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
		shell.peer.moveToTop(vitem.path);
	} else {
		shell.setCaret(null, null);
	}
};

/**
| Returns the vtwig at rank 'rank'.
|
| TODO: put in a common prototype for all visuals with ranks?
*/
VSpace.prototype.vAtRank = function(rank) {
	return this.vv[this.twig.ranks[rank]];
};

/**
| Mouse wheel
*/
VSpace.prototype.mousewheel = function(p, dir, shift, ctrl) {
	var $view = this.$view;
	var twig  = this.twig;

	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		var vitem = this.vAtRank(r);
		if (vitem.mousewheel($view, p, dir, shift, ctrl))
			{ return true; }
	}

	if (dir > 0) {
		this.$view = this.$view.review( 1, p);
	} else {
		this.$view = this.$view.review(-1, p);
	}
	shell.setSpaceZoom(this.$view.fact);

	this.knock();
	shell.redraw = true;

	return true;
};

/**
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
VSpace.prototype.mousehover = function(p, shift, ctrl) {
	if (p === null) { return null; }
	var $view = this.$view;

	var $action = shell.$action;
	var cursor = null;

	var focus = this.focusedVItem();
	if (focus) {
		// TODO move into items
		if (focus.withinItemMenu($view, p)) {
			cursor = 'default';
		} else {
			var com = focus.checkItemCompass($view, p);
			if (com) { cursor = com + '-resize'; }
		}
	}

	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (cursor) {
			vitem.mousehover($view, null);
		} else {
			cursor = vitem.mousehover($view, p);
		}
	}

	return cursor || 'pointer';
};

/**
| Starts an operation with the mouse button held down.
*/
VSpace.prototype.dragstart = function(p, shift, ctrl) {
	var $view = this.$view;
	var focus = this.focusedVItem();

	// see if the itemmenu of the focus was targeted
	if (this.access == 'rw' && focus && focus.withinItemMenu($view, p)) {
		var dp = $view.depoint(p);
		shell.startAction(
			Action.RELBIND, 'space',
			'itemPath', focus.path,
			'start',    dp,
			'move',     dp
		);
		shell.redraw = true;
		return;
	}

	// see if one item was targeted
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.dragstart($view, p, shift, ctrl, this.access)) return;
	}

	// otherwise do panning
	shell.startAction(
		Action.PAN, 'space',
		'start', p,
		'pan',   $view.pan
	);
	return;
};

/**
| A mouse click.
*/
VSpace.prototype.click = function(p, shift, ctrl) {
	var self  = this;
	var $view = this.$view;

	// clicked the tab of the focused item?
	var focus = this.focusedVItem();
	if (focus && focus.withinItemMenu($view, p)) {
		var labels = { n : 'Remove'};

		var os = focus.getOvalSlice();

		shell.setMenu(new OvalMenu(
			system.fabric,
			$view.point(os.psw).add(half(os.width), 0),
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
		if (vitem.click($view, p, shift, ctrl)) return true;
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

	this.setFocus(null);
	shell.redraw = true;
	return true;
};

/**
| Stops an operation with the mouse button held down.
*/
VSpace.prototype.dragstop = function(p, shift, ctrl) {
	var $action = shell.$action;
	var $view   = this.$view;
	var vitem;

	if (!$action) { throw new Error('Dragstop without action?'); }

	switch ($action.type) {
	case Action.PAN :
		break;
	case Action.RELBIND :
		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			vitem = this.vAtRank(r);
			if (vitem.dragstop($view, p))
				{ break; }
		}
		break;
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
	case Action.SCROLLY    :
		vitem = this.vget($action.itemPath);
		vitem.dragstop($view, p, shift, ctrl);
		break;
	default :
		throw new Error('Do not know how to handle Action.' + $action.type);
	}
	shell.stopAction();
	return true;
};

/**
| Moving during an operation with the mouse button held down.
*/
VSpace.prototype.dragmove = function(p, shift, ctrl) {
	var $view   = this.$view;
	var $action = shell.$action;
	var vitem;

	switch($action.type) {
	case Action.PAN :
		var pd = p.sub($action.start);

		this.$view = $view = new View(
			$action.pan.add(pd.x / $view.zoom, pd.y / $view.zoom),
			$view.fact
		);

		shell.redraw = true;
		return 'pointer';

	case Action.RELBIND :
		$action.vitem2 = null;
		$action.move  = p;
		shell.redraw = true;

		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			vitem = this.vAtRank(r);
			if (vitem.dragmove($view, p))
				{ return 'pointer'; }
		}
		return 'pointer';

	default :
		vitem = this.vget($action.itemPath);
		vitem.dragmove($view, p);
		return 'move';
	}
};

/**
| An entry of the float menu has been selected
*/
VSpace.prototype.floatMenuSelect = function(entry, p) {
	var $view = this.$view;
	var pnw, key;

	switch(entry) {
	case 'n' :
		// note
		var nw = theme.note.newWidth;
		var nh = theme.note.newHeight;
		var dp = $view.depoint(p);
		pnw = dp.sub(half(nw) , half(nh));
		key = shell.peer.newNote(this.path, new Rect(pnw, pnw.add(nw, nh)));
		var vnote = this.vv[key];
		this.setFocus(vnote);
		break;
	case 'ne' :
		// label
		pnw = $view.depoint(p);
		pnw = pnw.sub(theme.label.createOffset);
		key = shell.peer.newLabel(this.path, pnw, 'Label', 20);
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
		shell.peer.removeItem(focus.path);
		break;
	}
};

/**
| Mouse button down event.
*/
VSpace.prototype.mousedown = function(p, shift, ctrl) {
	var $view   = this.$view;
	var $action = shell.$action;
	var pnw, md, key;

	if (this.access == 'ro') {
		this.dragstart(p, shift, ctrl);
		return 'drag';
	}

	var focus = this.focusedVItem();
	if (focus) {
		if (focus.withinItemMenu($view, p)) return 'atween';
		var com = focus.checkItemCompass($view, p);
		if (com) {
			// resizing
			var dp = $view.depoint(p);
			$action = shell.startAction(
				Action.ITEMRESIZE, 'space',
				'itemPath', focus.path,
				'start',    dp,
				'move',     dp
			);
			$action.align = com;
			$action.startZone = focus.getZone();
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
| Changes the zoom factor (around center)
*/
VSpace.prototype.changeZoom = function(df) {
	var $view = this.$view;
	var pm = new Point(half(this.fabric.width), half(this.fabric.height));
	pm = $view.depoint(pm);
	this.$view = this.$view.review(df, pm);
	shell.setSpaceZoom(this.$view.fact);
	this.knock();
	shell.redraw = true;
};

/**
| User pressed a special key.
*/
VSpace.prototype.specialKey = function(key, shift, ctrl) {
	if (ctrl) {
		switch(key) {
		case 'z' : shell.peer.undo();   return;
		case 'y' : shell.peer.redo();   return;
		case ',' : this.changeZoom( 1); return;
		case '.' : this.changeZoom(-1); return;
		}
	}
	
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
