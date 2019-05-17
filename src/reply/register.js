/*
| The servers replies to a succesful clients register request.
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;


if( TIM )
{
	// this hasn't any attributes, a json with the type 'reply_register'
	// simply means all went well instead of returning an error.

	def.json = 'reply_register';
}


} );
