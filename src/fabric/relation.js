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
		// access level of current user (rw or ro)
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// the keys of the items this item affects (for ancillaries)
		affects : { type : [ 'undefined', 'tim.js/stringSet' ] },

		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the point the relation goes from
		from : { type : [ 'undefined', '../gleam/point' ], json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : 'undefined' },

		// item the relation goes from
		item1key : { type : 'string', json : true },

		// item the relation goes to
		item2key : { type : 'string', json : true },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },

		// the point the relation goes to
		to : { type : [ 'undefined', '../gleam/point' ], json : true },

		// the items zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'relation';
}


const fabric_label = tim.require( './label' );

const change_list = tim.require( '../change/list' );

const change_set = tim.require( '../change/set' );

const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_connect = tim.require( '../gleam/connect' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

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

	const from = item1 && this.ancillaryFrom( item1 );

	const to = item2 && this.ancillaryTo( item2 );

	let ancillary = fabric_label.ancillary.call( this, space );

	const tfrom = this.from;

	const tto = this.to;

	if( ( tfrom && !tfrom.equals( from ) ) || ( from && !from.equals( tfrom ) ) )
	{
		const ch =
			change_set.create(
				'path', this.path.chop.append( 'from' ),
				'prev', tfrom,
				'val', from
			);

		if( !ancillary ) ancillary = change_list.one( ch );
		else ancillary = ancillary.append( ch );
	}

	if( ( tto && !tto.equals( to ) ) || ( to && !to.equals( tto ) ) )
	{
		const ch =
			change_set.create(
				'path', this.path.chop.append( 'to' ),
				'prev', tto,
				'val', to
			);

		if( !ancillary ) ancillary = change_list.one( ch );
		else ancillary = ancillary.append( ch );
	}

	return ancillary;
};


/*
| Calculates the from point.
*/
def.proto.ancillaryFrom =
	function(
		item
	)
{
	const shape = item.shape;

	const line = gleam_connect.line( shape, this.shape );

	return line.p1;
};


/*
| Calculates the to point.
*/
def.proto.ancillaryTo =
	function(
		item
	)
{
	const shape = item.shape;

	const line = gleam_connect.line( this.shape, shape );

	return line.p2;
};


/*
| The item's glint.
|
| This cannot be done lazily, since it
| depends on other items.
*/
def.lazy.glint =
	function( )
{
	const tZone = this.tZone;

	const wg =
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'glint', this.doc.glint,
					'size', tZone.enlarge1.size
				),
			'pos', tZone.enlarge1.pos
		);

	const arr = [ wg ];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFacetShape( facet, this.tShape ) );
	}

	let fromGlint = this._getConnectionGlint( );

	let toGlint = this._getArrowGlint( );

	if( fromGlint ) arr.push( fromGlint );

	if( toGlint ) arr.push( toGlint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Returns the glint of an arrow to a shape.
*/
def.proto._getArrowGlint =
	function( )
{
	const to = this.to;

	if( !to ) return;

	const arrowShape =
		gleam_arrow.getArrowShape( this.shape, 'none', to, 'arrow' )
		.transform( this.transform );

	return gleam_glint_paint.createFacetShape( gruga_relation.facet, arrowShape );
};


/*
| Returns the glint of a connection to a shape.
*/
def.proto._getConnectionGlint =
	function( )
{
	const from = this.from;

	if( !from ) return;

	const arrowShape =
		gleam_arrow.getArrowShape( from, 'none', this.shape, 'none' )
		.transform( this.transform );

	return gleam_glint_paint.createFacetShape( gruga_relation.facet, arrowShape );
};


} );
