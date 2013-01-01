/*
| The visual space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual = Visual || { };


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
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor
*/
var Space = Visual.Space =
	function(
		twig,
		spacename,
		access
	)
{
	Visual.Base.call( this, spacename, twig, null );

	var sub = this.$sub = { };

	this.access = access;
	this.fabric = system.fabric;

	this.$view  = new Euclid.View( Euclid.Point.zero, 0 );

	for( var k in twig.copse )
		{ sub[ k ] = this.createItem( twig.copse[ k ], k ); }

	this._floatMenuLabels =
		{
			c  : 'new',
			n  : 'Note',
			ne : 'Label',
			se : 'Portal'
		};
};

Jools.subclass(
	Space,
	Visual.Base
);


/*
| Updates $sub to match a new twig.
*/
Space.prototype.update =
	function( twig )
{
	// no change?
	if ( this.twig === twig )
		{ return; }

	this.twig = twig;

	var old = this.$sub;
	var sub = this.$sub = { };
	var copse = twig.copse;
	for( var k in copse )
	{
		var s = twig.copse[ k ];
		var o = old[ k ];
		if( Jools.is( o ) )
		{
			if( o.twig !== s )
				{ o.update( s ); }
			sub[ k ] = o;
		}
		else
		{
			sub[ k ] = this.createItem( s, k );
		}
	}

	// removes the focus if the focused item is removed.
	var caret = shell.$caret;
	var csign = caret.sign;

	if( caret.section === 'space' &&
		csign && csign.path &&
		!Jools.isnon( sub[ csign.path.get( 0 ) ] ) )
	{
		if(
			shell.selection.active &&
			shell.selection.sign1.path.get( -4 ) === csign.path.get( 1 )
		)
		{
			shell.selection.deselect( true );
		}

		shell.dropFocus( );
	}

	shell.redraw = true;
};


/*
| Returns the focused item.
*/
Space.prototype.focusedItem = function( )
{
	var caret = shell.$caret;

	if( caret.section !== 'space' )
	{
		return null;
	}

	return this.getSub(
		caret.sign.path,
		'Item'
	);
};


/*
| Creates a new visual representation of an item.
*/
Space.prototype.createItem =
	function(
		twig,
		k
	)
{
	var Proto;

	switch (twig.type)
	{
		case 'Note' :
			Proto = Visual.Note;
			break;

		case 'Label' :
			Proto = Visual.Label;
			break;

		case 'Portal' :
			Proto = Visual.Portal;
			break;

		case 'Relation' :
			Proto = Visual.Relation;
			break;

		default :
			throw new Error( 'unknown type: ' + twig.type );
	}

	return new Proto(
		this.spacename,
		twig,
		new Path( [ k ] ),
		this
	);
};


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function( )
{
	var twig = this.twig;
	var view = this.$view;
	var zone;

	for( var r = twig.length - 1; r >= 0; r-- )
	{
		this.atRank( r ).draw(
			this.fabric,
			view
		);
	}

	var focus = this.focusedItem( );
	if( focus )
	{
		focus.drawHandles(
			this.fabric,
			view
		);
	}

	var action = shell.bridge.action( );

	switch( action && action.type )
	{
		case 'CreateLabel' :

			if( action.start && action.move )
			{
				var trans = Visual.Label.s_createTrans(
					view.depoint( action.start ),
					view.depoint( action.move  )
				);

				Visual.Label.s_drawTrans(
					this.fabric,
					view,
					trans
				);
			}

			break;


		case 'CreateNote' :

			if( action.start && action.move )
			{
				zone = Visual.Note.s_getZone(
					view.depoint( action.start ),
					view.depoint( action.move  )
				);

				Visual.Note.s_drawTrans(
					this.fabric,
					view,
					zone
				);
			}

			break;

		case 'CreatePortal' :

			if( action.start && action.move )
			{
				zone = Visual.Portal.s_getZone(
					view.depoint( action.start ),
					view.depoint( action.move  )
				);

				Visual.Portal.s_drawTrans(
					this.fabric,
					view,
					zone
				);
			}

			break;

		case 'CreateRelation' :

			if( action.fromItemPath )
			{
				var fromItem = this.getSub(
					action.fromItemPath,
					'Item'
				);

				fromItem.highlight(
					this.fabric,
					view
				);

				var toItem = null;

				if( action.toItemPath )
				{
					toItem =
						this.getSub(
							action.toItemPath,
							'Item'
						);

					toItem.highlight(
						this.fabric,
						view
					);
				}

				var fromSilhoutte =
					fromItem.getSilhoutte(
						fromItem.getZone( )
					);

				var toSilhoutte;

				if(
					action.toItemPath &&
					!action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toSilhoutte =
						toItem.getSilhoutte(
							toItem.getZone( )
						);
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toSilhoutte =
						view.depoint( action.move );
				}

				if( toSilhoutte )
				{
					var arrow =
						Euclid.Line.connect(
							fromSilhoutte,
							'normal',
							toSilhoutte,
							'arrow'
						);

					arrow.draw(
						this.fabric,
						view,
						theme.relation.style
					);
				}
			}

			break;
	}
};


