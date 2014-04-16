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
							'String',
						defaultValue :
							'undefined'
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'Path',
						defaultValue :
							'undefined'
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
									[ 'mark' ]
							},
						defaultValue :
							'undefined'
					},
				path :
					{
						comment :
							'the path of the space',
						type :
							'Path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'owner of the space',
						type :
							'String',
						defaultValue :
							'undefined'
					},
				spaceTag :
					{
						comment :
							'name of the space',
						type :
							'String',
						defaultValue :
							'undefined'
					},
				// FIXME remove
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
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						defaultValue :
							'undefined'
					}
			},
		init :
			[
				'inherit',
				'traitSet'
			],
		node :
			true,
		json :
			true,
		twig :
			{
				'Note' :
					'Visual.Note',
				'Label' :
					'Visual.Label',
				'Relation' :
					'Visual.Relation',
				'Portal' :
					'Visual.Portal'
			}
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );

	Visual =
		{
			Space :
				require( '../joobj/this' )( module )
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
	if( !this.view )
	{
		// abstract
		return;
	}

	for( var k in this.twig )
	{
		this.twig[ k ] =
			this.twig[ k ].create(
				'path',
					this
					.path
					.append( 'twig' )
					.appendNC( k ), // FIXME inherit
				'hover',
					this.hover,
				'mark',
					this.mark,
				'traitSet',
					traitSet,
				'view',
					this.view
			);
	}
};


/*
| The disc is shown while a space is shown.
*/
Space.prototype.showDisc =
	true;


/*
| Returns the mark if the form jockey concerns a mark.
*/
Space.concernsMark =
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
			Path.empty.append( 'space' )
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

	return this.twig[ key ];
};


/*
| Returns the visual item by a given tree-rank.
*/
Space.prototype.atRank =
	function(
		rank
	)
{
	return this.getItem( this.ranks[ rank ] );
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
/*
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

**	if( CHECK )
**	{
**		if( !proto )
**		{
**			throw new Error(
**				'unknown type: ' + tree.twig.type
**			);
**		}
**	}

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
*/


/*
| Redraws the complete space.
*/
Space.prototype.draw =
	function(
		fabric
	)
{
	var
		action,
		focus,
		r,
		view;

	view =
		this.view,

	action =
		shell.action;

	for(
		r = this.ranks.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( fabric );
	}

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
						.getItem( this.hover.get( 2 ) )
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
		item,
		r,
		rZ,
		view;

	view =
		this.view;

	for(
		r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		item =
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
		a,
		aZ,
		item,
		focus,
		reply,
		view;

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
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
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
		a,
		aZ,
		focus,
		view;

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
			Stubs.emptyNote.create(
				'zone',
					Euclid.Rect.create(
						'pnw',
							p,  // FIXME why no depoint?
						'pse',
							p
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
			Stubs.emptyLabel.create(
				'pnw',
					view.depoint( p ),
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
			Stubs.emptyPortal.create(
				'hover',
					Path.empty,
				'mark',
					Mark.Vacant.create( ),
				'path',
					Path.empty,
				'view',
					view,
				'zone',
					Euclid.Rect.create(
						'pnw',
							p, //FIXME depoint?
						'pse',
							p
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
		a = 0, aZ = this.ranks.length;
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
		a,
		aZ,
		item,
		view;

	view =
		this.view;

	// clicked some item?
	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		item =
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
		action,
		item,
		key,
		result,
		view;

	action =
		shell.action;

	view =
		this.view;

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
								'zone',
									Euclid.Rect.createArbitrary(
										view.depoint( action.start ),
										view.depoint( p )
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
									space.twig[ key ].
									doc.
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
								model.doc.fontsize *
									( oheight + dy ) / oheight,
								theme.label.minSize
						),

						resized =
							action.transItem.create(
								'fontsize',
									fs
							),

						label =
							resized.create(
								'pnw',
									( p.x > action.start.x ) ?
										zone.pnw
										:
										Euclid.Point.create(
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
							label.doc.fontsize
						);

					key =
						result.chgX.trg.path.get( -1 );

					shell.setMark(
						Mark.Caret.create(
							'path',
								shell.space
								.twig[ key ]
								.doc.atRank( 0 ).textPath,
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
						portal;

					portal =
						action.transItem.create(
							'zone',
								Euclid.Rect.createArbitrary(
									view.depoint( action.start ),
									view.depoint( p )
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
								shell
								.space
								.twig[ key ]
								.subPaths
								.spaceUser,
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

					throw new Error( );
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

					throw new Error( );
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

						throw new Error( );
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
							action.transItem.doc.fontsize
						);

						break;

					default :

						throw new Error( );
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

			throw new Error( );
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
		action,
		view,
		transItem,
		fs,
		model,
		origin,
		oheight,
		pd,
		r,
		rZ,
		resized;

	action =
		shell.action;

	view =
		this.view;

	transItem =
		null;

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
							'zone',
								zone
						);

					break;

				case 'pnw/fontsize' :

					oheight =
						model.zone.height;

					fs =
						Math.max(
							model.doc.fontsize *
								zone.height / oheight,
							theme.label.minSize
						);

					resized =
						model.create(
							'fontsize',
								fs
						);

					transItem =
						resized.create(
							'pnw',
								( p.x > action.start.x ) ?
									zone.pnw
									:
									Euclid.Point.create(
										'x',
											zone.pse.x - resized.zone.width,
										'y',
											zone.pnw.y
									)
						);

					break;

				default :

					throw new Error( );
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
							'pnw',
								origin.pnw.add(
									view.dex( p.x ) - action.start.x,
									view.dey( p.y ) - action.start.y
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

							throw new Error( );
					}

					fs =
						Math.max(
							origin.doc.fontsize *
								( oheight + dy ) / oheight,
							theme.label.minSize
						);

					resized =
						origin.create(
							'fontsize',
								fs
						);

					transItem =
						resized.create(
							'pnw',
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
								)
						);

					break;

				default :

					throw new Error( );
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

			throw new Error( );
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
		item,
		mark,
		path;

	mark =
		this.mark;

	if( !mark.hasCaret )
	{
		return false;
	}

	path =
		mark.caretPath;

	item =
		this.twig[ path.get( 2 ) ];

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
	var
		item,
		mark,
		path;

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

	mark =
		this.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	path =
		mark.caretPath;

	item =
		this.twig[ path.get( 2 ) ];

	if( item )
	{
		item.specialKey(
			key,
			shift,
			ctrl
		);
	}
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Space;
}


} )( );

