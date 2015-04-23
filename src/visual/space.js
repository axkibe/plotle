/*
| A space visualisation.
*/

var
	action_itemResize,
	action_pan,
	change_grow,
	change_set,
	euclid_arrow,
	euclid_point,
	euclid_rect,
	fabric_doc,
	fabric_label,
	fabric_para,
	gruga_relation,
	jion,
	mark_caret,
	result_hover,
	root,
	session_uid,
	shell_stubs,
	theme,
	visual_label,
	visual_note,
	visual_portal,
	visual_relation,
	visual_space;


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
	return{
		id : 'visual_space',
		attributes :
		{
			access :
			{
				comment : 'rights the current user has for this space',
				type : [ 'undefined', 'string' ]
			},
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				assign : '_action'
			},
			fabric :
			{
				comment : 'space fabric data',
				type : 'fabric_space'
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/mark' )
					.concat( [ 'undefined' ] ),
				prepare : 'visual_space.concernsMark( mark )'
			},
			ref :
			{
				comment : 'reference to this space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ]
			}
		},
		init : [ 'inherit' ],
		twig :
		[
			'visual_label',
			'visual_note',
			'visual_portal',
			'visual_relation'
		]
	};
}


var
	prototype,
	spacePath;


if( NODE )
{
	visual_space = require( 'jion' ).this( module, 'source' );

	visual_space.prototype._init = function( ){ };

	visual_space.concernsMark = function( o ){ return o; };

	return;
}


prototype = visual_space.prototype;

spacePath = jion.path.empty.append( 'space' );


/*
| Returns the mark if the space concerns about a mark.
*/
visual_space.concernsMark =
	function(
		mark
	)
{
	return(
		( mark && mark.containsPath( spacePath ) )
		? mark
		: undefined
	);
};


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		a,
		aZ,
		fabric,
		item,
		k,
		path,
		//iTwig,
		ranks,
		twig;

	fabric = this.fabric;

	//iTwig = inherit._twig;

	twig = { };

	ranks = [ ];

	for( a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		k = fabric.getKey( a );

		ranks.push( k );

		item = fabric.get( k );

		path = item.path;

		if( !path )
		{
			path = spacePath.append( 'twig' ).appendNC( k );
		}

		switch( item.reflect )
		{
			case 'fabric_label' :

				twig[ k ] =
					( inherit && inherit._twig[ k ] || visual_label )
					.create(
						'hover', this.hover,
						'fabric', item,
						'mark', this.mark,
						'path', path,
						'view', this.view
					);

				break;

			case 'fabric_relation' :

				twig[ k ] =
					( inherit && inherit._twig[ k ] || visual_relation )
					.create(
						'hover', this.hover,
						'fabric', item,
						'mark', this.mark,
						'path', path,
						'view', this.view
					);

				break;

			case 'fabric_note' :

				twig[ k ] =
					( inherit && inherit._twig[ k ] || visual_note )
					.create(
						'hover', this.hover,
						'fabric', item,
						'mark', this.mark,
						'path', path,
						'view', this.view
					);

				break;

			case 'fabric_portal' :

				twig[ k ] =
					( inherit && inherit._twig[ k ] || visual_portal )
					.create(
						'hover', this.hover,
						'fabric', item,
						'mark', this.mark,
						'path', path,
						'view', this.view
					);

				break;

			default :

				// FIXME XXX remove
				twig[ k ] =
					item.create(
						'hover', this.hover,
						'mark', this.mark,
						'path', path,
						'view', this.view
					);
		}
	}

	if( FREEZE )
	{
		Object.freeze( ranks );

		Object.freeze( twig );
	}

	this._twig = twig;
	this._ranks = ranks;
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

	path = mark ? mark.itemPath : undefined;

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

	if( path && path.length > 2 )
	{
		return this.getVis( path.get( 2 ) );
	}
	else
	{
		return undefined;
	}
};


/*
| Returns an item by its key.
*/
prototype.getVis =
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

	return this.get( key );
};


