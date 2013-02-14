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
var styles =
{
//	boxes :
//		theme.dash.boxes,

	checkbox :
		theme.forms.checkbox,

	checkboxHover :
		theme.forms.checkboxHover,

	checkboxFocus :
		theme.forms.checkboxFocus,

	checkboxHofoc :
		theme.forms.checkboxHofoc,

	checkboxCheck :
		theme.forms.checkboxCheck,


	button :
		theme.forms.button,

	buttonHover :
		theme.forms.buttonHover,

	buttonFocus :
		theme.forms.buttonFocus,

	buttonHofoc :
		theme.forms.buttonHofoc,

//	highlight :
//		theme.dash.highlight,


	input :
		theme.forms.input,

	inputFocus :
		theme.forms.inputFocus
};


/*
| Gets a style by its name.
*/
Widgets.getStyle =
	function( name )
{
	var style =
		styles[ name ];

	if( !style )
	{
		throw new Error( 'Invalid style name: ' + name );
	}

	return style;
};

} )( );
