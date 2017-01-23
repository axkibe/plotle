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
					require( '../action/typemap' )
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
					require( './mark/typemap' )
					.concat( [ 'undefined' ] ),
				prepare : 'visual_space.concernsMark( mark )'
			},
			ref :
			{
				comment : 'reference to this space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			transform :
			{
				comment : 'the current transform of space',
				type : 'gleam_transform'
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'gleam_size'
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
	gleam_arrow,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_point,
	gleam_rect,
	gruga_label,
	gruga_relation,
	gruga_select,
	jion,
	jion$path,
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


/*
| The path for transientItems
*/
jion.lazyStaticValue(
	visual_space,
	'transPath',
	function( )
{
	return(
		jion$path.create(
			'ray:init', [ 'spaceVisual', ':transient' ]
		)
	);
}
);


/*
| Mapping of fabric item name to visual items.
|
| FIXME freeze
*/
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
| FUTURE inherit optimizations.
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
		transform,
		twig;

	action = this.action;

	fabric = this.fabric;

	hover = this.hover;

	mark = this.mark;

	transform = this.transform;

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
				'transform', transform
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

	paths = mark.itemPaths;

	if( !paths || paths.length !== 1 ) return undefined;

	path = paths.get( 0 );

	if( path.length <= 2 ) return undefined; // FUTURE shouldn't be necessary

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
		mark;

	mark = this.mark;

	if( mark )
	{
		if( mark.itemPaths )
		{
			content = this.getRay( mark.itemPaths );
		}

		if( content )
		{
			return(
				( this._inheritFrame || visual_frame )
				.create(
					'content', content,
					'transform', this.transform
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

	return this.transform.y( focus.attentionCenter );
}
);


/*
| Return the space glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		action,
		arrow,
		frame,
		fromItem,
		fromJoint,
		gLen,
		gRay,
		r,
		s,
		toItem,
		toJoint,
		transform;

	action = this.action;

	transform = this.transform;

	gRay = [ ];

	gLen = 0;

	for( r = this.length - 1; r >= 0; r-- )
	{
		s = this.atRank( r );

		gRay[ gLen++ ] = s.glint;
	}

	frame = this.frame;

	if( frame ) gRay[ gLen++ ] = frame.glint;

	switch( action && action.reflect )
	{
		case 'action_createGeneric' :

			if( action.startPoint ) gRay[ gLen++ ] = action.transItem.glint;

			break;

		case 'action_createRelation' :

			if( action.fromItemPath )
			{
				fromItem = this.get( action.fromItemPath.get( -1 ) );

				if( action.toItemPath )
				{
					toItem = this.get( action.toItemPath.get( -1 ) );
				}

				fromJoint = fromItem._glintNormalBackground; // FIXME private

				if(
					action.toItemPath
					&& !action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toJoint = toItem._glintNormalBackground; // FIXME private
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toJoint = action.toPoint.detransform( transform );
				}

				if( toJoint )
				{
					arrow =
						gleam_arrow.create(
							'joint1', fromJoint,
							'joint2', toJoint,
							'end1', 'normal',
							'end2', 'arrow'
						);

					gRay[ gLen++ ] =
						gleam_glint_paint.create(
							'facet', gruga_relation.facet,
							'shape', arrow.shape.transform( transform )
						);
				}
			}

			break;

		case 'action_select' :

			if( action.zone )
			{
				gRay[ gLen++ ] =
					gleam_glint_paint.create(
						'facet', gruga_select.facet,
						'shape', action.zone.transform( transform )
					);
			}

			break;
	}

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);


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
		p,     // cursor point
		dir,   // wheel direction, >0 for down, <0 for up
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		item,
		r,
		rZ;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		item = this.atRank( r );

		if( item.mousewheel( p, dir, shift, ctrl ) ) return true;
	}

	root.changeSpaceTransform( dir > 0 ? 1 : -1, p );

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
prototype.pointingHover =
	function(
		p         // cursor point
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		action,
		aType,
		aZ,
		item,
		focus,
		frame,
		result;

	action = this.action;

	focus = this.focus;

	frame = this.frame;

	aType = action && action.reflect;

	switch( aType )
	{
		case 'action_createRelation' :

			if( action.relationState === 'start' )
			{
				for( a = 0, aZ = this.length; a < aZ; a++ )
				{
					item = this.atRank( a );

					if( item.tZone.within( p ) )
					{
						root.create(
							'action', action.create( 'fromItemPath', item.path )
						);

						return result_hover.create( 'cursor', 'default' );
					}
				}

				root.create(
					'action', action.create( 'fromItemPath', undefined )
				);

				return result_hover.create( 'cursor', 'default' );
			}

			break;

		case 'action_dragItems' :

			return result_hover.create( 'cursor', 'grabbing' );

		case 'action_resizeItems' :

			return result_hover.create( 'cursor', action.resizeDir + '-resize' );

		case 'action_pan' :

			if( action.startPoint )
			{
				return result_hover.create( 'cursor', 'grabbing' );
			}

			break;
	}

	if( frame && aType !== 'action_select' )
	{
		result = frame.pointingHover( p );

		if( result ) return result;
	}

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		result = item.pointingHover( p, action );

		if( result ) return result;
	}

	return(
		result_hover.create(
			'cursor', aType === 'action_select' ? 'crosshair' : 'pointer'
		)
	);
};


/*
| Starts an operation with the pointing device held down.
*/
prototype.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		access,
		aType,
		aZ,
		action,
		dp,
		focus,
		frame,
		item,
		transform;

	access = this.access;

	focus = this.focus;

	frame = this.frame;

	transform = this.transform;

	// resizing
	dp = p.detransform( transform );

	action = this.action;

	aType = action && action.reflect;

	// see if the frame was targeted
	if( access == 'rw' && frame && aType !== 'action_select' )
	{
		if( frame.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	if( aType === 'action_createGeneric' )
	{
		this._startCreateGeneric( dp );

		return;
	}

	// see if one item was targeted
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	// otherwise panning is initiated
	switch( aType )
	{
		case 'action_create' :

			root.create(
				'action',
					action.create(
						'offset', transform.offset,
						'startPoint', p
					)
			);

			return;

		case 'action_createRelation' :

			root.create(
				'action',
					action.create(
						'offset', transform.offset,
						'relationState', 'pan', // FUTURE remove pan
						'startPoint', p
					)
			);

			return;

		case 'action_select' :

			root.create(
				'action',
					action.create(
						'startPoint', dp,
						'toPoint', dp
					)
			);

			return;

		default :

			root.create(
				'action',
					action_pan.create(
						'offset', transform.offset,
						'startPoint', p
					)
			);

			return;
	}
};


/*
| A click.
*/
prototype.click =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		a,
		aZ,
		access,
		frame,
		item,
		mark;

	access = this.access;

	mark = this.mark;

	frame = this.frame;

	if( frame && frame.click( p, shift, ctrl, access ) ) return true;

	// clicked some item?
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		item = this.atRank( a );

		if( ctrl )
		{
			if( item.ctrlClick( p, shift, access, mark ) ) return true;
		}
		else
		{
			if( item.click( p, shift, access ) ) return true;
		}
	}

	// otherwise ...

	if( !ctrl ) root.create( 'mark', undefined );

	return true;
};


/*
| Stops an operation with the poiting device button held down.
*/
prototype.dragStop =
	function(
		p,     // cursor point
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
		item;

/**/if( CHECK )
/**/{
/**/	if( root.spaceVisual !== this ) throw new Error( );
/**/}

	action = this.action;

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

			paths = action.itemPaths;

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

			paths = action.itemPaths;

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
		p,     // cursor point
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

			this._moveCreate( p, shift, ctrl );

			return;

		case 'action_createGeneric' :

			this._moveCreateGeneric( p, shift, ctrl );

			return;

		case 'action_createRelation' :

			this._moveCreateRelation( p, shift, ctrl );

			return;

		case 'action_pan' :

			this._movePan( p, shift, ctrl );

			return;

		case 'action_dragItems' :

			this._moveDragItems( p, shift, ctrl );

			return;

		case 'action_resizeItems' :

			this._moveResizeItems( p, shift, ctrl );

			return;

		case 'action_scrolly' :

			this._moveScrollY( p, shift, ctrl );

			return;

		case 'action_select' :

			this._moveSelect( p, shift, ctrl );

			return;

		default : throw new Error( );
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

	if( !mark || !mark.hasCaret ) return false;

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
		mark,
		paths,
		r,
		rZ,
		pZ;

	if( ctrl )
	{
		switch( key )
		{
			case 'z' : root.doTracker.undo( ); return true;

			case 'y' : root.doTracker.redo( ); return true;

			case ',' : this._changeZoom(  1 ); return true;

			case '.' : this._changeZoom( -1 ); return true;
		}
	}

	mark = this.mark;

	if( mark && mark.hasCaret )
	{
		item = this.get( mark.caret.path.get( 2 ) );

		if( item )
		{
			item.specialKey( key, shift, ctrl );
		}

		return;
	}

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :

				// selects all items in this space

				paths = [ ];

				pZ = 0;

				for( r = 0, rZ = this.length; r < rZ; r++ )
				{
					paths[ pZ++ ] = this.atRank( r ).path;
				}

				paths = jion$pathRay.create( 'ray:init', paths );

				mark = visual_mark_items.create( 'itemPaths', paths );

				root.create( 'mark', mark );

				return true;
		}

		return true;
	}
};


/*
| Changes the zoom factor ( around center )
*/
prototype._changeZoom =
	function(
		df
	)
{
	var
		pc,
		pm,
		vs;

	vs = this.viewSize;

	pc =
		gleam_point.create(
			'x', vs.width / 2,
			'y', vs.height / 2
		);

	pm = pc.detransform( this.transform );

	root.changeSpaceTransform( df, pm );
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
		transform,
		transItem,
		zone;

	action = this.action;

	// there isn't really a creation going on?
	if( !action.startPoint ) return;

	transform = this.transform;

	dp = p.detransform( transform );

	zone = gleam_rect.createArbitrary( action.startPoint, dp );

	model = action.itemType.model;

	transItem = action.transItem;

	switch( action.itemType )
	{
		case visual_note :
		case visual_portal :

			zone = zone.ensureMinSize( model.minWidth, model.minHeight );

			transItem =
				transItem.create(
					'fabric', transItem.fabric.create( 'zone', zone ),
					'transform', transform
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
				transItem.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			pnw =
				( dp.x > action.startPoint.x )
				? zone.pnw
				: gleam_point.create(
					'x', zone.pse.x - resized.zone.width,
					'y', zone.pnw.y
				);

			transItem =
				resized.create(
					'fabric', resized.fabric.create( 'pnw', pnw ),
					'transform', transform
				);

			break;

		default : throw new Error( );
	}

	root.create(
		'action', action.create( 'transItem', transItem )
	);
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
		transform;

	action = this.action;

	transform = this.transform;

	if( action.relationState === 'pan' )
	{
		// panning while creating a relation

		pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform',
				transform.create(
					'offset', action.offset.add( pd )
				)
		);

		return;
	}

	// Looks if the action is dragging to an item
	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		if( this.atRank( r ).createRelationMove( p, action ) ) return;
	}

	root.create(
		'action',
			action.create(
				'toItemPath', undefined,
				'toPoint', p
			)
	);
};


