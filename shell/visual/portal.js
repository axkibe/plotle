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
                .-,--.         .      .
                 '|__/ ,-. ,-. |- ,-. |
                 ,|    | | |   |  ,-| |
                 `'    `-' '   `' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A portal to another space

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
var config;
var Euclid;
var Jools;
var shell;
var theme;


/*
| Capsule
*/
(function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor.
*/
var Portal = Visual.Portal = function(spacename, twig, path)
{
	Visual.Item.call(this, spacename, twig, path);
};

Jools.subclass(Portal, Visual.Item);


/*
| Resize handles to show on notes.
*/
Portal.prototype.handles =
{
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true
};


/*
| Returns the portals silhoutte.
|
| $zone :  the cache for the items zone
| zAnchor: if true anchor the silhoute at zero.
*/
Portal.prototype.getSilhoutte = function($zone, zAnchor)
{
	var $z = $zone;
	var $s;

	if (zAnchor)
	{
		$s = this._silhoutte$0;

		if ($s && $s.width === $z.width && $s.height === $z.height)
			{ return $s; }

		return this._silhoutte$0 = new Euclid.Oval(
			Euclid.Point.zero,
			new Euclid.Point($z.width, $z.height)
		);
	}
	else
	{
		$s = this._silhoutte$1;

		if ($s && $s.eq($z))
			{ return $s; }

		return this._silhoutte$1 = new Euclid.Oval($z.pnw, $z.pse);
	}
};


/*
| Sets the items position and size after an action.
*/
Portal.prototype.actionstop = function(view, p)
{
	switch (shell.$action.type) {

		case Action.ITEMDRAG :
		case Action.ITEMRESIZE :

			var zone = this.getZone();

			if ( zone.width < theme.portal.minWidth ||
				zone.height < theme.portal.minHeight )
				{ throw new Error('Portal under minimum size!'); }

			if (this.twig.zone.eq(zone))
				{ return; }

			shell.peer.setZone( this.path, zone );

			shell.redraw = true;

			return true;

		default :

			return Visual.Item.prototype.actionstop.call(this, view, p);
	}

};


/*
| Sets the focus to this item.
*/
Portal.prototype.grepFocus = function()
{
	// already have focus?
	if (shell.$space.focusedItem() === this)
		{ return; }

	var caret = shell.setCaret(
		'space',
		{
			path : this.path,
			at1  : 0
		}
	);

	caret.show();

	shell.peer.moveToTop( this.path );
};



/*
| Sees if this portal is being clicked.
*/
Portal.prototype.click = function(view, p)
{
	var vp = view.depoint(p);

	if (!this.getZone().within(vp))
		{ return false; }

	var $space = shell.$space;
	var focus  = $space.focusedItem();
	if (focus !== this)
	{
		this.grepFocus();
		shell.selection.deselect();
	}

	shell.redraw = true;

	var caret = shell.setCaret(
		'space',
		{
			path : this.path,
			at1  : null
		}
	);

	caret.show();
	shell.selection.deselect();

	return true;
};

/*
| Draws the portal.
|
| fabric: to draw upon.
*/
Portal.prototype.draw = function(fabric, view)
{
	var zone  = this.getZone();
	var vzone = view.rect(zone);
	var f     = this.$fabric;
	var sbary = this.scrollbarY;


	// no buffer hit?
	if (config.debug.noCache || !f ||
		vzone.width  !== f.width ||
		vzone.height !== f.height)
	{
		f = this.$fabric = new Euclid.Fabric(vzone.width + 1, vzone.height + 1);

		var silhoutte = this.getSilhoutte(vzone, true);
		f.fill(theme.portal.style.fill, silhoutte, 'sketch', Euclid.View.proper);
		f.edge(theme.portal.style.edge, silhoutte, 'sketch', Euclid.View.proper);
	}

	fabric.drawImage(f, vzone.pnw);
};


/*
| Mouse wheel turned.
*/
Portal.prototype.mousewheel = function(view, p, dir, shift, ctrl)
{
	var dp = view.depoint(p);

	return this.getZone().within(dp);
};


/*
|
*/
Portal.prototype.drawCaret = function(view)
{
	// FIXME
};


/*
| Mouse is hovering around.
| Checks if this item reacts on this.
*/
Portal.prototype.mousehover = function(view, p)
{
	if (p === null)
		{ return null; }

	var dp = view.depoint(p);

	if (this.getZone().within(dp))
		{ return 'default'; }
	else
		{ return null; }
};


/*
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Portal.prototype.getZone = function()
{
	var twig    = this.twig;
	var $action = shell.$action;
	var max     = Math.max;
	var min     = Math.min;

	if ( !$action || !this.path.equals( $action.itemPath ) )
		{ return twig.zone; }

	// FIXME cache the last zone

	switch ($action.type)
	{

		case Action.ITEMDRAG:
			return twig.zone.add(
				$action.move.x - $action.start.x,
				$action.move.y - $action.start.y);

		case Action.ITEMRESIZE:
			var szone = $action.startZone;
			if (!szone)
				{ return twig.zone; }

			var spnw = szone.pnw;
			var spse = szone.pse;
			var dx = $action.move.x - $action.start.x;
			var dy = $action.move.y - $action.start.y;
			var minw = theme.portal.minWidth;
			var minh = theme.portal.minHeight;
			var pnw, pse;

			switch ($action.align)
			{
				case 'n'  :
					pnw = Euclid.Point.renew(spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
					pse = spse;
					break;
				case 'ne' :
					pnw = Euclid.Point.renew(
						spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
					pse = Euclid.Point.renew(
						max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
					break;
				case 'e'  :
					pnw = spnw;
					pse = Euclid.Point.renew(max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
					break;
				case 'se' :
					pnw = spnw;
					pse = Euclid.Point.renew(
						max(spse.x + dx, spnw.x + minw),
						max(spse.y + dy, spnw.y + minh), spnw, spse);
					break;
				case 's' :
					pnw = spnw;
					pse = Euclid.Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
					break;
				case 'sw'  :
					pnw = Euclid.Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
					pse = Euclid.Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
					break;
				case 'w'   :
					pnw = Euclid.Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
					pse = spse;
					break;
				case 'nw' :
					pnw = Euclid.Point.renew(
						min(spnw.x + dx, spse.x - minw),
						min(spnw.y + dy, spse.y - minh), spnw, spse);
					pse = spse;
					break;
				//case 'c' :
				default  :
					throw new Error('unknown align');
			}

			return new Euclid.Rect(pnw, pse);

		default :
			return twig.zone;
	}
};

})();
