/*
| A space visualisation.
*/
'use strict';


// FIXME
var
	action_createGeneric,
	action_createRelation,
	action_pan,
	action_select,
	change_list,
	fabric_label,
	fabric_note,
	fabric_portal,
	fabric_relation,
	gleam_arrow,
	gleam_glint_list,
	gleam_glint_paint,
	gleam_point,
	gleam_rect,
	gruga_label,
	gruga_relation,
	gruga_select,
	result_hover,
	visual_frame,
	visual_itemList,
	visual_label,
	visual_mark_items,
	visual_note,
	visual_portal,
	visual_relation;


tim.define( module, 'visual_space', ( def, visual_space ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		access :
		{
			// rights the current user has for this space
			type : [ 'undefined', 'string' ]
		},
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] )
		},
		fabric :
		{
			// space fabric data
			type : 'fabric_space'
		},
		hover :
		{
			// node currently hovered upon
			type : [ 'undefined', 'tim$path' ],
			prepare : 'visual_space.concernsHover( hover )'
		},
		mark :
		{
			// the users mark
			type :
				require( './mark/typemap' )
				.concat( [ 'undefined' ] ),
			prepare : 'visual_space.concernsMark( mark )'
		},
		ref :
		{
			// reference to this space
			type : [ 'undefined', 'ref_space' ]
		},
		transform :
		{
			// the current transform of space
			type : 'gleam_transform'
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'inherit' ];


	def.twig =
	[
		'visual_label',
		'visual_note',
		'visual_portal',
		'visual_relation'
	];
}




/*::::::::::::::::::::::.
:: Static (lazy) values
':::::::::::::::::::::::*/
/*
| Path of the visual space.
*/
def.staticLazy.spacePath =
	() => tim.path.empty.append( 'spaceVisual' );


/*
| The path for transientItems
*/
def.staticLazy.transPath =
	() => tim.path.empty.append( 'spaceVisual' ).append( ':transient' );


