/*
| Gets styles by a name.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Accent,
	Style;


/*
| Capsule
*/
(function( ) {
'use strict';
if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Gets a style by its name.
*/
Widgets.getStyle =
	function(
		name,
		accent
	)
{
	var
		style =
			Style.styles[ name ];

	if( !style )
	{
		throw new Error(
			'Invalid style name: ' + name
		);
	}

	switch( accent )
	{
		case Accent.NORMA :

			style =
				style.normal;

			break;

		case Accent.HOVER :

			style =
				style.hover;

			break;

		case Accent.FOCUS :

			style =
				style.focus;

			break;

		case Accent.HOFOC :

			style =
				style.hofoc;

			break;

		default :

			throw new Error(
				'Invalid accent: ' + accent
			);
	}

	if( !style )
	{
		throw new Error(
			'Style ' +
			name +
			' does not have requested accent: ' +
			accent
		);
	}

	return style;
};

} )( );
