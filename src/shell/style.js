/*
| Styles.
*/


var
	euclid_border,
	euclid_borderRay,
	euclid_color,
	gradient_askew,
	gradient_colorStop,
	gradient_radial,
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
	/*
	| Standard look of a note.
	*/
	note :
	{
		normal :
		{
			fill :
				gradient_askew.create(
					'ray:append',
					gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			border :
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 1,
						'color', euclid_color.rgb( 255, 188, 87 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		},

		highlight :
		{
			border :
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 183, 15, 0.5 )
				)
		}
	},

	/*
	| Standard look of a portal.
	*/
	portal :
	{
		normal :
		{
			fill :
				gradient_radial.create(
					'ray:append',
					gradient_colorStop.create(
						'offset', 0,
						'color', euclid_color.rgba( 255, 255, 248, 0.955 )
					),
					'ray:append',
					gradient_colorStop.create(
						'offset', 1,
						'color', euclid_color.rgba( 255, 255, 160, 0.955 )
					)
				),
			border :
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 3,
						'width', 6,
						'color', euclid_color.rgb( 255, 220, 128 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		},

		highlight :
		{
			border :
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 183, 15, 0.5 )
				)
		}
	},

	/*
	| Input fields on portals.
	*/
	portalInput :
	{
		normal :
		{
			border :
				euclid_border.create(
					'color', euclid_color.rgb( 255, 219, 165 )
				)
		}
	},


	/*
	| Standard look of a label.
	*/
	label :
	{
		normal :
		{
			border :
				euclid_border.create(
					'color', euclid_color.rgba( 100, 100, 0, 0.1 )
				)
		},

		highlight :
		{
			border :
				euclid_border.create(
					'width', 3,
					'color', euclid_color.rgba( 255, 183, 15, 0.5 )
				)
		}
	},


	/*
	| Default input field style.
	*/
	input :
	{
		normal :
		{
			fill : euclid_color.white,
			border :
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 188, 87 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		},

		/*
		| Default input focused field style.
		*/
		focus :
		{
			fill : euclid_color.white,
			border :
				euclid_borderRay.create(
					'ray:append',
					euclid_border.create(
						'distance', 1,
						'width', 2,
						'color', euclid_color.rgb( 255, 99, 188 )
					),
					'ray:append',
					euclid_border.simpleBlack
				)
		}
	}
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
