/*
| The servers replies to a clients (space-)acquire request.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the acquire result
		status : { type : 'string', json : true },

		// access level, readonly(r) or read-write(rw)
		access : { type : [ 'undefined', 'string' ], json : true },

		// sequence the space is at
		seq : { type : [ 'undefined', 'integer' ], json : true },

		// the space
		space : { type : [ 'undefined', '../fabric/space' ], json : true, }
	};

	def.json = 'reply_acquire';
}


} );
