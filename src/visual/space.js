/*
| A space visualisation.
*/
'use strict';


tim.define( module, ( def, visual_space ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this space
		access : { type : [ 'undefined', 'string' ] },

		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// space fabric data
		fabric : { type : '../fabric/space' },

		// the alteration frame
		frame : { type : [ './frame', 'undefined' ] },

		// node currently hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover )'
		},

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// reference to this space
		ref : { type : [ 'undefined', '../ref/space' ] },

		// the current transform of space
		transform : { type : '../gleam/transform' },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig =
	[
		'undefined',
		'./label',
		'./note',
		'./portal',
		'./relation'
	];
}


const action_createGeneric = require( '../action/createGeneric' );

const action_createRelation = require( '../action/createRelation' );

const action_dragItems = require( '../action/dragItems' );

const action_pan = require( '../action/pan' );

const action_resizeItems = require( '../action/resizeItems' );

const action_select = require( '../action/select' );

const action_scrolly = require( '../action/scrolly' );

const change_list = require( '../change/list' );

const fabric_label = require( '../fabric/label' );

const fabric_note = require( '../fabric/note' );

const fabric_portal = require( '../fabric/portal' );

const fabric_relation = require( '../fabric/relation' );

const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_label = require( '../gruga/label' );

const gruga_note = require( '../gruga/note' );

const gruga_relation = require( '../gruga/relation' );

const gruga_select = require( '../gruga/select' );

const pathList = tim.import( 'tim.js', 'pathList' );

const result_hover = require( '../result/hover' );

const tim_path = tim.import( 'tim.js', 'path' );

const visual_frame = require( '../visual/frame' );

const visual_item = require( '../visual/item' );

const visual_itemList = require( '../visual/itemList' );

const visual_label = require( '../visual/label' );

const visual_mark_items = require( '../visual/mark/items' );

const visual_note = require( '../visual/note' );

const visual_portal = require( '../visual/portal' );

const visual_relation = require( '../visual/relation' );





/*::::::::::::::::::::::.
:: Static (lazy) values
':::::::::::::::::::::::*/
/*
| Path of the visual space.
*/
def.staticLazy.spacePath = () => tim_path.empty.append( 'spaceVisual' );


/*
| The path for transientItems
*/
def.staticLazy.transPath = () => tim_path.empty.append( 'spaceVisual' ).append( ':transient' );


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
| Transforms the items into visual items.
*/
def.transform.get =
	function(
		key,
		item
	)
{
	let path;

	const fabric = this.fabric.get( key );

	if( !fabric ) return;

	if( !item )
	{
		item = visual_space.visualMap.get( fabric.timtype );

/**/	if( CHECK )
/**/	{
/**/		if( !item ) throw new Error( );
/**/	}

		path = visual_space.spacePath.append( 'twig' ).appendNC( key );
	}
	else
	{
		path = item.path;
	}

	const action = visual_item.concernsAction( this.action, item );

	const mark = visual_item.concernsMark( this.mark, path );

	let highlight = !!( mark && mark.containsPath( path ) );

	if( !highlight && action && item.timtype )
	{
		highlight =
			( action.timtype === action_createRelation && action.affectsItem( item ) )
			|| ( action.timtype === action_select && action.affectsItem( item ) );
	}

	const hover = item.concernsHover( this.hover, path );

	if( item === visual_note || item.timtype === visual_note )
	{
		item =
			item.create(
				'action', action,
				'highlight', highlight,
				'hover', hover,
				'fabric', fabric,
				'mark', mark,
				'path', path,
				// FIXME why not just defaultValue?
				'scrollPos', item.scrollPos || gleam_point.zero,
				'transform', this.transform
			);
	}
	else
	{
		item =
			item.create(
				'action', action,
				'highlight', highlight,
				'hover', hover,
				'fabric', fabric,
				'mark', mark,
				'path', path,
				'transform', this.transform
			);
	}

	if( item.timtype === visual_note )
	{
		const aperture = item.zone.height - gruga_note.innerMargin.y;

		const dHeight = item.doc.fullsize.height;

		let scrollPos = item.scrollPos;

		if( dHeight < aperture )
		{
			scrollPos = scrollPos.create( 'y', 0 );

			item = item.create( 'scrollPos', scrollPos );
		}
		else if( scrollPos.y > dHeight - aperture )
		{
			scrollPos = scrollPos.create( 'y', dHeight - aperture );

			item = item.create( 'scrollPos', scrollPos );
		}
	}

	let action2 = action;
	let highlight2 = highlight;

	// FIXME take scrollPos into redo

	if( !action )
	{
		action2 = visual_item.concernsAction( this.action, item );
	}

	// checks if the highlight feature has changed on the created item
	if( !highlight && action2 && item.timtype )
	{
		switch( action2.timtype )
		{
			case action_createRelation :
			case action_select :

				highlight2 = action2.affectsItem( item );

				break;
		}
	}


	if(
		action2 !== action
		|| highlight2 !== highlight
	)
	{
		item = item.create(
			'action', action2,
			'highlight', highlight2
		);
	}

	return item;
};


/*
| Takes the ranks of the fabric.
*/
def.lazy._ranks =
	function( )
{
	return this.fabric._ranks;
};


