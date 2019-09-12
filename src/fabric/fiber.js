/*
| Everything of a fabric.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| This tim needs to be extended.
*/
def.abstract = true;


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// the display's device pixel ratio
		// no json thus not saved or transmitted
		devicePixelRatio : { type : [ 'undefined', 'number' ] },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },
	};
}


/*
| The key of this fiber.
*/
def.lazy.key = function( ) { return this.trace.key; };


} );
