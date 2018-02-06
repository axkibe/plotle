/*
| The animation root is the master of all animations.
*/
'use strict';


tim.define( module, 'animation_root', ( def, animation_root ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.twig =
	[
		'animation_transform'
	];

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{
	if( this.length === 0 )
	{
		system.stopAnimation( );

		return;
	}

	system.doAnimation( );
};


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

		if( !anim.frame( time ) )
		{
			aroot = aroot.create( 'twig:remove', key );

			a--; al--;
		}
	}
};


} );
