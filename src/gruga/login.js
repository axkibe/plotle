/*
| Default design for the login form.
*/


var
	euclid_point,
	euclid_rect,
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


// FIXME create euclid stuff right away.
var
	// login control
	loginButton =
	{
		width : 70,
		height : 70,
		w : 95,
		n : 28
	},

	// Close control
	closeButton =
	{
		width : 50,
		height : 50,
		w : 180,
		n : 38
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
				'pos',
					euclid_point.create(
						'x', -225,
						'y', -112
					)
			),
		'twig:add',
		'usernameLabel',
			widget_label.abstract(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos',
					euclid_point.create(
						'x', -175,
						'y', -49
					)
			),
		'twig:add',
		'passwordLabel',
			widget_label.abstract(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'la' ),
				'pos',
					euclid_point.create(
						'x', -175,
						'y', -9
					)
			),
		'twig:add',
		'errorLabel',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'pos',
					euclid_point.create(
						'x', -20,
						'y', -83
					)
			),
		'twig:add',
		'userInput',
			widget_input.abstract(
				'facets', gruga_genericInput.facets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'area',
					euclid_rect.create(
						'pnw',
							euclid_point.create(
								'x', -80,
								'y', -67
							),
						'pse',
							euclid_point.create(
								'x', 130,
								'y', -42
							)
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
						'pnw',
							euclid_point.create(
								'x', -80,
								'y', -27
							),
						'pse',
							euclid_point.create(
								'x', 130,
								'y', -2
							)
					)
			),
		'twig:add',
		'loginButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.create(
						'pnw',
							euclid_point.create(
								'x', loginButton.w,
								'y', loginButton.n
							),
						'pse',
							euclid_point.create(
								'x', loginButton.w + loginButton.width,
								'y', loginButton.n + loginButton.height
							)
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
					euclid_rect.create(
						'pnw',
							euclid_point.create(
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							euclid_point.create(
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} )( );
