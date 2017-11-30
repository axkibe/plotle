/*
| A reference to a dynamic list of space references belonging to a user.
*/
'use strict';


tim.define( module, 'ref_userSpaceList', ( def, ref_userSpaceList ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		username :
		{
			// the username for the list
			type : 'string',
			json : true,
		}
	};
}


} );