/*
| Force-clears all caches.
*/
Space.prototype.knock =
	function( )
{
	for( var r = this.twig.length - 1; r >= 0; r-- )
	{
		this.atRank( r ).knock( );
	}
};


/*
| Positions the caret.
*/
Space.prototype.positionCaret =
	function( )
{
	this.getSub( shell.$caret.sign.path, 'positionCaret' )
		.positionCaret( this.$view );
};


/*
| Mouse wheel
*/
Space.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
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

	shell.setSpaceZoom( this.$view.fact );

	this.knock( );

	shell.redraw = true;

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
Space.prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( p === null )
	{
		return null;
	}

	var view   = this.$view;

	var cursor = null;

	var focus = this.focusedItem( );

	var action = shell.bridge.action( );

	if( focus )
	{
		var com = focus.checkHandles( view, p );

		if( com )
		{
			cursor = com + '-resize';
		}
	}

	for( var a = 0, aZ = this.twig.length; a < aZ; a++ )
	{
		var item = this.atRank( a );

		var cu = item.pointingHover(
			view,
			p
		);

		if( !cursor && cu )
		{
			cursor = cu;

			switch( action && action.type ) {

			case 'Remove' :

				if(
					!item.path.equals( action.removeItemPath )
				)
				{
					action.removeItemPath = item.path;

					action.removeItemFade = true;

					shell.redraw = true;
				}

				break;

			case 'CreateRelation' :

				if(
					action.relationState === 'start' &&
					!item.path.equals( action.fromItemPath )
				)
				{
					action.fromItemPath = item.path;

					shell.redraw = true;
				}

				break;
			}
		}
	}

	if( !cursor )
	{
		switch( action && action.type )
		{
		case 'Remove' :

			if( action.removeItemPath )
			{
				action.removeItemPath = null;

				shell.redraw = true;
			}

			break;

		case 'CreateRelation' :

			if( action.fromItemPath )
			{
				action.fromItemPath = null;

				shell.redraw = true;
			}

			break;
		}
	}

	return cursor || 'pointer';
};


/*
| Starts an operation with the mouse button held down.
*/
Space.prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var view  = this.$view;

	var focus = this.focusedItem( );

	// see if the itemmenu of the focus was targeted
	if(
		this.access == 'rw' &&
		focus
	)
	{
		var dp;
		var com =
			focus.checkHandles(
				view,
				p
			);

		if( com )
		{
			// resizing
			dp = view.depoint(p);

			action = shell.bridge.startAction(
				'ItemResize',
				'space',
				'itemPath',  focus.path,
				'start',     dp,
				'move',      dp,
				'align',     com,
				'startZone', focus.getZone( )
			);

			return;
		}
	}

	var action = shell.bridge.action( );

	switch( action && action.type ) {

		case 'CreateLabel' :
		case 'CreateNote' :
		case 'CreatePortal' :

			action.start = p;

			return;

		case 'CreateRelation' :

			if( action.relationState === 'pan' )
			{
				// starts a panning operation instead
				// while creating a relation

				action.start = p;

				action.pan = view.pan;
			}

			return;

		case 'Remove' :

			if( !action.removeItemPath )
			{
				// starts a panning operation instead
				// while removing

				action.start = p;

				action.pan = view.pan;
			}

			// otherwise starts a true remove operation
			// itemRemovePath is already set by Hover

			return;

		default :

			// ignore and go on
			break;
	}

	// normal mode

	// see if one item was targeted
	for( var a = 0, aZ = this.twig.length; a < aZ; a++ )
	{
		var item = this.atRank( a );
		if(
			item.dragStart(
				view,
				p,
				shift,
				ctrl,
				this.access
			)
		)
		{
			return;
		}
	}

	// otherwise panning is initiated
	shell.bridge.startAction
	(
		'Pan',
		'space',
		'start',  p,
		'pan',    view.pan
	);

	return;
};


