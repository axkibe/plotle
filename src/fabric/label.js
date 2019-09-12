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
		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

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
const gleam_glint_pane = tim.require( '../gleam/glint/pane' );
const gleam_glint_window = tim.require( '../gleam/glint/window' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_rect = tim.require( '../gleam/rect' );
const gleam_size = tim.require( '../gleam/size' );
const gleam_transform = tim.require( '../gleam/transform' );
const gruga_label = tim.require( '../gruga/label' );
const mark_caret = tim.require( '../mark/caret' );
const session_uid = tim.require( '../session/uid' );
const trace_root = tim.require( '../trace/root' );


/*
| Position and fontsize are directly affected by actions.
*/
def.proto.actionAffects = 'posfs';


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

	const label =
		resized.create(
			'zone',
				gleam_rect.create(
					'pos', pos,
					'width', resized.ancillarySize.width,
					'height', resized.ancillarySize.height
				)
		);

	const key = session_uid.newUid( );

	const trace = trace_root.singleton.appendSpace.appendItem( key );

/**/if( CHECK )
/**/{
/**/	if( label.fontsize !== label.doc.fontsize ) throw new Error( );
/**/}

	root.alter(
		'change', change_grow.create( 'val', label, 'trace', trace.chopRoot, 'rank', 0 ),
		'mark',
			mark_caret.create(
				'offset', trace.appendDoc.appendPara( '1' ).appendText.appendOffset( 0 )
			)
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
	const trace = this.trace && this.trace.appendDoc;

	const transform = this.transform;

	return(
		( doc || this.doc ).create(
			'devicePixelRatio', this.devicePixelRatio,
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'scrollPos', gleam_point.zero,
			'transform', transform && transform.ortho,
			'trace', trace
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

	const a =
		[
			gleam_glint_window.create(
				'pane',
					gleam_glint_pane.create(
						'devicePixelRatio', this.devicePixelRatio,
						'glint', this.doc.glint,
						'size', tZone.enlarge1.size,
						'tag', 'label(' + this.trace.key + ')'
					),
				'pos', tZone.enlarge1.pos
			)
		];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		a.push( gleam_glint_paint.createFacetShape( facet, this.tShape ) );
	}

	return gleam_glint_list.create( 'list:init', a );
};


/*
| Nofication when the item lost the users mark.
*/
def.proto.markLost =
	function( )
{
	if( this.doc.isBlank )
	{
		const pl = this.trace.last;

		root.alter(
			'change',
				change_shrink.create(
					'trace', pl,
					'prev', pl.pick( root ),
					'rank', root.space.rankOf( pl.traceItem.key )
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
def.lazy.ancillarySize =
	function( )
{
	const height = this.doc.fullsize.height + 2;

	return(
		gleam_size.wh(
			Math.max( this.doc.fullsize.width + 4, height / 4 ),
			height
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

	const as = this.ancillarySize;

	const width = as.width;

	const height = as.height;

	// no ancillary changes needed
	if( width === zone.width && height === zone.height ) return;

	const c =
		change_set.create(
			'trace', this.trace.traceItem.appendZone.chopRoot,
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
				'width', model.ancillarySize.width,
				'height', model.ancillarySize.height
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
	'zone';


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
