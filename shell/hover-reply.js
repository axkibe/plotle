/*
| Answer of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	HoverReply;


/*
| Imports
*/
var
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}

var
	_tag =
		'HOVER-REPLY-16577377';


/*
| Constructor.
*/
HoverReply =
	function(
		tag,
		cursor,
		path,
		section
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	this.section =
		section;

	this.path =
		path;

	this.cursor =
		cursor;

	Jools.immute( this );
};


/*
| Creates a new hover object.
*/
HoverReply.create =
	function(
		// free strings
	)
{
	var
		cursor =
			null,

		inherit =
			null,

		path =
			null,

		section =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'cursor' :

				cursor =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'section' :

				section =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: '
				);
		}
	}

	if( inherit )
	{
		if( cursor === null )
		{
			cursor =
				inherit.cursor;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if( section === null )
		{
			section =
				inherit.section;
		}

		if(
			cursor === inherit.cursor
			&&
			path === inherit.path
			&&
			section == inherit.section
		)
		{
			return inherit;
		}
	}

/**/if( CHECK )
/**/{
/**/	switch( section )
/**/	{
/**/		case 'space' :
/**/		case 'forms' :
/**/		case 'disc' :
/**/
/**/			break;
/**/
/**/		default :
/**/
/**/			throw new Error(
/**/				'invalid section: ' + section
/**/			);
/**/	}
/**/}

	return (
		new HoverReply(
			_tag,
			cursor,
			path,
			section
		)
	);
};


/*
| Reflection
*/
HoverReply.prototype.reflect =
	'HoverReply';


} )( );