/*
| A mouse click.
*/
Space.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var self = this;
	var view = this.$view;

	// clicked the tab of the focused item?
	var focus = this.focusedItem( );

	// clicked some item?
	for( var a = 0, aZ = this.twig.length; a < aZ; a++ )
	{
		var item = this.atRank(a);
		if(
			item.click(
				view,
				p,
				shift,
				ctrl
			)
		)
		{
			return true;
		}
	}

	shell.dropFocus( );

	shell.redraw = true;

	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
Space.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var action = shell.bridge.action( );
	var view   = this.$view;
	var key, item;

	if( !action )
	{
		throw new Error('Dragstop without action?');
	}

	switch( action.type )
	{
		case 'CreateNote' :

			key = shell.peer.newNote(
				this.spacename,
				Visual.Note.s_getZone(
					view.depoint( action.start ),
					view.depoint( action.move  )
				)
			);

			this.$sub[ key ].grepFocus( );

			shell.redraw = true;

			if( !ctrl )
			{
				shell.bridge.stopAction( );
			}

			break;

		case 'CreateLabel' :

			var trans = Visual.Label.s_createTrans(
				view.depoint( action.start ),
				view.depoint( action.move  )
			);

			key = shell.peer.newLabel(
				this.spacename,
				trans.pnw,
				'Label',
				trans.font.size
			);

			this.$sub[ key ].grepFocus( );

			shell.redraw = true;

			shell.bridge.stopAction( );

			break;

		case 'CreatePortal' :

			key = shell.peer.newPortal(
				this.spacename,
				Visual.Portal.s_getZone(
					view.depoint( action.start ),
					view.depoint( action.move  )
				)
			);

			this.$sub[ key ].grepFocus( );

			shell.redraw = true;

			shell.bridge.stopAction( );

			break;

		case 'Pan' :

			shell.bridge.stopAction( );

			break;

		case 'CreateRelation' :

			switch( action.relationState )
			{

				case 'hadSelect' :

					item = this.getSub( action.toItemPath );

					item.dragStop( view, p );

					shell.redraw = true;

					shell.bridge.stopAction( );

					break;

				case 'pan' :

					action.relationState = 'start';

					break;
			}

			break;

		case 'ItemDrag' :
		case 'ItemResize' :
		case 'ScrollY' :

			this.getSub(
				action.itemPath,
				'dragStop'
			).dragStop(
				view,
				p,
				shift,
				ctrl
			);

			shell.bridge.stopAction( );

			break;

		case 'Remove' :

			var removeItem = this.getSub(
				action.removeItemPath,
				'Item'
			);

			// checks if the pointer is still
			// on the items to be removed
			// otherwise it is not removed!
			if(
				!removeItem.getZone().within(
					view,
					p
				)
			)
			{
				action.removeItemPath = null;

				shell.redraw = true;

				break;
			}

			var focus = this.focusedItem( );

			if( action.removeItemPath )
			{
				if(
					focus &&
					action.removeItemPath.equals( focus.path )
				)
				{
					shell.dropFocus( );
				}

				shell.peer.removeItem(
					action.removeItemPath
				);

				action.removeItemPath = null;
			}

			shell.redraw = true;

			break;

		default :

			throw new Error( 'Do not know how to handle Action: ' + action.type );
	}

	return true;
};


/*
| Moving during an operation with the mouse button held down.
*/
Space.prototype.dragMove =
	function(
		p
		// shift,
		// ctrl
	)
{
	var view =
		this.$view;

	var action =
		shell.bridge.action( );

	var item, pd;

	switch( action.type )
	{
		case 'CreateNote' :
		case 'CreateLabel' :
		case 'CreatePortal' :

			action.move = p;

			shell.redraw = true;

			return 'pointer';

		case 'CreateRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd = p.sub( action.start );

				this.$view = view = new Euclid.View(
					action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
					view.fact
				);

				shell.redraw = true;

				return 'pointer';
			}


			action.toItemPath = null;

			action.move = p;

			for( var r = 0, rZ = this.twig.length; r < rZ; r++ )
			{
				item = this.atRank( r );

				if(
					item.dragMove(
						view,
						p
					)
				)
				{
					return 'pointer';
				}
			}

			shell.redraw = true;

			return 'pointer';


		case 'Remove' :

			if( !action.removeItemPath )
			{
				// dragging while removing

				pd = p.sub( action.start );

				this.$view = view = new Euclid.View(
					action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
					view.fact
				);
			}
			else
			{
				var removeItem = this.getSub(
					action.removeItemPath,
					'Item'
				);

				// the item to removed is faded
				// when the pointer is still upon
				// it

				action.removeItemFade = (
					removeItem.getZone().within(
						view,
						p
					)
				);
			}

			shell.redraw = true;

			return 'pointer';

		case 'Pan' :

			pd = p.sub( action.start );

			this.$view = view = new Euclid.View(
				action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
				view.fact
			);

			shell.redraw = true;

			return 'pointer';

		default :

			this.getSub( action.itemPath, 'dragMove' )
				.dragMove( view, p );

			return 'move';
	}
};


