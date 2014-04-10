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


/*
| Imports
*/
var
	Action,
	Euclid,
	HoverReply,
	Jools,
	Mark,
	meshverse,
	Path,
	shell,
	Stubs,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Space',
		unit :
			'Visual',
		attributes :
			{
				access :
					{
						comment :
							'rights the current user has for this space',
						type :
							'String'
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'Path'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								func :
									'Space.concernsMark',
								args :
									[
										'mark'
									]
							}
					},
				path :
					{
						comment :
							'the path of the space',
						type :
							'Path'
					},
				spaceUser :
					{
						comment :
							'owner of the space',
						type :
							'String'
					},
				spaceTag :
					{
						comment :
							'name of the space',
						type :
							'String'
					},
				traitSet :
					{
						comment :
							'traitSet',
						type :
							'TraitSet',
						assign :
							null,
						defaultValue :
							'null'
					},
				tree :
					{
						comment :
							'the data tree',
						type :
							'Tree'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View'
					}
			},
		init :
			[
				'inherit',
				'traitSet'
			]
	};
}


var
	Space =
		Visual.Space;

/*
| Initializer.
*/
Space.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	var
		sub =
			{ };

	for( var k in this.tree.twig )
	{
		if( k === 'type' )
		{
			continue;
		}

		switch( this.tree.twig[ k ].reflect ) // XXX
		{
		case 'Note' :
		sub[ k ] =
			this.tree.twig[ k ].create(
				'path',
					this.path.appendNC( k ), // FIXME inherit
				'hover',
					this.hover,
				'mark',
					this.mark,
				'traitSet',
					traitSet,
				'view',
					this.view
			);

		break;

		default :
		sub[ k ] =
			this._createItem(
				k,
				inherit && inherit.sub[ k ],
				traitSet
			);
		}
	}

	this.sub =
		sub;
};


/*
| The disc is shown while a space is shown.
*/
Space.prototype.showDisc =
	true;


/*
| FIXME remove
*/
var
	_spacePath =
		Path.empty.append( 'space' );

/*
| Returns the mark if the form jockey concerns a mark.
*/
Space.concernsMark =
	function(
		mark
	)
{
	if(
		mark.containsPath(
			_spacePath
		)
	)
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| Returns the focused item.
|
| FIXME handle this more gracefully
*/
Space.prototype.focusedItem =
	function( )
{
	var
		action,
		mark,
		path;

	action =
		shell.action;

	mark =
		this.mark;

	path =
		mark.itemPath;

	if( action )
	{
		switch( action.reflect )
		{
			case 'ItemDrag' :
			case 'ItemResize' :

				if( action.transItem.path.subPathOf( path ) )
				{
					return action.transItem;
				}

				break;
		}
	}

	if( path.length > 1 )
	{
		return this.getItem( path.get( 1 ) );
	}
	else
	{
		return null;
	}
};


/*
| Returns an item by its key.
*/
Space.prototype.getItem =
	function(
		key
	)
{
	var
		action =
			shell.action;

	switch( action && action.reflect )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			if( action.transItem.key === key )
			{
				return action.transItem;
			}

			break;
	}

	return this.sub[ key ];
};


/*
| Returns the visual item by a given tree-rank.
*/
Space.prototype.atRank =
	function(
		rank
	)
{
	return this.getItem( this.tree.ranks[ rank ] );
};


/*
| The attention center.
*/
Jools.lazyValue(
	Space.prototype,
	'attentionCenter',
	function( )
	{
		var
			focus =
				this.focusedItem( );

		if( !focus )
		{
			return null;
		}

		return (
			this.view.y(
				focus.attentionCenter
			)
		);
	}
);


