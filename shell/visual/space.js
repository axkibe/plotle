/*
| The visual space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;

Visual =
	Visual || { };


/*
| Imports
*/
var
	Caret,
	Euclid,
	Jools,
	MeshMashine,
	Path,
	Sign,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor
*/
var Space =
Visual.Space =
	function(
		twig,
		spaceUser,
		spaceTag,
		access
	)
{
	Visual.Base.call(
		this,
		twig,
		null
	);

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	var sub =
	this.$sub =
		{ };

	this.access =
		access;

	this.$view =
		new Euclid.View(
			Euclid.Point.zero,
			0
		);

	for( var k in twig.copse )
	{
		sub[ k ] =
			this.createItem(
				twig.copse[ k ],
				k
			);
	}

	// TODO change Caret to free string arguments
	this.$caret =
		new Caret(
			null,
			null,
			false
		);
};


Jools.subclass(
	Space,
	Visual.Base
);


/*
| Updates the subtree to match a new twig.
*/
Space.prototype.update =
	function(
		twig,
		chgX
	)
{
	// no change?
	if( this.twig === twig )
	{
		return;
	}

	this.twig =
		twig;

	var
		old =
			this.$sub,

		sub =
		this.$sub =
				{ },

		copse =
			twig.copse;

	for( var k in copse )
	{
		sub[ k ] =
			this.createItem(
				twig.copse[ k ],
				k,
				old[ k ]
			);
	}

	// removes the focus if the focused item is removed.

	var
		caret =
			this.$caret,

		csign =
			caret.sign;

	if(
		csign &&
		csign.path &&
		Jools.is(
			sub[ csign.path.get( 0 ) ]
		)
	)
	{
		var selection =
			shell.getSelection( );

		if(
			selection &&
			selection.sign1.path.get( -4 ) === csign.path.get( 1 )
		)
		{
			shell.deselect( true );
		}

		this.setCaret( null );
	}

	shell.redraw =
		true;

	if( caret.sign !== null )
	{
		this.setCaret(
			MeshMashine.tfxSign(
				caret.sign,
				chgX
			),
			caret.retainx
		);
	}
};


/*
| Returns the focused item.
*/
Space.prototype.focusedItem =
	function( )
{
	var
		caret =
			this.$caret;

	if( !caret.sign )
	{
		return null;
	}

	var
		path =
			caret.sign.path,

		action =
			shell.bridge.action( );


	switch( action && action.type )
	{
		case 'ItemDrag' :

			if( action.itemPath.subPathOf( path ) )
			{
				return action.item;
			}

			break;
	}

	return (
		this.getSub(
			path,
			'Item'
		)
	);
};


/*
| Creates a new visual representation of an item.
*/
Space.prototype.createItem =
	function(
		twig,
		key,
		inherit
	)
{
	var Proto =
		Visual[ twig.type ];

	if( !Proto )
	{
		throw new Error( 'unknown type: ' + twig.type );
	}

	if( twig.type === 'Note' || twig.type === 'Label' )
	{ // TODO remove
		return (
			Proto.create(
				'inherit',
					inherit,
				'twig',
					twig,
				'path',
					new Path( [ key ] )
			)
		);
	}

	return (
		Proto.create(
			'twig',
			inherit,
			twig,
			inherit ?
				inherit.path :
				new Path( [ key ] )
		)
	);
};


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function(
		fabric
	)
{
	var
		twig =
			this.twig,

		view =
			this.$view,

		action =
			shell.bridge.action( ),

		zone;

	this._center =
		fabric.getCenter( );


	// removes caret caches.
	this.$caret.$save =
	this.$caret.$screenPos =
		null;

	for(
		var r = twig.length - 1;
		r >= 0;
		r--
	)
	{
		var
			item =
				this.atRank( r );

		switch( action && action.type )
		{
			case 'ItemDrag' :

				if( item.path.equals( action.itemPath ) )
				{
					item =
						action.item;
				}
		}

		item.draw(
			fabric,
			this.$caret,
			view
		);
	}

	var focus =
		this.focusedItem( );

	if( focus )
	{
		focus.drawHandles(
			fabric,
			view
		);
	}

	switch( action && action.type )
	{
		case 'createLabel' :
		case 'createNote' :
		case 'createPortal' :

			if( action.start && action.move )
			{
				action.item.draw(
					fabric,
					this.$caret,
					view
				);
			}

			break;

		case 'createRelation' :

			if( action.fromItemPath )
			{
				var fromItem =
					this.getSub(
						action.fromItemPath,
						'Item'
					);

				fromItem.highlight(
					fabric,
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
						fabric,
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
						fabric,
						view,
						theme.relation.style
					);
				}
			}

			break;
	}

	this.$caret.display( );
};


