/*
| The servers replies to a clients update request.
*/
'use strict';


tim.define( module, 'reply_update', ( def, reply_update ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.list = [ 'change_dynamic' ];

	def.json = true;
}


} );
