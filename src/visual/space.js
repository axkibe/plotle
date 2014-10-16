/*
| The visual space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	visual;


/*
| Imports
*/
var
	actions,
	euclid,
	jion,
	jools,
	marks,
	peer,
	result,
	root,
	Stubs,
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
			'visual.space',
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
							'jion.path',
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
									'visual.space',
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
							'jion.path',
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
							'euclid.view',
						defaultValue :
							undefined
					}
			},
		init :
			[
				'inherit',
				'twigDup'
			],
		node :
			true,
		json :
			true,
		twig :
			[
				'visual.note',
				'visual.label',
				'visual.relation',
				'visual.portal'
			]
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	visual =
		{
			space : require( '../jion/this' )( module )
		};
}


var
	space;

space = visual.space;


/*
| Initializer.
*/
space.prototype._init =
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
space.prototype.showDisc = true;


/*
| Returns the mark if the form jockey concerns a mark.
*/
space.concernsMark =
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
			jion.path.empty.append( 'space' )
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
space.prototype.focusedItem =
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
		: jion.path.empty;

	if( action )
	{
		switch( action.reflect )
		{
			case 'actions.itemDrag' :
			case 'actions.itemResize' :

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
space.prototype.getItem =
	function(
		key
	)
{
	var
		action;

	action = root.action;

	switch( action && action.reflect )
	{
		case 'actions.itemDrag' :
		case 'actions.itemResize' :

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
space.prototype.atRank =
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
	space.prototype,
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
| Redraws the complete space.
*/
space.prototype.draw =
	function(
		fabric
	)
{
	var
		action,
		arrow,
		focus,
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
		this.atRank( r ).draw( fabric );
	}

	focus = this.focusedItem( );

	if( focus )
	{
		focus.drawHandles(
			fabric,
			view
		);
	}

	switch( action && action.reflect )
	{
		case 'actions.createGeneric' :

			if( action.start )
			{
				action.transItem.draw( fabric );
			}

			break;

		case 'actions.createRelation' :

			if( !action.fromItemPath.isEmpty )
			{
				var
					fromItem =
						this.getItem(
							action.fromItemPath.get( -1 )
						);

				fromItem.highlight( fabric );

				toItem = null;

				if( !action.toItemPath.isEmpty )
				{
					toItem =
						this.getItem(
							action.toItemPath.get( -1 )
						);

					toItem.highlight( fabric );
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
					toSilhoutte =
						view.depoint( action.toPoint );
				}

				if( toSilhoutte )
				{
					arrow =
						euclid.arrow.connect(
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
space.prototype.mousewheel =
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
		item = this.atRank(r);

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
		root.setView(
			this.view.review( 1, p )
		);
	}
	else
	{
		root.setView(
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
space.prototype.pointingHover =
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
		res,
		view;

	view = this.view,

	focus = this.focusedItem( );

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
			return(
				result.hover.create(
					'path',
						jion.path.empty,
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
		item = this.atRank( a ),

		res =
			item.pointingHover(
				view,
				p
			);

		if( res )
		{
			return res;
		}
	}

	return(
		result.hover.create(
			'path',
				jion.path.empty,
			'cursor',
				'pointer'
		)
	);
};


/*
| Starts an operation with the mouse button held down.
*/
space.prototype.dragStart =
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
		focus,
		item,
		transItem,
		view;

	view = this.view,

	focus = this.focusedItem( );

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

			root.setAction(
				actions.itemResize.create(
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

	action = root.action;

	item = null;

	transItem = null;

	// FIXME simplify
	if(
		action &&
		action.reflect === 'actions.createGeneric' &&
		action.itemType === 'note'
	)
	{
		transItem =
			Stubs.emptyNote.create(
				'zone',
					euclid.rect.create(
						'pnw',
							p,  // FIXME why no depoint?
						'pse',
							p
					),
				'mark',
					null,
				'path',
					jion.path.empty,
				'view',
					view
			);

		root.setAction(
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
		action.reflect === 'actions.createGeneric' &&
		action.itemType === 'label'

	)
	{
		transItem =
			Stubs.emptyLabel.create(
				'pnw',
					view.depoint( p ),
				'mark',
					null,
				'path',
					jion.path.empty,
				'view',
					view
			);

		root.setAction(
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
		action.reflect === 'actions.createGeneric' &&
		action.itemType === 'portal'

	)
	{
		transItem =
			Stubs.emptyPortal.create(
				'hover',
					jion.path.empty,
				'mark',
					null,
				'path',
					jion.path.empty,
				'view',
					view,
				'zone',
					euclid.rect.create(
						'pnw',
							p, //FIXME depoint?
						'pse',
							p
					)
			);

		root.setAction(
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
		case 'actions.createRelation' :

			root.setAction(
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
	root.setAction(
		actions.pan.create(
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
space.prototype.click =
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

	root.setMark( null );

	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
space.prototype.dragStop =
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
		res,
		view;

	action = root.action;

	view = this.view;

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
		case 'actions.createGeneric' :

			switch( action.itemType )
			{
				case 'note' :

					// FIXME move to note
					// ( and all others creators )

					var
						note =
							action.transItem.create(
								'zone',
									euclid.rect.createArbitrary(
										view.depoint( action.start ),
										view.depoint( p )
									)
							);

					res =
						peer.newNote(
							this.spaceUser,
							this.spaceTag,
							note.zone
						),

					key =
						res.chgX.trg.path.get( -1 );

					root.setMark(
						marks.caret.create(
							'path',
								root.
									space.twig[ key ].
									doc.
									atRank( 0 ).textPath,
							'at',
								0
						)
					);

					if( !ctrl )
					{
						root.setAction( null );
					}

					break;

				case 'label' :

					var
						model =
							action.model,

						zone =
							euclid.rect.createArbitrary(
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
										euclid.point.create(
											'x',
												zone.pse.x - resized.zone.width,
											'y',
												zone.pnw.y
										)
							);

					res =
						peer.newLabel(
							label.pnw,
							'Label',
							label.doc.fontsize
						);

					key = res.chgX.trg.path.get( -1 );

					root.setMark(
						marks.caret.create(
							'path',
								root.space
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

					var
						portal;

					portal =
						action.transItem.create(
							'zone',
								euclid.rect.createArbitrary(
									view.depoint( action.start ),
									view.depoint( p )
								)
						);

					res =
						peer.newPortal(
							portal.zone,
							root.username, // FIXME
							'home'
						);

					key = res.chgX.trg.path.get( -1 );

					root.setMark(
						marks.caret.create(
							'path',
								root
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
						root.setAction( null );
					}

					break;

				default :

					throw new Error( );
			}

			break;

		case 'actions.pan' :

			root.setAction( null );

			break;

		case 'actions.createRelation' :

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

						item.dragStop(
							view,
							p
						);
					}

					root.setAction( null );

					break;

				case 'pan' :

					root.setAction(
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

		case 'actions.itemDrag' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{
				switch( action.transItem.positioning )
				{
					case 'zone' :

						peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						peer.setPNW(
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

		case 'actions.itemResize' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{

				switch( action.transItem.positioning )
				{
					case 'zone' :

						peer.setZone(
							action.transItem.path,
							action.transItem.zone
						);

						break;

					case 'pnw/fontsize' :

						peer.setPNW(
							action.transItem.path,
							action.transItem.zone.pnw
						);

						peer.setFontSize(
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

		case 'actions.scrollY' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragStop(
				view,
				p,
				shift,
				ctrl
			);

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
space.prototype.dragMove =
	function(
		p
		// shift,
		// ctrl
	)
{
	var
		action,
		align,
		view,
		transItem,
		fs,
		model,
		origin,
		oheight,
		pd,
		r,
		rZ,
		resized,
		zone;

	action = root.action;

	transItem = null;

	view = this.view;

	if( action === null )
	{
		return 'pointer';
	}

	switch( action.reflect )
	{
		case 'actions.createGeneric' :

			model =
				action.model;
			zone =
				euclid.rect.createArbitrary(
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
									euclid.point.create(
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

			root.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return 'pointer';

		case 'actions.createRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd =
					p.sub( action.start );

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
					'toItemPath',
						jion.path.empty,
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

		case 'actions.pan' :

			pd =
				p.sub( action.start );

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

		case 'actions.itemDrag' :

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

			root.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return true;


		case 'actions.itemResize' :

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

			root.setAction(
				action.create(
					'transItem',
						transItem
				)
			);

			return true;

		case 'actions.scrollY' :

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
space.prototype.input =
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
space.prototype._changeZoom =
	function( df )
{
	var
		pm =
			this.view.depoint(
				this.view.baseFrame.pc
			);

	root.setView(
		this.view.review(
			df,
			pm
		)
	);
};


/*
| User pressed a special key.
*/
space.prototype.specialKey =
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

				root.link.undo( );

				return;

			case 'y' :

				root.link.redo( );

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
	module.exports = space;
}


} )( );

