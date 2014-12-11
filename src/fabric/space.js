/*
| The visual space.
*/

var
	actions_itemResize,
	actions_pan,
	euclid_arrow,
	euclid_point,
	euclid_rect,
	fabric_space,
	jion_path,
	jools,
	marks_caret,
	result_hover,
	root,
	shell_peer,
	shell_stubs,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'fabric_space',
		attributes :
			{
				access :
					{
						comment :
							'rights the current user has for this space',
						type :
							'String',
						defaultValue :
							undefined
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE
						concerns :
							{
								type :
									'fabric_space',
								func :
									'concernsMark',
								args :
									[ 'mark' ]
							},
						defaultValue :
							undefined,
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the space',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'owner of the space',
						type :
							'String',
						defaultValue :
							undefined
					},
				spaceTag :
					{
						comment :
							'name of the space',
						type :
							'String',
						defaultValue :
							undefined
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							undefined
					}
			},
		init :
			[
				'inherit',
				'twigDup'
			],
		json :
			true,
		twig :
			[
				'fabric_note',
				'fabric_label',
				'fabric_relation',
				'fabric_portal'
			]
	};
}


if( SERVER )
{
	fabric_space = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Initializer.
*/
fabric_space.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	if( !this.view )
	{
		// abstract
		return;
	}

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	for( var k in this.twig )
	{
		this.twig[ k ] =
			this.twig[ k ].create(
				'path',
					this.path
					.append( 'twig' )
					.appendNC( k ), // FIXME inherit
				'hover',
					this.hover,
				'mark',
					this.mark,
				'view',
					this.view
			);
	}
};


/*
| The disc is shown while a space is shown.
*/
fabric_space.prototype.showDisc = true;


/*
| Returns the mark if the form jockey concerns a mark.
*/
fabric_space.concernsMark =
	function(
		mark
	)
{
	// returns an undefined mark if it was undefined
	// or the mark itself if it has a space path
	if(
		!mark
		||
		mark.containsPath(
			jion_path.empty.append( 'space' )
		)
	)
	{
		return mark;
	}
	else
	{
		return null;
	}
};


/*
| Returns the focused item.
|
| FIXME handle this more gracefully
*/
fabric_space.prototype.focusedItem =
	function( )
{
	var
		action,
		mark,
		path;

	action = root.action;

	mark = this.mark;

	path =
		mark
		? mark.itemPath
		: jion_path.empty;

	if( action )
	{
		switch( action.reflect_ )
		{
			case 'actions_itemDrag' :
			case 'actions_itemResize' :

				if( action.transItem.path.subPathOf( path ) )
				{
					return action.transItem;
				}

				break;
		}
	}

	if( path.length > 2 )
	{
		return this.getItem( path.get( 2 ) );
	}
	else
	{
		return null;
	}
};


/*
| Returns an item by its key.
*/
fabric_space.prototype.getItem =
	function(
		key
	)
{
	var
		action;

	action = root.action;

	switch( action && action.reflect_ )
	{
		case 'actions_itemDrag' :
		case 'actions_itemResize' :

			if( action.transItem.key === key )
			{
				return action.transItem;
			}

			break;
	}

	return this.twig[ key ];
};


/*
| Returns the visual item by a given tree-rank.
*/
fabric_space.prototype.atRank =
	function(
		rank
	)
{
	return this.getItem( this.ranks[ rank ] );
};


/*
| The attention center.
*/
jools.lazyValue(
	fabric_space.prototype,
	'attentionCenter',
	function( )
	{
		var
			focus;

		focus = this.focusedItem( );

		if( !focus )
		{
			return null;
		}

		return this.view.y( focus.attentionCenter );
	}
);


/*
| Displays the whole space.
*/
fabric_space.prototype.draw =
	function(
		display
	)
{
	var
		action,
		arrow,
		focus,
		fromItem,
		fromSilhoutte,
		r,
		toItem,
		toSilhoutte,
		view;

	view = this.view,

	action = root.action;

	for(
		r = this.ranks.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( display );
	}

	focus = this.focusedItem( );

	if( focus )
	{
		focus.drawHandles( display, view );
	}

	switch( action && action.reflect_ )
	{
		case 'actions_createGeneric' :

			if( action.start )
			{
				action.transItem.draw( display );
			}

			break;

		case 'actions_createRelation' :

			if( !action.fromItemPath.isEmpty )
			{
				fromItem =
					this.getItem(
						action.fromItemPath.get( -1 )
					);

				fromItem.highlight( display );

				toItem = null;

				if( !action.toItemPath.isEmpty )
				{
					toItem = this.getItem( action.toItemPath.get( -1 ) );

					toItem.highlight( display );
				}

				fromSilhoutte = fromItem.silhoutte;

				if(
					!action.toItemPath.isEmpty
					&&
					!action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toSilhoutte = toItem.silhoutte;
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toSilhoutte = view.depoint( action.toPoint );
				}

				if( toSilhoutte )
				{
					arrow =
						euclid_arrow.connect(
							fromSilhoutte, 'normal',
							toSilhoutte, 'arrow'
						);

					arrow.draw(
						display,
						view,
						theme.relation.style
					);
				}
			}
			else
			{
				if( !this.hover.isEmpty )
				{
					this
					.getItem( this.hover.get( 2 ) )
					.highlight( display );
				}
			}

			break;
	}
};


