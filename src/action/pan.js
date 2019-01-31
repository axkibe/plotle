/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// offset
		offset : { type : '../gleam/point' },
	};
}


/*
| Drag moves during panning.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		space,  // the visual space for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const pd = p.sub( this.startPoint );

	root.create(
		'spaceTransform', space.transform.create( 'offset', this.offset.add( pd ) )
	);
};


} );
