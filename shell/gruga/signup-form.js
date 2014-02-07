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
Gruga.SignUpForm =
{
	type :
		'Layout',
	twig :
	{
		'headline' :
			Widgets.Label.create(
				'text',
					'Sign Up',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-245,
						'y',
							-165
					)
			),
		'usernameLabel' :
			Widgets.Label.create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-102
					)
			),
		'emailLabel' :
			Widgets.Label.create(
				'text',
					'email',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-62
					)
			),
		'passwordLabel' :
			Widgets.Label.create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							-22
					)
			),
		'password2Label' :
			Widgets.Label.create(
				'text',
					'repeat password',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							18
					)
			),
		'newsletterLabel' :
			Widgets.Label.create(
				'text',
					'newsletter',
				'font',
					fontPool.get( 16, 'ra' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-98,
						'y',
							58
					)
			),
		'errorLabel' :
			Widgets.Label.create(
				'text',
					'',
				'font',
					fontPool.get( 14, 'car' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-20,
						'y',
							-136
					)
			),
		'userInput' :
		{
			type :
				'InputWidget',
			password :
				false,
			style :
				'input',
			font :
				fontPool.get( 14, 'la' ),
			maxlen :
				100,
			designFrame  :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-80,
							'y',
								-120
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								130,
							'y',
								-95
						)
				)
		},
		'emailInput' :
		{
			type :
				'InputWidget',
			password :
				false,
			style :
				'input',
			font :
				fontPool.get( 14, 'la' ),
			maxlen :
				100,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-80,
							'y',
								-80
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								130,
							'y',
								-55
						)
				)
		},
		'passwordInput' :
		{
			type :
				'InputWidget',
			password :
				true,
			style :
				'input',
			font :
				fontPool.get( 14, 'la' ),
			maxlen :
				100,
			designFrame  :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-80,
							'y',
								-40
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								130,
							'y',
								-15
						)
				)
		},
		'password2Input' :
		{
			type :
				'InputWidget',
			password :
				true,
			style :
				'input',
			font :
				fontPool.get( 14, 'la' ),
			maxlen :
				100,
			designFrame  :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-80,
							'y',
								0
						),
					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								130,
							'y',
								25
						)
				)
		},
		'newsletterCheckBox' :
		{
			type :
				'CheckBoxWidget',
			style :
				'checkbox',
			checked :
				true,
			designFrame :
				Design.AnchorRect.create(
					'pnw',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-75,
							'y',
								45
						),

					'pse',
						Design.AnchorPoint.create(
							'anchor',
								'c',
							'x',
								-59,
							'y',
								60
						)
				)
		},
		'newsletter2Label' :
			Widgets.Label.create(
				'text',
					'Updates and News',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-45,
						'y',
							57
					)
			),
		'newsletter3Label' :
			Widgets.Label.create(
				'text',
					'Never going to be more than an email a month. For sure!',
				'font',
					fontPool.get( 12, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-45,
						'y',
							77
					)
			),
		'signupButton' :
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									signupButton.w,
								'y',
									signupButton.n
							),
						'pse',
							Design.AnchorPoint.create(
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
		'closeButton' :
			Widgets.Button.create(
				'style',
					'genericButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									closeButton.w,
								'y',
									closeButton.n
							),
						'pse',
							Design.AnchorPoint.create(
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
	},

	ranks :
	[
		'headline',
		'usernameLabel',
		'emailLabel',
		'passwordLabel',
		'password2Label',
		'newsletterLabel',
		'errorLabel',
		'userInput',
		'emailInput',
		'passwordInput',
		'password2Input',
		'newsletterCheckBox',
		'newsletter2Label',
		'newsletter3Label',
		'signupButton',
		'closeButton'
	]
};


} )( );