/*
| Mouse wheel
*/
fabric_space.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	var
		item,
		r,
		rZ,
		view;

	view = this.view;

	for(
		r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		item = this.atRank( r );

		if( item.mousewheel( view, p, dir, shift, ctrl ) )
		{
			return true;
		}
	}

	if( dir > 0 )
	{
		root.setView( this.view.review( 1, p ) );
	}
	else
	{
		root.setView( this.view.review( -1, p ) );
	}

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
fabric_space.prototype.pointingHover =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		a,
		aZ,
		com,
		item,
		focus,
		res,
		view;

	view = this.view,

	focus = this.focusedItem( );

	if( focus )
	{
		com = focus.checkHandles( view, p );

		if( com )
		{
			return(
				result_hover.create(
					'path', jion_path.empty,
					'cursor', com + '-resize'
				)
			);
		}
	}

	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		item = this.atRank( a ),

		res = item.pointingHover( view, p );

		if( res )
		{
			return res;
		}
	}

	return(
		result_hover.create(
			'path', jion_path.empty,
			'cursor', 'pointer'
		)
	);
};


/*
| Starts an operation with the mouse button held down.
*/
fabric_space.prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		a,
		aZ,
		action,
		com,
		dp,
		focus,
		item,
		transItem,
		view;

	view = this.view,

	focus = this.focusedItem( );

	// see if the handles were targeted
	if( this.access == 'rw' && focus )
	{
		com = focus.checkHandles( view, p );

		if( com )
		{
			// resizing
			dp = view.depoint( p );

			root.setAction(
				actions_itemResize.create(
					'start', dp,
					'transItem', focus,
					'origin', focus,
					'align', com
				)
			);

			return;
		}
	}

	action = root.action;

	item = null;

	transItem = null;

	// FIXME simplify
	if(
		action
		&& action.reflect_ === 'actions_createGeneric'
		&& action.itemType === 'note'
	)
	{
		transItem =
			shell_stubs.emptyNote.create(
				'zone',
					euclid_rect.create(
						'pnw', p,  // FIXME why no depoint?
						'pse', p
					),
				'mark', null,
				'path', jion_path.empty,
				'view', view
			);

		root.setAction(
			action.create(
				'start', p,
				'model', transItem,
				'transItem', transItem
			)
		);

		return;
	}
	else if(
		action
		&& action.reflect_ === 'actions_createGeneric'
		&& action.itemType === 'label'
	)
	{
		transItem =
			shell_stubs.emptyLabel.create(
				'pnw', view.depoint( p ),
				'mark', null,
				'path', jion_path.empty,
				'view', view
			);

		root.setAction(
			action.create(
				'start', p,
				'model', transItem,
				'transItem', transItem
			)
		);

		return;
	}
	else if(
		action &&
		action.reflect_ === 'actions_createGeneric' &&
		action.itemType === 'portal'
	)
	{
		transItem =
			shell_stubs.emptyPortal.create(
				'hover', jion_path.empty,
				'mark', null,
				'path', jion_path.empty,
				'view', view,
				'zone',
					euclid_rect.create(
						'pnw', p, //FIXME depoint?
						'pse', p
					)
			);

		root.setAction(
			action.create(
				'start', p,
				'model', transItem,
				'transItem', transItem
			)
		);

		return;
	}

	// see if one item was targeted
	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		item = this.atRank( a );

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

	switch( action && action.reflect_ )
	{
		case 'actions_createRelation' :

			root.setAction(
				action.create(
					'pan', view.pan,
					'relationState', 'pan',
					'start', p
				)
			);

			return;
	}

	// otherwise panning is initiated
	root.setAction(
		actions_pan.create(
			'start', p,
			'pan', view.pan
		)
	);

	return;
};


/*
| A mouse click.
*/
fabric_space.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		a,
		aZ,
		item,
		view;

	view = this.view;

	// clicked some item?
	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		item = this.atRank( a );

		if(
			item.click( this, view, p, shift, ctrl, this.access )
		)
		{
			return true;
		}
	}

	// otherwise ...

	root.setMark( null );

	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
