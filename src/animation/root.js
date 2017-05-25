/*
| The animation root is the master of all animations.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'animation_root',
		attributes :
		{ },
		twig :
		[
			'animation_transform'
		],
		init : [ ]
	};
}


var
	animation_root,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = animation_root.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	var
		len;

	len = this.length;

	if( len === 0 )
	{
		system.stopAnimation( );

		return;
	}

	system.doAnimation( );
};


/*
| Handles a frame for all animations.
*/
prototype.frame =
	function(
		time
	)
{
	var
		a,
		anim,
		aroot,
		aZ,
		key;

	aroot = this;

	console.log( 'animation frame', time );

	for( a = 0, aZ = aroot.length; a < aZ; a++ )
	{
		key = aroot.getKey( a );

		anim = aroot.get( key );

		if( !anim.frame( time ) )
		{
			aroot = aroot.create( 'twig:remove', key );

			aZ--;

			a--;

			continue;
		}
	}
};


} )( );