/*
| An entry of the float menu has been selected
*/
Space.prototype.menuSelect =
	function(
		entry,
		p
	)
{
	var view = this.$view;
	var pnw;
	var key;
	var nw;
	var nh;

	switch( entry )
	{
		case 'n' :
			// note
			nw = theme.note.newWidth;
			nh = theme.note.newHeight;

			pnw = view.depoint( p ).
				sub(
					Jools.half( nw ),
					Jools.half( nh )
				);

			key = shell.peer.newNote(
				this.spacename,
				new Euclid.Rect(
					'pnw/size',
					pnw,
					nw,
					nh
				)
			);

			this.$sub[ key ].grepFocus( );

			break;

		case 'ne' :
			// label

			pnw = view.depoint( p ).
				sub( theme.label.createOffset );

			key = shell.peer.newLabel(
				this.spacename,
				pnw,
				'Label',
				20
			);

			this.$sub[ key ].grepFocus( );

			break;

		case 'se' :
			// portal

			nw = theme.portal.newWidth;
			nh = theme.portal.newHeight;

			pnw = view.depoint(p).
				sub(
					Jools.half( nw ),
					Jools.half( nh )
				);

			key = shell.peer.newPortal(
				this.spacename,
				new Euclid.Rect(
					'pnw/size',
					pnw,
					nw,
					nh
				)
			);

			this.$sub[key].grepFocus( );

			break;
	}
};


/*
| Pointing device starts pointing ( mouse down, touch start )
*/
Space.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	var view   = this.$view;

	if( this.access == 'ro' )
	{
		return 'drag';
	}

	var action = shell.bridge.action( );

	switch( action && action.type ) {

	case 'Remove' :

		// starts a drag operation on deletion
		// so the item gets removed on
		// mouse/finger up

		return 'drag';

	case 'CreateRelation' :

		if( action.fromItemPath )
		{
			action.relationState = 'hadSelect';
		}
		else
		{
			action.relationState = 'pan';
		}

		return 'drag';
	}


	var focus = this.focusedItem( );

	if( focus )
	{
		var com =
			focus.checkHandles(
				view,
				p
			);

		if( com )
		{
			return 'drag';
		}
	}

	return 'atween';
};


/*
| Text input
*/
Space.prototype.input =
	function( text )
{
	var caret = shell.$caret;

	if (!caret.sign)
		{ return; }

	this.getSub(
		caret.sign.path,
		'input'
	).input( text );
};


/*
| Changes the zoom factor (around center)
*/
Space.prototype.changeZoom =
	function( df )
{
	var pm = this.$view.depoint( this.fabric.getCenter( ) );

	this.$view = this.$view.review( df, pm );

	shell.setSpaceZoom( this.$view.fact );

	this.knock( );

	shell.redraw = true;
};


/*
| User pressed a special key.
*/
Space.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( ctrl )
	{
		switch( key )
		{
			case 'z' :
				shell.peer.undo( );
				return;
			case 'y' :
				shell.peer.redo( );
				return;
			case ',' :
				this.changeZoom(  1 );
				return;
			case '.' :
				this.changeZoom( -1 );
				return;
		}
	}

	var caret = shell.$caret;

	if (!caret.sign)
	{
		return;
	}

	this.getSub(
		caret.sign.path,
		'specialKey'
	).specialKey(
		key,
		shift,
		ctrl
	);
};


/*
| Returns the sub node path points to.
|
| For example 'Item' or having a method like 'specialKey'
*/
Space.prototype.getSub =
	function(
		path,
		mark   // If mark is not null,
		//     // returns the last node that features the mark
	)
{
	var n = this;
	var m = null;

	for( var a = 0, aZ = path.length; a < aZ; a++ )
	{
		if( !n.$sub )
		{
			break;
		}

		n = n.$sub[ path.get( a ) ];

		if( !n )
		{
			break;
		}

		if( mark && n[ mark ] )
		{
			m = n;
		}
	}

	if( !mark )
	{
		return n;
	}

	return m;
};


} )( );

