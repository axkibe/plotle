/*
| The servers replies to a clients update request.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.list = [ '../change/dynamic' ];

	def.json = 'reply_update';
}


} );
