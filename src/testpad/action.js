/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def, self ) => {


if( TIM )
{
	def.attributes =
	{
		// action command
		command : { type : 'string' },

		// action affects at line
		line : { type : 'integer' },

		// action affects offset
		at : { type : [ 'undefined', 'integer' ] },

		// action affects offset (span end)
		at2 : { type : [ 'undefined', 'integer' ] },

		// action carries value
		value : { type : [ 'undefined', 'string' ] },
	};
}


} );
