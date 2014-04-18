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
	Design,
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
	Forms.SignUp.Create(
		'twig:add',
		'headline',
			Widgets.Label.Create(
				'text',
					'Sign Up',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'email',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'repeat password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'newsletter',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'',
				'font',
					fontPool.get( 14, 'car' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Input.Create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-120
							),
						'pse',
							Design.AnchorPoint.Create(
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
			Widgets.Input.Create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-80
							),
						'pse',
							Design.AnchorPoint.Create(
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
			Widgets.Input.Create(
				'password',
					true,
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-40
							),
						'pse',
							Design.AnchorPoint.Create(
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
			Widgets.Input.Create(
				'password',
					true,
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									0
							),
						'pse',
							Design.AnchorPoint.Create(
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
			Widgets.CheckBox.Create(
				'style',
					'checkbox',
				'checked',
					true,
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									-75,
								'y',
									45
							),
						'pse',
							Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'Updates and News',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Button.Create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									signupButton.w,
								'y',
									signupButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
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
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			),
		'twig:add',
		'closeButton',
			Widgets.Button.Create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.Create(
						'pnw',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									closeButton.w,
								'y',
									closeButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
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
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			)
	);

} )( );
