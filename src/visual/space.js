/*
| A space visualisation.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
				type : [ 'undefined', 'jion$path' ],
				prepare : 'visual_space.concernsHover( hover )'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
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
	action_itemResize,
	action_pan,
	euclid_arrow,
	euclid_point,
	euclid_rect,
	gruga_label,
	gruga_relation,
	jion,
	result_hover,
	root,
	visual_frame,
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

spacePath = jion.path.empty.append( 'spaceVisual' );


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
| Returns the hover path if the space concerns about a hover.
*/
visual_space.concernsHover =
	function(
		hover
	)
{
	return(
		hover && hover.get( 0 ) === 'spaceVisual'
		? hover
		: undefined
	);
};


jion.lazyStaticValue(
	visual_space,
	'visualMap',
	function( )
{
	return {
		'fabric_label' : visual_label,
		'fabric_note' : visual_note,
		'fabric_portal' : visual_portal,
		'fabric_relation' : visual_relation
	};
}
);


/*
| Initializer.
|
| FIXME inherit optimizations.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		a,
		action,
		aZ,
		fabric,
		hover,
		item,
		iItem,
		k,
		mark,
		path,
		ranks,
		twig,
		view;

	action = this._action;

	fabric = this.fabric;

	hover = this.hover;

	mark = this.mark;

	view = this.view;

	twig = { };

	ranks = [ ];

	for( a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		k = fabric.getKey( a );

		ranks[ a ] = k;

		item = fabric.get( k );

		iItem = this._twig[ k ];

		if( !iItem )
		{
			iItem = visual_space.visualMap[ item.reflect ];

/**/		if( CHECK )
/**/		{
/**/			if( !iItem ) throw new Error( );
/**/		}

			path = spacePath.append( 'twig' ).appendNC( k );
		}
		else
		{
			path = pass;
		}

		twig[ k ] =
			iItem.create(
				'action', action,
				'hover', hover,
				'fabric', item,
				'mark', mark,
				'path', path,
				'view', view
			);
	}

	if( FREEZE )
	{
		Object.freeze( ranks );

		Object.freeze( twig );
	}

	this._ranks = ranks;

	this._twig = twig;

	if( inherit && jion.hasLazyValueSet( inherit, 'frame' ) )
	{
		this._inheritFrame = inherit.frame;
	}
};


/*
| The disc is shown while a space is shown.
*/
prototype.showDisc = true;


/*
| Determines the focused item.
*/
jion.lazyValue(
	prototype,
	'focus',
	function( )
{
	var
		mark,
		path;

	mark = this.mark;

	if( !mark ) return undefined;

	path = mark.itemPath;
	
	if( !path || path.length <= 2 ) return undefined;

	return this.get( path.get( 2 ) );
}
);


