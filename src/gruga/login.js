/*
| Default design for the login form.
*/


var
	form_login,
	gleam_point,
	gleam_rect,
	gleam_size,
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
				'pos', gleam_point.xy( -225, -112 )
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', gleam_point.xy( -175, -49 )
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos', gleam_point.xy( -175, -9 )
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos', gleam_point.xy( -20, -83 )
			),
		'twig:add',
		'userInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -67 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -80, -27 ),
						'width', 210,
						'height', 25
					)
			),
		'twig:add',
		'loginButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 95, 28 ),
						gleam_size.wh( 70, 70 )
					),
				'text', 'log in',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.posSize(
						gleam_point.xy( 180, 38 ),
						gleam_size.wh( 50, 50 )
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


if( FREEZE ) Object.freeze( gruga_login );


} )( );
