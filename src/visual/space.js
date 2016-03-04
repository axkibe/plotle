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
					.concat( [ 'undefined' ] )
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
	action_create,
	action_createGeneric,
	action_createRelation,
	action_pan,
	action_select,
	change_ray,
	euclid_arrow,
	euclid_connect,
	euclid_point,
	euclid_rect,
	gleam_container,
	gruga_label,
	gruga_relation,
	gruga_select,
	jion,
	jion$pathRay,
	result_hover,
	root,
	visual_frame,
	visual_itemRay,
	visual_label,
	visual_mark_items,
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
		highlight,
		hover,
		item,
		iItem,
		k,
		mark,
		path,
		ranks,
		twig,
		view;

	action = this.action;

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
			path = iItem.path;
		}

		highlight =
			(
				action
				&& (
					(
						action.reflect === 'action_createRelation'
						&& action.affects( path )
					)
					|| (
						action.reflect === 'action_select'
						&& action.affects( path )
					)
				)
			)
			|| (
				mark
				&& mark.containsPath( path )
			);

		twig[ k ] =
			iItem.create(
				'action', action,
				'highlight', !!highlight,
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
		path,
		paths;

	mark = this.mark;

	if( !mark ) return undefined;

	paths = mark.paths;

	if( !paths || paths.length !== 1 ) return undefined;

	path = paths.get( 0 );

	if( path.length <= 2 ) return undefined; // FIXME shouldn't be necessary

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
		content,
		mark,
		view;

	mark = this.mark;

	view = this.view;

	if( mark )
	{
		if( mark.paths )
		{
			content = this.getRay( mark.paths );
		}

		if( content )
		{
			return(
				( this._inheritFrame || visual_frame )
				.create(
					'content', content,
					'view', view
				)
			);
		}
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
| Updates the gleam container
*/
prototype.beam =
	function(
		// container
	)
{
	var
		c,
		r,
		s;

	c = gleam_container.create( );

	for( r = this.length - 1; r >= 0; r-- )
	{
		s = this.atRank( r );

		c = s.beam( c );
	}

	if( this.frame )
	{
		c = this.frame.beam( c );
	}

	return c;
};


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

	action = this.action;

	for( r = this.length - 1; r >= 0; r-- )
	{
		this.atRank( r ).draw( display );
	}

	focus = this.focus;

	if( this.frame )
	{
		this.frame.draw( display );
	}

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
						euclid_arrow.shape(
								euclid_connect.line(
									fromSilhoutte,
									toSilhoutte
								),
								'normal',
								'arrow'
						)
						.inView( view );

					display.paint( gruga_relation.facet, arrow );
				}
			}

			break;

		case 'action_select' :

			if( action.vZone )
			{
				display.paint( gruga_select.facet, action.vZone );
			}

			break;
	}
};


