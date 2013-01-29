/*
| Gets styles by a name.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


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

//	checkbox :
//		theme.dash.checkbox,

//	checkboxHover :
//		theme.dash.checkboxHover,

//	checkboxFocus :
//		theme.dash.checkboxFocus,

//	checkboxHofoc :
//		theme.dash.checkboxHofoc,

//	checkboxCheck :
//		theme.dash.checkboxCheck,


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
Forms.getStyle =
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
