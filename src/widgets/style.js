/*
| Gets styles by a name.
*/


var
	Accent, // FIXME
	Style, // FIXME
	widgets_style,
	widgets; // FIXME

widgets = widgets || { }; // FIXME



/*
| Capsule
*/
(function( ) {
'use strict';


widgets_style = { };

/*
| Gets a style by its name.
*/
widgets.getStyle = // FIXME
widgets_style.get =
	function(
		name,
		accent
	)
{
	var
		style;

	style = Style.styles[ name ];

	if( !style )
	{
		throw new Error(
			'Invalid style name: ' + name
		);
	}

	switch( accent )
	{
		case Accent.NORMA :

			style = style.normal;

			break;

		case Accent.HOVER :

			style = style.hover;

			break;

		case Accent.FOCUS :

			style = style.focus;

			break;

		case Accent.HOFOC :

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