/*
| Force-clears all caches.
*/
Space.prototype.knock =
	function( )
{
	this.$caret.$save =
	this.$caret.$screenPos =
		null;

	for(
		var r = this.twig.length - 1;
		r >= 0;
		r--
	)
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
	var
		node =
			this.getSub(
				this.$caret.sign.path,
				'positionCaret'
			);

	if( node )
	{
		node.positionCaret(
			this,
			this.$caret,
			this.$view
		);
	}
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
	var view =
		this.$view;

	var twig =
		this.twig;

	for(
		var r = 0, rZ = twig.length;
		r < rZ;
		r++
	)
	{
		var item =
			this.atRank(r);

		if (
			item.mousewheel(
				view,
				p,
				dir,
				shift,
				ctrl
			)
		)
		{
			return true;
		}
	}

	if ( dir > 0 )
	{
		this.$view =
			this.$view.review(  1, p );
	}
	else
	{
		this.$view =
			this.$view.review( -1, p );
	}

	shell.setSpaceZoom( this.$view.fact );

	this.knock( );

	shell.redraw =
		true;

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

	var
		view =
			this.$view,

		cursor =
			null,

		focus =
			this.focusedItem( ),

		action =
			shell.bridge.action( );

	if( focus )
	{
		var com =
			focus.checkHandles(
				view,
				p
			);

		if( com )
		{
			cursor =
				com + '-resize';
		}
	}

	for(
		var a = 0, aZ = this.twig.length;
		a < aZ;
		a++
	)
	{
		var item =
			this.atRank( a );

		var cu =
			item.pointingHover(
				view,
				p
			);

		if( !cursor && cu )
		{
			cursor =
				cu;

			switch( action && action.type )
			{

				case 'Remove' :

					if(
						!item.path.equals( action.removeItemPath )
					)
					{
						action.removeItemPath =
							item.path;

						action.removeItemFade =
							true;

						shell.redraw =
							true;
					}

					break;

				case 'createRelation' :

					if(
						action.relationState === 'start' &&
						!item.path.equals( action.fromItemPath )
					)
					{
						action.fromItemPath =
							item.path;

						shell.redraw =
							true;
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
					action.removeItemPath =
						null;

					shell.redraw =
						true;
				}

				break;

			case 'createRelation' :

				if( action.fromItemPath )
				{
					action.fromItemPath =
						null;

					shell.redraw =
						true;
				}

				break;
		}
	}

	return cursor || 'pointer';
};


/*
| Sets the caret position.
*/
Space.prototype.setCaret =
	function(
		sign,
		retainx
	)
{
	switch( sign && sign.constructor )
	{
		case null :
		case Sign :

			break;

		case Object :

			sign =
				new Sign( sign );

			break;

		default :

			throw new Error(
				'Space.setCaret: invalid sign'
			);
	}

	var
		item;

	if(
		this.$caret.sign &&
		(
			!sign ||
			this.$caret.sign.path !== sign.path
		)
	)
	{
		item =
			this._getCaretItem(
				this.$caret.sign.path
			);

		if( item )
		{
			item.knock( );
		}

		this.redraw = true;
	}

	this.$caret =
		new Caret(
			sign,
			Jools.is( retainx ) ? retainx : null,
			this.$caret.$shown
		);

	if( sign )
	{
		item =
			this._getCaretItem(
				sign.path
			);

		if( item )
		{
			item.knock( );
		}

		this.redraw = true;
	}

	return this.$caret;
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
	var
		view =
			this.$view,

		focus =
			this.focusedItem( );

	// see if the handles were targeted
	if(
		this.access == 'rw' &&
		focus
	)
	{
		var
			dp,
			com =
				focus.checkHandles(
					view,
					p
				);

		if( com )
		{
			// resizing
			dp =
				view.depoint( p );

			shell.bridge.startAction(
				'ItemResize',
				'space',
				'itemPath',
					focus.path,
				'start',
					dp,
				'move',
					dp,
				'align',
					com,
				'startZone',
					focus.getZone( )
			);

			return;
		}
	}

	var
		action =
			shell.bridge.action( );


	switch( action && action.type ) {

		case 'createNote' :

			action.start =
				p;

			action.item =
				this.getActionItemCreator( action )
					.create(
						'zone',
							new Euclid.Rect(
								'pnw/pse',
								p, //TODO depoint?
								p
							),
						'doc',
							Visual.Doc.create(
								'phrase',
								null,
								'',
								theme.note.fontsize
							)
					);

			return;

		case 'createLabel' :
		case 'createPortal' :

			action.start =
				p;

			action.item =
				this.getActionItemCreator( action )
					.create(
						'zone',
							new Euclid.Rect(
								'pnw/pse',
								p,
								p
							),
						'doc',
							Visual.Doc.create(
								'phrase',
								null,
								'Label',
								theme.label.minSize
							)
					);

			return;

		default :

			// ignore and go on
			break;
	}

	// see if one item was targeted
	for(
		var a = 0, aZ = this.twig.length;
		a < aZ;
		a++
	)
	{
		var item =
			this.atRank( a );

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

	// starts a panning operation instead
	switch( action && action.type )
	{
		case 'Remove' :

			action.start =
				p;

			action.pan =
				view.pan;

			return;

		case 'createRelation' :

			action.start =
				p;

			action.pan =
				view.pan;

			action.relationState =
				'pan';

			return;
	}

	// otherwise panning is initiated
	shell.bridge.startAction
	(
		'Pan',
		'space',
		'start',
			p,
		'pan',
			view.pan
	);

	return;
};


/*
| Returns the creator for an item to be created
*/
Space.prototype.getActionItemCreator =
	function(
		action
	)
{
	switch( action.type )
	{
		case 'createLabel' :

			return Visual.Label;

		case 'createNote' :

			return Visual.Note;

		case 'createPortal' :

			return Visual.Portal;

		default :

			throw new Error(
				'unknown action'
			);
	}
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
	var view =
		this.$view;

	// clicked some item?
	for(
		var a = 0, aZ = this.twig.length;
		a < aZ;
		a++
	)
	{
		var item =
			this.atRank( a );

		if(
			item.click(
				this,
				view,
				p,
				shift,
				ctrl,
				this.access
			)
		)
		{
			return true;
		}
	}

	// otherwise ...

	this.setCaret( null );

	shell.redraw =
		true;

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
	var
		action =
			shell.bridge.action( ),

		view =
			this.$view,

		key,
		item;

	if( !action )
	{
		throw new Error('Dragstop without action?');
	}

	switch( action.type )
	{
		case 'createNote' :

			var
				note =
					Visual.Note.create(
						'inherit',
							action.item,
						'zone',
							new Euclid.Rect(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( action.move )
							)
					);

				key =
					shell.peer.newNote(
						this.spaceUser,
						this.spaceTag,
						note.zone
					);

			this.$sub[ key ].grepFocus( this );

			shell.redraw =
				true;

			if( !ctrl )
			{
				shell.bridge.stopAction( );
			}

			break;

		case 'createLabel' :

			var
				label =
					Visual.Label.create(
						'inherit',
							action.item,
						'zone',
							new Euclid.Rect(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( action.move  )
							)
					);

			key =
				shell.peer.newLabel(
					this.spaceUser,
					this.spaceTag,
					label.pnw,
					'Label',
					label.$sub.doc.getFont( label ).size
				);

			this.$sub[ key ].grepFocus( this );

			shell.redraw =
				true;

			if( !ctrl )
			{
				shell.bridge.stopAction( );
			}

			break;

		case 'createPortal' :

			var
				portal =
					Visual.Portal.create(
						'zone',
						action.item,
						// FIXME, provide reusable points/rects
						new Euclid.Rect(
							'arbitrary',
							view.depoint( action.start ),
							view.depoint( action.move  )
						)
					);

			key =
				shell.peer.newPortal(
					this.spaceUser,
					this.spaceTag,
					portal.zone,
					shell.bridge.getUsername( ),
					'home'
				);

			this.$sub[ key ].grepFocus( this );

			shell.redraw = true;

			shell.bridge.stopAction( );

			break;

		case 'Pan' :

			shell.bridge.stopAction( );

			break;

		case 'createRelation' :

			switch( action.relationState )
			{

				case 'hadSelect' :

					if( action.toItemPath )
					{
						item =
							this.getSub(
								action.toItemPath
							);

						item.dragStop(
							view,
							p
						);
					}

					shell.redraw =
						true;

					shell.bridge.stopAction( );

					break;

				case 'pan' :

					action.relationState = 'start';

					break;
			}

			break;

		case 'ItemDrag' :

			if( !action.item.zone.equals( action.origin.zone ) )
			{
				shell.peer.setZone(
					action.itemPath,
					action.item.zone
				);

				shell.bridge.stopAction( );

				shell.redraw = true;
			}

			break;

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

			var focus =
				this.focusedItem( );

			if( action.removeItemPath )
			{
				var removeItem =
					this.getSub(
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
					action.removeItemPath =
						null;

					shell.redraw =
						true;

					break;
				}

				if(
					focus &&
					action.removeItemPath.equals( focus.path )
				)
				{
					this.setCaret( null );
				}

				shell.peer.removeItem(
					action.removeItemPath
				);

				action.removeItemPath =
					null;
			}

			shell.redraw =
				true;

			break;

		default :

			throw new Error(
				'Do not know how to handle action: ' + action.type
			);
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
	var
		view =
			this.$view,

		action =
			shell.bridge.action( ),

		item,

		pd;

	switch( action.type )
	{
		case 'createLabel' :
		case 'createNote' :
		case 'createPortal' :

			action.move =
				p;

			action.item =
				this.getActionItemCreator( action )
					.create(
						'inherit',
							action.item,
						'zone',
							new Euclid.Rect(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( p )
							)
					);

			shell.redraw =
				true;

			return 'pointer';

		case 'createRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd =
					p.sub( action.start );

				this.$view =
				view =
					new Euclid.View(
						action.pan.add(
							pd.x / view.zoom,
							pd.y / view.zoom
						),
						view.fact
					);

				shell.redraw =
					true;

				return 'pointer';
			}

			action.toItemPath =
				null;

			action.move =
				p;

			for(
				var r = 0, rZ = this.twig.length;
				r < rZ;
				r++
			)
			{
				item =
					this.atRank( r );

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

			shell.redraw =
				true;

			return 'pointer';


		case 'Remove' :

			if( !action.removeItemPath )
			{
				// dragging while removing

				pd =
					p.sub( action.start );

				view =
				this.$view =
					new Euclid.View(
						action.pan.add( pd.x / view.zoom, pd.y / view.zoom ),
						view.fact
					);
			}
			else
			{
				var removeItem =
					this.getSub(
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

			shell.redraw =
				true;

			return 'pointer';

		case 'Pan' :

			pd =
				p.sub( action.start );

			view =
			this.$view =
				new Euclid.View(
					action.pan.add(
						pd.x / view.zoom,
						pd.y / view.zoom
					),
					view.fact
				);

			shell.redraw =
				true;

			return 'pointer';

		case 'ItemDrag' :

			action.move =
				view.depoint( p );

			action.item =
				action.origin.creator.create(
					'inherit',
						action.item,
					'zone',
						action.origin.zone.add(
							action.move.x - action.start.x,
							action.move.y - action.start.y
						)
				);

			shell.redraw =
				true;

			return true;


		case 'ItemResize' :

			action.move =
				view.depoint( p );

			shell.redraw =
				true;

			return true;

		default :

			this.getSub(
				action.itemPath,
				'dragMove'
			).dragMove(
				view,
				p
			);

			return 'move';
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
	var
		view =
			this.$view;

	/*
	if( this.access == 'ro' )
	{
		return 'drag';
	}
	*/

	var action =
		shell.bridge.action( );

	switch( action && action.type )
	{
		case 'Remove' :

			// starts a drag operation on deletion
			// so the item gets removed on
			// mouse/finger up

			return 'drag';

		case 'createRelation' :

			// this is either a pan or creates the relation
			// anyway its a drag.

			return 'drag';
	}


	var focus =
		this.focusedItem( );

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
	var caret =
		this.$caret;

	if( !caret.sign )
	{
		return;
	}

	var node =
		this.getSub(
			caret.sign.path,
			'input'
		);

	if( node )
	{
		node.input(
			caret,
			text
		);
	}
};


/*
| Changes the zoom factor (around center)
*/
Space.prototype.changeZoom =
	function( df )
{
	var pm =
		this.$view.depoint( this._center );

	this.$view =
		this.$view.review(
			df,
			pm
		);

	shell.setSpaceZoom(
		this.$view.fact
	);

	this.knock( );

	shell.redraw =
		true;
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

	var caret =
		this.$caret;

	if ( !caret.sign )
	{
		return;
	}

	var node =
		this.getSub(
			caret.sign.path,
			'specialKey'
		);

	if( node )
	{
		node.specialKey(
			this,
			caret,
			key,
			shift,
			ctrl
		);
	}
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
	var
		n =
			this,

		m =
			null,

		action =
			shell.bridge.action( );

	for(
		var a = 0, aZ = path.length;
		a < aZ;
		a++
	)
	{
		if (
			action &&
			action.itemPath &&
			action.itemPath.length === a
		)
		{
			switch( action.type )
			{
				case 'ItemDrag' :

					if(
						action.itemPath.subPathOf( path )
					)
					{
						n =
							action.item;

						if( mark && n[ mark ] )
						{
							m =
								n;
						}

						continue;
					}

					break;
			}
		}

		if( !n.$sub )
		{
			break;
		}

		n =
			n.$sub[ path.get( a ) ];

		if( !n )
		{
			break;
		}

		if( mark && n[ mark ] )
		{
			m =
				n;
		}
	}

	if( !mark )
	{
		return n;
	}

	return m;
};


/*
| The shell got the systems focus.
*/
Space.prototype.systemFocus =
	function( )
{
	var caret =
		this.$caret;

	caret.show( );

	caret.display( );
};



/*
| The shell lost the systems focus.
*/
Space.prototype.systemBlur =
	function( )
{
	var caret =
		this.$caret;

	caret.hide( );

	caret.display( );
};


/*
| Blinks the caret (if shown)
*/
Space.prototype.blink =
	function( )
{
	this.$caret.blink( );
};


/*
| Returns the the item the caret is in
| TODO might remove this func
*/
Space.prototype._getCaretItem =
	function(
		path
	)
{
	return this.getSub(
		path,
		'Item'
	);
};



} )( );

