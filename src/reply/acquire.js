/*
| The servers replies to a clients (space-)acquire request.
*/
'use strict';


tim.define( module, 'reply_acquire', ( def, reply_acquire ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		status :
		{
			// the acquire result
			type : 'string',
			json : true,
		},
		access :
		{
			// access level, readonly(r) or read-write(rw)
			type : [ 'undefined', 'string' ],
			json : true,
		},
		seq :
		{
			// sequence the space is at
			type : [ 'undefined', 'integer' ],
			json : true,
		},
		space :
		{
			// the space
			type : [ 'undefined', 'fabric_space' ],
			json : true,
		}
	};
}


} );
