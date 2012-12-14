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

	return this.getSub( caret.sign.path, 'Item' );
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
		case 'RelBind' :

			var av  = this.getSub(
				action.itemPath,
				'Item'
			);

			var av2 = action.item2Path ?
				this.getSub(
					action.item2Path,
					'Item'
				) :
				null;

			var target = av2 ?
				av2.getSilhoutte( av2.getZone( ) ) :
				view.depoint( action.move );

			var arrow  = Euclid.Line.connect(
				av.getSilhoutte( av.getZone( ) ),
				'normal',
				target,
				'arrow'
			);

			if( av2 )
			{
				av2.highlight(
					this.fabric,
					view
				);
			}

			arrow.draw(
				this.fabric,
				view,
				theme.relation.style
			);

			break;

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
				var itemFrom = this.getSub(
					action.fromItemPath,
					'Item'
				);

				itemFrom.highlight(
					this.fabric,
					view
				);
			}

			//var av2 = action.item2Path ?
			//	this.getSub(
			//		action.item2Path,
			//		'Item'
			//	) :
			//	null;

			//var target = av2 ?
			//	av2.getSilhoutte( av2.getZone( ) ) :
			//	view.depoint( action.move );

			//var arrow  = Euclid.Line.connect(
			//	av.getSilhoutte( av.getZone( ) ),
			//	'normal',
			//	target,
			//	'arrow'
			//);

			//if( av2 )
			//{
			//	av2.highlight(
			//		this.fabric,
			//		view
			//	);
			//}

			//arrow.draw(
			//	this.fabric,
			//	view,
			//	theme.relation.style
			//);

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
		if( focus.withinCtrlArea( view, p ) )
		{
			cursor = 'default';
		}
		else
		{
			var com = focus.checkHandles( view, p );

			if( com )
			{
				cursor = com + '-resize';
			}
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

			if(
				action &&
				action.type === 'Remove'
			)
			{
				if(
					!item.path.equals( action.removeItemPath )
				)
				{
					action.removeItemPath = item.path;

					shell.redraw = true;
				}
			}

			if( shell.bridge.inMode( 'Create' ) )
			{
				//var action = shell.bridge.action( );
				//action.fromItemPath =
			}
		}
	}

	if(
		!cursor &&
		action &&
		action.type === 'Remove' &&
		action.removeItemPath
	)
	{
		action.removeItemPath = null;

		shell.redraw = true;
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
		focus &&
		focus.withinCtrlArea( view, p )
	)
	{
		var dp = view.depoint(p);

		shell.bridge.startAction(
			'RelBind',
			'space',
			'itemPath', focus.path,
			'start',    dp,
			'move',     dp
		);

		shell.redraw = true;
		return;
	}


	if( shell.bridge.inMode( 'Create' ) )
	{
		var action = shell.bridge.action( );

		switch( action && action.type ) {

		case 'CreateLabel' :
		case 'CreateNote' :
		case 'CreatePortal' :

			action.start = p;
			return;

		case 'Remove' :
			return;

		default :
			// ignore and go on
			break;
		}
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

	if(
		focus &&
		focus.withinCtrlArea( view, p )
	)
	{
		shell.setMenu( focus.getMenu( view ) );
		return;
	}

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

	// otherwhise pop up the float menu
	shell.setMenu(
		new EllipseMenu(
			system.fabric,
			p,
			theme.ellipseMenu,
			this._floatMenuLabels,
			self
		)
	);

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

			shell.bridge.stopAction( );

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

		case 'RelBind' :

			for( var r = 0, rZ = this.twig.length; r < rZ; r++ )
			{
				item = this.atRank( r );
				if( item.dragStop( view, p ) )
				{
					break;
				}
			}

			shell.redraw = true;

			shell.bridge.stopAction( );

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

			var focus = this.focusedItem( );

			if(
				focus &&
				action.removeItemPath.equals( focus.path )
			)

			shell.dropFocus( );

			shell.peer.removeItem(
				action.removeItemPath
			);

			action.removeItemPath = null;

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

	var item;

	switch( action.type )
	{
		case 'CreateNote' :
		case 'CreateLabel' :
		case 'CreatePortal' :

		case 'DragMove' :

			action.move = p;

			shell.redraw = true;

			return 'pointer';

		case 'Remove' :

			return 'pointer';

		case 'Pan' :

			var pd = p.sub( action.start );

			this.$view = view = new Euclid.View(
				action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
				view.fact
			);

			shell.redraw = true;

			return 'pointer';

		case 'RelBind' :

			action.item2Path = null;

			action.move = p;

			shell.redraw = true;

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
		p,
		shift,
		ctrl
	)
{
	var view   = this.$view;
	var action = shell.bridge.action( );

	if( this.access == 'ro' )
	{
		this.dragStart(
			p,
			shift,
			ctrl
		);

		return 'drag';
	}

	var action = shell.bridge.action( );

	// starts a drag operation on deletion
	// so the item gets removed on
	// mouse/finger up
	if(
		action &&
		action.type === 'Remove' &&
		action.removeItemPath
	)
	{
		return 'drag';
	}


	var focus = this.focusedItem( );

	if( focus )
	{
		if( focus.withinCtrlArea( view, p ) )
			{ return 'atween'; }

		var com = focus.checkHandles( view, p );

		if( com )
		{
			// resizing
			var dp = view.depoint(p);

			action = shell.bridge.startAction(
				'ItemResize',
				'space',
				'itemPath',  focus.path,
				'start',     dp,
				'move',      dp,
				'align',     com,
				'startZone', focus.getZone( )
			);

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

