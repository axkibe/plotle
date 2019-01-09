/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.attributes =
	{
		command :
		{
			// action command
			type : 'string'
		},
		line :
		{
			// action affects at line
			type : 'integer'
		},
		at :
		{
			// action affects offset
			type : [ 'undefined', 'integer' ]
		},
		at2 :
		{
			// action affects offset (span end)
			type : [ 'undefined', 'integer' ]
		},
		value :
		{
			// action carries value
			type : [ 'undefined', 'string' ]
		}
	};
}


} );
