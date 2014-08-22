/*
| A vacant mark.
|
| FUTURE replace by null.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var
	marks;


/*
| Imports
*/
var
	jion,
	jools;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'vacant',
		unit :
			'marks',
		singleton :
			true,
		equals :
			'primitive'
	};
}


var
	vacant;

vacant = marks.vacant;


/*
| The item's path.
*/
jools.lazyValue(
	vacant.prototype,
	'itemPath',
	function( )
	{
		return jion.path.empty;
	}
);

/*
| The widget's path.
*/
jools.lazyValue(
	vacant.prototype,
	'widgetPath',
	function( )
	{
		return  jion.path.empty;
	}
);

/*
| The content the mark puts into the clipboard.
*/
vacant.prototype.clipboard = '';

/*
| Returns true if an entity of this mark
| contains 'path'.
*/
vacant.prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid empty path'
/**/		);
/**/	}
/**/}

	return false;
};


} )( );
