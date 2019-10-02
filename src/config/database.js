/*
| Manages the database config.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// host of the database
		host : { type : 'string', defaultValue : '"localhost"' },

		// port of the database
		port : { type : 'integer', defaultValue : '27017' },

		// name of the dabase
		name : { type : 'string', defaultValue : '"plotle-20"' },
	};
}


} );