/*
| Determines the current alteration frame.
*/
jion.lazyValue(
	prototype,
	'frame',
	function( )
{
	var
		mark,
		view;

	mark = this.mark;
	
	view = this.view;

	if( mark && mark.itemPath )
	{
		return(
			( this._inheritFrame || visual_frame)
			.create(
				'view', view,
				'zone', this.get( mark.itemPath.get( 2 ) ).zone
			)
		);
	}
}
);


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

		focus = this.focus;

		if( !focus ) return undefined;

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
		this.atRank( r ).draw( display );
	}

	focus = this.focus;

	//if( focus ) focus.handlesBezel.drawHandles( display ); FIXME

	if( this.frame ) this.frame.draw( display );

	switch( action && action.reflect )
	{
		case 'action_createGeneric' :

			if( action.startPoint ) action.transItem.draw( display );

			break;

		case 'action_createRelation' :

			if( action.fromItemPath )
			{
				fromItem = this.get( action.fromItemPath.get( -1 ) );

				if( action.toItemPath )
				{
					toItem = this.get( action.toItemPath.get( -1 ) );
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
					toSilhoutte = action.toPoint.fromView( view );
				}

				if( toSilhoutte )
				{
					arrow =
						euclid_arrow.connect(
							fromSilhoutte, 'normal',
							toSilhoutte, 'arrow'
						).
						inView( view );

					arrow.draw( display, gruga_relation.facet );
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
		p,     // cursor point ( in view )
		dir,   // wheel direction, >0 for down, <0 for up
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
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
		item = this.atRank( r );

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
		p         // cursor point ( in view )
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		action,
		aZ,
		com,
		item,
		focus,
		result,
		view;

	action = this._action;

	view = this.view;

	focus = this.focus;

	if( focus )
	{
		com = focus.handlesBezel.checkHandles( p );

		if( com )
		{
			return result_hover.create( 'cursor', com + '-resize' );
		}
	}

	if(
		action
		&& action.reflect === 'action_createRelation'
		&& action.relationState === 'start'
	)
	{
		for( a = 0, aZ = this.length; a < aZ; a++ )
		{
			item = this.atRank( a );

			if( item.vZone.within( p ) )
			{
				root.create(
					'action', action.create( 'fromItemPath', item.path )
				);

				return(
					result_hover.create(
						'path', undefined,
						'cursor', 'default'
					)
				);
			}
		}

		root.create(
			'action', action.create( 'fromItemPath', undefined )
		);

		return(
			result_hover.create(
				'path', undefined,
				'cursor', 'default'
			)
		);
	}

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		result = item.pointingHover( p );

		if( result ) return result;
	}

	return result_hover.create( 'cursor', 'pointer' );
};


/*
| Starts an operation with the mouse button held down.
*/
prototype.dragStart =
	function(
		p,     // cursor point ( in view )
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
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
		view;

	access = this.access;

	view = this.view;

	focus = this.focus;

	// resizing
	dp = p.fromView( view );

	// see if the handles were targeted
	if( access == 'rw' && focus )
	{
		com = focus.handlesBezel.checkHandles( p );

		if( com )
		{
			root.create(
				'action',
					action_itemResize.create(
						'align', com,
						'itemPath', focus.path,
						'startPoint', dp,
						'startZone', focus.zone,
						'toFontsize', focus.fontsize
					)
			);

			return;
		}
	}

	action = this._action;

	if( action && action.reflect === 'action_createGeneric' )
	{
		this._startCreateGeneric( dp );

		return;
	}

	// see if one item was targeted
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl, access ) ) return;
	}

	// starts panning while creating a relation
	if( action && action.reflect === 'action_createRelation' )
	{
		root.create(
			'action',
				action.create(
					'pan', view.pan,
					'relationState', 'pan',
					'startPoint', p
				)
		);

		return;
	}

	// otherwise panning is initiated
	root.create(
		'action',
			action_pan.create(
				'startPoint', p,
				'pan', view.pan
			)
	);
};


/*
| A mouse click.
*/
prototype.click =
	function(
		p,     // cursor point ( in view )
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
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
		item = this.atRank( a );

		if( item.click( p, shift, ctrl, access ) ) return true;
	}

	// otherwise ...

	root.create( 'mark', undefined );

	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
