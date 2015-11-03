/*
| Default design for the login form.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	form_login,
	gruga_genericButton,
	gruga_genericInputFacets,
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
	form_login.create(
		'twig:add',
		'headline',
			widget_label.create(
				'text', 'Log In',
				'font', shell_fontPool.get( 22, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -225,
						'y', -112
					)
			),
		'twig:add',
		'usernameLabel',
			widget_label.create(
				'text', 'username',
				'font', shell_fontPool.get( 16, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -175,
						'y', -49
					)
			),
		'twig:add',
		'passwordLabel',
			widget_label.create(
				'text', 'password',
				'font', shell_fontPool.get( 16, 'la' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -175,
						'y', -9
					)
			),
		'twig:add',
		'errorLabel',
			widget_label.create(
				'text', '',
				'font', shell_fontPool.get( 14, 'car' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', -20,
						'y', -83
					)
			),
		'twig:add',
		'userInput',
			widget_input.create(
				'facets', gruga_genericInputFacets,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', -67
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', -42
							)
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.create(
				'facets', gruga_genericInputFacets,
				'password', true,
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', -80,
								'y', -27
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', 130,
								'y', -2
							)
					)
			),
		'twig:add',
		'loginButton',
			widget_button.create(
				'facets', gruga_genericButton.facets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', loginButton.w,
								'y', loginButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', loginButton.w + loginButton.width,
								'y', loginButton.n + loginButton.height
							)
					),
				'text', 'log in',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			widget_button.create(
				'facets', gruga_genericButton.facets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape', euclid_anchor_ellipse.fullSkewNW
			)
	);


} )( );
