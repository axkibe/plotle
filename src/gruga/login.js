/*
| Default design for the login form.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	form_login,
	gruga_genericButtonFacets,
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
					design_anchorPoint.create(
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
					design_anchorPoint.create(
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
					design_anchorPoint.create(
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
					design_anchorPoint.create(
						'anchor', 'c',
						'x', -20,
						'y', -83
					)
			),
		'twig:add',
		'userInput',
			widget_input.create(
				'style', 'input',
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', -80,
								'y', -67
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', 130,
								'y', -42
							)
					)
			),
		'twig:add',
		'passwordInput',
			widget_input.create(
				'password', true,
				'style', 'input',
				'font', shell_fontPool.get( 14, 'la' ),
				'maxlen', 100,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', -80,
								'y', -27
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', 130,
								'y', -2
							)
					)
			),
		'twig:add',
		'loginButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', loginButton.w,
								'y', loginButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', loginButton.w + loginButton.width,
								'y', loginButton.n + loginButton.height
							)
					),
				'text', 'log in',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_anchorPoint.c,
				'shape', design_anchorEllipse.fullSkewNW
			)
	);


} )( );