/*
| Returns a ray of visual item by a ray of paths
*/
prototype.getRay =
	function(
		paths
	)
{
	var
		a,
		aZ,
		path,
		items,
		iZ;

/**/if( CHECK )
/**/{
/**/	if( paths.reflect === 'jion$pathRay' ) throw new Error( );
/**/
/**/	if( paths.length === 0 ) throw new Error( );
/**/}

	items = [ ];

	iZ = 0;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
	{
		path = paths.get( a );

/**/	if( CHECK )
/**/	{
/**/		if( path.get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/
/**/		if( path.get( 1 ) !== 'twig' ) throw new Error( );
/**/	}

		items[ iZ++ ] = this.get( path.get( 2 ) );
	}

	return visual_itemRay.create( 'ray:init', items );
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
		item,
		focus,
		frame,
		result,
		view;

	action = this.action;

	view = this.view;

	focus = this.focus;

	frame = this.frame;

	if( frame )
	{
		result = frame.pointingHover( p );

		if( result ) return result;
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

	return result_hover.create( 'cursor', 'default' );
};


/*
| Starts an operation with the pointing device held down.
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
		dp,
		focus,
		frame,
		result,
		item,
		view;

	access = this.access;

	view = this.view;

	focus = this.focus;

	frame = this.frame;

	// resizing
	dp = p.fromView( view );

	// see if the handles were targeted
	if( access == 'rw' && frame )
	{
		result = frame.dragStart( p, shift, ctrl, access );

		if( result !== undefined ) return result;
	}

	action = this.action;

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

	if( action )
	{
		switch( action.reflect )
		{
			case 'action_select' :

				root.create(
					'action',
						action.create(
							'startPoint', p,
							'toPoint', p
						)
				);

				return;

			case 'action_createRelation' :
				// starts panning while creating a relation

				root.create(
					'action',
						action.create(
							'pan', view.pan,
							'relationState', 'pan', // FIXME remove pan
							'startPoint', p
						)
				);

				return;

			case 'action_create' :

				// starts panning while creating nothing
				root.create(
					'action',
						action.create(
							'pan', view.pan,
							'startPoint', p
						)
				);

				return;
		}
	}


	// otherwise panning is initiated
	root.create(
		'action',
			action_pan.create(
				'pan', view.pan,
				'startPoint', p
			)
	);
};


/*
| A click.
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
		mark,
		view;

	access = this.access;

	mark = this.mark;

	view = this.view;

	// clicked some item?
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		if( !item.vSilhoutte.within( p ) ) continue;

		if( ctrl )
		{
			if( item.ctrlClick( p, shift, access, mark ) ) return true;
		}
		else
		{
			if( item.click( p, shift, ctrl, access ) ) return true;
		}
	}

	// otherwise ...

	if( !ctrl )
	{
		root.create( 'mark', undefined );
	}

	return true;
};


/*
| Stops an operation with the poiting device button held down.
*/
prototype.dragStop =
	function(
		p,     // cursor point ( in view )
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		action,
		aZ,
		changes,
		chi,
		paths,
		item,
		view;

/**/if( CHECK )
/**/{
/**/	if( root.spaceVisual !== this ) throw new Error( );
/**/}

	action = this.action;

	view = this.view;

	if( !action ) return;

	switch( action.reflect )
	{
		case 'action_create' :

			this._stopCreate( p, shift, ctrl );

			break;

		case 'action_createGeneric' :

			this._stopCreateGeneric( p, shift, ctrl );

			break;

		case 'action_createRelation' :

			this._stopCreateRelation( p, shift, ctrl );

			break;

		case 'action_dragItems' :

			paths = action.paths;

			for( a = 0, aZ = paths.length; a < aZ; a++ )
			{
				item = root.getPath( paths.get( a ) );

				chi = item.getDragItemChange( );

				if( !chi ) continue;

				if( !changes )
				{
					changes = chi;
				}
				else
				{
					if( changes.reflect !== 'change_ray' )
					{
						changes = change_ray.create( 'ray:append', changes );
					}

					if( chi.reflect !== 'change_ray' )
					{
						changes = changes.create( 'ray:append', chi );
					}
					else
					{
						changes = changes.appendRay( chi );
					}

				}
			}

			if( changes ) root.alter( changes );

			root.create( 'action', undefined );

			break;

		case 'action_pan' :

			root.create( 'action', undefined );

			break;

		case 'action_resizeItems' :

			paths = action.paths;

			for( a = 0, aZ = paths.length; a < aZ; a++ )
			{
				item = root.getPath( paths.get( a ) );

				chi = item.getResizeItemChange( );

				if( !chi ) continue;

				if( !changes )
				{
					changes = chi;
				}
				else
				{
					if( changes.reflect !== 'change_ray' )
					{
						changes = change_ray.create( 'ray:append', changes );
					}

					if( chi.reflect !== 'change_ray' )
					{
						changes = changes.create( 'ray:append', chi );
					}
					else
					{
						changes = changes.appendRay( chi );
					}

				}
			}

			if( changes ) root.alter( changes );

			root.create( 'action', undefined );

			break;

		case 'action_scrolly' :

			root.create( 'action', undefined );

			break;

		case 'action_select' :

			this._stopSelect( p, shift, ctrl );

			break;

		default :

			throw new Error( );
	}

	return true;
};


/*
| Moving during an operation with the pointing device button held down.
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

	action = this.action;

	if( !action ) return 'pointer';

	switch( action.reflect )
	{
		case 'action_create' :

			return this._moveCreate( p, shift, ctrl );

		case 'action_createGeneric' :

			return this._moveCreateGeneric( p, shift, ctrl );

		case 'action_createRelation' :

			return this._moveCreateRelation( p, shift, ctrl );

		case 'action_pan' :

			return this._movePan( p, shift, ctrl );

		case 'action_dragItems' :

			return this._moveDragItems( p, shift, ctrl );

		case 'action_resizeItems' :

			return this._moveResizeItems( p, shift, ctrl );

		case 'action_scrolly' :

			return this._moveScrollY( p, shift, ctrl );

		case 'action_select' :

			return this._moveSelect( p, shift, ctrl );

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

	action = this.action;

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

	action = this.action;

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
| Moves during creating.
*/
prototype._moveCreate =
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

	action = this.action;

	view = this.view;

	if( action.pan )
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
	}

	return 'pointer';
};



/*
| Moves during item dragging.
*/
prototype._moveDragItems =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		startPoint,
		view;

	action = this.action;

	startPoint = action.startPoint;

	view = this.view;

	root.create(
		'action',
			action.create(
				'moveBy',
					euclid_point.create(
						'x', view.dex( p.x ) - startPoint.x,
						'y', view.dey( p.y ) - startPoint.y
					)
			)
	);

	return true;
};


