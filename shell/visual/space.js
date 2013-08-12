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
	shellverse,
	Stubs,
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
		tree,
		inherit,
		spaceUser,
		spaceTag,
		access,
		caret
	)
{
	Visual.Base.call(
		this,
		tree,
		null
	);

	this.spaceUser =
		spaceUser;

	this.spaceTag =
		spaceTag;

	this.access =
		access;

	this.$view =
		inherit ?
			inherit.$view
			:
			new Euclid.View(
				Euclid.Point.zero,
				0
			);

	if( inherit && tree === inherit.tree )
	{
		this.sub =
			inherit.sub;
	}
	else
	{
		var sub =
		this.sub =
			{ };

		for( var k in tree.twig )
		{
			if( k === 'type' )
			{
				continue;
			}

			sub[ k ] =
				this.createItem(
					tree.twig[ k ],
					k,
					inherit && inherit.sub[ k ]
				);
		}
	}

	// TODO change Caret to free string arguments
	this.caret =
		caret ||
		new Caret(
			null, // sign
			null  // retrainx
		);

	Jools.keyNonGrata(
		this,
		'$caret'
	);
};


Jools.subclass(
	Space,
	Visual.Base
);


/*
| The disc is shown while a space is shown.
*/
Space.prototype.showDisc =
	true;


/*
| Returns the focused item.
*/
Space.prototype.focusedItem =
	function( )
{
	var
		caret =
			this.caret;

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
		case 'ItemResize' :

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
| Returns an item by its key
*/
Space.prototype.getItem =
	function(
		key
	)
{
	var
		action =
			shell.bridge.action( );

	switch( action && action.type )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			if( action.itemPath.get( 0 ) === key )
			{
				return action.item;
			}

			break;
	}

	return this.sub[ key ];
};


