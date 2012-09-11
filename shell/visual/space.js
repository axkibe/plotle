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
(function(){
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var Space = Visual.Space = function(twig, spacename, access)
{
	Visual.Base.call(this, spacename, twig, null);

	var $sub = this.$sub = { };

	this.access = access;
	this.fabric = system.fabric;

	this.$view  = new Euclid.View( Euclid.Point.zero, 0 );

	for( var k in twig.copse )
		{ $sub[ k ] = this.createItem( twig.copse[ k ], k ); }

	this._floatMenuLabels =
		{
			c  : 'new',
			n  : 'Note',
			ne : 'Label',
			se : 'Portal'
		};
};

Jools.subclass( Space, Visual.Base );

/*
| Updates $sub to match a new twig.
*/
Space.prototype.update = function( twig )
{
	// no change?
	if ( this.twig === twig )
		{ return; }

	this.twig = twig;

	// TODO remove $
	var $old = this.$sub;
	var $sub = this.$sub = { };
	var copse = twig.copse;
	for( var k in copse )
	{
		var sub = twig.copse[ k ];
		var o = $old[ k ];
		if ( Jools.is( o ) )
		{
			if ( o.twig !== sub )
				{ o.update( sub ); }
			$sub[ k ] = o;
		}
		else
		{
			$sub[ k ] = this.createItem( sub, k );
		}
	}

	// removes the focus if the focused item is removed.
	var caret = shell.$caret;
	var csign = caret.sign;

	if (caret.section === 'space' &&
		csign && csign.path &&
		!Jools.isnon( $sub[ csign.path.get( 0 ) ] ) )
	{
		if (shell.selection.active &&
			shell.selection.sign1.path.get( -4 ) === csign.path.get( 1 ) )
			{ shell.selection.deselect(true); }

		shell.dropFocus();
	}

	shell.redraw = true;
};

/**
| Returns the focused item.
*/
Space.prototype.focusedItem = function()
{
	var caret = shell.$caret;

	if (caret.section !== 'space')
		{ return null; }

	return this.getSub(caret.sign.path, 'Item');
};

/**
| Creates a new visual representation of an item.
*/
Space.prototype.createItem = function(twig, k)
{
	var path = new Path( [ k ] );

	switch (twig.type)
	{
		case 'Note' :
			return new Visual.Note ( this.spacename, twig, path, this );

		case 'Label' :
			return new Visual.Label ( this.spacename, twig, path, this );

		case 'Portal' :
			return new Visual.Portal ( this.spacename, twig, path, this );

		case 'Relation' :
			return new Visual.Relation ( this.spacename, twig, path, this );

		default :
			throw new Error('unknown type: ' + twig.type);
	}
};


/*
| Redraws the complete space.
*/
Space.prototype.draw = function()
{
	var twig = this.twig;
	var view = this.$view;

	for( var r = twig.length - 1; r >= 0; r-- )
		{ this.atRank( r ).draw( this.fabric, view ); }

	var focus = this.focusedItem( );
	if( focus )
		{ focus.drawHandles( this.fabric, view ); }

	var action = shell.$action;

	switch( action && action.type )
	{
		case Action.RELBIND :

			var av  = this.getSub( action.itemPath, 'Item' );

			var av2 = action.item2Path ?
				this.getSub( action.item2Path, 'Item' ) :
				null;

			var target = av2 ?
				av2.getZone( ) :
				view.depoint( action.move );

			var arrow  = Euclid.Line.connect(
				av.getSilhoutte( av.getZone( ) ),
				'normal',
				target,
				'arrow'
			);

			if( av2 )
				{ av2.highlight( this.fabric, view ); }

			arrow.draw( this.fabric, view, theme.relation.style );

			break;
	}
};


/*
| Force-clears all caches.
*/
Space.prototype.knock = function()
{
	for( var r = this.twig.length - 1; r >= 0; r-- )
		{ this.atRank( r ).knock( ); }
};


/*
| Draws the caret.
*/
Space.prototype.drawCaret = function()
{
	this.getSub( shell.$caret.sign.path, 'drawCaret' )
		.drawCaret( this.$view );
};


/*
| Mouse wheel
*/
Space.prototype.mousewheel = function( p, dir, shift, ctrl )
{
	var view = this.$view;
	var twig = this.twig;

	for( var r = 0, rZ = twig.length; r < rZ; r++ )
	{
		var item = this.atRank(r);

		if ( item.mousewheel( view, p, dir, shift, ctrl ) )
			{ return true; }
	}

	if ( dir > 0 )
		{ this.$view = this.$view.review(  1, p ); }
	else
		{ this.$view = this.$view.review( -1, p ); }

	shell.setSpaceZoom(this.$view.fact);

	this.knock();

	shell.redraw = true;

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
Space.prototype.mousehover = function(p, shift, ctrl)
{
	if (p === null)
		{ return null; }

	var view   = this.$view;
	var cursor = null;

	var focus = this.focusedItem();
	if (focus)
	{
		if( focus.withinCtrlArea( view, p ) )
		{
			cursor = 'default';
		}
		else
		{
			var com = focus.checkHandles( view, p );

			if (com)
				{ cursor = com + '-resize'; }
		}
	}

	for(var a = 0, aZ = this.twig.length; a < aZ; a++)
	{
		var item = this.atRank(a);
		if (cursor)
			{ item.mousehover( view, null ); }
		else
			{ cursor = item.mousehover( view, p ); }
	}

	return cursor || 'pointer';

};


/*
| Starts an operation with the mouse button held down.
*/
Space.prototype.dragstart = function(p, shift, ctrl)
{
	var view  = this.$view;
	var focus = this.focusedItem();

	// see if the itemmenu of the focus was targeted
	if( this.access == 'rw' && focus && focus.withinCtrlArea( view, p ))
	{
		var dp = view.depoint(p);
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
	for(var a = 0, aZ = this.twig.length; a < aZ; a++)
	{
		var item = this.atRank(a);
		if ( item.dragstart( view, p, shift, ctrl, this.access ))
			{ return; }
	}

	// otherwise do panning
	shell.startAction
	(
		Action.PAN, 'space',
		'start',    p,
		'pan',      view.pan
	);

	return;
};

/**
| A mouse click.
*/
Space.prototype.click = function(p, shift, ctrl)
{
	var self = this;
	var view = this.$view;

	// clicked the tab of the focused item?
	var focus = this.focusedItem();
	if( focus && focus.withinCtrlArea( view, p ) )
	{
		shell.setMenu( focus.getMenu( view ) );
		return;
	}

	// clicked some item?
	for(var a = 0, aZ = this.twig.length; a < aZ; a++)
	{
		var item = this.atRank(a);
		if (item.click( view, p, shift, ctrl) )
			{ return true; }
	}

	// otherwhise pop up the float menu
	shell.setMenu( new EllipseMenu(
		system.fabric,
		p,
		theme.ellipseMenu,
		this._floatMenuLabels,
		self
	) );

	shell.dropFocus();
	shell.redraw = true;
	return true;
};

/**
| Stops an operation with the mouse button held down.
*/
Space.prototype.actionstop = function(p, shift, ctrl)
{
	var action = shell.$action;
	var view   = this.$view;
	var item;

	if (!action)
		{ throw new Error('Dragstop without action?'); }

	switch (action.type)
	{

		case Action.PAN :
			break;

		case Action.RELBIND :

			for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
				item = this.atRank(r);
				if (item.actionstop(view, p))
					{ break; }
			}
			shell.redraw = true;
			break;

		case Action.ITEMDRAG   :
		case Action.ITEMRESIZE :
		case Action.SCROLLY    :

			this.getSub( action.itemPath, 'actionstop' )
				.actionstop(view, p, shift, ctrl);
			break;

		default :
			throw new Error('Do not know how to handle Action.' + action.type);
	}

	shell.stopAction();
	return true;
};

/**
| Moving during an operation with the mouse button held down.
*/
Space.prototype.actionmove = function(p, shift, ctrl) {
	var view   = this.$view;
	var action = shell.$action;
	var item;

	switch( action.type )
	{

		case Action.PAN :

			var pd = p.sub( action.start );

			this.$view = view = new Euclid.View(
				action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
				view.fact
			);

			shell.redraw = true;

			return 'pointer';

		case Action.RELBIND :

			action.item2Path = null;
			action.move      = p;
			shell.redraw     = true;

			for(var r = 0, rZ = this.twig.length; r < rZ; r++)
			{
				item = this.atRank(r);

				if (item.actionmove(view, p))
					{ return 'pointer'; }
			}
			return 'pointer';

		default :

			this.getSub( action.itemPath, 'actionmove' )
				.actionmove(view, p);

			return 'move';
	}
};


/*
| An entry of the float menu has been selected
*/
Space.prototype.menuSelect = function(entry, p)
{
	var $view = this.$view;
	var pnw;
	var key;
	var nw;
	var nh;

	switch(entry)
	{
		case 'n' :
			// note
			nw = theme.note.newWidth;
			nh = theme.note.newHeight;

			pnw = $view.depoint( p ).
				sub( Jools.half( nw ), Jools.half ( nh ) );

			key = shell.peer.newNote(
				this.spacename,
				new Euclid.Rect(pnw, pnw.add(nw, nh))
			);

			this.$sub[key].grepFocus();

			break;

		case 'ne' :
			// label

			pnw = $view.depoint( p ).
				sub( theme.label.createOffset );

			key = shell.peer.newLabel(
				this.spacename,
				pnw,
				'Label',
				20
			);

			this.$sub[key].grepFocus();

			break;

		case 'se' :
			// portal

			nw = theme.portal.newWidth;
			nh = theme.portal.newHeight;

			pnw = $view.depoint(p).
				sub( Jools.half( nw ) , Jools.half( nh ) );

			key = shell.peer.newPortal(
				this.spacename,
				new Euclid.Rect(pnw, pnw.add(nw, nh))
			);

			this.$sub[key].grepFocus();

			break;
	}
};


/*
| Mouse button down event.
*/
Space.prototype.mousedown = function(p, shift, ctrl)
{
	var view   = this.$view;
	var action = shell.$action;

	if(this.access == 'ro' )
	{
		this.dragstart(p, shift, ctrl);
		return 'drag';
	}

	var focus = this.focusedItem();

	if( focus )
	{
		if( focus.withinCtrlArea(view, p) )
			{ return 'atween'; }

		var com = focus.checkHandles(view, p);
		if( com )
		{
			// resizing
			var dp = view.depoint(p);

			action = shell.startAction
			(
				Action.ITEMRESIZE, 'space',
				'itemPath',        focus.path,
				'start',           dp,
				'move',            dp,
				'align',           com,
				'startZone',       focus.getZone()
			);

			return 'drag';
		}
	}

	return 'atween';
};


/*
| Text input
*/
Space.prototype.input = function(text)
{
	var caret = shell.$caret;

	if (!caret.sign)
		{ return; }

	this.getSub( caret.sign.path, 'input' )
		.input(text);
};


/*
| Changes the zoom factor (around center)
*/
Space.prototype.changeZoom = function(df)
{
	var pm     = this.$view.depoint(this.fabric.getCenter());

	this.$view = this.$view.review(df, pm);

	shell.setSpaceZoom(this.$view.fact);

	this.knock();

	shell.redraw = true;
};


/*
| User pressed a special key.
*/
Space.prototype.specialKey = function(key, shift, ctrl)
{
	if (ctrl)
	{
		switch(key)
		{
			case 'z' : shell.peer.undo();   return;
			case 'y' : shell.peer.redo();   return;
			case ',' : this.changeZoom( 1); return;
			case '.' : this.changeZoom(-1); return;
		}
	}

	var caret = shell.$caret;

	if (!caret.sign)
		{ return; }

	this.getSub( caret.sign.path, 'specialKey').specialKey(key, shift, ctrl);
};


/*
| Returns the sub node path points to.
|
| If mark is not null, returns the last node that features the mark
|
| For example 'Item' or 'actionmove',
*/
Space.prototype.getSub = function( path, mark )
{
	var n = this;
	var m = null;

	for (var a = 0, aZ = path.length; a < aZ; a++)
	{
		if ( !n.$sub )
			{ break; }

		n = n.$sub[ path.get( a ) ];

		if (!n)
			{ break; }

		if ( mark && n[ mark ] )
			{ m = n; }
	}

	if (!mark)
		{ return n; }

	return m;
};


} ) ();
