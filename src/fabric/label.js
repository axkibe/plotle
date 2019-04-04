/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, fabric_label ) => {


def.extend = './docItem';


if( TIM )
{
	def.attributes =
	{
		// access level of current user (rw or ro)
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// the keys of the items this item affects (for ancillaries)
		affects : { type : [ 'undefined', 'tim.js/stringSet' ] },

		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : 'undefined' },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },

		// the items zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'label';
}


const change_grow = tim.require( '../change/grow' );

const change_list = tim.require( '../change/list' );

const change_set = tim.require( '../change/set' );

const change_shrink = tim.require( '../change/shrink' );

const fabric_doc = tim.require( './doc' );

const fabric_para = tim.require( './para' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_label = tim.require( '../gruga/label' );

const session_uid = tim.require( '../session/uid' );

const tim_path = tim.require( 'tim.js/path' );

const visual_mark_caret = tim.require( '../visual/mark/caret' );


/*
| Position and fontsize are directly affected by actions.
*/
def.proto.actionAffectsPosFs = true;


/*
| User wants to create a new label.
*/
def.static.createGeneric =
	function(
		action, // the create action
		dp      // the detransform point the createGeneric
		//      // stoped at.
	)
{
	const model = fabric_label.model;

	const zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const fs = model.doc.fontsize * zone.height / model.zone.height;

	const resized = model.create( 'fontsize', fs );

	const ti = action.transientItem;

	const pos = ti.zone.pos;

	/*
	const pos =
		( dp.x > action.startPoint.x )
		? zone.pos
		: gleam_point.xy(
			zone.pos.x + zone.width - resized.zone.width,
			zone.pos.y
		);
	*/

	const label =
		resized.create(
			'zone',
				gleam_rect.create(
					'pos', pos,
					'width', resized.ancillaryWidth,
					'height', resized.ancillaryHeight
				)
		);

	const key = session_uid.newUid( );

	const path = tim_path.empty.append( 'twig' ).append( key );

	const mpath =
		path.prepend( 'space' )
		.append( 'doc', ).append( 'twig' ).append( '1' ).append( 'text' );

/**/if( CHECK )
/**/{
/**/	if( label.fontsize !== label.doc.fontsize ) throw new Error( );
/**/}

	root.alter(
		'change',
			change_grow.create(
				'val', label,
				'path', path,
				'rank', 0
			),
		'mark', visual_mark_caret.pathAt( mpath, 0 )
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

	const transform = this.transform;

	return(
		( doc || this.doc ).create(
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', path && path.append( 'doc' ),
			'scrollPos', gleam_point.zero,
			'transform', transform && transform.ortho
		)
	);
};


/*
| The items glint.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const arr =
		[
			gleam_glint_window.create(
				'glint', this.doc.glint,
				'rect', tZone.enlarge1,
				'offset', gleam_point.zero
			)
		];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFS( facet, this.tShape ) );
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Inheritance optimization.
|
| FIXME shouldn't this be default?
*/
def.inherit.glint =
	function(
		inherit
	)
{
	return inherit.equals( this );
};



/*
| Nofication when the item lost the users mark.
*/
def.proto.markLost =
	function( )
{
	if( this.doc.isBlank )
	{
		const pc = this.path.chop;

		root.alter(
			'change',
				change_shrink.create(
					'path', pc,
					'prev', root.space.getPath( pc ),
					'rank', root.space.rankOf( pc.get( 1 ) )
				)
		);
	}
};


/*
| Returns the minimum x-scale factor this item could go through.
*/
def.proto.minScaleX = ( zone ) => 0;


/*
| Returns the minimum y-scale factor this item could go through.
*/
def.proto.minScaleY = ( zone ) => 0;


/*
| Computed height of the label.
*/
def.lazy.ancillaryHeight =
	function( )
{
	return this.doc.fullsize.height + 2;
};


/*
| Computed width of the label.
|
| FIXME change to ancillarySize
*/
def.lazy.ancillaryWidth =
	function( )
{
	return(
		Math.max(
			this.doc.fullsize.width + 4,
			this.ancillaryHeight / 4
		)
	);
};


/*
| The changes needed for secondary data to adapt to primary.
*/
def.static.ancillary =
def.proto.ancillary =
	function(
		space  // space including other items dependend upon
	)
{
	const zone = this.zone;

	const width = this.ancillaryWidth;

	const height = this.ancillaryHeight;

	// no secondary changes needed
	if( width === zone.width && height === zone.height ) return;

	const c =
		change_set.create(
			'path', this.path.chop.append( 'zone' ),
			'prev', zone,
			'val', zone.create( 'height', height, 'width', width )
		);

	return change_list.create( 'list:init', [ c ] );
};


/*
| The label model.
*/
def.staticLazy.model =
	function( )
{
	const fontsize = gruga_label.defaultFontsize;

	let model =
		fabric_label.create(
			'access', 'rw',
			'doc',
				fabric_doc.create(
					'twig:add', '1', fabric_para.create( 'text', 'Label' )
				),
			'fontsize', fontsize,
			'zone', gleam_rect.zero,
			'highlight', false,
			'transform', gleam_transform.normal
		);

	model =
		model.create(
			'zone',
			model.zone.create(
				'width', model.ancillaryWidth,
				'height', model.ancillaryHeight
			)
		);

	return model;
};


/*
| The mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		// p
		// dir
	)
{
	// the label lets wheel events pass through it.
	return false;
};


/*
| Labels use pos/fontsize for positioning
*/
def.static.positioning =
def.proto.positioning =
	'pos/fontsize';


/*
| Labels resize proportional only.
*/
def.proto.proportional = true;


/*
| Dummy since a label does not scroll.
*/
def.proto.scrollMarkIntoView = ( ) => undefined;


/*
| The item's shape.
*/
def.lazy.shape = function( ){ return this.zone.shrink1; };


} );
