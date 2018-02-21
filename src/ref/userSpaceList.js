/*
| A reference to a dynamic list of space references belonging to a user.
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
		// the username for the list
		username : { type : 'string', json : true },
	};

	def.json = 'ref_userSpaceList';
}


} );