fabric_space.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		action,
		fs,
		dy,
		item,
		key,
		label,
		model,
		note,
		oheight,
		portal,
		res,
		resized,
		view,
		zone;

	action = root.action;

	view = this.view;

	if( !action )
	{
		return;
	}

	switch( action.reflect_ )
	{
		case 'actions_createGeneric' :

			switch( action.itemType )
			{
				case 'note' :

					// FIXME move to note
					// ( and all others creators )

					note =
						action.transItem.create(
							'zone',
								euclid_rect.createArbitrary(
									view.depoint( action.start ),
									view.depoint( p )
								)
						);

					res = shell_peer.newNote( note.zone );

					key = res.reaction.trg.path.get( -1 );

					root.setMark(
						marks_caret.create(
							'path',
								root
								.space.twig[ key ]
								.doc
								.atRank( 0 ).textPath,
							'at', 0
						)
					);

					if( !ctrl )
					{
						root.setAction( null );
					}

					break;

				case 'label' :

					model = action.model;

					zone =
						euclid_rect.createArbitrary(
							view.depoint( action.start ),
							view.depoint( p )
						);

					oheight = model.zone.height;

					dy = zone.height - oheight;

					fs =
						Math.max(
							model.doc.fontsize *
								( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized = action.transItem.create( 'fontsize', fs );

					label =
						resized.create(
							'pnw',
								( p.x > action.start.x )
								?  zone.pnw
								: euclid_point.create(
									'x', zone.pse.x - resized.zone.width,
									'y', zone.pnw.y
								)
						);

					res =
						shell_peer.newLabel(
							label.pnw,
							'Label',
							label.doc.fontsize
						);

					key = res.reaction.trg.path.get( -1 );

					root.setMark(
						marks_caret.create(
							'path',
								root
								.space
								.twig[ key ]
								.doc.atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						root.setAction( null );
					}

					break;

				case 'portal' :

					portal =
						action.transItem.create(
							'zone',
								euclid_rect.createArbitrary(
									view.depoint( action.start ),
									view.depoint( p )
								)
						);

					res =
						shell_peer.newPortal(
							portal.zone,
							root.username, // FIXME
							'home'
						);

					key = res.reaction.trg.path.get( -1 );

					root.setMark(
						marks_caret.create(
							'path',
								root
								.space
								.twig[ key ]
								.path
								.append( 'spaceUser' ),
							'at',
								0
						)
					);

					if( !ctrl )
					{
						root.setAction( null );
					}

					break;

				default :

					throw new Error( );
			}

			break;

		case 'actions_pan' :

			root.setAction( null );

			break;

		case 'actions_createRelation' :

			switch( action.relationState )
			{

				case 'start' :

					root.setAction( null );

					break;

				case 'hadSelect' :

					if( !action.toItemPath.isEmpty )
					{
						item =
							this.getItem(
								action.toItemPath.get( -1 )
							);

						item.dragStop( view, p );
					}

					root.setAction( null );

					break;

				case 'pan' :

					root.setAction(
						action.create( 'relationState', 'start' )
					);

					break;

				default :

					throw new Error( );
			}

			break;

		case 'actions_itemDrag' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{
				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell_peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell_peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						break;

					default :

						throw new Error( );
				}
			}

			root.setAction( null );

			break;

		case 'actions_itemResize' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{

				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell_peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell_peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						shell_peer.setFontSize(
							action.transItem.path,
							action.transItem.doc.fontsize
						);

						break;

					default :

						throw new Error( );
				}
			}

			root.setAction( null );

			break;

		case 'actions_scrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragStop( view, p, shift, ctrl );

			root.setAction( null );

			break;

		default :

			throw new Error( );
	}

	return true;
};