/*
| Creates a new visual representation of an item.
*/
Space.prototype.createItem =
	function(
		tree,
		key,
		inherit
	)
{
	var Proto =
		Visual[ tree.twig.type ];

	if( !Proto )
	{
		throw new Error(
			'unknown type: ' + tree.twig.type
		);
	}

	return (
		Proto.create(
			'inherit',
				inherit,
			'tree',
				tree,
			'path',
				new Path( [ key ] )
		)
	);
};


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function(
		fabric,
		haveSystemFocus,
		caretBlink
	)
{
	var
		tree =
			this.tree,

		view =
			this.$view,

		action =
			shell.bridge.action( ),

		zone,

		ranks =
			this.ranks;

	this._center =
		fabric.getCenter( );


	// removes caret caches.
	this.caret.$save =
	this.caret.$screenPos =
		null;

	for(
		var r = tree.length - 1;
		r >= 0;
		r--
	)
	{
		// FIXME, maybe overload this.atRank
		this.getItem( this.tree.ranks[ r ] )
			.draw(
				fabric,
				this.caret,
				view
			);
	}

	var
		focus =
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
					this.caret,
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

				var
					fromSilhoutte =
						fromItem.silhoutte,

					toSilhoutte;

				if(
					action.toItemPath &&
					!action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toSilhoutte =
						toItem.silhoutte;
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


	if( haveSystemFocus )
	{
		this.caret.display( caretBlink );
	}
};


/*
| Force-clears all caches.
| TODO remove
*/
Space.prototype.knock =
	function( )
{
	this.caret.$save =
	this.caret.$screenPos =
		null;

	for(
		var r = this.tree.length - 1;
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
				this.caret.sign.path,
				'positionCaret'
			);

	if( node )
	{
		node.positionCaret(
			this,
			this.caret,
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
	var
		view =
			this.$view,

		tree =
			this.tree;

	for(
		var r = 0, rZ = tree.length;
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
		var a = 0, aZ = this.tree.length;
		a < aZ;
		a++
	)
	{
		var
			item =
				this.atRank( a ),

			cu =
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
				'item',
					focus,
				'origin',
					focus,
				'align',
					com
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

			action.origin =
			action.item =
				this.getActionItemCreator( action )
					.create(
						'zone',
							Euclid.Rect.create(
								'pnw/pse',
								p, //TODO depoint?
								p
							),
						'doc',
							Visual.Doc.create(
								'tree',
									Stubs.emptyDoc,
								'fontsize',
									theme.note.fontsize,
								'flowWidth',
									0,
								'paraSep',
									Jools.half(
										theme.note.fontsize
									)
							)
					);

			return;

		case 'createLabel' :

			action.start =
				p;

			action.origin =
			action.item =
				this.getActionItemCreator( action )
					.create(
						'pnw',
							view.depoint( p ),
						'fontsize',
							theme.note.fontsize, // FIXME
						'doc',
							Visual.Doc.create(
								'tree',
									Stubs.labelDoc,
								'fontsize',
									theme.note.fontsize, // FIXME
								'flowWidth',
									0,
								'paraSep',
									0
							)
					);

			return;


		case 'createPortal' :

			action.start =
				p;

			action.origin =
			action.item =
				this.getActionItemCreator( action )
					.create(
						'zone',
							Euclid.Rect.create(
								'pnw/pse',
								p, //TODO depoint?
								p
							)
					);

			return;

		default :

			// ignore and go on
			break;
	}

	// see if one item was targeted
	for(
		var a = 0, aZ = this.tree.length;
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
		var a = 0, aZ = this.tree.length;
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

	shell.setCaret(
		'space',
		null,
		null
	);

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
		result,
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
							Euclid.Rect.create(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( action.move )
							)
					);

			result =
				shell.peer.newNote(
					this.spaceUser,
					this.spaceTag,
					note.zone
				),

			key =
				result.chgX.trg.path.get( -1 );

			shell.setCaret(
				'space',
				shell.space.sub[ key ].sub.doc.atRank( 0 ).textPath,
				0
			);

			shell.redraw =
				true;

			if( !ctrl )
			{
				shell.bridge.stopAction( );
			}

			break;

		case 'createLabel' :

			var
				origin =
					action.origin,

				zone =
					Euclid.Rect.create(
						'arbitrary',
						view.depoint( action.start ),
						view.depoint( action.move ) // TODO why not p?
					),

				oheight =
					origin.zone.height,

				dy =
					zone.height - oheight,

				fs =
					Math.max(
						origin.sub.doc.fontsize * ( oheight + dy ) / oheight,
						theme.label.minSize
					),

				resized =
					action.item.creator.create(
						'inherit',
							origin,
						'fontsize',
							fs
					),

				label =
					this.getActionItemCreator( action )
						.create(
							'inherit',
								resized,
							'pnw',
								( p.x > action.start.x ) ?
									zone.pnw
									:
									shellverse.grow(
										'Point',
										'x',
											zone.pse.x - resized.zone.width,
										'y',
											zone.pnw.y
									)
						);

			result =
				shell.peer.newLabel(
					this.spaceUser,
					this.spaceTag,
					label.pnw,
					'Label',
					label.sub.doc.fontsize
				);

			key =
				result.chgX.trg.path.get( -1 );

			shell.setCaret(
				'space',
				shell.space.sub[ key ].sub.doc.atRank( 0 ).textPath,
				0
			);

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
						'inherit',
							action.item,
						'zone',
							Euclid.Rect.create(
								'arbitrary',
								view.depoint( action.start ),
								view.depoint( action.move )
							)
					);

			result =
				shell.peer.newPortal(
					this.spaceUser,
					this.spaceTag,
					portal.zone,
					shell.bridge.getUsername( ),
					'home'
				);

			key =
				result.chgX.trg.path.get( -1 );

			shell.setCaret(
				'space',
				shell.space.sub[ key ].subPaths.spaceUser,
				0
			);

			shell.redraw =
				true;

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

					action.relationState =
						'start';

					break;
			}

			break;

		case 'ItemDrag' :

			if( !action.item.zone.equals( action.origin.zone ) )
			{
				switch( action.item.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.itemPath,
							action.item.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.itemPath,
							action.item.zone.pnw
						);

						break;

					default :

						throw new Error(
							'invalid positioning' +
							action.item.positioning
						);
				}

				shell.redraw =
					true;
			}

			shell.bridge.stopAction( );

			break;

		case 'ItemResize' :

			if( !action.item.zone.equals( action.origin.zone ) )
			{

				switch( action.item.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.itemPath,
							action.item.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.itemPath,
							action.item.zone.pnw
						);

						shell.peer.setFontSize(
							action.itemPath,
							action.item.sub.doc.fontsize
						);

						break;

					default :

						throw new Error(
							'invalid positioning' +
							action.item.positioning
						);
				}

				shell.redraw =
					true;
			}

			shell.bridge.stopAction( );

			break;

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
					!removeItem.zone.within(
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
					shell.setCaret(
						'space',
						null,
						0
					);
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

		fs,

		origin,

		oheight,

		pd,

		resized;

	switch( action.type )
	{
		case 'createLabel' :
		case 'createNote' :
		case 'createPortal' :

			action.move = // TODO remove action.move
				p;

			origin =
				action.origin;

			var
				zone =
					Euclid.Rect.create(
						'arbitrary',
						view.depoint( action.start ),
						view.depoint( p )
					);

			switch( origin.positioning )
			{
				case 'zone' :

					action.item =
						this.getActionItemCreator( action )
							.create(
								'inherit',
									origin,
								'zone',
									zone
							);

					break;

				case 'pnw/fontsize' :

					oheight =
						origin.zone.height;

					fs =
						Math.max(
							origin.sub.doc.fontsize * zone.height / oheight,
							theme.label.minSize
						);

					resized =
						action.item.creator.create(
							'inherit',
								origin,
							'fontsize',
								fs
						);

					action.item =
						action.item.creator.create(
							'inherit',
								resized,
							'pnw',
								( p.x > action.start.x ) ?
									zone.pnw
									:
									shellverse.grow(
										'Point',
										'x',
											zone.pse.x - resized.zone.width,
										'y',
											zone.pnw.y
									)
						);

					break;
			}

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
				var r = 0, rZ = this.tree.length;
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
					removeItem.zone.within(
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

			origin =
				action.origin;

			switch( origin.positioning )
			{
				case 'zone' :

					action.item =
						origin.creator.create(
							'inherit',
								origin,
							'zone',
								origin.zone.add(
									action.move.x - action.start.x,
									action.move.y - action.start.y
								)
					);

					break;

				case 'pnw/fontsize' :

					action.item =
						origin.creator.create(
							'inherit',
								origin,
							'pnw',
								origin.pnw.add(
									action.move.x - action.start.x,
									action.move.y - action.start.y
								)
					);
			}

			shell.redraw =
				true;

			return true;


		case 'ItemResize' :

			action.move =
				view.depoint( p );

			origin =
				action.origin;

			var
				align =
					action.align;

			switch( origin.positioning )
			{
				case 'zone' :

					action.item =
						action.origin.creator.create(
							'inherit',
								origin,
							'zone',
								origin.zone.cardinalResize(
									align,
									action.move.x - action.start.x,
									action.move.y - action.start.y,
									origin.minHeight,
									origin.minWidth
								)
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						origin.zone.height;

					var dy;

					switch( action.align )
					{
						case 'ne' :
						case 'nw' :

							dy =
								action.start.y - action.move.y;

							break;

						case 'se' :
						case 'sw' :

							dy =
								action.move.y - action.start.y;

							break;

						default :

							if( CHECK )
							{
								throw new Error(
									'unknown align'
								);
							}
					}

					fs =
						Math.max(
							origin.sub.doc.fontsize * ( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized =
						action.item.creator.create(
							'inherit',
								origin,
							'fontsize',
								fs
						);

					action.item =
						action.item.creator.create(
							'inherit',
								resized,
							'fontsize',
								fs,
							'pnw',
								origin.pnw.add(
									align === 'sw' || align === 'nw' ?
										Math.round( origin.zone.width - resized.zone.width ) :
										0,
									align === 'ne' || align === 'nw' ?
										Math.round( origin.zone.height - resized.zone.height ) :
										0
								)
						);

					break;

				default :

					if( CHECK )
					{
						throw new Error(
							'invalid positioning'
						);
					}
			}


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
	function(
		text
	)
{
	var
		caret =
			this.caret;

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
		node.input( text );
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

	var
		caret =
			this.caret;

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
				case 'ItemResize' :

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

		if( !n.sub )
		{
			break;
		}

		n =
			n.sub[ path.get( a ) ];

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