/*
| Mapping of fabric item name to visual items.
*/
def.staticLazy.visualMap =
	function( )
{
	const map = new Map( );

	map.set( fabric_label, visual_label );
	map.set( fabric_note, visual_note );
	map.set( fabric_portal, visual_portal );
	map.set( fabric_relation, visual_relation );

	if( FREEZE ) Object.freeze( map );

	return map;
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if the space concerns about a mark.
*/
def.static.concernsMark =
	function(
		mark
	)
{
	return(
		( mark && mark.containsPath( visual_space.spacePath ) )
		? mark
		: undefined
	);
};


/*
| Returns the hover path if the space concerns about a hover.
*/
def.static.concernsHover =
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
| Initializer.
|
| FUTURE inherit optimizations.
*/
def.func._init =
	function(
		inherit
	)
{
	const action = this.action;

	const fabric = this.fabric;

	const hover = this.hover;

	const mark = this.mark;

	const transform = this.transform;

	const twig = { };

	const ranks = [ ];

	let path;

	for( let a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		const k = fabric.getKey( a );

		ranks[ a ] = k;

		const item = fabric.get( k );

		let iItem = this._twig[ k ];

		if( !iItem )
		{
			iItem = visual_space.visualMap.get( item.timtype );

/**/		if( CHECK )
/**/		{
/**/			if( !iItem ) throw new Error( );
/**/		}

			path = visual_space.spacePath.append( 'twig' ).appendNC( k );
		}
		else
		{
			path = iItem.path;
		}

		const highlight =
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

	if( inherit && tim.hasLazyValueSet( inherit, 'frame' ) )
	{
		this._inheritFrame = inherit.frame;
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const focus = this.focus;

	if( !focus ) return;

	return this.transform.y( focus.attentionCenter );
};


/*
| Determines the focused item.
*/
def.lazy.focus =
	function( )
{
	const mark = this.mark;

	if( !mark ) return undefined;

	const paths = mark.itemPaths;

	if( !paths || paths.length !== 1 ) return undefined;

	const path = paths.get( 0 );

	if( path.length <= 2 ) return undefined; // FUTURE shouldn't be necessary

	return this.get( path.get( 2 ) );
};


/*
| The current alteration frame.
*/
def.lazy.frame =
	function( )
{
	const mark = this.mark;

	if( !mark ) return;

	if( !mark.itemPaths ) return;

	const content = this.getList( mark.itemPaths );

	if( !content ) return;

	return(
		( this._inheritFrame || visual_frame )
		.create(
			'content', content,
			'transform', this.transform
		)
	);
};


/*
| Return the space glint.
*/
def.lazy.glint =
	function( )
{
	const action = this.action;

	const transform = this.transform;

	const arr = [ ];

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const s = this.atRank( r );

		let g = s.glint;

		if( typeof( g ) === 'function' ) g = g.call( s );

		arr.push( g );
	}

	const frame = this.frame;

	if( frame ) arr.push( frame.glint );

	switch( action && action.reflect )
	{
		case 'action_createGeneric' :

			if( action.startPoint ) arr.push( action.transItem.glint );

			break;

		case 'action_createRelation' :

			if( action.fromItemPath )
			{
				const fromItem = this.get( action.fromItemPath.get( -1 ) );

				let toItem, toJoint;

				if( action.toItemPath )
				{
					toItem = this.get( action.toItemPath.get( -1 ) );
				}

				const fromJoint = fromItem.shape;

				if(
					action.toItemPath
					&& !action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toJoint = toItem.shape;
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toJoint = action.toPoint.detransform( transform );
				}

				if( toJoint )
				{
					const arrow =
						gleam_arrow.create(
							'joint1', fromJoint,
							'joint2', toJoint,
							'end1', 'normal',
							'end2', 'arrow'
						);

					arr.push(
						gleam_glint_paint.create(
							'facet', gruga_relation.facet,
							'shape', arrow.shape.transform( transform )
						)
					);
				}
			}

			break;

		case 'action_select' :

			if( action.zone )
			{
				arr.push(
					gleam_glint_paint.create(
						'facet', gruga_select.facet,
						'shape', action.zone.transform( transform )
					)
				);
			}

			break;
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| The disc is shown while a space is shown.
*/
def.func.showDisc = true;


/*
| Returns a list of visual items by a list of paths.
*/
def.func.getList =
	function(
		paths
	)
{
/**/if( CHECK )
/**/{
/**/	if( paths.reflect !== 'pathList' ) throw new Error( );
/**/
/**/	if( paths.length === 0 ) throw new Error( );
/**/}

	const items = [ ];

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		const path = paths.get( a );

/**/	if( CHECK )
/**/	{
/**/		if( path.get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/
/**/		if( path.get( 1 ) !== 'twig' ) throw new Error( );
/**/	}

		items.push( this.get( path.get( 2 ) ) );
	}

	return visual_itemList.create( 'list:init', items );
};


/*
| Mouse wheel.
*/
def.func.mousewheel =
	function(
		p,     // cursor point
		dir,   // wheel direction, >0 for down, <0 for up
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const item = this.atRank( r );

		if( item.mousewheel( p, dir, shift, ctrl ) ) return true;
	}

	root.changeSpaceTransformPoint( dir > 0 ? 1 : -1, p );

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
def.func.pointingHover =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const frame = this.frame;

	const aType = action && action.reflect;

	switch( aType )
	{
		case 'action_createRelation' :

			if( action.relationState === 'start' )
			{
				for( let a = 0, aZ = this.length; a < aZ; a++ )
				{
					const item = this.atRank( a );

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
		const result = frame.pointingHover( p );

		if( result ) return result;
	}

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const result = this.atRank( a ).pointingHover( p, action );

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
def.func.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const access = this.access;

	const frame = this.frame;

	const transform = this.transform;

	// resizing
	const dp = p.detransform( transform );

	const action = this.action;

	const aType = action && action.reflect;

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
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	// otherwise panning is initiated
	switch( aType )
	{
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
def.func.click =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const access = this.access;

	const mark = this.mark;

	const frame = this.frame;

	if( frame && frame.click( p, shift, ctrl, access ) ) return true;

	// clicked some item?
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const item = this.atRank( a );

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
def.func.dragStop =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{

/**/if( CHECK )
/**/{
/**/	if( root.spaceVisual !== this ) throw new Error( );
/**/}

	const action = this.action;

	if( !action ) return;

	let changes, paths;

	switch( action.reflect )
	{
		case 'action_createGeneric' :

			this._stopCreateGeneric( p, shift, ctrl );

			break;

		case 'action_createRelation' :

			this._stopCreateRelation( p, shift, ctrl );

			break;

		case 'action_dragItems' :

			paths = action.itemPaths;

			for( let a = 0, aZ = paths.length; a < aZ; a++ )
			{
				const item = root.getPath( paths.get( a ) );

				const chi = item.getDragItemChange( );

				if( !chi ) continue;

				if( !changes )
				{
					changes = chi;
				}
				else
				{
					if( changes.reflect !== 'change_list' )
					{
						changes = change_list.create( 'list:append', changes );
					}

					if( chi.reflect !== 'change_list' )
					{
						changes = changes.create( 'list:append', chi );
					}
					else
					{
						changes = changes.appendList( chi );
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

			for( let a = 0, aZ = paths.length; a < aZ; a++ )
			{
				const item = root.getPath( paths.get( a ) );

				const chi = item.getResizeItemChange( );

				if( !chi ) continue;

				if( !changes )
				{
					changes = chi;
				}
				else
				{
					if( changes.reflect !== 'change_list' )
					{
						changes = change_list.create( 'list:append', changes );
					}

					if( chi.reflect !== 'change_list' )
					{
						changes = changes.create( 'list:append', chi );
					}
					else
					{
						changes = changes.appendList( chi );
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
def.func.dragMove =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( !action ) return 'pointer';

	switch( action.reflect )
	{
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
def.func.input =
	function(
		text
	)
{
	const mark = this.mark;

	if( !mark || !mark.hasCaret ) return false;

	const path = mark.caret.path;

	const item = this.get( path.get( 2 ) );

	if( item ) item.input( text );
};


/*
| Tries to scrolls the focused item to move
| the mark into view.
*/
def.func.scrollMarkIntoView =
	function( )
{
	const focus =  this.focus;

	if( focus && focus.scrollMarkIntoView ) focus.scrollMarkIntoView( );
};


/*
| User pressed a special key.
*/
def.func.specialKey =
	function(
		key,   // key being pressed
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	if( ctrl )
	{
		switch( key )
		{
			case 'z' : root.doTracker.undo( ); return true;

			case 'y' : root.doTracker.redo( ); return true;

			case ',' :

				root.changeSpaceTransformCenter( 1 );

				return true;

			case '.' :

				root.changeSpaceTransformCenter( -1 );

				return true;
		}
	}

	const mark = this.mark;

	if( mark && mark.hasCaret )
	{
		const item = this.get( mark.caret.path.get( 2 ) );

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

				let paths = [ ];

				for( let r = 0, rZ = this.length; r < rZ; r++ )
				{
					paths.push( this.atRank( r ).path );
				}

				paths = tim.pathList.create( 'list:init', paths );

				root.create( 'mark', visual_mark_items.create( 'itemPaths', paths ) );

				return true;
		}

		return true;
	}
};


/*
| Moves during creating a generic item.
*/
def.func._moveCreateGeneric =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	// there isn't really a creation going on?
	if( !action.startPoint ) return;

	const transform = this.transform;

	const dp = p.detransform( transform );

	let zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const model = action.itemType.model;

	let transItem = action.transItem;

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

			const fs =
				Math.max(
					model.doc.fontsize
					* zone.height
					/ model.zone.height,
					gruga_label.minSize
				);

			const resized =
				transItem.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			const pos =
				( dp.x > action.startPoint.x )
				? zone.pos
				: gleam_point.create(
					'x', zone.pos.x + zone.width - resized.zone.width,
					'y', zone.pos.y
				);

			transItem =
				resized.create(
					'fabric', resized.fabric.create( 'pos', pos ),
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
def.func._moveCreateRelation =
	function(
		p         // point, viewbased point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	if( action.relationState === 'pan' )
	{
		// panning while creating a relation

		const pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform',
				transform.create(
					'offset', action.offset.add( pd )
				)
		);

		return;
	}

	// Looks if the action is dragging to an item
	for( let r = 0, rZ = this.length; r < rZ; r++ )
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
def.func._moveCreate =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	if( action.offset )
	{
		// panning while creating a relation

		const pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform', transform.create( 'offset', action.offset.add( pd ) )
		);
	}
};


/*
| Moves during item dragging.
*/
def.func._moveDragItems =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const startPoint = action.startPoint;

	const transform = this.transform;

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
def.func._moveResizeItems =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	const pBase = action.pBase;

	const startPoint = action.startPoint;

	const dx = transform.dex( p.x );

	const dy = transform.dey( p.y );

	let scaleX, scaleY;

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

	const paths = action.itemPaths;

	const startZones = action.startZones;

	for( let a = 0, aZ = paths.length; a < aZ; a++ )
	{
		const path = paths.get( a );

		const key = path.get( 2 );

		const item = this.get( path.get( 2 ) );

		const startZone = startZones.get( key );

		let min = item.minScaleX( startZone );

		if( scaleX < min ) scaleX = min;

		min = item.minScaleY( startZone );

		if( scaleY < min ) scaleY = min;
	}

	if( action.proportional )
	{
		scaleX = scaleY = Math.max( scaleX, scaleY );
	}


	root.create(
		'action', action.create( 'scaleX', scaleX, 'scaleY', scaleY )
	);
};


/*
| Moves during panning.
*/
def.func._movePan =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	const pd = p.sub( action.startPoint );

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
def.func._moveSelect =
	function(
		p         // point
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( action.itemPath )
	{
		const item = this.get( action.itemPath.get( 2 ) );

		return item.moveSelect( p );
	}

	root.create(
		'action', action.create( 'toPoint', p.detransform( this.transform ) )
	);
};


/*
| Moves during scrolling.
*/
def.func._moveScrollY =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const item = this.get( action.scrollPath.get( -1 ) );

	const dy = ( p.y - action.startPoint.y ) / this.transform.zoom;

	const sbary = item.scrollbarY;

	const spos = action.startPos + sbary.scale( dy );

	root.setPath(
		item.path.append( 'scrollPos' ),
		item.scrollPos.create( 'y', spos )
	);
};


/*
| Starts creating a generic item.
*/
def.func._startCreateGeneric =
	function(
		dp   // depoint, non-viewbased point of start
	)
{
	const action = this.action;

	const itemType = action.itemType;

	const model = itemType.model;

	let transItem;

	switch( itemType.positioning )
	{
		case 'zone' :

			let fabric  =
				model.fabric.create(
					'zone',
						gleam_rect.create(
							'pos', dp,
							'width', model.minWidth,
							'height', model.minHeight
						)
				);

			if( itemType === visual_portal )
			{
				fabric =
					fabric.create(
						'spaceUser', root.userCreds.name,
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

		case 'pos/fontsize' :

			transItem =
				model.create(
					'fabric', model.fabric.create( 'pos', dp ),
					'path', visual_space.transPath,
					'transform', this.transform
				);

			break;

		default : throw new Error( );

	}

	root.create(
		'action', action.create( 'startPoint', dp, 'transItem', transItem )
	);
};


/*
| Stops creating a generic item.
*/
def.func._stopCreateGeneric =
	function(
		p,     // point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( !action.startPoint ) return;

	action.itemType.createGeneric( action, p.detransform( this.transform ) );

	root.create(
		'action',
			ctrl
			? action_createGeneric.create( 'itemType', action.itemType )
			: undefined
	);
};


/*
| Stops creating.
*/
def.func._stopCreate =
	function(
		// p      // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	root.create(
		'action', this.action.create( 'offset', undefined, 'startPoint', undefined )
	);
};


/*
| Stops creating a relation.
*/
def.func._stopCreateRelation =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	switch( action.relationState )
	{
		case 'hadSelect' :

			if( action.toItemPath )
			{
				const item = this.get( action.toItemPath.get( -1 ) );

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
def.func._stopSelect =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	let action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.reflect !== 'action_select' ) throw new Error( );
/**/}

	action = action.create( 'toPoint', p.detransform( this.transform ) );

	let paths = [ ];

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const item = this.atRank( r );

		const path = item.path;

		if( action.affects( path ) ) paths.push( path );
	}

	action =
		shift
		? action_select.create( )
		: undefined;

	let mark = pass;

	if( paths.length > 0 )
	{
		paths = tim.pathList.create( 'list:init', paths );

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


} );

