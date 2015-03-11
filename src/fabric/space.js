/*
| The visual space.
*/

var
	action_itemResize,
	action_pan,
	change_join,
	change_grow,
	change_remove,
	change_set,
	euclid_arrow,
	euclid_point,
	euclid_rect,
	fabric_doc,
	fabric_label,
	fabric_para,
	fabric_space,
	jion_path,
	jools,
	mark_caret,
	result_hover,
	root,
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
				action :
					{
						comment : 'current action',
						type : '->action',
						defaultValue : 'null',
						assign : '_action'
					},
				access :
					{
						comment : 'rights the current user has for this space',
						type : 'string',
						defaultValue : 'undefined'
					},
				hover :
					{
						comment : 'node currently hovered upon',
						type : 'jion_path',
						defaultValue : 'undefined'
					},
				mark :
					{
						comment : 'the users mark',
						type : '->mark',
						prepare : 'fabric_item.concernsMark( mark, path )',
						defaultValue : 'undefined',
						allowsNull : true
					},
				path :
					{
						comment : 'the path of the space',
						type : 'jion_path',
						defaultValue : 'undefined'
					},
				ref :
					{
						comment : 'reference to this space',
						type : 'fabric_spaceRef',
						defaultValue : 'undefined'
					},
				view :
					{
						comment : 'the current view',
						type : 'euclid_view',
						defaultValue : 'undefined'
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


var
	prototype;


if( SERVER )
{
	fabric_space = require( '../jion/this' )( module );

	jion_path = require( '../jion/path' );

	fabric_space.prototype._init = function( ){ };
}


prototype = fabric_space.prototype;


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
		|| mark.containsPath( jion_path.empty.append( 'space' ) )
	)
	{
		return mark;
	}
	else
	{
		return null;
	}
};


if( SERVER )
{
	return;
}


/*
| Initializer.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		k,
		path,
		twig;

	if( !this.view )
	{
		// abstract
		return;
	}

	twig =
		twigDup
		? this.twig
		: jools.copy( this.twig );

	for( k in twig )
	{
		path = twig[ k ].path;

		if(
			!path ||
			path.length === 0 || // FUTURE remove empty paths
			!path.shorten.shorten.equals( this.path )
		)
		{
			path = this.path.append( 'twig' ).appendNC( k );
		}

		twig[ k ] =
			twig[ k ].create(
				'hover', this.hover,
				'mark', this.mark,
				'path', path,
				'view', this.view
			);
	}

/**/if( FREEZE )
/**/{
/**/	Object.freeze( twig );
/**/}

	this.twig = twig;
};


/*
| The disc is shown while a space is shown.
*/
prototype.showDisc = true;