/*
| Moves during item resizing.
*/
prototype._moveResizeItems =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		action,
		aZ,
		dx,
		dy,
		item,
		key,
		path,
		paths,
		pBase,
		startPoint,
		min,
		scaleX,
		scaleY,
		startZone,
		startZones,
		view;

	action = this.action;

	view = this.view;

	pBase = action.pBase;

	startPoint = action.startPoint;

	dx = view.dex( p.x );

	dy = view.dey( p.y );

	switch( action.resizeDir )
	{
		case 'n' :
		case 'ne' :
		case 'nw' :
		case 's' :
		case 'se' :
		case 'sw' :

			scaleY =
				Math.max(
					( pBase.y - dy ) / ( pBase.y - startPoint.y ),
					0
				);

			break;
	}

	if( !action.proportional || scaleY === undefined )
	{
		switch( action.resizeDir )
		{
			case 'ne' :
			case 'nw' :
			case 'e' :
			case 'se' :
			case 'sw' :
			case 'w' :

				scaleX =
					Math.max(
						( pBase.x - dx ) / ( pBase.x - startPoint.x ),
						0
					);

				break;
		}
	}

	if( action.proportional )
	{
		if( scaleX === undefined )
		{
			scaleX = scaleY;
		}
		else if( scaleY === undefined )
		{
			scaleY = scaleX;
		}
	}
	else
	{
		if( scaleX === undefined ) scaleX = 1;

		if( scaleY === undefined ) scaleY = 1;
	}

	paths = action.paths;

	startZones = action.startZones;

	for( a = 0, aZ = paths.length; a < aZ; a++ )
	{
		path = paths.get( a );

		key = path.get( 2 );

		item = this.get( path.get( 2 ) );

		startZone = startZones.get( key );

		min = item.minScaleX( startZone );

		if( scaleX < min ) scaleX = min;

		min = item.minScaleY( startZone );

		if( scaleY < min ) scaleY = min;
	}

	if( action.proportional )
	{
		scaleX =
		scaleY =
			Math.max( scaleX, scaleY );
	}


	root.create(
		'action',
			action.create(
				'scaleX', scaleX,
				'scaleY', scaleY
			)
	);

	return true;
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

	action = this.action;

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
| Moves during selecting.
*/
prototype._moveSelect =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action;

	action = this.action;

	root.create(
		'action',
			action.create(
				'toPoint', p
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

	action = this.action;

	item = this.get( action.paths.get( 0 ).get( -1 ) );

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

	action = this.action;

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

	action = this.action;

	action.itemType.createGeneric( action, p.fromView( this.view ) );

	root.create(
		'action',
			ctrl
			? action_createGeneric.create( 'itemType', action.itemType )
			: action_create.create( )
	);
};


/*
| Stops creating.
*/
prototype._stopCreate =
	function(
		// p      // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	root.create(
		'action',
			this.action.create(
				'pan', undefined,
				'startPoint', undefined
			)
	);
};


/*
| Stops creating a relation.
*/
prototype._stopCreateRelation =
	function(
		p,      // point, viewbased point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	var
		action,
		item;

	action = this.action;

	switch( action.relationState )
	{
		case 'hadSelect' :

			if( action.toItemPath )
			{
				item = this.get( action.toItemPath.get( -1 ) );

				item.createRelationStop( p );
			}

			root.create(
				'action',
				ctrl
				? action_createRelation.create( 'relationState', 'start' )
				: undefined
			);

			return;

		case 'start' :

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


/*
| Stops selecting.
*/
prototype._stopSelect =
	function(
		p,      // point, viewbased point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	var
		action,
		item,
		mark,
		path,
		paths,
		pZ,
		r,
		rZ;

	action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.reflect !== 'action_select' ) throw new Error( );
/**/}

	action = action.create( 'toPoint', p );

	paths = [ ];

	pZ = 0;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		item = this.atRank( r );

		path = item.path;

		if( action.affects( path ) )
		{
			paths[ pZ++ ] = path;
		}
	}

	action =
		shift
		? action_select.create( )
		: undefined;

	if( pZ === 0 )
	{
		mark = pass;
	}
	else
	{
		paths = jion$pathRay.create( 'ray:init', paths );

		if( !ctrl || !this.mark )
		{
			mark = visual_mark_items.create( 'paths', paths );
		}
		else
		{
			mark =
				visual_mark_items.create(
					'paths', paths.combine( this.mark.paths )
				);
		}
	}

	root.create(
		'action', action,
		'mark', mark
	);
};


} )( );

