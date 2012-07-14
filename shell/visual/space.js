/**                                               .---.
.----.     .----..--.                             |   |
 \    \   /    / |__|                             |   |
  '   '. /'   /  .--.                             |   |
  |    |'    /   |  |                       __    |   |
  |    ||    |   |  |     _     _    _   .:--.'.  |   |
  '.   `'   .'   |  |   .' |   | '  / | / |   \ | |   |
   \        /    |  |  .   | /.' | .' | `" __ | | |   |
    \      /     |__|.'.'| |///  | /  |  .'.''| | |   |
     '----'        .'.'.-'  /|   `'.  | / /   | |_'---'
                   .'   \_.' '   .'|  '/\ \._,\ '/
                              `-'  `--'  `--'  `"
                     .---.
                     \___  ,-. ,-. ,-. ,-.
                         \ | | ,-| |   |-'
                     `---' |-' `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                           '
 The visual of a space.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Visual;
Visual = Visual || {};

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

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var Base     = Visual.Base;
var debug    = Jools.debug;
var is       = Jools.is;
var isnon    = Jools.isnon;
var half     = Jools.half;
var log      = Jools.log;
var Label    = Visual.Label;
var Note     = Visual.Note;
var Relation = Visual.Relation;
var ro       = Math.round;
var subclass = Jools.subclass;

/**
| Constructor
*/
var Space = Visual.Space = function(twig, path, access) {
	Base.call(this, twig, path);

	if (this.$sub !== null) { throw new Error('iFail'); }
	var g = this.$sub = {};

	this.access      = access;
	this.fabric      = system.fabric;
	this.$view       = new View(Point.zero, 0);

	for (var k in twig.copse)
		{ g[k] = this.createItem(twig.copse[k], k); }

	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
};
subclass(Space, Base);

