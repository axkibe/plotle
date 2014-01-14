/*
| A vacant mark
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
	Jools,
	Path;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
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
| Returns the items path.
*/
Jools.lazyFixate(
	Vacant.prototype,
	'itemPath',
	function( )
	{
		return Path.empty;
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