/*
| Moves during creating.
*/
prototype._moveCreate =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		pd,
		transform;

	action = this.action;

	transform = this.transform;

	if( action.offset )
	{
		// panning while creating a relation

		pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform',
				this.transform.create(
					'offset',
						action.offset.add(
							pd.x / transform.zoom,
							pd.y / transform.zoom
						)
				)
		);
	}
};



/*
| Moves during item dragging.
*/
prototype._moveDragItems =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		startPoint,
		transform;

	action = this.action;

	startPoint = action.startPoint;

	transform = this.transform;

	root.create(
		'action',
			action.create(
				'moveBy',
					gleam_point.create(
						'x', transform.dex( p.x ) - startPoint.x,
						'y', transform.dey( p.y ) - startPoint.y
					)
			)
	);
};


/*
| Moves during item resizing.
*/
prototype._moveResizeItems =
	function(
		p         // point of stop
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
		transform;

	action = this.action;

	transform = this.transform;

	pBase = action.pBase;

	startPoint = action.startPoint;

	dx = transform.dex( p.x );

	dy = transform.dey( p.y );

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

	paths = action.itemPaths;

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
};


/*
| Moves during panning.
*/
prototype._movePan =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		pd,
		transform;

	action = this.action;

	transform = this.transform;

	pd = p.sub( action.startPoint );

	root.create(
		'spaceTransform',
			transform.create(
				'offset', action.offset.add( pd )
			)
	);
};


