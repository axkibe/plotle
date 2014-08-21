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
			'Vacant',
		unit :
			'marks',
		singleton :
			true,
		equals :
			'primitive'
	};
}


var
	Vacant =

Vacant = marks.Vacant;


/*
| The item's path.
*/
jools.lazyValue(
	Vacant.prototype,
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
	Vacant.prototype,
	'widgetPath',
	function( )
	{
		return  jion.path.empty;
	}
);

/*
| The content the mark puts into the clipboard.
*/
Vacant.prototype.clipboard =
	'';

/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Vacant.prototype.containsPath =
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
