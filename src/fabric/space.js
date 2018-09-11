/*
| A space.
*/
'use strict';


tim.define( module, ( def, fabric_space ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the path of the space
		path : { type : [ 'undefined', 'tim.js/path' ], transform : '_transformPath' },

		// reference to this space
		ref : { type : [ 'undefined', '../ref/space' ] },
	};

	def.twig =
	[
		'./note',
		'./label',
		'./relation',
		'./portal'
	];

	def.json = 'space';
}


const tim_path = tim.import( 'tim.js', 'path' );


/*
| Transforms items.
*/
def.func._transform =
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
| Transforms the path attribute.
*/
def.func._transformPath =
	function(
		path
	)
{
	if( path ) return path;

	return tim_path.empty.append( 'space' );
};


} );

