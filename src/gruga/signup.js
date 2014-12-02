/*
| Default design for the signup form.
*/


var
	design,
	fontPool,
	forms_signUp,
	gruga_signUp,
	widgets;

/*
| Capsule
*/
( function( ) {
'use strict';

var
	/*
	| Signup control
	*/
	signupButton =
	{
		width :
			70,
		height :
			70,
		w :
			95,
		n :
			95
	},
	/*
	| Close control
	*/
	closeButton =
	{
		width :
			50,
		height :
			50,
		w :
			180,
		n :
			105
	};


/*
| Layout
*/
gruga_signUp =
	forms_signUp.create(
		'twig:add',
		'headline',
			widgets.label.create(
				'text',
					'Sign Up',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-245,
						'y',
							-165
					)
			),
		'twig:add',
		'usernameLabel',
			widgets.label.create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-102
					)
			),
		'twig:add',
		'emailLabel',
			widgets.label.create(
				'text',
					'email',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-62
					)
			),
		'twig:add',
		'passwordLabel',
			widgets.label.create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-22
					)
			),
		'twig:add',
		'password2Label',
			widgets.label.create(
				'text',
					'repeat password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							18
					)
			),
		'twig:add',
		'newsletterLabel',
			widgets.label.create(
				'text',
					'newsletter',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							58
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
							-136
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
									-120
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-95
							)
					)
			),
		'twig:add',
		'emailInput',
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
									-80
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-55
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
									-40
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-15
							)
					)
			),
		'twig:add',
		'password2Input',
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
									0
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									25
							)
					)
			),
		'twig:add',
		'newsletterCheckBox',
			widgets.checkbox.create(
				'style',
					'checkbox',
				'checked',
					true,
				'designFrame',
					design.anchorRect.create(
						'pnw',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									-75,
								'y',
									45
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									-59,
								'y',
									60
							)
					)
			),
		'twig:add',
		'newsletter2Label',
			widgets.label.create(
				'text',
					'Updates and News',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-45,
						'y',
							57
					)
			),
		'twig:add',
		'newsletter3Label',
			widgets.label.create(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					design.anchorPoint.create(
						'anchor',
							'c',
						'x',
							-45,
						'y',
							77
					)
			),
		'twig:add',
		'signupButton',
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
									signupButton.w,
								'y',
									signupButton.n
							),
						'pse',
							design.anchorPoint.create(
								'anchor',
									'c',
								'x',
									signupButton.w +
									signupButton.width,
								'y',
									signupButton.n +
									signupButton.height
							)
					),
				'text',
					'sign up',
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
