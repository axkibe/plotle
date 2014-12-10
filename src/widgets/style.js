/*
| Gets styles by a name.
*/


var
	shell_accent,
	shell_style,
	widgets_style;


/*
| Capsule
*/
(function( ) {
'use strict';


widgets_style = { };

/*
| Gets a style by its name.
*/
widgets_style.get =
	function(
		name,
		accent
	)
{
	var
		style;

	style = shell_style.styles[ name ];

	if( !style )
	{
		throw new Error(
			'Invalid style name: ' + name
		);
	}

	switch( accent )
	{
		case shell_accent.NORMA :

			style = style.normal;

			break;

		case shell_accent.HOVER :

			style = style.hover;

			break;

		case shell_accent.FOCUS :

			style = style.focus;

			break;

		case shell_accent.HOFOC :

			style = style.hofoc;

			break;

		default :

			throw new Error( );
	}

	if( !style )
	{
		throw new Error( );
	}

	return style;
};

} )( );
