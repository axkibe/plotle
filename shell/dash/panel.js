 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
             .-,--.             .
              '|__/ ,-. ,-. ,-. |
              ,|    ,-| | | |-' |
              `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A panel of the dashboard.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/**
| Export
*/
var Dash;
Dash = Dash || {};


/**
| Imports
*/
var config;
var Curve;
var Design;
var Euclid;
var Jools;
var Proc;
var shell;
var Tree;


/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/**
| Constructor
*/
var Panel = Dash.Panel = function(name, inherit, board, screensize)
{
	this.name  = name;
	this.board = board;
	var tree   = this.tree  = new Tree(Design[name], Design.Pattern);
	var frameD = tree.root.frame;
	var oframe = new Euclid.Rect(Euclid.Point.zero, screensize);
	var pnw    = this.pnw    = Curve.computePoint(frameD.pnw, oframe);
	var pse    = this.pse    = Curve.computePoint(frameD.pse, oframe);
	var iframe = this.iframe = new Euclid.Rect(Euclid.Point.zero, pse.sub(pnw));
	this.curve = new Curve(tree.root.curve, iframe);

	this.gradientPC = new Euclid.Point(Jools.half(iframe.width), iframe.height + 450);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.screensize = screensize;

	this.$hover = inherit ? inherit.$hover : null;

	this.$sub = {};
	var layout = tree.root.layout;

	for(var a = 0, aZ = layout.length; a < aZ; a++)
	{
		var cname = layout.ranks[a];
		var twig  = layout.copse[cname];
		this.$sub[cname] = this.newControl(twig, inherit && inherit.$sub[cname], cname);
	}
};


/**
| Creates a new component.
*/
Panel.prototype.newControl = function(twig, inherit, name)
{
	if (twig.code && twig.code !== '')
	{
		var Proto = Proc[twig.code];
		if (Proto)
			{ return new Proto(twig, this, inherit, name); }
		else
			{ throw new Error('No prototype for :' + twig.code); }
	}

	switch(twig.type) {

		case 'Chat'   :
			return new Dash.Chat(twig, this, inherit, name);

		case 'Button' :
			return new Dash.Button (twig, this, inherit, name);

		case 'Input' :
			return new Dash.Input  (twig, this, inherit, name);

		case 'Label' :
			return new Dash.Label  (twig, this, inherit, name);

		default :
			throw new Error('Invalid component type: ' + twig.type);
	}
};


/**
| Returns the focused item.
*/
Panel.prototype.focusedControl = function()
{
	var caret = shell.$caret;

	if (caret.section !== 'board')
		{ return null; }

	var sign = caret.sign;
	var path = sign.path;

	if (path.get(0) !== this.name)
		{ return null; }

	return this.$sub[path.get(1)] || null;
};


/**
| Sketches the panels frame.
*/
Panel.prototype.sketch = function(fabric, border, twist)
	{ this.curve.sketch(fabric, border, twist); };


/**
| Force clears all caches.
*/
Panel.prototype.knock = function()
{
	this.$fabric = null;

	for(var c in this.$sub)
		{ this.$sub[c].knock(); }
};


/**
| Draws the panels contents.
*/
Panel.prototype._weave = function()
{
	if (this.$fabric && !config.debug.noCache)
		{ return this.$fabric; }

	var iframe = this.iframe;
	var fabric = this.$fabric = new Euclid.Fabric(iframe);
	var style = Dash.getStyle(this.tree.root.style);
	if (!style)
		{ throw new Error('no style!'); }

	fabric.fill(style.fill, this, 'sketch', Euclid.View.proper);
	var layout = this.tree.root.layout;

	var focus = this.focusedControl();
	for(var a = layout.length - 1; a >= 0; a--)
	{
		var cname = layout.ranks[a];
		var c = this.$sub[cname];
		c.draw(fabric, Dash.Accent.state(cname === this.$hover || c.$active, c === focus));
	}
	fabric.edge(style.edge, this, 'sketch', Euclid.View.proper);

	if (config.debug.drawBoxes)
	{
		fabric.paint(
			Dash.getStyles('boxes'),
			new Euclid.Rect(iframe.pnw,
			iframe.pse.sub(1, 1)),
			'sketch',
			Euclid.View.proper
		);
	}

	return fabric;
};


/**
| Draws the panel.
*/
Panel.prototype.draw = function(fabric)
	{ fabric.drawImage(this._weave(), this.pnw); };


/**
| Draws the caret.
*/
Panel.prototype.drawCaret = function(view)
{
	var cname = shell.$caret.sign.path.get(1);

	var ce = this.$sub[cname];

	if (!ce)
		{ throw new Error('Caret component does not exist!'); }

	if (ce.drawCaret)
		{ ce.drawCaret(view); }
};


/**
| Returns true if point is on this panel.
*/
Panel.prototype.mousehover = function(p, shift, ctrl)
{
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this._weave();
	var a, aZ;

	if( p === null )
		{ return this.setHover(null); }

	// TODO pse.y?
	if( p.y < pnw.y ||
		p.x < pnw.x ||
		p.x > pse.x
	)
		{ return this.setHover(null); }

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric

	if( !fabric.withinSketch(
			this,
			'sketch',
			Euclid.View.proper,
			pp
		)
	)
	{
		return this.setHover(null);
	}

	var cursor = null;

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++)
	{
		var cname = layout.ranks[a];
		var ce = this.$sub[cname];

		if (cursor)
			{ ce.mousehover(null, shift, ctrl); }
		else
			{ cursor = ce.mousehover(pp, shift, ctrl); }
	}

	if (cursor === null)
		{ this.setHover(null); }

	return cursor || 'default';
};


/**
| Returns true if point is on this panel.
*/
Panel.prototype.mousedown = function(p, shift, ctrl)
{
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this._weave();
	var a, aZ;

	// TODO pse.y?
	if( p.y < pnw.y ||
		p.x < pnw.x ||
		p.x > pse.x)
	{
		this.setHover(null);
		return null;
	}

	var pp = p.sub(pnw);

	// FIXME Optimize by reusing the latest path of this.$fabric
	if( !fabric.withinSketch( this, 'sketch', Euclid.View.proper, pp ) )
	{
		this.setHover(null);
		return null;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.$sub[cname];
		var r = ce.mousedown(pp, shift, ctrl);
		if (r)
			{ return r; }
	}

	this.setHover(null);
	return false;
};

/**
| Text input.
*/
Panel.prototype.input = function(text)
{
	var focus = this.focusedControl();
	if (!focus)
		{ return; }

	focus.input(text);
};

/**
| Cycles the focus
*/
Panel.prototype.cycleFocus = function(dir)
{
	var layout = this.tree.root.layout;
	var focus  = this.focusedControl();
	if (!focus)
		{ return; }

	var rank = layout.rankOf(focus.name);
	var rs   = rank;
	var cname;
	var ve;

	while (true)
	{
		rank = (rank + dir + layout.length) % layout.length;

		if (rank === rs)
			{ shell.dropFocus(); }

		cname = layout.ranks[rank];
		ve    = this.$sub[cname];
		if (ve.grepFocus())
			{ break; }
	}
};


/**
| User pressed a special key.
*/
Panel.prototype.specialKey = function(key, shift, ctrl)
{
	var focus = this.focusedControl();

	if (!focus)
		{ return; }

	if (key === 'tab')
	{
		this.cycleFocus(shift ? -1 : 1);
		return;
	}

	focus.specialKey(key, shift, ctrl);
};


/**
| Clears caches.
*/
Panel.prototype.poke = function()
{
	this.$fabric = null;
	shell.redraw = true;
};


/**
| Sets the hovered component.
*/
Panel.prototype.setHover = function(cname)
{
	if (this.$hover === cname)
		{ return null; }

	this.$fabric = null;
	shell.redraw = true;

	if (this.$hover)
		{ this.$sub[this.$hover].knock(); }

	if (cname)
		{ this.$sub[cname].knock(); }

	this.$hover = cname;

	return null;
};


})();
