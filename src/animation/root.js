/*
| The animation root is the master of all animations.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.twig = [ './transform' ];
}


/*:::::::::::.
:: Functions
'::::::::::::*/


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
		if( !anim.frame( time ) )
		{
			aroot = aroot.create( 'twig:remove', key );

			a--; al--;
		}
	}

	return aroot;
};


} );

