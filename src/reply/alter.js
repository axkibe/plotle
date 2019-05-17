/*
| The servers replies to a clients alter request.
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;


if( TIM )
{
	// there aren't any attributes,
	// the answer is simply an "Okay, I got that"
	// instead of an error.

	def.json = 'reply_alter';
}


} );
