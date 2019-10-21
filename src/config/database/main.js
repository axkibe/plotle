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
		// url of the database
		url : { type : 'string', defaultValue : '"http://admin:PASSWORD@localhost:8834"' },

		// name of the dabase
		name : { type : 'string', defaultValue : '"plotle-22"' },

		// password file for database
		passfile : { type : 'string', defaultValue : '""' },

		// possibly runs a pouchdb-server instance
		pouchdb :
		{
			type : './pouchdb',
			defaultValue : 'require( "./pouchdb" ).create( )'
		},
	};
}


} );
