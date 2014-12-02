/*
| Default design for the login form.
*/


var
	design,
	forms,
	fontPool,
	gruga_login,
	widgets;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	// login control
	loginButton =
	{
		width :
			70,
		height :
			70,
		w :
			95,
		n :
			28
	},
	// Close control
	closeButton =
	{
		width :
			50,
		height :
			50,
		w :
			180,
		n :
			38
	};


/*
| Layout
*/
gruga_login =
	forms.login.create(
		'twig:add',
		'headline',
			widgets.label.create(
				'text',
					'Log In',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-225,
						'y',
							-112
					)
			),
		'twig:add',
		'usernameLabel',
			widgets.label.create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-175,
						'y',
							-49
					)
			),
		'twig:add',
		'passwordLabel',
			widgets.label.create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-175,
						'y',
							-9
					)
			),
		'twig:add',
		'errorLabel',
			widgets.label.create(
				'text',
					'',
				'font',
					fontPool.get( 14, 'car' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-20,
						'y',
							-83
					)
			),
		'twig:add',
		'userInput',
			widgets.input.create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-67
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-42
							)
					)
			),
		'twig:add',
		'passwordInput',
			widgets.input.create(
				'password',
					true,
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-27
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-2
							)
					)
			),
		'twig:add',
		'loginButton',
			widgets.button.create(
				'style',
					'genericButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									loginButton.w,
								'y',
									loginButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									loginButton.w +
									loginButton.width,
								'y',
									loginButton.n +
									loginButton.height
							)
					),
				'text',
					'log in',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.PC,
				'shape',
					design.anchorEllipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			widgets.button.create(
				'style',
					'genericButton',
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									closeButton.w,
								'y',
									closeButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									closeButton.w +
									closeButton.width,
								'y',
									closeButton.n +
									closeButton.height
							)
					),
				'text',
					'close',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					design.anchorPoint.PC,
				'shape',
					design.anchorEllipse.fullSkewNW
			)
	);


} )( );
