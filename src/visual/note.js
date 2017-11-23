/*
| A fix sized text item.
|
| Potentionally has a scrollbar.
*/
'use strict';


// FIXME
var
	change_grow,
	fabric_doc,
	fabric_note,
	fabric_para,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_list,
	gleam_glint_mask,
	gleam_glint_paint,
	gleam_glint_window,
	gleam_point,
	gleam_rect,
	gleam_roundRect,
	gleam_transform,
	gruga_note,
	session_uid,
	shell_settings,
	visual_doc,
	visual_docItem,
	visual_item,
	visual_mark_caret,
	widget_scrollbar;


tim.define( module, 'visual_note', ( def, visual_note ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] ),
			prepare : 'visual_item.concernsAction( action, path )'
		},
		fabric :
		{
			// the notes fabric
			type : 'fabric_note'
		},
		highlight :
		{
			// the item is highlighted
			type : 'boolean'
		},
		hover :
		{
			// node currently hovered upon
			type : [ 'undefined', 'jion$path' ],
			assign : ''
		},
		mark :
		{
			// the users mark
			prepare : 'visual_item.concernsMark( mark, path )',
			type :
				require( './mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// the path of the note
			type : [ 'undefined', 'jion$path' ]
		},
		scrollPos :
		{
			// scroll position
			type : [ 'undefined', 'gleam_point' ]
			// is force defined in _init
		},
		transform :
		{
			// the current space transform
			type : 'gleam_transform'
		}
	};

	def.init = [ 'inherit' ];

	def.alike =
	{
		alikeIgnoringTransform :
		{
			ignores : { 'transform' : true }
		}
	};
}


// FIXME?
//visual_note.reflect = 'visual_note:static';

/*
| Hack to fix visual_note:static references.
*/
// FIXME?
//visual_note.equals =
//	function( o )
//{
//	return o === this;
//};


/*::::::::::::::::::::::.
:: Static (lazy) values
':::::::::::::::::::::::*/


/*
| The note model.
*/
def.staticLazy.model =
	function( )
{
	return(
		visual_note.create(
			'fabric',
				fabric_note.create(
					'fontsize', gruga_note.defaultFontsize,
					'zone', gleam_rect.zero,
					'doc',
						fabric_doc.create(
							'twig:add', '1', fabric_para.create( 'text', '' )
						)
				),
			'highlight', false,
			'transform', gleam_transform.normal
		)
	);
};


/*
| Notes do not need to be resized proportionally.
*/
def.static.proportional = false;


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| User wants to create a new note.
*/
def.static.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	const zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const note = action.transItem.fabric.create( 'zone', zone );

	const key = session_uid( );

	root.alter(
		change_grow.create(
			'val', note,
			'path',
				tim.path.empty
				.append( 'twig' )
				.append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path',
					root
					.spaceVisual.get( key )
					.doc
					.atRank( 0 ).textPath,
				'at', 0
			)
	);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
// FIXME
def.lazy.attentionCenter = NODE || visual_docItem.attentionCenter;


/*
| Forwards fabric settings.
*/
def.lazy.fontsize =
	function( )
{
	return this.fabric.fontsize;
};


/*
| The item's glint.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const arr =
		[
			gleam_glint_window.create(
				'glint', this._glint,
				'rect', tZone.add1_5,
				'offset', gleam_point.zero
			)
		];

	if( this.highlight )
	{
		const facet = gruga_note.facets.getFacet( 'highlight', true );

		arr.push(
			gleam_glint_paint.create(
				'facet', facet,
				'shape', this.tShape
			)
		);
	}

	const sbary = this.scrollbarY;

	if( sbary ) arr.push( sbary.glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The key of this item.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| The notes shape
*/
def.lazy.shape =
	function( )
{
	const zone = this.zone;

	const cr = gruga_note.cornerRadius;

	return(
		gleam_roundRect.create(
			'pos', zone.pos,
			'width', zone.width,
			'height', zone.height,
			'a', cr,
			'b', cr
		)
	);
};


/*
| The transformed shape.
*/
def.lazy.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


/*
| Zone in current transform.
*/
def.lazy.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| The items zone possibly altered by action.
*/
def.lazy.zone =
	function( )
{
	const action = this.action;

	let zone;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			const moveBy = action.moveBy;

			zone = this.fabric.zone;

			return(
				moveBy
				? zone.add( moveBy )
				: zone
			);

		case 'action_resizeItems' :

			const pBase = action.pBase;

			zone = action.startZones.get( this.path.get( 2 ) );

			if( !pBase ) return zone;

			zone = zone.baseScale( action, 0, 0 );

			if( zone.height < this.minHeight || zone.width < this.minWidth )
			{
				zone =
					zone.create(
						'width', Math.max( zone.width, this.minWidth ),
						'height', Math.max( zone.height, this.minHeight )
					);
			}

			return zone;

		default :

			return this.fabric.zone;
	}
};


/*
| The notes shape anchored at zero.
*/
def.lazy._zeroShape =
	function( )
{
	const zone = this.zone;

	const cr = gruga_note.cornerRadius;

	return(
		gleam_roundRect.create(
			'pos', gleam_point.zero,
			'width', zone.width,
			'height', zone.height,
			'a', cr,
			'b', cr
		)
	);
};


