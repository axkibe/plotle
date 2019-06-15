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
| Returns the list of zones of the items.
| FIXME make a set.
*/
def.lazy.zones =
	function( )
{
	const group = { };

	for( let item of this )
	{
		const key = item.path.get( 2 );

/**/	if( CHECK )
/**/	{
/**/		if( group[ key ] ) throw new Error( );
/**/	}

		group[ key ] = item.zone;
	}

	return gleam_rectGroup.create( 'group:init', group );
};


} );
