/*
| Holds information of inner or outer distances.
*/
'use strict';


tim.define( module, 'gleam_margin', ( def, gleam_margin ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		n : // north
		{
			type : 'number'
		},
		e : // east
		{
			type : 'number'
		},
		s : // south
		{
			type : 'number'
		},
		w : // west
		{
			type : 'number'
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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