/*
| Moves during selecting.
*/
prototype._moveSelect =
	function(
		p         // point
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		item;

	action = this.action;

	if( action.itemPath )
	{
		item = this.get( action.itemPath.get( 2 ) );

		return item.moveSelect( p );
	}

	root.create(
		'action',
			action.create(
				'toPoint', p.detransform( this.transform )
			)
	);
};



/*
| Moves during scrolling.
*/
prototype._moveScrollY =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	var
		action,
		dy,
		item,
		sbary,
		spos;

	action = this.action;

	item = this.get( action.itemPaths.get( 0 ).get( -1 ) );

	dy = ( p.y - action.startPoint.y ) / this.transform.zoom;

	sbary = item.scrollbarY;

	spos = action.startPos + sbary.scale( dy );

	root.setPath(
		item.path.append( 'scrollPos' ),
		item.scrollPos.create( 'y', spos )
	);
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
		fabric,
		itemType,
		model,
		transItem;

	action = this.action;

	itemType = action.itemType;

	model = itemType.model;

	switch( itemType.positioning )
	{
		case 'zone' :

			fabric  =
				model.fabric.create(
					'zone',
						dp.createRectOfSize(
							model.minWidth,
							model.minHeight
						)
				);

			if( itemType === visual_portal )
			{
				fabric =
					fabric.create(
						'spaceUser', root.user.name,
						'spaceTag', 'home'
					);
			}

			transItem =
				model.create(
					'fabric', fabric,
					'path', visual_space.transPath,
					'transform', this.transform
				);

			break;

		case 'pnw/fontsize' :

			transItem =
				model.create(
					'fabric', model.fabric.create( 'pnw', dp ),
					'path', visual_space.transPath,
					'transform', this.transform
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
		p,     // point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		action;

	action = this.action;

	if( !action.startPoint ) return;

	action.itemType.createGeneric( action, p.detransform( this.transform ) );

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
		// p      // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	root.create(
		'action',
			this.action.create(
				'offset', undefined,
				'startPoint', undefined
			)
	);
};


/*
| Stops creating a relation.
*/
prototype._stopCreateRelation =
	function(
		p,      // point of stop
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
		p,      // point of stop
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

	action = action.create( 'toPoint', p.detransform( this.transform ) );

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
			mark = visual_mark_items.create( 'itemPaths', paths );
		}
		else
		{
			mark =
				visual_mark_items.create(
					'itemPaths', paths.combine( this.mark.itemPaths )
				);
		}
	}

	root.create(
		'action', action,
		'mark', mark
	);
};


} )( );

