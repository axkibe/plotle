/*
| Default design for the signup form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Gruga;


Gruga =
	Gruga || { };


/*
| Imports
*/
var
	design,
	fontPool,
	Forms,
	Widgets;

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
Gruga.SignUp =
	Forms.SignUp.create(
		'twig:add',
		'headline',
			Widgets.Label.create(
				'text',
					'Sign Up',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'email',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'repeat password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'newsletter',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'',
				'font',
					fontPool.get( 14, 'car' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Input.create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-120
							),
						'pse',
							design.AnchorPoint.create(
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
			Widgets.Input.create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-80
							),
						'pse',
							design.AnchorPoint.create(
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
			Widgets.Input.create(
				'password',
					true,
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-40
							),
						'pse',
							design.AnchorPoint.create(
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
			Widgets.Input.create(
				'password',
					true,
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									0
							),
						'pse',
							design.AnchorPoint.create(
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
			Widgets.CheckBox.create(
				'style',
					'checkbox',
				'checked',
					true,
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-75,
								'y',
									45
							),
						'pse',
							design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'Updates and News',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					design.AnchorPoint.create(
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
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									signupButton.w,
								'y',
									signupButton.n
							),
						'pse',
							design.AnchorPoint.create(
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
					design.AnchorPoint.PC,
				'shape',
					design.AnchorEllipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					design.AnchorRect.create(
						'pnw',
							design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									closeButton.w,
								'y',
									closeButton.n
							),
						'pse',
							design.AnchorPoint.create(
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
					design.AnchorPoint.PC,
				'shape',
					design.AnchorEllipse.fullSkewNW
			)
	);

} )( );
