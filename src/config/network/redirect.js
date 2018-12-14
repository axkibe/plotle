/*
| The redirect server.
| This is done to redirect http to https requests.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// http or "" (meaning no redirect server)
		protocol : { type : 'string', defaultValue : '""' },

		// port to listen on
		port : { type : 'integer', defaultValue : '80' },

		// where to redirect them to
		destination : { type : 'string', defaultValue : '"https://"' },
	};
}


} );
