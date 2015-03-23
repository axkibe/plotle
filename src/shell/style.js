/*
| Styles.
*/


var
	shell_accent,
	shell_style;

/*
| Capsule
*/
( function( ) {
'use strict';


shell_style = { };


shell_style.styles =
{
};


/*
| Gets a style by its name.
*/
shell_style.getStyle =
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
		throw new Error( );
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

			if( style[ accent ] )
			{
				style = style[ accent ];
			}
			else
			{
				throw new Error( );
			}
	}

	if( !style )
	{
		throw new Error( );
	}

	return style;
};

} )( );
