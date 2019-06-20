/*
| A set of items.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.set = [ '< ./item-types' ];
}


const gleam_rectGroup = tim.require( '../gleam/rectGroup' );


/*
| Returns the group of zones of the items.
*/
def.lazy.zones =
	function( )
{
	const group = { };

	for( let item of this )
	{
		const key = item.trace.key;

/**/	if( CHECK )
/**/	{
/**/		if( group[ key ] ) throw new Error( );
/**/	}

		group[ key ] = item.zone;
	}

	return gleam_rectGroup.create( 'group:init', group );
};


} );
