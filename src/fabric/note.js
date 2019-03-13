/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/
'use strict';


tim.define( module, ( def, fabric_note ) => {


def.extend = '../visual/docItem';


if( TIM )
{
	def.attributes =
	{
		// access level of current user (rw or ro)
		// not used on server side
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// current action
		// FIXME remove
		//action : { type : [ 'undefined', '< ../action/types' ] },
		// XXX
		action : { type : [ 'undefined', 'protean' ] },

		// the notes document
		doc : { type : './doc', json : true },

		// the fontsize of the note
		fontsize : { type : 'number', json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// FIXME undefined only
		// no json thus not saved or transmitted
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ 'undefined', '< ../visual/mark/types' ] },

		// the path of the item
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// scroll position
		// no json thus not saved or transmitted
		scrollPos : { type : [ 'undefined', '../gleam/point' ] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },

		// the notes zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'note';

	def.alike =
	{
		alikeIgnoringTransform : { ignores : { 'transform' : true } }
	};
}


const change_grow = tim.require( '../change/grow' );

const fabric_doc = tim.require( '../fabric/doc' );

const fabric_para = tim.require( '../fabric/para' );

const gleam_font_font = tim.require( '../gleam/font/font' );

const gleam_glint_border = tim.require( '../gleam/glint/border' );

const gleam_glint_fill = tim.require( '../gleam/glint/fill' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_mask = tim.require( '../gleam/glint/mask' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_roundRect = tim.require( '../gleam/roundRect' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_note = tim.require( '../gruga/note' );

const session_uid = tim.require( '../session/uid' );

const tim_path = tim.require( 'tim.js/path' );

const shell_settings = tim.require( '../shell/settings' );

const visual_mark_caret = tim.require( '../visual/mark/caret' );

const widget_scrollbar = tim.require( '../widget/scrollbar' );

const visual_base_zone = tim.require( '../visual/base/zone', 'NOW' );

/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if(	this.scrollPos
/**/		&& ( this.scrollPos.x < 0 || this.scrollPos.y < 0 )
/**/	) throw new Error( );
/**/}
};


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

	const note = action.transientItem.create( 'zone', zone );

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'val', note,
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.setUserMark(
		visual_mark_caret.pathAt( root.spaceVisual.get( key ).doc.atRank( 0 ).textPath, 0 )
	);
};


/*
| Forwards the path to the doc.
*/
def.adjust.doc =
	function(
		doc
	)
{
	const path = doc.path || ( this.path && this.path.append( 'doc' ) );

	const zone = this.zone;

	return(
		doc.create(
			'flowWidth', zone.width - gruga_note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', gruga_note.innerMargin,
			'mark', this.mark,
			'paraSep', this.fontsize / 2,
			'path', path,
			'scrollPos', this.scrollPos,
			'transform', this.transform
		)
	);
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
def.lazy.minSize = ( ) => gruga_note.minSize;


/*
| The note model.
*/
def.staticLazy.model =
	function( )
{
	return(
		fabric_note.create(
			'access', 'rw',
			'action', action_none.create( ),
			'doc',
				fabric_doc.create(
					'twig:add', '1', fabric_para.create( 'text', '' )
				),
			'fontsize', gruga_note.defaultFontsize,
			'highlight', false,
			'scrollPos', gleam_point.zero,
			'transform', gleam_transform.normal,
			'zone', gleam_rect.zero,
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
/**/	if( para.timtype !== fabric_para ) throw new Error( );
/**/}

	const zone = this.zone;

	const imargin = this.doc.innerMargin;

	const fs = this.doc.font.size;

	const descend = fs * gleam_font_font.bottomBox;

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
| The notes shape.
*/
def.lazy._shape =
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
| The items zone possibly altered by action.
| FIXME remove.
*/
def.lazy._zone =
	function( )
{
	return this.action.affectZone( this.zone, this.minSize );
};


} );