prototype.dragStop =
	function(
		p,     // cursor point ( in view )
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		item,
		view;

	action = this._action;

	view = this.view;

	if( !action ) return;

	switch( action.reflect )
	{
		case 'action_createGeneric' :

			this._stopCreateGeneric( p, shift, ctrl );

			break;

		case 'action_pan' :

			root.create( 'action', undefined );

			break;

		case 'action_createRelation' :

			this._stopCreateRelation( p, shift, ctrl );

			break;

		case 'action_itemDrag' :

			item = root.getPath( action.itemPath );

			item.itemDrag( );

			break;

		case 'action_itemResize' :

			item = root.getPath( action.itemPath );

			item.stopItemResize( );

			break;

		case 'action_scrolly' :

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
		p,     // cursor point ( in view )
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		action;

	action = this._action;

	if( !action ) return 'pointer';

	switch( action.reflect )
	{
		case 'action_createGeneric' :

			return this._moveCreateGeneric( p, shift, ctrl );

		case 'action_createRelation' :

			return this._moveCreateRelation( p, shift, ctrl );

		case 'action_pan' :

			return this._movePan( p, shift, ctrl );

		case 'action_itemDrag' :

			return this._moveItemDrag( p, shift, ctrl );

		case 'action_itemResize' :

			return this._moveItemResize( p, shift, ctrl );


		case 'action_scrolly' :

			return this._moveScrollY( p, shift, ctrl );

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

	path = mark.caret.path;

	item = this.get( path.get( 2 ) );

	if( item ) item.input( text );
};


/*
| Tries to scrolls the focused item to move
| the mark into view.
*/
prototype.scrollMarkIntoView =
	function( )
{
	var
		focus;

	focus =  this.focus;

	if( focus && focus.scrollMarkIntoView ) focus.scrollMarkIntoView( );
};


/*
| User pressed a special key.
*/
prototype.specialKey =
	function(
		key,   // key being pressed
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		item,
		mark;

	if( ctrl )
	{
		switch( key )
		{
			case 'z' : root.doTracker.undo( ); return;

			case 'y' : root.doTracker.redo( ); return;

			case ',' : this._changeZoom(  1 ); return;

			case '.' : this._changeZoom( -1 ); return;
		}
	}

	mark = this.mark;

	if( !mark || !mark.hasCaret ) return;

	item = this.get( mark.caret.path.get( 2 ) );

	if( item ) item.specialKey( key, shift, ctrl );
};


/*
| Changes the zoom factor ( around center )
*/
prototype._changeZoom =
	function( df )
{
	var
		pm;

	pm = this.view.baseArea.pc.fromView( this.view );

	root.create( 'view', this.view.review( df, pm ) );
};


/*
| Moves during creating a generic item.
*/
prototype._moveCreateGeneric =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		dp,
		fs,
		model,
		pnw,
		resized,
		transItem,
		view,
		zone;

	action = this._action;

	view = this.view;

	dp = p.fromView( view );

	zone = euclid_rect.createArbitrary( action.startPoint, dp );

	model = action.itemType.model;

	switch( action.itemType )
	{
		case visual_note :
		case visual_portal :

			zone = zone.ensureMinSize( model.minWidth, model.minHeight );

			transItem =
				model.create(
					'fabric', model.fabric.create( 'zone', zone ),
					'view', view
				);

			break;

		case visual_label :

			fs =
				Math.max(
					model.doc.fontsize
					* zone.height
					/ model.zone.height,
					gruga_label.minSize
				);

			resized =
				model.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			pnw =
				( dp.x > action.startPoint.x )
				? zone.pnw
				: euclid_point.create(
					'x', zone.pse.x - resized.zone.width,
					'y', zone.pnw.y
				);

			transItem =
				resized.create(
					'fabric', resized.fabric.create( 'pnw', pnw ),
					'view', view
				);

			break;

		default : throw new Error( );
	}

	root.create(
		'action', action.create( 'transItem', transItem )
	);

	return 'pointer';
};


/*
| Moves during creating a relation.
*/
prototype._moveCreateRelation =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		pd,
		r,
		rZ,
		view;

	action = this._action;

	view = this.view;

	if( action.relationState === 'pan' )
	{
		// panning while creating a relation

		pd = p.sub( action.startPoint );

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

	// Looks if the action is dragging to an item
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		if( this.atRank( r ).createRelationMove( p, action ) )
		{
			return 'pointer';
		}
	}

	root.create(
		'action',
			action.create(
				'toItemPath', undefined,
				'toPoint', p
			)
	);

	return 'pointer';
};


/*
| Moves during item dragging.
*/
prototype._moveItemDrag =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		item,
		view;

	action = this._action;

	item = root.getPath( action.itemPath );

	view = this.view;

	root.create(
		'action',
			action.create(
				'toPnw',
					item.fabric.pnw.add(
						view.dex( p.x ) - action.startPoint.x,
						view.dey( p.y ) - action.startPoint.y
				)
			)
	);

	return true;
};


