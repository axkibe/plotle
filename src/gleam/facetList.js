/*
| A list of facets.
|
| Display prioritiy is from last to first ( actually zeroth ).
*/
'use strict';


tim.define( module, ( def, self ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.list = [ './facet' ];
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns the facet with highest index matching
| the specification in arguments given by
|
| 'name', value pairs
*/
def.func.getFacet =
	function(
		// ...
	)
{
	const aZ = arguments.length;

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const f = this.get( r );

		let matches = 0;

		for( let a = 0; a < aZ; a += 2 )
		{
			if( f.get( arguments[ a ] ) === arguments[ a + 1 ] )
			{
				matches++;
			}
		}

		if( matches === f.size ) return f;
	}
};


} );
