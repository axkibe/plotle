/*
| A client's update set to sleep.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{

	def.attributes =
	{
		// the list of moment of a dynamics the client is sleeping for
		moments : { type : '../ref/momentList' },

		// the node result handler of the clients request
		result : { type : 'protean' },

		// the timer associated with this sleep
		timer : { type : 'protean' },
	};
}


} );