/*
| Creates a new visual representation of an item.
*/
Space.prototype._createItem =
	function(
		key,
		proto,
		traitSet
	)
{
	var
		// default undefined -> inherit
		path,

		tree =
			this.tree.twig[ key ];

	if( !proto )
	{
		proto =
			Visual[ tree.twig.type ];

/**/	if( CHECK )
/**/	{
/**/		if( !proto )
/**/		{
/**/			throw new Error(
/**/				'unknown type: ' + tree.twig.type
/**/			);
/**/		}
/**/	}

		path =
			this.path.appendNC( key );
	}

	return (
		proto.create(
			'tree',
				tree,
			'path',
				path,
			'hover',
				this.hover,
			'mark',
				this.mark,
			'traitSet',
				traitSet,
			'view',
				this.view
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
		tree =
			this.tree,

		view =
			this.view,

		action =
			shell.action;

	for(
		var r = tree.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( fabric );
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

	switch( action && action.reflect )
	{
		case 'CreateGeneric' :

			if( action.start )
			{
				action.transItem.draw( fabric );
			}

			break;

		case 'CreateRelation' :

			if( !action.fromItemPath.isEmpty )
			{
				var
					fromItem =
						this.getItem(
							action.fromItemPath.get( -1 )
						);

				fromItem.highlight( fabric );

				var
					toItem =
						null;

				if( !action.toItemPath.isEmpty )
				{
					toItem =
						this.getItem(
							action.toItemPath.get( -1 )
						);

					toItem.highlight( fabric );
				}

				var
					fromSilhoutte =
						fromItem.silhoutte,

					toSilhoutte;

				if(
					!action.toItemPath.isEmpty
					&&
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
						view.depoint( action.toPoint );
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
			else
			{
				if( !this.hover.isEmpty )
				{
					this
						.getItem( this.hover.get( 1 ) )
						.highlight( fabric );
				}
			}

			break;
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
			this.view,

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
		shell.setView(
			this.view.review( 1, p )
		);
	}
	else
	{
		shell.setView(
			this.view.review( -1, p )
		);
	}

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
	var
		view =
			this.view,

		focus =
			this.focusedItem( );

	if( focus )
	{
		var
			com =
				focus.checkHandles(
					view,
					p
				);

		if( com )
		{
			return (
				HoverReply.create(
					'path',
						Path.empty,
					'cursor',
						com + '-resize'
				)
			);
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

			reply =
				item.pointingHover(
					view,
					p
				);

		if( reply )
		{
			return reply;
		}
	}

	return (
		HoverReply.create(
			'path',
				Path.empty,
			'cursor',
				'pointer'
		)
	);
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
			this.view,

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

			shell.setAction(
				Action.ItemResize.create(
					'start',
						dp,
					'transItem',
						focus,
					'origin',
						focus,
					'align',
						com
				)
			);

			return;
		}
	}

	var
		action =
			shell.action,

		item =
			null,

		transItem =
			null;

	// FIXME simplify
	if(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Note'
	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'tree',
					Stubs.emptyNote.setPath(
						// FIXME elegance
						Path.empty.append( 'zone' ),
						Euclid.Rect.create(
							'pnw',
								p,  // FIXME why no depoint?
							'pse',
								p
						),
						meshverse
					),
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view
			);

		shell.setAction(
			action.create(
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}
	else if
	(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Label'

	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'tree',
					// FIXME elegance
					Stubs.emptyLabel.setPath(
						Path.empty.append( 'pnw' ),
						view.depoint( p ),
						meshverse
					),
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view
			);

		shell.setAction(
			action.create(
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}
	else if
	(
		action &&
		action.reflect === 'CreateGeneric' &&
		action.itemType === 'Portal'

	)
	{
		transItem =
			Visual[ action.itemType ].create(
				'hover',
					Path.empty,
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view,
				'tree',
					Stubs.emptyPortal.setPath(
						// TODO elegance
						Path.empty.append( 'zone' ),
						Euclid.Rect.create(
							'pnw',
								p, //FIXME depoint?
							'pse',
								p
						),
						meshverse
					)
			);

		shell.setAction(
			action.create(
				'start',
					p,
				'model',
					transItem,
				'transItem',
					transItem
			)
		);

		return;
	}

	// see if one item was targeted
	for(
		var a = 0, aZ = this.tree.length;
		a < aZ;
		a++
	)
	{
		item =
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

	switch( action && action.reflect )
	{
		case 'CreateRelation' :

			shell.setAction(
				action.create(
					'pan',
						view.pan,
					'relationState',
						'pan',
					'start',
						p
				)
			);

			return;
	}

	// otherwise panning is initiated
	shell.setAction(
		Action.Pan.create(
			'start',
				p,
			'pan',
				view.pan
		)
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
	var
		view =
			this.view;

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

	shell.setMark(
		Mark.Vacant.create( )
	);

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
			shell.action,

		view =
			this.view,

		key,
		result,
		item;

/**/if( CHECK )
/**/{
/**/	if( !action )
/**/	{
/**/		throw new Error(
/**/			'Dragstop without action'
/**/		);
/**/	}
/**/}

	switch( action.reflect )
	{
		case 'CreateGeneric' :

			switch( action.itemType )
			{
				case 'Note' :

					// FIXME move to Note
					// ( and all others creators )

					var
						note =
							action.transItem.create(
								'tree',
									// FIXME elegance
									action.transItem.tree.setPath(
										Path.empty.append( 'zone' ),
										Euclid.Rect.createArbitrary(
											view.depoint( action.start ),
											view.depoint( p )
										),
										meshverse
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

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.
									space.sub[ key ].
									sub.doc.
									atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				case 'Label' :

					var
						model =
							action.model,

						zone =
							Euclid.Rect.createArbitrary(
								view.depoint( action.start ),
								view.depoint( p )
							),

						oheight =
							model.zone.height,

						dy =
							zone.height - oheight,

						fs =
							Math.max(
								model.sub.doc.fontsize *
									( oheight + dy ) / oheight,
								theme.label.minSize
						),

						resized =
							model.create(
								'tree',
									// FIXME elegance
									action.transItem.tree.setPath(
										Path.empty.append( 'fontsize' ),
										fs,
										meshverse
									)
							),

						label =
							resized.create(
								'tree',
									// FIXME elegance
									resized.tree.setPath(
										Path.empty.append( 'pnw' ),
										( p.x > action.start.x ) ?
											zone.pnw
											:
											Euclid.Point.create(
												'x',
													zone.pse.x - resized.zone.width,
												'y',
													zone.pnw.y
											),
										meshverse
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

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.space
									.sub[ key ]
									.sub.doc.atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				case 'Portal' :

					var
						portal =
							action.transItem.create(
								'tree',
									// TODO elegance
									action.transItem.tree.setPath(
										Path.empty.append( 'zone' ),
										Euclid.Rect.createArbitrary(
											view.depoint( action.start ),
											view.depoint( p )
										),
										meshverse
									)
							);

					result =
						shell.peer.newPortal(
							this.spaceUser,
							this.spaceTag,
							portal.zone,
							shell.username, // FIXME
							'home'
						);

					key =
						result.chgX.trg.path.get( -1 );

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.space
									.sub[ key ]
									.subPaths.spaceUser,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						shell.setAction(
							Action.None.create( )
						);
					}

					break;

				default :

					throw new Error(
						CHECK && 'invalid itemtype'
					);
			}

			break;

		case 'Pan' :

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'CreateRelation' :

			switch( action.relationState )
			{

				case 'start' :

					shell.setAction(
						Action.None.create( )
					);

					break;

				case 'hadSelect' :

					if( !action.toItemPath.isEmpty )
					{
						item =
							this.getItem(
								action.toItemPath.get( -1 )
							);

						item.dragStop(
							view,
							p
						);
					}

					shell.setAction(
						Action.None.create( )
					);

					break;

				case 'pan' :

					shell.setAction(
						action.create(
							'relationState',
								'start'
						)
					);

					break;

				default :

					throw new Error(
						CHECK && 'unknown relation state'
					);
			}

			break;

		case 'ItemDrag' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{
				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						break;

					default :

						throw new Error(
							CHECK &&
							(
								'invalid positioning' +
								action.transItem.positioning
							)
						);
				}
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ItemResize' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{

				switch( action.transItem.positioning )
				{
					case 'zone' :

						shell.peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						shell.peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						shell.peer.setFontSize(
							action.transItem.path,
							action.transItem.sub.doc.fontsize
						);

						break;

					default :

						throw new Error(
							CHECK &&
							(
								'invalid positioning' +
									action.transItem.positioning
							)
						);
				}
			}

			shell.setAction(
				Action.None.create( )
			);

			break;

		case 'ScrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragStop(
				view,
				p,
				shift,
				ctrl
			);

			shell.setAction(
				Action.None.create( )
			);

			break;

		default :

			throw new Error(
				CHECK &&
				(
					'Do not know how to handle action: ' + action.reflect
				)
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
			this.view,

		action =
			shell.action,

		transItem =
			null,

		fs,

		model,

		origin,

		oheight,

		pd,

		resized;

	switch( action.reflect )
	{
		case 'CreateGeneric' :

			model =
				action.model;

			var
				zone =
					Euclid.Rect.createArbitrary(
						view.depoint( action.start ),
						view.depoint( p )
					);

			switch( model.positioning )
			{
				case 'zone' :

					transItem =
						model.create(
							'tree',
								// FIXME elegance
								model.tree.setPath(
									Path.empty.append( 'zone' ),
									zone,
									meshverse
								)
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						model.zone.height;

					fs =
						Math.max(
							model.sub.doc.fontsize *
								zone.height / oheight,
							theme.label.minSize
						);

					resized =
						model.create(
							'tree',
								// FIXME elegance
								model.tree.setPath(
									Path.empty.append( 'fontsize' ),
									fs,
									meshverse
								)
						);

					transItem =
						resized.create(
							'tree',
								// FIXME elegance
								resized.tree.setPath(
									Path.empty.append( 'pnw' ),
									( p.x > action.start.x ) ?
										zone.pnw
										:
										Euclid.Point.create(
											'x',
												zone.pse.x - resized.zone.width,
											'y',
												zone.pnw.y
										),
									meshverse
								)
						);

					break;

				default :

					throw new Error(
						CHECK && 'invalid positioning'
					);
			}

			shell.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return 'pointer';

		case 'CreateRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd =
					p.sub( action.start );

				shell.setView(
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

			shell.setAction(
				action.create(
					'toItemPath',
						Path.empty,
					'toPoint',
						p
				)
			);

			// FIXME why is this?
			for(
				var r = 0, rZ = this.tree.length;
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

		case 'Pan' :

			pd =
				p.sub( action.start );

			shell.setView(
				view.create(
					'pan',
						action.pan.add(
							Math.round( pd.x / view.zoom ),
							Math.round( pd.y / view.zoom )
						)
				)
			);

			return 'pointer';

		case 'ItemDrag' :

			origin =
				action.origin;

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
							'tree',
								// FUTURE make this more elegant
								origin.tree.setPath(
									Path.empty.append( 'pnw' ),
									origin.pnw.add(
										view.dex( p.x ) - action.start.x,
										view.dey( p.y ) - action.start.y
									),
									meshverse
								)
					);
			}

			shell.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return true;


		case 'ItemResize' :

			origin =
				action.origin;

			var
				align =
					action.align;

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

					oheight =
						origin.zone.height;

					var
						dy;

					switch( action.align )
					{
						case 'ne' :
						case 'nw' :

							dy =
								action.start.y -
								view.dey( p.y );

							break;

						case 'se' :
						case 'sw' :

							dy =
								view.dey( p.y ) -
								action.start.y;

							break;

						default :

							throw new Error(
								CHECK && 'unknown align'
							);
					}

					fs =
						Math.max(
							origin.sub.doc.fontsize *
								( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized =
						origin.create(
							'tree',
								// FUTURE do more elegantly
								origin.tree.setPath(
									Path.empty.append( 'fontsize' ),
									fs,
									meshverse
								)
						);

					transItem =
						resized.create(
							'tree',
								resized.tree.setPath(
									Path.empty.append( 'pnw' ),
									// FUTURE do more elegantly
									resized.pnw.add(
										align === 'sw' || align === 'nw' ?
											Math.round(
												origin.zone.width -
													resized.zone.width
											)
											:
											0,
										align === 'ne' || align === 'nw' ?
											Math.round(
												origin.zone.height -
													resized.zone.height
											)
											:
											0
									),
									meshverse
								)
						);

					break;

				default :

					throw new Error(
						CHECK && 'invalid positioning'
					);
			}

			shell.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return true;

		case 'ScrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragMove(
				view, // FIXME dont
				p
			);

			// FIXME let the item decide on the cursor
			return 'move';

		default :

			throw new Error(
				CHECK
				&&
				(
					'unknown action: ' + action.reflect
				)
			);
	}
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
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return false;
	}


	var
		path =
			mark.caretPath,

		item =
			this.sub[ path.get( 1 ) ];

	if( item )
	{
		item.input( text );
	}
};


/*
| Changes the zoom factor ( around center )
*/
Space.prototype._changeZoom =
	function( df )
{
	var
		pm =
			this.view.depoint(
				this.view.baseFrame.pc
			);

	shell.setView(
		this.view.review(
			df,
			pm
		)
	);
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

				this._changeZoom(  1 );

				return;

			case '.' :

				this._changeZoom( -1 );

				return;
		}
	}

	var
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	var
		path =
			mark.caretPath,

		item =
			this.sub[ path.get( 1 ) ];

	if( item )
	{
		item.specialKey(
			key,
			shift,
			ctrl
		);
	}
};


} )( );

