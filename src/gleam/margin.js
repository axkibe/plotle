/*
| Holds information of inner or outer distances.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// north
		n : { type : 'number' },

		// east
		e : { type : 'number' },

		// south
		s : { type : 'number' },

		// west
		w : { type : 'number' },
	};
}


/*
| east + west margin = x margin
*/
def.lazy.x =
	function( )
{
	return this.e + this.w;
};


/*
| north + south margin = y margin
*/
def.lazy.y =
	function( )
{
	return this.n + this.s;
};


} );
