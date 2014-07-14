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
	Mark;


/*
| Imports
*/
var
	Jion,
	Jools;


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
			'Mark',
		singleton :
			true,
		subclass :
			'Mark.Mark',
		equals :
			'primitive'
	};
}


var
	Vacant =
		Mark.Vacant;


/*
| The item's path.
*/
Jools.lazyValue(
	Vacant.prototype,
	'itemPath',
	function( )
	{
		return Jion.Path.empty;
	}
);

/*
| The widget's path.
*/
Jools.lazyValue(
	Vacant.prototype,
	'widgetPath',
	function( )
	{
		return  Jion.Path.empty;
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