/**
| Updates v-vine to match a new twig.
*/
Space.prototype.update = function(tree, chgX) {
	var twig = tree.root.copse[this.key];

	// no change?
	if (this.twig === twig) { return; }

	this.twig = twig;

	var gold = this.$sub;
	var g    = this.$sub = {};
	var copse = twig.copse;
	for(var k in copse) {
		var sub = twig.copse[k];
		var o = gold[k];
		if (is(o)) {
			if (o.twig !== sub) {
				o.update(sub);
			}
			g[k] = o;
		} else {
			g[k] = this.createItem(sub, k);
		}
	}

	// removes the focus if the focused item is removed.
	var caret = shell.caret;
	var csign = caret.sign;

	if (caret.visec === 'space' &&
		csign && csign.path &&
		csign.path.get(0) === this.key &&
		!isnon(g[csign.path.get(1)])
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
| TODO what is this really for???
*/
Space.prototype.getEntity = function(path) {
	if (path.get(0) !== this.key) {
		throw new Error('getting entity of not current space',
			path.get(0), '!=', this.key
		);
	}
	return this.$sub[path.get(1)] || null;
};

/**
| Returns the focused item.
*/
Space.prototype.focusedItem = function() {
	var caret = shell.caret;
	if (caret.visec !== 'space') { return null; }
	return this.getEntity(caret.sign.path);
};

/**
| Creates a new visual representation of an item.
*/
Space.prototype.createItem = function(twig, k) {
	var ipath = new Path(this.path, '++', k);
	switch (twig.type) {
	case 'Note'     : return new Note    (twig, ipath, this);
	case 'Label'    : return new Label   (twig, ipath, this);
	case 'Relation' : return new Relation(twig, ipath, this);
	default : throw new Error('unknown type: '+twig.type);
	}
};

/**
| Redraws the complete space.
*/
Space.prototype.draw = function() {
	var twig   = this.twig;
	var $view  = this.$view;

	for(var r = twig.length - 1; r >= 0; r--) {
		this.atRank(r).draw(this.fabric, $view);
	}

	var focus = this.focusedItem();
	if (focus) { focus.drawHandles(this.fabric, $view); }

	var $action = shell.$action;
	switch ($action && $action.type) {
	case Action.RELBIND :
		var av  = this.get($action.itemPath);
		var av2 = $action.item2Path ? this.get($action.item2Path) : null;
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
Space.prototype.knock = function() {
	for(var r = this.twig.length - 1; r >= 0; r--)
		{ this.atRank(r).knock(); }
};

/**
| Draws the caret.
*/
Space.prototype.drawCaret = function() {
	this.get(shell.caret.sign.path, -1).drawCaret(this.$view);
};

/**
| Sets the focused item.
| item === null blurs.
*/
Space.prototype.setFocus = function(item) {
	var focus = this.focusedItem();
	if (focus && focus === item) { return; }

	var caret = shell.caret;

	if (item) {
		var doc = item.$sub.doc;

		caret = shell.setCaret(
			'space',
			{
				path : doc.atRank(0).textPath(),
				at1  : 0
			}
		);

		caret.show();
		shell.peer.moveToTop(item.path);
	} else {
		shell.setCaret(null, null);
	}
};

/**
| Mouse wheel
*/
Space.prototype.mousewheel = function(p, dir, shift, ctrl) {
	var $view = this.$view;
	var twig  = this.twig;

	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		var item = this.atRank(r);
		if (item.mousewheel($view, p, dir, shift, ctrl))
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
Space.prototype.mousehover = function(p, shift, ctrl) {
	if (p === null) { return null; }
	var $view = this.$view;

	var $action = shell.$action;
	var cursor = null;

	var focus = this.focusedItem();
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
		var item = this.atRank(a);
		if (cursor) {
			item.mousehover($view, null);
		} else {
			cursor = item.mousehover($view, p);
		}
	}

	return cursor || 'pointer';
};

/**
| Starts an operation with the mouse button held down.
*/
Space.prototype.dragstart = function(p, shift, ctrl) {
	var $view = this.$view;
	var focus = this.focusedItem();

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
		var item = this.atRank(a);
		if (item.dragstart($view, p, shift, ctrl, this.access)) return;
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
Space.prototype.click = function(p, shift, ctrl) {
	var self  = this;
	var $view = this.$view;

	// clicked the tab of the focused item?
	var focus = this.focusedItem();
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
		var item = this.atRank(a);
		if (item.click($view, p, shift, ctrl)) return true;
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
Space.prototype.actionstop = function(p, shift, ctrl) {
	var $action = shell.$action;
	var $view   = this.$view;
	var item;

	if (!$action) { throw new Error('Dragstop without action?'); }

	switch ($action.type) {
	case Action.PAN :
		break;
	case Action.RELBIND :
		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			item = this.atRank(r);
			if (item.actionstop($view, p))
				{ break; }
		}
		shell.redraw = true;
		break;
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
	case Action.SCROLLY    :
		item = this.get($action.itemPath);
		item.actionstop($view, p, shift, ctrl);
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
Space.prototype.actionmove = function(p, shift, ctrl) {
	var $view   = this.$view;
	var $action = shell.$action;
	var item;

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
		$action.item2Path = null;
		$action.move      = p;
		shell.redraw      = true;

		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			item = this.atRank(r);
			if (item.actionmove($view, p))
				{ return 'pointer'; }
		}
		return 'pointer';

	default :
		item = this.get($action.itemPath);
		item.actionmove($view, p);
		return 'move';
	}
};

/**
| An entry of the float menu has been selected
*/
Space.prototype.floatMenuSelect = function(entry, p) {
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
		this.setFocus(this.$sub[key]);
		break;
	case 'ne' :
		// label
		pnw = $view.depoint(p);
		pnw = pnw.sub(theme.label.createOffset);
		key = shell.peer.newLabel(this.path, pnw, 'Label', 20);
		this.setFocus(this.$sub[key]);
		break;
	}
};

/**
| An entry of the item menu has been selected
*/
Space.prototype.itemMenuSelect = function(entry, p, focus) {
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
Space.prototype.mousedown = function(p, shift, ctrl) {
	var $view   = this.$view;
	var $action = shell.$action;
	var pnw, md, key;

	if (this.access == 'ro') {
		this.dragstart(p, shift, ctrl);
		return 'drag';
	}

	var focus = this.focusedItem();
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
Space.prototype.input = function(text) {
	var caret = shell.caret;
	if (!caret.sign) return;
	this.get(caret.sign.path, -1).input(text);
};

/**
| Changes the zoom factor (around center)
*/
Space.prototype.changeZoom = function(df) {
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
Space.prototype.specialKey = function(key, shift, ctrl) {
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
	this.get(caret.sign.path, -1).specialKey(key, shift, ctrl);
};

/**
| Returns the visual node the path points to.
*/
Space.prototype.get = function(path, plen) {
	/**/ if (!is(plen)) { plen  = path.length; }
	else if (plen < 0)  { plen += path.length; }
	/**/ if (plen <= 0) { throw new Error('cannot get path of length <= 0'); }
	if (path.get(0) !== this.key) {
		throw new Error('cannot get path of not current space',
			path.get(0), '!=', this.key
		);
	}

	var node = this;
	for (var a = 1; a < plen; a++) {
		node = node.$sub[path.get(a)];
	}
	return node;
};

})();
