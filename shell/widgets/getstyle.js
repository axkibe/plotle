/*
| Gets styles by a name.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Widgets;
Widgets =
	Widgets || { };


/*
| Imports
*/
var theme;


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
| List of tagnames.
*/
/*

TODO remove

var styles =
{
//	boxes :
//		theme.dash.boxes,

	checkbox :
		theme.forms.checkbox,

	checkboxCheck :
		theme.forms.checkboxCheck,

	genericButton :
		theme.forms.genericButton,

	createButton :
		theme.disc.createButton,

	mainButton :
		theme.disc.mainButton,

//	highlight :
//		theme.dash.highlight,

	iconNormal :
		theme.disc.iconNormal,

	iconRemove :
		theme.disc.iconRemove,

	input :
		theme.forms.input
};
*/


/*
| Gets a style by its name.
*/
Widgets.getStyle =
	function(
		name,
		accent
	)
{
	var style =
		theme.styles[ name ];

	if( !style )
	{
		throw new Error(
			'Invalid style name: ' + name
		);
	}

	var Accent =
		Widgets.Accent;

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
