/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, ( def, fabric_relation ) => {


def.extend = './label';


if( TIM )
{
	def.attributes =
	{
		// the keys of the items this item affects (for ancillaries)
		affects : { type : [ 'undefined', 'tim.js/stringSet' ] },

		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the point the relation goes from
		jp1 : { type : [ 'undefined', '../gleam/point' ], json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// item the relation goes from
		item1key : { type : 'string', json : true },

		// item the relation goes to
		item2key : { type : 'string', json : true },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },

		// the point the relation goes to
		jp2 : { type : [ 'undefined', '../gleam/point' ], json : true },

		// the items zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'relation';
}


const fabric_label = tim.require( './label' );

const change_list = tim.require( '../change/list' );

const change_set = tim.require( '../change/set' );

const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_line = tim.require( '../gleam/line' );

const gruga_label = tim.require( '../gruga/label' );

const gruga_relation = tim.require( '../gruga/relation' );


/*
| The changes needed for secondary data to adapt to primary.
*/
def.proto.ancillary =
	function(
		space  // space including other items dependend upon
	)
{
	const item1 = space.get( this.item1key );

	const item2 = space.get( this.item2key );

	const jp1 = item1 && this._ancillaryJP1( item1 );

	const jp2 = item2 && this._ancillaryJP2( item2 );

	let ancillary = fabric_label.ancillary.call( this, space );

	const tjp1 = this.jp1;

	const tjp2 = this.jp2;

	if( ( tjp1 && !tjp1.equals( jp1 ) ) || ( jp1 && !jp1.equals( tjp1 ) ) )
	{
		const ch =
			change_set.create(
				'trace', this.trace.appendJP1.chopRoot,
				'prev', tjp1,
				'val', jp1
			);

		if( !ancillary ) ancillary = change_list.createWithElements( ch );
		else ancillary = ancillary.append( ch );
	}

	if( ( tjp2 && !tjp2.equals( jp2 ) ) || ( jp2 && !jp2.equals( tjp2 ) ) )
	{
		const ch =
			change_set.create(
				'trace', this.trace.appendJP2.chopRoot,
				'prev', tjp2,
				'val', jp2
			);

		if( !ancillary ) ancillary = change_list.createWithElements( ch );
		else ancillary = ancillary.append( ch );
	}

	return ancillary;
};


/*
| Calculates the jp1 point.
*/
def.proto._ancillaryJP1 =
	function(
		item
	)
{
	const shape = item.shape;

	const line = gleam_line.createConnection( shape, this.shape );

	return line.p1;
};


/*
| Calculates the to point.
*/
def.proto._ancillaryJP2 =
	function(
		item
	)
{
	const shape = item.shape;

	const line = gleam_line.createConnection( this.shape, shape );

	return line.p2;
};


/*
| The item's glint.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const wg =
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'devicePixelRatio', this.devicePixelRatio,
					'glint', this.doc.glint,
					'size', tZone.enlarge1.size,
					'tag', 'relation(' + this.trace.key + ')'
				),
			'pos', tZone.enlarge1.pos
		);

	const arr = [ wg ];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFacetShape( facet, this.tShape ) );
	}

	let j1Glint = this._getJ1Glint( );

	let j2Glint = this._getJ2Glint( );

	if( j1Glint ) arr.push( j1Glint );

	if( j2Glint ) arr.push( j2Glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Returns the glint of a connection to a shape.
*/
def.proto._getJ1Glint =
	function( )
{
	const jp1 = this.jp1;

	if( !jp1 ) return;

	const arrowShape =
		gleam_arrow.getArrowShape( jp1, 'none', this.shape, 'none', gruga_relation.arrowSize )
		.transform( this.transform );

	return gleam_glint_paint.createFacetShape( gruga_relation.facet, arrowShape );
};


/*
| Returns the glint of an arrow to a shape.
*/
def.proto._getJ2Glint =
	function( )
{
	const jp2 = this.jp2;

	if( !jp2 ) return;

	const arrowShape =
		gleam_arrow.getArrowShape( this.shape, 'none', jp2, 'arrow', gruga_relation.arrowSize )
		.transform( this.transform );

	return gleam_glint_paint.createFacetShape( gruga_relation.facet, arrowShape );
};


} );
