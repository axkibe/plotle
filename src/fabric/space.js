/*
| A space.
*/
'use strict';


tim.define( module, ( def, fabric_space ) => {


if( TIM )
{
	def.attributes =
	{
		// the path of the space
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// reference to this space
		ref : { type : [ 'undefined', '../ref/space' ] },

		// this space has a grid.
		hasGrid : { type : 'boolean', defaultValue : 'true' },

		// this space has grid snapping
		hasSnapping : { type : 'boolean', defaultValue : 'true' },
	};

	def.twig = [ '< ./item-types' ];

	def.json = 'space';
}


const tim_path = tim.require( 'tim.js/path' );


/*
| Forwards the path to items.
*/
def.adjust.get =
	function(
		name,
		item
	)
{
	if( !item ) return;

	if( item.path ) return item;

	return item.create( 'path', this.path.append( 'twig' ).appendNC( name ) );
};


/*
| Adjusts the path attribute to a default.
*/
def.adjust.path =
	function(
		path
	)
{
	if( path ) return path;

	return tim_path.empty.append( 'space' );
};


} );
