/*
| A fix sized text item.
|
| Potentionally has a scrollbar.
*/
'use strict';


tim.define( module, ( def, visual_note ) => {


def.extend = './docItem';


if( TIM )
{
	def.attributes =
	{
		// access level of current user (rw or ro)
		access : { type : 'string' },

		// current action
		action : { type : [ '< ../action/types' ] },

		// the visual document (content)
		doc : { type : [ './doc', 'undefined' ] },

		// the notes fabric
		fabric : { type : '../fabric/note' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		// FIXME undefined only
		hover : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the item
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

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


const action_none = require( '../action/none' );

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

const tim_path = require( 'tim.js/src/path/path' );

const shell_settings = require( '../shell/settings' );

const visual_base_zone = require( '../visual/base/zone' );

const visual_doc = require( '../visual/doc' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_para = require( '../visual/para' );

const widget_scrollbar = require( '../widget/scrollbar' );



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

	const note = action.transientItem.fabric.create( 'zone', zone );

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
| Adjusts the doc.
*/
def.adjust.doc =
	function(
		doc
	)
{
	const path = this.path;

	const zone = this.zone( );

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
| Forwards fabric settings.
*/
def.lazy.fontsize =
	function( )
{
	return this.fabric.fontsize;
};


/*
| Returns the change for the action affecting this item.
*/
def.proto.getItemChange = visual_base_zone.getItemChange;


/*
| The item's glint.
*/
def.proto.glint = function( ) { return this._glint; };


/*
| Returns the minimum x-scale factor this item could go through.
*/
def.proto.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minSize.width / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.proto.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minSize.height / zone.height;
};


/*
| Minimum size.
*/
def.proto.minSize = gruga_note.minSize;


/*
| The note model.
*/
def.staticLazy.model =
	function( )
{
	return(
		visual_note.create(
			'access', 'rw',
			'action', action_none.create( ),
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
| Mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir
		// shift,
		// ctrl
	)
{
	if( !this.pointWithin( p ) ) return false;

	let y = this.scrollPos.y - dir * shell_settings.textWheelSpeed;

	if( y < 0 ) y = 0;

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create( 'y', y )
	);

	return true;
};


/*
| Notes use zone for positioning
*/
def.static.positioning =
def.proto.positioning =
	'zone';


/*
| Notes do not need to be resized proportionally.
*/
def.static.proportional = false;


/*
| The vertical scrollbar.
*/
def.lazy.scrollbarY =
	function( )
{
	const dHeight = this.doc.fullsize.height;

	const zone = this.zone( );

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
| Scrolls the note so the caret comes into view.
*/
def.proto.scrollMarkIntoView =
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

	const zone = this.zone( );

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
| The notes shape.
*/
def.proto.shape = function( ){ return this._shape; };


/*
| The items zone possibly altered by action.
*/
def.proto.zone = function( ) { return this._zone; };


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( this.scrollPos.x < 0 || this.scrollPos.y < 0 ) throw new Error( );
/**/	};
/**/}


/*
| The item's glint.
*/
def.lazy._glint =
	function( )
{
	const tZone = this.tZone;

	const arr =
		[
			gleam_glint_window.create(
				'glint', this._innerGlint,
				'rect', tZone.add1_5,
				'offset', gleam_point.zero
			)
		];

	if( this.highlight )
	{
		const facet = gruga_note.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFS( facet, this._tShape( ) ) );
	}

	const sbary = this.scrollbarY;

	if( sbary ) arr.push( sbary.glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The notes shape.
*/
def.lazy._shape =
	function( )
{
	const zone = this.zone( );

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
| The notes inner glint.
*/
def.lazy._innerGlint =
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
def.inherit._innerGlint =
	function(
		inherit
	)
{
	return(
		inherit.alikeIgnoringTransform( this )
		&& inherit.transform.zoom === this.transform.zoom
	);
};


/*
| The notes shape anchored at zero.
*/
def.lazy._zeroShape =
	function( )
{
	const zone = this.zone( );

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
| The items zone possibly altered by action.
*/
def.lazy._zone =
	function( )
{
	return this.action.affectZone( this.fabric.zone, this.minSize );
};


} );
