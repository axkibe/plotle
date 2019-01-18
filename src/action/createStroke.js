/*
| A user is creating a new stroke.
*/
'use strict';


tim.define( module, ( def, action_createStroke ) => {


if( TIM )
{
	def.attributes =
	{
		// the item path or pos the stroke goes from
		from : { type : [ 'undefined', 'tim.js/src/path', '../gleam/point' ] },

		// the item path hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the item path or pos the stroke goes to
		to : { type : [ 'undefined', 'tim.js/src/path', '../gleam/point' ] },

		// the itemType of stroke ("arrow" or "line")
		itemType : { type : 'string' },
	};
}


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affectsItem =
	function(
		item
	)
{
	const path = item.path;

	return path.equals( this.from ) || path.equals( this.to ) || path.equals( this.hover );
};


/*
| Shortcut.
*/
def.staticLazy.createArrow = ( ) =>
	action_createStroke.create( 'itemType', 'arrow' );


/*
| Shortcut.
*/
def.staticLazy.createLine = ( ) =>
	action_createStroke.create( 'itemType', 'line' );




def.lazy.transientItem =
	function( )
{
	switch( this.itemType )
	{
		case arrow:

			return(
				visual_stroke.create(
};


} );