/*
| Returns the focused item.
|
| FIXME handle this more gracefully
*/
prototype.focusedItem =
	function( )
{
	var
		action,
		mark,
		path;

	action = this._action;

	mark = this.mark;

	path =
		mark
		? mark.itemPath
		: jion_path.empty;

	if( action )
	{
		switch( action.reflect )
		{
			case 'action_itemDrag' :
			case 'action_itemResize' :

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
prototype.getItem =
	function(
		key
	)
{
	var
		action;

	action = this._action;

	switch( action && action.reflect )
	{
		case 'action_itemDrag' :
		case 'action_itemResize' :

			if( action.transItem.path.get( -1 ) === key )
			{
				return action.transItem;
			}

			break;
	}

	return this.twig[ key ];
};


/*
| Returns the item by a given tree-rank.
|
| FUTURE remove
*/
prototype.atRank =
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
	prototype,
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
prototype.draw =
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

	action = this._action;

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
		focus.handlesBezel.drawHandles( display );
	}

	switch( action && action.reflect )
	{
		case 'action_createGeneric' :

			if( action.start )
			{
				action.transItem.draw( display );
			}

			break;

		case 'action_createRelation' :

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
prototype.mousewheel =
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

	root.create(
		'view',
			dir > 0
			? this.view.review( 1, p )
			: this.view.review( -1, p )
	);

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
prototype.pointingHover =
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
		result,
		view;

	view = this.view,

	focus = this.focusedItem( );

	if( focus )
	{
		com = focus.handlesBezel.checkHandles( p );

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

		result = item.pointingHover( p );

		if( result )
		{
			return result;
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
prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		a,
		access,
		aZ,
		action,
		com,
		dp,
		focus,
		item,
		transItem,
		view;

	access = this.access;

	view = this.view;

	focus = this.focusedItem( );

	// see if the handles were targeted
	if( access == 'rw' && focus )
	{
		com = focus.handlesBezel.checkHandles( p );

		if( com )
		{
			// resizing
			dp = view.depoint( p );

			root.create(
				'action',
					action_itemResize.create(
						'start', dp,
						'transItem', focus,
						'origin', focus,
						'align', com
					)
			);

			return;
		}
	}

	action = this._action;

	item = null;

	transItem = null;

	// FIXME simplify
	if(
		action
		&& action.reflect === 'action_createGeneric'
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

		root.create(
			'action',
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
		&& action.reflect === 'action_createGeneric'
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

		root.create(
			'action',
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
		action.reflect === 'action_createGeneric' &&
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

		root.create(
			'action',
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

		if( item.dragStart( p, shift, ctrl, access ) )
		{
			return;
		}
	}

	// starts a panning operation instead

	switch( action && action.reflect )
	{
		case 'action_createRelation' :

			root.create(
				'action',
					action.create(
						'pan', view.pan,
						'relationState', 'pan',
						'start', p
					)
			);

			return;
	}

	// otherwise panning is initiated
	root.create(
		'action',
			action_pan.create(
				'start', p,
				'pan', view.pan
			)
	);

	return;
};


/*
| A mouse click.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		a,
		aZ,
		access,
		item,
		view;

	access = this.access;

	view = this.view;

	// clicked some item?
	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		item = this.atRank( a );

		if( item.click( p, shift, ctrl, access ) )
		{
			return true;
		}
	}

	// otherwise ...

	root.create( 'mark', null );

	return true;
};


/*
| Stops an operation with the mouse button held down.
|
| FIXME split this up
*/
prototype.dragStop =
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
		resized,
		val,
		view,
		zone;

	action = this._action;

	view = this.view;

	if( !action )
	{
		return;
	}

	switch( action.reflect )
	{
		case 'action_createGeneric' :

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

					key = jools.uid( );

					root.alter(
						change_grow.create(
							'val', note,
							'path',
								jion_path.empty
								.append( 'twig' )
								.append( key ),
							'rank', 0
						)
					);

					root.create(
						'mark',
							mark_caret.create(
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
						root.create( 'action', null );
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

					key = jools.uid( );

					// FIXME might take label right away!
					val =
						fabric_label.create(
							'fontsize', label.doc.fontsize,
							'pnw', label.pnw,
							'doc',
								fabric_doc.create(
								'twig:add', '1',
								fabric_para.create( 'text', 'Label' )
							)
					);

					root.alter(
						change_grow.create(
							'val', val,
							'path',
								jion_path.empty
								.append( 'twig' )
								.append( key ),
							'rank', 0
						)
					);

					root.create(
						'mark',
							mark_caret.create(
								'path',
									root
									.space
									.twig[ key ]
									.doc.atRank( 0 ).textPath,
								'at', 0
							)
					);

					if( !ctrl )
					{
						root.create( 'action', null );
					}

					break;

				case 'portal' :

					portal =
						action.transItem.create(
							'zone',
								euclid_rect.createArbitrary(
									view.depoint( action.start ),
									view.depoint( p )
								),
							'spaceUser', root.user.name,
							'spaceTag', 'home'
						);

					key = jools.uid( );

					root.alter(
						change_grow.create(
							'path',
								jion_path.empty
								.append( 'twig' )
								.append( key ),
							'val', portal,
							'rank', 0
						)
					);

					root.create(
						'mark',
							mark_caret.create(
								'path',
									root.space.get( key ).path
									.append( 'spaceUser' ),
								'at', 0
							)
					);

					if( !ctrl )
					{
						root.create( 'action', null );
					}

					break;

				default :

					throw new Error( );
			}

			break;

		case 'action_pan' :

			root.create( 'action', null );

			break;

		case 'action_createRelation' :

			switch( action.relationState )
			{

				case 'start' :

					root.create( 'action', null );

					break;

				case 'hadSelect' :

					if( !action.toItemPath.isEmpty )
					{
						item = this.getItem( action.toItemPath.get( -1 ) );

						item.dragStop( p );
					}

					root.create( 'action', null );

					break;

				case 'pan' :

					root.create(
						'action',
							action.create( 'relationState', 'start' )
					);

					break;

				default :

					throw new Error( );
			}

			break;

		case 'action_itemDrag' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{
				switch( action.transItem.positioning )
				{
					case 'zone' :

						root.alter(
							change_set.create(
								'path',
									action.transItem.path
									.chop.append( 'zone' ),
								'val', action.transItem.zone,
								'prev', action.origin.zone
							)
						);

						break;

					case 'pnw/fontsize' :

						root.alter(
							change_set.create(
								'path',
									action.transItem.path
									.chop.append( 'pnw' ),
								'val', action.transItem.zone.pnw,
								'prev', action.origin.zone.pnw
							)
						);

						break;

					default :

						throw new Error( );
				}
			}

			root.create( 'action', null );

			break;

		case 'action_itemResize' :

			if( !action.transItem.zone.equals( action.origin.zone ) )
			{

				switch( action.transItem.positioning )
				{
					case 'zone' :

						root.alter(
							change_set.create(
								'path',
									action.transItem.path
									.chop.append( 'zone' ),
								'val', action.transItem.zone,
								'prev', action.origin.zone
							)
						);

						break;

					case 'pnw/fontsize' :

						root.alter(
							change_set.create(
								'path',
									action.transItem.path
									.chop.append( 'pnw' ),
								'val', action.transItem.zone.pnw,
								'prev', action.origin.zone.pnw
							),
							change_set.create(
								'path',
									action.transItem.path
									.chop.append( 'fontsize' ),
								'val',
									// FIXME why doc?
									action.transItem.doc.fontsize,
								'prev', action.origin.fontsize
							)
						);

						break;

					default :

						throw new Error( );
				}
			}

			root.create( 'action', null );

			break;

		case 'action_scrolly' :

			this.getItem(
				action.itemPath.get( -1 )
			).dragStop( p, shift, ctrl );

			root.create( 'action', null );

			break;

		default :

			throw new Error( );
	}

	return true;
};


/*
| Moving during an operation with the mouse button held down.
*/
prototype.dragMove =
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

	action = this._action;

	transItem = null;

	view = this.view;

	if( action === null )
	{
		return 'pointer';
	}

	switch( action.reflect )
	{
		case 'action_createGeneric' :

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

			root.create(
				'action', action.create( 'transItem', transItem )
			);

			return 'pointer';

		case 'action_createRelation' :

			if( action.relationState === 'pan' )
			{
				// panning while creating a relation

				pd = p.sub( action.start );

				root.create(
					'view',
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

			root.create(
				'action',
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
				if( this.atRank( r ).dragMove( p ) )
				{
					return 'pointer';
				}
			}

			return 'pointer';

		case 'action_pan' :

			pd = p.sub( action.start );

			root.create(
				'view',
					view.create(
						'pan',
							action.pan.add(
								Math.round( pd.x / view.zoom ),
								Math.round( pd.y / view.zoom )
							)
					)
			);

			return 'pointer';

		case 'action_itemDrag' :

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

			root.create(
				'action', action.create( 'transItem', transItem )
			);

			return true;


		case 'action_itemResize' :

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

			root.create(
				'action', action.create( 'transItem', transItem )
			);

			return true;

		case 'action_scrolly' :

			this.getItem( action.itemPath.get( -1 ) )
			.dragMove( p );

			// FIXME let the item decide on the cursor
			return 'move';

		default :

			throw new Error( );
	}
};


/*
| Text input
*/
prototype.input =
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
| Removes a text spawning over several entities.
*/
prototype.removeRange =
	function(
		front,
		back
	)
{
	var
		changes,
		k1,
		k2,
		pivot,
		r,
		r1,
		r2,
		text,
		ve;

/**/if( CHECK )
/**/{
/**/	if(
/**/		front.path.get( -1 ) !== 'text'
/**/		|| back.path.get( -1 ) !== 'text'
/**/		|| front.path.get( 0 ) !== 'space'
/**/		|| back.path.get( 0 ) !== 'space'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if ( front.path.equals( back.path ) )
	{
		root.alter(
			change_remove.create(
				'path', front.path.chop,
				'at1', front.at,
				'at2', back.at,
				'val',
					root.space.getPath( front.path.chop )
					.substring( front.at, back.at )
			)
		);

		return;
	}

	changes = [ ];

	k1 = front.path.get( -2 );

	k2 = back.path.get( -2 );

	pivot = root.space.getPath( front.path.chop.shorten.shorten.shorten );

	r1 = pivot.rankOf( k1 );

	r2 = pivot.rankOf( k2 );

	text = root.space.getPath( front.path.chop );

	for(
		r = r1;
		r < r2;
		r++
	)
	{
		ve = pivot.atRank( r + 1 );

		changes.push(
			change_join.create(
				'path', front.path.chop,
				'path2', ve.textPath.chop,
				'at1', text.length
			)
		);

		text += ve.text;
	}

	text =
		text.substring(
			front.at,
			text.length - ve.text.length + back.at
		);

	changes.push(
		change_remove.create(
			'path', front.path.chop,
			'at1', front.at,
			'at2', front.at + text.length,
			'val', text
		)
	);

	root.alter( changes );
};


/*
| User pressed a special key.
*/
prototype.specialKey =
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


/*
| Changes the zoom factor ( around center )
*/
prototype._changeZoom =
	function( df )
{
	var
		pm;

	pm = this.view.depoint( this.view.baseFrame.pc );

	root.create( 'view', this.view.review( df, pm ) );
};


} )( );

