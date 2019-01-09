/*
| A fix sized text item.
|
| Potentionally has a scrollbar.
*/
'use strict';


tim.define( module, ( def, self ) => {


def.extend = './docItem';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		doc : { type : [ './doc', 'undefined' ] },

		// the notes fabric
		fabric : { type : '../fabric/note' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		// FIXME undefined only
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the note
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// scroll position
		scrollPos : { type : [ '../gleam/point' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};

	def.alike =
	{
		alikeIgnoringTransform : { ignores : { 'transform' : true } }
	};
}


const action_dragItems = require( '../action/dragItems' );

const action_resizeItems = require( '../action/resizeItems' );

const change_grow = require( '../change/grow' );

const fabric_doc = require( '../fabric/doc' );

const fabric_note = require( '../fabric/note' );

const fabric_para = require( '../fabric/para' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_mask = require( '../gleam/glint/mask' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_roundRect = require( '../gleam/roundRect' );

const gleam_transform = require( '../gleam/transform' );

const gruga_note = require( '../gruga/note' );

const session_uid = require( '../session/uid' );

const tim_path = tim.import( 'tim.js', 'path' );

const shell_settings = require( '../shell/settings' );

const visual_doc = require( '../visual/doc' );

const visual_docItem = require( '../visual/docItem' );

const visual_item = require( '../visual/item' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_para = require( '../visual/para' );

const widget_scrollbar = require( '../widget/scrollbar' );


/*
| The note model.
*/
def.staticLazy.model =
	function( )
{
	return(
		self.create(
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
			'scrollPos', gleam_point.zero,
			'transform', gleam_transform.normal
		)
	);
};


/*
| Notes do not need to be resized proportionally.
*/
def.static.proportional = false;


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

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'val', note,
			'path', tim_path.empty.append( 'twig' ).append( key ), 'rank', 0
		)
	);

	root.setUserMark(
		visual_mark_caret.pathAt( root.spaceVisual.get( key ).doc.atRank( 0 ).textPath, 0 )
	);
};


/*
| Doesn't care about hovering
*/
def.static.concernsHover =
def.func.concernsHover =
	( ) => undefined;


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

		arr.push( gleam_glint_paint.createFS( facet, this.tShape ) );
	}

	const sbary = this.scrollbarY;

	if( sbary ) arr.push( sbary.glint );

	return gleam_glint_list.create( 'list:init', arr );
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
| Adapts the doc.
*/
def.transform.doc =
	function(
		doc
	)
{
	const path = this.path;

	const zone = this.zone;

	return(
		( doc || visual_doc )
		.create(
			'clipsize', zone.size,
			'fabric', this.fabric.doc,
			'flowWidth', zone.width - gruga_note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', gruga_note.innerMargin,
			'mark', this.mark,
			'paraSep', this.fontsize / 2,
			'path', path && path.append( 'doc' ),
			'scrollPos', this.scrollPos,
			'transform', this.transform
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

	switch( action && action.timtype )
	{
		case action_dragItems :

			const moveBy = action.moveBy;

			zone = this.fabric.zone;

			return(
				moveBy
				? zone.add( moveBy )
				: zone
			);

		case action_resizeItems :

			const pBase = action.pBase;

			zone = action.startZones.get( this.path.get( 2 ) );

			if( !pBase ) return zone;

			zone = zone.baseScaleAction( action, 0, 0 );

			if( zone.height < this.minHeight || zone.width < this.minWidth )
			{
				zone =
					zone.create(
						'width', Math.max( zone.width, this.minWidth ),
						'height', Math.max( zone.height, this.minHeight )
					);
			}

			return zone;

		default : return this.fabric.zone;
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


/*
| Inheritance optimization.
*/
def.inherit._glint =
	function(
		inherit
	)
{
	return(
		inherit.alikeIgnoringTransform( this )
		&& inherit.transform.zoom === this.transform.zoom
	);
};


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		if( this.scrollPos.x < 0 || this.scrollPos.y < 0 ) throw new Error( );
/**/	};
/**/}


/*
| The y scrollbar.
*/
def.lazy.scrollbarY =
	function( )
{
	const dHeight = this.doc.fullsize.height;

	const zone = this.zone;

	const aperture = zone.height - gruga_note.innerMargin.y;

	const path = this.path;

	if( dHeight <= aperture ) return;

	return(
		widget_scrollbar.create(
			'aperture', aperture,
			'max', dHeight,
			'path', path && path.append( 'scrollbarY' ),
			'pos', zone.pos.add( zone.width, gruga_note.vScrollbarDis ),
			'scrollpos', this.scrollPos.y,
			'size', zone.height - gruga_note.vScrollbarDis * 2,
			'transform', this.transform
		)
	);
};


/*
| Reacts on ctrl-clicks.
*/
def.func.ctrlClick = visual_item.ctrlClick;


/*
| A create relation action moves.
*/
def.func.createRelationMove = visual_item.createRelationMove;


/*
| A create relation action stops.
*/
def.func.createRelationStop = visual_item.createRelationStop;


/*
| Handles a potential dragStart event for this item.
*/
def.func.dragStart = visual_docItem.dragStart;


/*
| A text has been inputed.
*/
def.func.input = visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
def.func.getDragItemChange = visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
def.func.getResizeItemChange = visual_item.getResizeItemChangeZone;


/*
| User is hovering their pointing device over something.
*/
def.func.pointingHover = visual_docItem.pointingHover;


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
def.func.markForPoint = visual_docItem.markForPoint;


/*
| Minimum height.
*/
def.func.minHeight = gruga_note.minHeight;


/*
| Minimum width.
*/
def.func.minWidth = gruga_note.minWidth;


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

	let y = this.scrollPos.y - dir * shell_settings.textWheelSpeed;

	if( y < 0 ) y = 0;

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create( 'y', y )
	);

	return true;
};


/*
| A move during a text select on this item.
*/
def.func.moveSelect = visual_docItem.moveSelect;


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
/**/	if( para.timtype !== visual_para ) throw new Error( );
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
			this.scrollPos.create( 'y', sy + n )
		);
	}
	else if( s > zone.height )
	{
		root.setPath(
			this.path.append( 'scrollPos' ),
			this.scrollPos.create( 'y', sy + s - zone.height )
		);
	}
};


/*
| Handles a special key.
*/
def.func.specialKey = visual_docItem.specialKey;


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
