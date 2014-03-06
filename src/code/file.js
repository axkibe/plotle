/*
| A file to be generated
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Code;

Code =
	Code || { };


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
			'File',
		unit :
			'Code',
		attributes :
			{
				header :
					{
						comment :
							'header comment',
						type :
							'Array'
					}
			},
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	Code.File =
		require( '../joobj/this' )( module );
}

var
	File =
		Code.File;


/*
| Node exports
*/
if( SERVER )
{
	module.exports =
		File;
}


} )( );
