/*
| The user is scrolling a note.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// path to the item or widget being scrolled
		scrollPath : { type : 'tim.js/src/path' },

		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// position of the scrollbar on start of scrolling
		startPos : { type : 'number' },
	};
}


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	return this.scrollPath.equals( item.path );
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


} );

