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
		// access level of current user (rw or ro)
		access : { type : 'string' },

		// current action
		action : { type : [ '< ../action/types' ] },

		// the document (content)
		doc : { type : [ '../fabric/doc', 'undefined' ] },

		// the relations fabric
		fabric : { type : '../fabric/relation' },

		// the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the item
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gruga_label = tim.require( '../gruga/label' );

const gruga_relation = tim.require( '../gruga/relation' );


/*
| The item's glint.
|
| This cannot be done lazily, since it
| depends on other items.
*/
def.proto.glint =
	function( )
{
	const fabric = this.fabric;

	const item1 = root.spaceVisual.get( fabric.item1key );

	const item2 = root.spaceVisual.get( fabric.item2key );

	let shape1, shape2;

	if( item1 ) shape1 = item1.shape( );

	if( item2 ) shape2 = item2.shape( );

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

		arr.push( gleam_glint_paint.createFS( facet, this._tShape( ) ) );
	}

	if( shape1 ) arr.push( this._getConnectionGlint( shape1 ) );

	if( shape2 ) arr.push( this._getArrowGlint( shape2 ) );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Returns the glint of an arrow to a shape.
*/
def.proto._getArrowGlint =
	function(
		shape
	)
{
	const arrowShape =
		gleam_arrow.getArrowShape( this.shape( ), 'none', shape, 'arrow' )
		.transform( this.transform );

	return gleam_glint_paint.createFS( gruga_relation.facet, arrowShape );
};


/*
| Returns the glint of a connection to a shape.
*/
def.proto._getConnectionGlint =
	function(
		shape
	)
{
	const arrowShape =
		gleam_arrow.getArrowShape( shape, 'none', this.shape( ), 'none' )
		.transform( this.transform );

	return gleam_glint_paint.createFS( gruga_relation.facet, arrowShape );
};


} );