/*
| Returns the item by a given tree-rank.
*/
prototype.atRankVis =
	function(
		rank
	)
{
	return this.getVis( this.getKey( rank ) );
};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	function( )
	{
		var
			focus;

		focus = this.focusedItem( );

		if( !focus )
		{
			return undefined;
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

	for( r = this.length - 1; r >= 0; r-- )
	{
		this.atRankVis( r ).draw( display );
	}

	focus = this.focusedItem( );

	if( focus ) focus.handlesBezel.drawHandles( display );

	switch( action && action.reflect )
	{
		case 'action_createGeneric' :

			if( action.start ) action.transItem.draw( display );

			break;

		case 'action_createRelation' :

			if( action.fromItemPath )
			{
				fromItem = this.getVis( action.fromItemPath.get( -1 ) );

				fromItem.highlight( display );

				if( action.toItemPath )
				{
					toItem = this.getVis( action.toItemPath.get( -1 ) );

					toItem.highlight( display );
				}

				fromSilhoutte = fromItem.silhoutte;

				if(
					action.toItemPath
					&& !action.toItemPath.equals( action.fromItemPath )
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

					arrow.draw( display, view, gruga_relation );
				}
			}
			else
			{
				if( this.hover )
				{
					this
					.getVis( this.hover.get( 2 ) )
					.highlight( display );
				}
			}

			break;
	}
};


/*
| Mouse wheel.
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

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		item = this.atRankVis( r );

		if( item.mousewheel( view, p, dir, shift, ctrl ) ) return true;
	}

	root.create( 'view', view.review( dir > 0 ? 1 : -1, p ) );

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

	view = this.view;

	focus = this.focusedItem( );

	if( focus )
	{
		com = focus.handlesBezel.checkHandles( p );

		if( com )
		{
			return result_hover.create( 'cursor', com + '-resize' );
		}
	}

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRankVis( a );

		result = item.pointingHover( p );

		if( result )
		{
			return result;
		}
	}

	return result_hover.create( 'cursor', 'pointer' );
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
				'hover', jion.path.empty,
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
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRankVis( a );

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
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRankVis( a );

		if( item.click( p, shift, ctrl, access ) )
		{
			return true;
		}
	}

	// otherwise ...

	root.create( 'mark', undefined );

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

					key = session_uid( );

					root.alter(
						change_grow.create(
							'val', note,
							'path',
								jion.path.empty
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
									.spaceVisual.get( key )
									.doc
									.atRank( 0 ).textPath,
								'at', 0
							)
					);

					if( !ctrl )
					{
						root.create( 'action', undefined );
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

					key = session_uid( );

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
								jion.path.empty
								.append( 'twig' )
								.append( key ),
							'rank', 0
						)
					);

					root.create(
						'mark',
							mark_caret.create(
								'path',
									root.spaceVisual
									.get( key )
									.doc.atRank( 0 )
									.textPath,
								'at', 0
							)
					);

					if( !ctrl )
					{
						root.create( 'action', undefined );
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

					key = session_uid( );

					root.alter(
						change_grow.create(
							'path',
								jion.path.empty
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
									root.spaceVisual.get( key ).path
									.append( 'spaceUser' ),
								'at', 0
							)
					);

					if( !ctrl ) root.create( 'action', undefined );

					break;

				default :

					throw new Error( );
			}

			break;

		case 'action_pan' :

			root.create( 'action', undefined );

			break;

		case 'action_createRelation' :

			switch( action.relationState )
			{

				case 'start' :

					root.create( 'action', undefined );

					break;

				case 'hadSelect' :

					if( action.toItemPath )
					{
						item = this.getVis( action.toItemPath.get( -1 ) );

						item.dragStop( p );
					}

					root.create( 'action', undefined );

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

			root.create( 'action', undefined );

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

			root.create( 'action', undefined );

			break;

		case 'action_scrolly' :

			item = this.getVis( action.itemPath.get( -1 ));

			if( item )
			{
				item.dragStop( p, shift, ctrl );
			}

			root.create( 'action', undefined );

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
		item,
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

	view = this.view;

	if( !action ) return 'pointer';

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

			root.create( 'action', action = action.create( 'toPoint', p ) );

			// Looks if the action is dragging to an item
			for(
				r = 0, rZ = this.length;
				r < rZ;
				r++
			)
			{
				if( this.atRankVis( r ).dragMove( p ) )
				{
					return 'pointer';
				}
			}

			root.create( 'action', action.create( 'toItemPath', undefined ) );

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
						// make a createWithZone to visual items.
						origin.create(
							'fabric',
								origin.fabric.create(
									'zone',
										origin.zone.add(
											view.dex( p.x ) - action.start.x,
											view.dey( p.y ) - action.start.y
										)
								)
						);

					break;

				case 'pnw/fontsize' :

					transItem =
						// make a createWithPnw to visual items.
						origin.create(
							'fabric',
								origin.fabric.create(
									'pnw',
										origin.pnw.add(
											view.dex( p.x ) - action.start.x,
											view.dey( p.y ) - action.start.y
										)
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

					// FIXME createWithFontsize
					resized =
						origin.create(
							'fabric',
								origin.fabric.create( 'fontsize', fs )
						);

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

			item = this.getVis( action.itemPath.get( -1 ) );

			if( item )
			{
				item.dragMove( p );
			}

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

	item = this.get( path.get( 2 ) );

	if( item ) item.input( text );
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

	if( !mark || !mark.hasCaret ) return;

	item = this.get( mark.caretPath.get( 2 ) );

	if( item ) item.specialKey( key, shift, ctrl );
};


/*
| Changes the zoom factor ( around center )
|
| FIXME remove
*/
/*
prototype._changeZoom =
	function( df )
{
	var
		pm;

	pm = this.view.depoint( this.view.baseFrame.pc );

	root.create( 'view', this.view.review( df, pm ) );
};
*/


} )( );

