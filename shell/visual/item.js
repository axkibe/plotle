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
                    ,-_/ .
                    '  | |- ,-. ,-,-.
                    .^ | |  |-' | | |
                    `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of Note, Label and Relation.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Visual;
Visual = Visual || {};


/*
| Imports
*/
var Action;
var Euclid;
var Jools;
var EllipseMenu;
var Path;
var shell;
var system;
var theme;


/*
| Capsule
*/
( function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var Item = Visual.Item = function(spacename, twig, path)
{
	Visual.Base.call(this, spacename, twig, path);

	this.$fabric     = null;
	this.$handles    = { };
};

Jools.subclass(Item, Visual.Base);


/*
| Used for lookups
*/
Item.prototype.Item = true;


/*
| Updates the $sub to match a new twig.
*/
Item.prototype.update = function(twig)
{
	this.twig    = twig;
	this.$fabric = null;

	this.poke();
};


/*
| An entry of the item menu has been selected
*/
Item.prototype.menuSelect = function(entry, p)
{
	switch( entry )
	{
		case 'n': // remove
			shell.dropFocus();
			shell.peer.removeItem( this.path );
			break;
	}
};


/*
| Returns if point is within the item menu
*/
Item.prototype.withinCtrlArea = function(view, p)
{
	var cf = this.getCtrlFix();

	// FIXME fast check on rectangle

	if( !cf.area.within( cf.fixView(view), p ) )
		{ return false; }

	return !( this.getSilhoutte( this.getZone() )
		.within( view, p ) );
};


/*
| Returns the control menu for this item.
*/
Item.prototype.getMenu = function(view)
{
	var labels = { n : 'Remove'};

	var cf = this.getCtrlFix();

	return new EllipseMenu(
		system.fabric,
		cf.fixView( view ).point( cf.area.pc ),
		theme.ellipseMenu,
		labels,
		this
	);
};

/*
| Returns the compass direction of the handle if p is on a resizer handle.
*/
Item.prototype.checkHandles = function( view, p )
{
	var h      = this.planHandles();
	var f      = shell.fabric;
	var d8cwcf = Euclid.Compass.dir8CWCF;

	for(var a = 0, aZ = d8cwcf.length; a < aZ; a++)
	{
		var d = d8cwcf[a];
		var z = h[d];

		//if( !z || !z.within( view, p ) )

		if( !z ) // XXX
			{ continue; }

		var fixView = view.review( 0, view.point(z.pc) );

		if( f.withinSketch( this, 'sketchHandle', fixView, p, z ) )
			{ return d; }
	}

	return null;
};


/*
| Creates the handle object to plan where to sketch the handles to
*/
Item.prototype.planHandles = function( )
{
	var ha   = this.handles;
	var zone = this.getZone();
	var h    = this.$handles;

	if( h.zone && zone.eq( h.zone ) )
		{ return h; }

	var wx  = zone.pnw.x;
	var ny  = zone.pnw.y;
	var ex  = zone.pse.x;
	var sy  = zone.pse.y;

	var mx = Jools.half(wx + ex);
	var my = Jools.half(ny + sy);

	var dcx = theme.handle.cdistance;
	var dcy = theme.handle.cdistance;

	var dex = theme.handle.edistance;
	var dey = theme.handle.edistance;

	var a  = Math.min(
		Math.round((zone.width  + 2 * dcx) / 6),
		theme.handle.maxSize
	);

	var b  = Math.min(
		Math.round((zone.height + 2 * dcy) / 6),
		theme.handle.maxSize
	);

	var a2 = 2*a;
	var b2 = 2*b;

	if (dcx > a)
		{ dex -= Jools.half(dcx - a); dcx = a; }

	if (dcy > b)
		{ dey -= Jools.half(dcy - b); dcy = b; }

	return this.$handles =
		{
			// ellipse bezier height
			bb   : Math.round(b / 0.75),
			zone : zone,

			nw : ha.nw && Euclid.Rect.renew(
					wx - dcx,      ny - dcy,
					wx - dcx + a2, ny - dcy + b2,
					h.nw
				),
			n  : ha.n && Euclid.Rect.renew(
					mx - a,        ny - dey,
					mx + a,        ny - dey + b2,
					h.n
				),
			ne : ha.ne && Euclid.Rect.renew(
					ex + dcx - a2, ny - dcy,
					ex + dex,      ny - dcy + b2,
					h.ne
				),
			e  : ha.e && Euclid.Rect.renew(
					ex + dex - a2, my - b,
					ex + dex     , my + b,
					h.e
				),
			se : ha.se && Euclid.Rect.renew(
					ex + dcx - a2, sy + dcy - b2,
					ex + dcx,      sy + dcx,
					h.se
				),
			s  : ha.s && Euclid.Rect.renew(
					mx - a, sy + dey -b2,
					mx + a, sy + dey,
					h.s
				),
			sw : ha.sw && Euclid.Rect.renew(
					wx - dcx,      sy + dcy - b2,
					wx - dcx + a2, sy + dcy,
					h.sw
				),
			w  : ha.w && Euclid.Rect.renew(
					wx - dex,      my - b,
					wx - dex + a2, my + b,
					h.w
				)
		};
};


/*
| Sketches all resize handles.
*/
Item.prototype.sketchAllHandles = function(fabric, border, twist, view)
{
	if (border !== 0)
		{ throw new Error('borders unsupported for handles'); }

	var h      = this.planHandles();
	var d8cwcf = Euclid.Compass.dir8CWCF;

	for(var a = d8cwcf.length - 1; a >= 0; a--)
	{
		var d = d8cwcf[a];
		var z = h[d];

		if (!z)
			{ continue; }

		var fixView = view.review( 0, view.point( z.pc ) );

		this.sketchHandle( fabric, border, twist, fixView, z );
	}
};


/*
| Sketches one or all resize handles.
*/
Item.prototype.sketchHandle = function(fabric, border, twist, view, zone)
{
	var bb = view.distance( this.$handles.bb );

	var w = view.point( zone.w );
	var e = view.point( zone.e );

	fabric.moveTo( w );
	fabric.beziTo( 0, -bb, 0, -bb, e );
	fabric.beziTo( 0, +bb, 0, +bb, w );
};


/*
| Draws the handles of an item (resize, itemmenu)
*/
Item.prototype.drawHandles = function(fabric, view)
{
	var sbary = this.scrollbarY;

	if( sbary && sbary.visible )
	{
		var area = sbary.getArea(view);
		fabric.reverseClip( area, 'sketch', Euclid.View.proper, -1 );
	}

	fabric.reverseClip(
		this.getSilhoutte( this.getZone() ),
		'sketch',
		view,
		-1
	);

	// draws the resize handles
	fabric.paint(
		theme.handle.style,
		this,
		'sketchAllHandles',
		view
	);

	// draws item menu handler
	var cf = this.getCtrlFix();

	fabric.paint(
		theme.ellipseMenu.slice,
		cf.area,
		'sketch',
		cf.fixView( view )
	);

	fabric.deClip();
};



/*
| Dragstart.
|
| Checks if a dragstart targets this item.
*/
Item.prototype.dragstart = function(view, p, shift, ctrl, access)
{
	var sbary = this.scrollbarY;
	if( sbary && sbary.within( view, p ) )
	{
		shell.startAction(
			Action.SCROLLY, 'space',
			'itemPath', this.path,
			'start',    p,
			'startPos', sbary.getPos()
		);
		return true;
	}

	if( !this.getZone().within( view, p ) )
		{ return false; }

	shell.redraw = true;

	if (ctrl && access == 'rw')
	{
		// relation binding
		shell.startAction(
			Action.RELBIND, 'space',
			'itemPath', this.path,
			'start',    p,
			'move',     p
		);

		return true;
	}

	// scrolling or dragging
	if (access == 'rw')
	{
		this.grepFocus();

		var vp = view.depoint(p);

		shell.startAction(
			Action.ITEMDRAG, 'space',
			'itemPath', this.path,
			'start', vp,
			'move',  vp
		);

		return true;
	}
	else
	{
		return false;
	}
};


/*
| A move during an action.
*/
Item.prototype.actionmove = function(view, p, shift, ctrl)
{
	var $action = shell.$action;

	switch ($action.type)
	{
		case Action.RELBIND    :
			if( !this.getZone().within( view, p ) )
				{ return false; }
			$action.move = p;
			$action.item2Path = this.path;
			shell.redraw = true;
			return true;

		case Action.ITEMDRAG   :
		case Action.ITEMRESIZE :
			$action.move = view.depoint(p);
			shell.redraw = true;
			return true;

		case Action.SCROLLY :
			var start = $action.start;
			var dy    = p.y - start.y;
			var item  = shell.$space.getSub( $action.itemPath, 'Item' );
			var sbary = item.scrollbarY;
			var spos  = $action.startPos + sbary.scale(dy);
			item.setScrollbar(spos);
			item.poke();
			shell.redraw = true;
			return true;

		default :
			throw new Error('invalid actionmove');
	}
	return true;
};


/*
| Sets the items position and size after an action.
*/
Item.prototype.actionstop = function(view, p)
{
	var action = shell.$action;

	switch (action.type) {

		case Action.RELBIND :
			if( !this.getZone().within( view, p ) )
				{ return false; }

			var space = shell.$space;
			Visual.Relation.create( space, space.getSub( action.itemPath ), this );
			shell.redraw = true;
			return true;

		default :
			return false;
	}
};


/*
| User is hovering his/her pointing device over something.
|
| Checks if this item reacts on this.
*/
Item.prototype.pointingHover = function( view, p )
{
	if( p === null )
		{ return null; }

	var sbary = this.scrollbarY;

	if( sbary && sbary.within( view, p ) )
		{ return 'default'; }

	if( !this.getZone().within( view, p ) )
		{ return null; }

	return 'default';
};


/*
| Sets the focus to this item.
*/
Item.prototype.grepFocus = function()
{
	// already have focus?
	if (shell.$space.focusedItem() === this)
		{ return; }

	var doc = this.$sub.doc;

	var caret = shell.setCaret(
		'space',
		{
			path : doc.atRank( 0 ).textPath,
			at1  : 0
		}
	);

	caret.show();

	shell.peer.moveToTop(this.path);
};


/*
| Highlights the item.
*/
Item.prototype.highlight = function(fabric, view)
{
	var silhoutte = this.getSilhoutte( this.getZone() );
	fabric.edge(theme.note.style.highlight, silhoutte, 'sketch', view);
};


/*
| Called by subvisuals when they got changed.
*/
Item.prototype.poke = function()
{
	this.$fabric = null;
	shell.redraw = true;
};


/*
| Force-clears all caches.
*/
Item.prototype.knock = function()
{
	this.$fabric = null;
};


})();