/*
| The notes inner glint.
*/
def.lazy._glint =
	function( )
{
	const doc = this.doc;

	const facet = gruga_note.facets.getFacet( );

	const tOrthoShape = this._zeroShape.transform( this.transform.ortho );

	return(
		gleam_glint_list.create(
			'list:init',
			[
				gleam_glint_fill.create( 'facet', facet, 'shape', tOrthoShape ),
				gleam_glint_mask.create( 'glint', doc.glint, 'shape', tOrthoShape ),
				gleam_glint_border.create( 'facet', facet, 'shape', tOrthoShape )
			]
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{
	const fabric = this.fabric;

	const path = this.path;

	const zone = this.zone;

	if( this.scrollPos === undefined )
	{
		this.scrollPos = gleam_point.zero;
	}
	else if( this.scrollPos.x < 0 || this.scrollPos.y < 0 )
	{
		this.scrollPos =
			this.scrollPos.create(
				'x', Math.max( 0, this.scrollPos.x ),
				'y', Math.max( 0, this.scrollPos.y )
			);
	}

	let doc =
	this.doc =
		( inherit && inherit.doc || visual_doc )
		.create(
			'clipsize', zone.size,
			'fabric', fabric.doc,
			'flowWidth', zone.width - gruga_note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', gruga_note.innerMargin,
			'mark', this.mark,
			'paraSep', this.fontsize / 2,
			'path', path && path.append( 'doc' ),
			'scrollPos', this.scrollPos,
			'transform', this.transform
		);

	const dHeight = doc.fullsize.height;

	const aperture = this.zone.height - gruga_note.innerMargin.y;

	if( dHeight > aperture )
	{
		if( this.scrollPos.y > dHeight - aperture )
		{
			this.scrollPos =
				this.scrollPos.create(
					'y', dHeight - aperture
				);

			doc =
			this.doc =
				doc.create( 'scrollPos', this.scrollPos );
		}

		this.scrollbarY =
			widget_scrollbar.create(
				'aperture', aperture,
				'max', dHeight,
				'path', path && path.append( 'scrollbarY' ),
				'pos', zone.pos.add( zone.width, gruga_note.vScrollbarDis ),
				'scrollpos', this.scrollPos.y,
				'size', zone.height - gruga_note.vScrollbarDis * 2,
				'transform', this.transform
			);
	}
	else if( this.scrollPos.y !== 0 )
	{
		this.scrollPos = this.scrollPos.create( 'y', 0 );
	}

	if(
		inherit
		&& inherit.alikeIgnoringTransform( this )
		&& inherit.transform.zoom === this.transform.zoom
		&& tim.hasLazyValueSet( inherit, '_glint' )
	)
	{
		tim.aheadValue( this, '_glint', inherit._glint );
	}
};


/*
| Reacts on clicks.
*/
// FIXME
def.func.click = NODE || visual_docItem.click;


/*
| Reacts on ctrl-clicks.
*/
// FIXME
def.func.ctrlClick = NODE || visual_item.ctrlClick;


/*
| A create relation action moves.
*/
// FIXME
def.func.createRelationMove = NODE || visual_item.createRelationMove;


/*
| A create relation action stops.
*/
// FIXME
def.func.createRelationStop = NODE || visual_item.createRelationStop;


/*
| Handles a potential dragStart event for this item.
*/
// FIXME
def.func.dragStart = NODE || visual_docItem.dragStart;


/*
| A text has been inputed.
*/
// FIXME
def.func.input = NODE || visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
// FIXME
def.func.getDragItemChange = NODE || visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
// FIXME
def.func.getResizeItemChange = NODE || visual_item.getResizeItemChangeZone;


/*
| User is hovering their pointing device over something.
*/
// FIXME
def.func.pointingHover = NODE || visual_docItem.pointingHover;


/*
| Notes use zone for positioning
*/
def.static.positioning =
def.func.positioning =
	'zone';


/*
| Nofication when the item lost the users mark.
*/
def.func.markLost = function( ){ };


/*
| Returns the mark for a point
*/
// FIXME
def.func.markForPoint = NODE || visual_docItem.markForPoint;


/*
| Minimum height.
*/
// FIXME
def.func.minHeight = NODE || gruga_note.minHeight;


/*
| Minimum width.
*/
// FIXME
def.func.minWidth = NODE || gruga_note.minWidth;


/*
| Mouse wheel turned.
*/
def.func.mousewheel =
	function(
		p,
		dir
		// shift,
		// ctrl
	)
{
	if( !this.tShape.within( p ) ) return false;

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create(
			'y',
				this.scrollPos.y
				- dir * shell_settings.textWheelSpeed
		)
	);

	return true;
};


/*
| A move during a text select on this item.
*/
// FIXME
def.func.moveSelect = NODE || visual_docItem.moveSelect;


/*
| Scrolls the note so the caret comes into view.
*/
def.func.scrollMarkIntoView =
	function( )
{
	const mark = this.mark;

	if( !mark || !mark.hasCaret ) return;

	const sy = this.scrollPos.y;

	// FUTURE, more elegant path getting
	const para = this.doc.get( mark.caret.path.get( 5 ) );

/**/if( CHECK )
/**/{
/**/	if( para.reflect !== 'visual_para' ) throw new Error( );
/**/}

	const zone = this.zone;

	const imargin = this.doc.innerMargin;

	const fs = this.doc.font.size;

	const descend = fs * shell_settings.bottombox;

	const p = para.locateOffsetPoint( mark.caret.at );

	const ppos = para.pos;

	const s = ppos.y + p.y + descend + imargin.s;

	const n = ppos.y + p.y - fs - imargin.n;

	if( n < 0 )
	{
		root.setPath(
			this.path.append( 'scrollPos' ),
			this.scrollPos.create(
				'y', sy + n
			)
		);
	}
	else if( s > zone.height )
	{
		root.setPath(
			this.path.append( 'scrollPos' ),
			this.scrollPos.create(
				'y', sy + s - zone.height
			)
		);
	}
};


/*
| Handles a special key.
*/
// FIXME
def.func.specialKey = NODE || visual_docItem.specialKey;


/*
| Returns the minimum x-scale factor this item could go through.
*/
def.func.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minWidth / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.func.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minHeight / zone.height;
};



} );
