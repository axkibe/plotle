/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './label';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the document (content)
		doc : { type : [ './doc', 'undefined' ] },

		// the relations fabric
		fabric : { type : '../fabric/relation' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the item
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gruga_label = require( '../gruga/label' );

const gruga_relation = require( '../gruga/relation' );

const visual_label = require( '../visual/label' );


/*
| Transforms the doc.
| FIXME this is a dirty workaround.
*/
def.transform.doc = visual_label.prototype[ '__transform_' + 'doc' ];


/*
| The item's glint.
|
| This cannot be done lazily, since
| when one of the items the relation
| points to is moved the arrows are moved
| too.
*/
def.func.glint =
	function( )
{
	const item1 = root.spaceVisual.get( this.fabric.item1key );

	const item2 = root.spaceVisual.get( this.fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape;

	if( item2 ) shape2 = item2.shape;

	const tZone = this.tZone;

	const wg =
		gleam_glint_window.create(
			'glint', this.doc.glint,
			'rect', tZone.enlarge1,
			'offset', gleam_point.zero
		);

	const arr = [ wg ];

	if( this.highlight )
	{
		const facet = gruga_label.facets.getFacet( 'highlight', true );

		arr.push( gleam_glint_paint.createFS( facet, this.tShape ) );
	}

	if( shape1 ) arr.push( this._getConnectionGlint( shape1 ) );

	if( shape2 ) arr.push( this._getArrowGlint( shape2 ) );

	return gleam_glint_list.create( 'list:init', arr );
};


/* FUTURE repair caching
def.inherit.glint =
	function(
		inherit
	)
{
	const item1 = root.spaceVisual.get( this.fabric.item1key );

	const item2 = root.spaceVisual.get( this.fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape;

	if( item2 ) shape2 = item2.shape;

	const arrShape = cache.arrShape;

	const conShape = cache.conShape;

	return(
		(
			( !conShape && !shape1 )
			|| ( conShape && conShape.equals( shape1 ) )
		)
		&& (
			( !arrShape && !shape2 )
			|| ( arrShape && arrShape.equals( shape2 ) )
		)
	);
};
*/


/*
| Returns the glint of a connection to a shape.
*/
def.func._getConnectionGlint =
	function(
		shape
	)
{
	const arrowShape =
		gleam_arrow.getArrowShape( shape, 'normal', this.shape, 'normal' )
		.transform( this.transform );

	return gleam_glint_paint.createFS( gruga_relation.facet, arrowShape );
};


/*
| Returns the glint of an arrow to a shape.
*/
def.func._getArrowGlint =
	function(
		shape
	)
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape',
				gleam_arrow.getArrowShape(
					this.shape,
					'normal',
					shape,
					'arrow'
				)
				.transform( this.transform )
		)
	);
};


} );
