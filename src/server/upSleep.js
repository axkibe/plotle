/*
| A client's update set to sleep.
*/
'use strict';


tim.define( module, 'server_upSleep', ( def, server_upSleep ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{

	def.attributes =
	{
		moments :
		{
			// the list of moment of a dynamics the client is sleeping for
			type : 'ref_momentList',
		},
		result :
		{
			// the node result handler of the clients request
			type : 'protean'
		},
		timer :
		{
			// the timer associated with this sleep
			type : 'protean',
		}
	};
}

} );