/*
| The current alteration frame.
*/
def.transform.frame =
	function(
		frame
	)
{
	const mark = this.mark;

	if( !mark ) return;

	if( !mark.itemPaths ) return;

	const content = this.getList( mark.itemPaths );

	if( !content ) return;

	return(
		( frame || visual_frame )
		.create(
			'content', content,
			'transform', this.transform
		)
	);
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

	switch( action && action.timtype )
	{
		case action_createGeneric :

			if( action.startPoint ) arr.push( action.transItem.glint );

			break;

		case action_createRelation :

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

		case action_select :

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
/**/	if( paths.timtype !== pathList ) throw new Error( );
/**/
/**/	if( paths.length === 0 ) throw new Error( );
/**/}

	const items = [ ];

	for( let a = 0, al = paths.length; a < al; a++ )
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

	const aType = action && action.timtype;

	switch( aType )
	{
		case action_createRelation :

			if( action.relationState === 'start' )
			{
				for( let a = 0, al = this.length; a < al; a++ )
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

		case action_dragItems :

			return result_hover.create( 'cursor', 'grabbing' );

		case action_resizeItems :

			return result_hover.create( 'cursor', action.resizeDir + '-resize' );

		case action_pan :

			if( action.startPoint ) return result_hover.create( 'cursor', 'grabbing' );

			break;
	}

	if( frame && aType !== action_select )
	{
		const result = frame.pointingHover( p );

		if( result ) return result;
	}

	for( let a = 0, al = this.length; a < al; a++ )
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

	const aType = action && action.timtype;

	// see if the frame was targeted
	if( access == 'rw' && frame && aType !== action_select )
	{
		if( frame.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	if( aType === action_createGeneric )
	{
		this._startCreateGeneric( dp );

		return;
	}

	// see if one item was targeted
	for( let a = 0, al = this.length; a < al; a++ )
	{
		const item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	// otherwise panning is initiated
	switch( aType )
	{
		case action_createRelation :

			root.create(
				'action',
					action.create(
						'offset', transform.offset,
						'relationState', 'pan', // FUTURE remove pan
						'startPoint', p
					)
			);

			return;

		case action_select :

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
	for( let a = 0, al = this.length; a < al; a++ )
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

	if( !ctrl ) root.setUserMark( undefined );

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

	switch( action.timtype )
	{
		case action_createGeneric :

			this._stopCreateGeneric( p, shift, ctrl );

			break;

		case action_createRelation :

			this._stopCreateRelation( p, shift, ctrl );

			break;

		case action_dragItems :

			paths = action.itemPaths;

			for( let a = 0, al = paths.length; a < al; a++ )
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
					if( changes.timtype !== change_list )
					{
						changes = change_list.create( 'list:append', changes );
					}

					if( chi.timtype !== change_list )
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

		case action_pan :

			root.create( 'action', undefined );

			break;

		case action_resizeItems :

			paths = action.itemPaths;

			for( let a = 0, al = paths.length; a < al; a++ )
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
					if( changes.timtype !== change_list )
					{
						changes = change_list.create( 'list:append', changes );
					}

					if( chi.timtype !== change_list )
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

		case action_scrolly :

			root.create( 'action', undefined );

			break;

		case action_select :

			this._stopSelect( p, shift, ctrl );

			break;

		default :

			throw new Error( );
	}

	return true;
};


const dragMoveMap =
	new Map( [
		[
			action_createGeneric,
			function( ) { this._moveCreateGeneric.apply( this, arguments ); }
		],
		[
			action_createRelation,
			function( ) { this._moveCreateRelation.apply( this, arguments ); }
		],
		[
			action_pan,
			function( ) { this._movePan.apply( this, arguments ); }
		],
		[
			action_dragItems,
			function( ) { this._moveDragItems.apply( this, arguments ); }
		],
		[
			action_resizeItems,
			function( ) { this._moveResizeItems.apply( this, arguments ); }
		],
		[
			action_scrolly,
			function( ) { this._moveScrollY.apply( this, arguments ); }
		],
		[
			action_select,
			function( ) { this._moveSelect.apply( this, arguments ); }
		],
	] );

/**/if( FREEZE ) Object.freeze( dragMoveMap );

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

	dragMoveMap.get( action.timtype ).call( this, p, shift, ctrl );
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

		if( item ) item.specialKey( key, shift, ctrl );

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

				paths = pathList.create( 'list:init', paths );

				root.setUserMark( visual_mark_items.create( 'itemPaths', paths ) );

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

	for( let a = 0, al = paths.length; a < al; a++ )
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

	let spos = action.startPos + sbary.scale( dy );

	if( spos < 0 ) spos = 0;

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
/**/	if( action.timtype !== action_select ) throw new Error( );
/**/}

	action = action.create( 'toPoint', p.detransform( this.transform ) );

	let paths = [ ];

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const item = this.atRank( r );

		if( action.affectsItem( item ) ) paths.push( item.path );
	}

	action =
		shift
		? action_select.create( )
		: undefined;

	let mark = pass;

	if( paths.length > 0 )
	{
		paths = pathList.create( 'list:init', paths );

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

	root.create( 'action', action );

	root.setUserMark( mark );
};


} );

