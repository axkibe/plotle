/*
| Default design for the login form.
*/


var
	euclid_point,
	euclid_rect,
	euclid_size,
	form_login,
	gruga_genericButton,
	gruga_genericInput,
	gruga_login,
	shell_fontPool,
	widget_button,
	widget_input,
	widget_label;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	// login control
	loginButton =
	{
		pnw : euclid_point.xy( 95, 28 ),
		size : euclid_size.wh( 70, 70 )
	},

	// Close control
	closeButton =
	{
		pnw : euclid_point.xy( 180, 38 ),
		size : euclid_size.wh(  50, 50 )
	};


/*
| Layout
*/
gruga_login =
	form_login.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Log In',
				'font', shell_fontPool.get( 22, 'la' ),
				'pos', euclid_point.xy( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', euclid_point.xy( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', euclid_point.xy( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos', euclid_point.xy( -20, -83 )
			),
		'twig:add',
		'userInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, -67 ),
						'pse', euclid_point.xy( 130, -42 )
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw', euclid_point.xy( -80, -27 ),
						'pse', euclid_point.xy( 130, -2 )
					)
			),
		'twig:add',
		'loginButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.pnwSize(
						loginButton.pnw,
						loginButton.size
					),
				'text', 'log in',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.pnwSize(
						closeButton.pnw,
						closeButton.size
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} )( );
