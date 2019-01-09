/*
| The animation root is the master of all animations.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.twig = [ './transform' ];
}


/*
| Handles a frame for all animations.
*/
def.func.frame =
	function(
		time
	)
{
	let aroot = this;

	for( let a = 0, al = aroot.length; a < al; a++ )
	{
		const key = aroot.getKey( a );

		const anim = aroot.get( key );

		// this animation is finished
		anim.frame( time );
	}
};


} );