/*
| Moving during an operation with the mouse button held down.
*/
fabric_space.prototype.dragMove =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		action,
		align,
		dy,
		fs,
		model,
		origin,
		oheight,
		pd,
		r,
		resized,
		rZ,
		transItem,
		view,
		zone;

	action = root.action;

	transItem = null;

	view = this.view;

	if( action === null )
	{
		return 'pointer';
	}

	switch( action.reflect_ )
	{
		case 'actions_createGeneric' :

			model = action.model;

			zone =
				euclid_rect.createArbitrary(
					view.depoint( action.start ),
					view.depoint( p )
				);

			switch( model.positioning )
			{
				case 'zone' :

					transItem = model.create( 'zone', zone );

					break;

				case 'pnw/fontsize' :

					oheight = model.zone.height;

					fs =
						Math.max(
							model.doc.fontsize * zone.height / oheight,
							theme.label.minSize
						);

					resized = model.create( 'fontsize', fs );

					transItem =
						resized.create(
							'pnw',
								( p.x > action.start.x )
								?  zone.pnw
								: euclid_point.create(
									'x', zone.pse.x - resized.zone.width,
									'y', zone.pnw.y
								)
						);

					break;

				default :

					throw new Error( );
			}

			root.setAction(
				action.create( 'transItem', transItem )
			);

			return 'pointer';

		case 'actions_createRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd = p.sub( action.start );

				root.setView(
					view.create(
						'pan',
							action.pan.add(
								pd.x / view.zoom,
								pd.y / view.zoom
							)
					)
				);

				return 'pointer';
			}

			root.setAction(
				action.create(
					'toItemPath', jion_path.empty,
					'toPoint', p
				)
			);

			// FIXME why is this?
			for(
				r = 0, rZ = this.ranks.length;
				r < rZ;
				r++
			)
			{
				if(
					this.atRank( r ).dragMove(
						view, // FIXME dont
						p
					)
				)
				{
					return 'pointer';
				}
			}

			return 'pointer';

		case 'actions_pan' :

			pd = p.sub( action.start );

			root.setView(
				view.create(
					'pan',
						action.pan.add(
							Math.round( pd.x / view.zoom ),
							Math.round( pd.y / view.zoom )
						)
				)
			);

			return 'pointer';

		case 'actions_itemDrag' :

			origin = action.origin;

			switch( origin.positioning )
			{
				case 'zone' :

					transItem =
						origin.create(
							'zone',
								origin.zone.add(
									view.dex( p.x ) - action.start.x,
									view.dey( p.y ) - action.start.y
								)
						);

					break;

				case 'pnw/fontsize' :

					transItem =
						origin.create(
							'pnw',
								origin.pnw.add(
									view.dex( p.x ) - action.start.x,
									view.dey( p.y ) - action.start.y
								)
						);
			}

			root.setAction(
				action.create( 'transItem', transItem )
			);

			return true;


		case 'actions_itemResize' :

			origin = action.origin;

			align = action.align;

			switch( origin.positioning )
			{
				case 'zone' :

					transItem =
						origin.create(
							'zone',
								origin.zone.cardinalResize(
									align,
									view.dex( p.x ) - action.start.x,
										view.dey( p.y ) - action.start.y,
									origin.minHeight,
									origin.minWidth
								)
						);

					break;

				case 'pnw/fontsize' :

					oheight = origin.zone.height;

					switch( action.align )
					{
						case 'ne' :
						case 'nw' :

							dy = action.start.y - view.dey( p.y );

							break;

						case 'se' :
						case 'sw' :

							dy = view.dey( p.y ) - action.start.y;

							break;

						default :

							throw new Error( );
					}

					fs =
						Math.max(
							origin.doc.fontsize *
								( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized = origin.create( 'fontsize', fs );

					transItem =
						resized.create(
							'pnw',
								resized.pnw.add(
									( align === 'sw' || align === 'nw' )
									?  Math.round(
										origin.zone.width -
										resized.zone.width
									)
									: 0,
									( align === 'ne' || align === 'nw' )
									?  Math.round(
										origin.zone.height -
										resized.zone.height
									)
									: 0
								)
						);

					break;

				default :

					throw new Error( );
			}

			root.setAction(
				action.create( 'transItem', transItem )
			);

			return true;

		case 'actions_scrollY' :

			this.getItem( action.itemPath.get( -1 ) )
			.dragMove(
				view, // FIXME dont
				p
			);

			// FIXME let the item decide on the cursor
			return 'move';

		default :

			throw new Error( );
	}
};


/*
| Text input
*/
fabric_space.prototype.input =
	function(
		text
	)
{
	var
		item,
		mark,
		path;

	mark = this.mark;

	if( !mark || !mark.hasCaret )
	{
		return false;
	}

	path = mark.caretPath;

	item = this.twig[ path.get( 2 ) ];

	if( item )
	{
		item.input( text );
	}
};


/*
| Changes the zoom factor ( around center )
*/
fabric_space.prototype._changeZoom =
	function( df )
{
	var
		pm;

	pm = this.view.depoint( this.view.baseFrame.pc );

	root.setView( this.view.review( df, pm ) );
};


/*
| User pressed a special key.
*/
fabric_space.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		item,
		mark;

	if( ctrl )
	{
		switch( key )
		{
			case 'z' :

				root.doTracker.undo( );

				return;

			case 'y' :

				root.doTracker.redo( );

				return;

			case ',' :

				this._changeZoom(  1 );

				return;

			case '.' :

				this._changeZoom( -1 );

				return;
		}
	}

	mark = this.mark;

	if( !mark || !mark.hasCaret )
	{
		return;
	}

	item = this.twig[ mark.caretPath.get( 2 ) ];

	if( item )
	{
		item.specialKey( key, shift, ctrl );
	}
};


} )( );