/*
| Moves during item resizing.
*/
prototype._moveItemResize =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		align,
		dy,
		fs,
		item,
		resized,
		view,
		zone;

	action = this._action;

	align = action.align;

	item = root.getPath( action.itemPath );

	view = this.view;

	switch( item.positioning )
	{

		case 'zone' :

			zone =
				item.fabric.zone.cardinalResize(
					align,
					view.dex( p.x ) - action.startPoint.x,
					view.dey( p.y ) - action.startPoint.y,
					item.minHeight,
					item.minWidth
				);

			root.create(
				'action',
					action.create(
						'toPnw', zone.pnw,
						'toPse', zone.pse
					)
			);

			return true;

		case 'pnw/fontsize' :

			switch( action.align )
			{
				case 'ne' :
				case 'nw' :

					dy = action.startPoint.y - view.dey( p.y );

					break;

				case 'se' :
				case 'sw' :

					dy = view.dey( p.y ) - action.startPoint.y;

					break;

				default :

					throw new Error( );
			}

			fs =
				Math.max(
					item.fabric.fontsize
					* ( action.startZone.height + dy )
					/ action.startZone.height,
					gruga_label.minSize
				);

			resized =
				item.create(
					'path', undefined,
					'fabric', item.fabric.create( 'fontsize', fs )
				);

			action =
				action.create(
					'toFontsize', fs,
					'toPnw',
						item.fabric.pnw.add(
							( align === 'sw' || align === 'nw' )
							? (
								action.startZone.width -
								resized.zone.width
							)
							: 0,
							( align === 'ne' || align === 'nw' )
							? (
								action.startZone.height -
								resized.zone.height
							)
							: 0
						)
				);

				root.create( 'action', action );

			return true;

		default :

			throw new Error( );
	}
};


/*
| Moves during panning.
*/
prototype._movePan =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		pd,
		view;

	action = this._action;

	view = this.view;

	pd = p.sub( action.startPoint );

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
};


/*
| Moves during scrolling.
*/
prototype._moveScrollY =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		dy,
		item,
		sbary,
		spos,
		view;

	action = this._action;

	item = this.get( action.itemPath.get( -1 ) );

	view = this.view;

	dy = ( p.y - action.startPoint.y ) / view.zoom;

	sbary = item.scrollbarY;

	spos = action.startPos + sbary.scale( dy );

	root.setPath(
		item.path.append( 'scrollPos' ),
		item.scrollPos.create( 'y', spos )
	);

	return 'move';
};


/*
| Starts creating a generic item.
*/
prototype._startCreateGeneric =
	function(
		dp   // depoint, non-viewbased point of start
	)
{
	var
		action,
		itemType,
		model,
		transItem;

	action = this._action;

	itemType = action.itemType;

	model = itemType.model;

	switch( itemType.positioning )
	{
		case 'zone' :

			transItem =
				model.create(
					'fabric',
						model.fabric.create(
							'zone',
								euclid_rect.create(
									'pnw', dp,
									'pse',
										dp.add(
											model.minWidth,
											model.minHeight
										)
								)
						),
					'view', this.view
				);

			break;

		case 'pnw/fontsize' :

			transItem =
				model.create(
					'fabric', model.fabric.create( 'pnw', dp ),
					'view', this.view
				);

			break;

		default : throw new Error( );

	}

	root.create(
		'action',
			action.create(
				'startPoint', dp,
				'transItem', transItem
			)
	);
};


/*
| Stops creating a generic item.
*/
prototype._stopCreateGeneric =
	function(
		p,     // point, viewbased point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		action;

	action = this._action;

	action.itemType.createGeneric( action, p.fromView( this.view ) );

	if( !ctrl ) root.create( 'action', undefined );
};


/*
| Stops creating a relation.
*/
prototype._stopCreateRelation =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		item;

	action = this._action;

	switch( action.relationState )
	{

		case 'start' : root.create( 'action', undefined ); return;

		case 'hadSelect' :

			if( action.toItemPath )
			{
				item = this.get( action.toItemPath.get( -1 ) );

				item.createRelationStop( p );
			}

			root.create( 'action', undefined );

			return;

		case 'pan' :

			root.create(
				'action',
					action.create( 'relationState', 'start' )
			);

			return;

		default : throw new Error( );
	}
};


} )( );

