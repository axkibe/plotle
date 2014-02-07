/*
| Default design for the login form.
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
	| Login control
	*/
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
			38
	};


/*
| Layout
*/
Gruga.LoginForm =
{
	type :
		'Layout',

	twig :
	{
		'headline' :
			Widgets.Label.create(
				'text',
					'Log In',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-225,
						'y',
							-112
					)
			),
		'usernameLabel' :
			Widgets.Label.create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-175,
						'y',
							-49
					)
			),
		'passwordLabel' :
			Widgets.Label.create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							-175,
						'y',
							-9
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
							-83
					)
			),
		'userInput' :
			Widgets.Input.create(
				'style',
					'input',
				'font',
					fontPool.get( 14, 'la' ),
				'maxlen',
					100,
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-67
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-42
							)
					)
			),
		'passwordInput' :
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
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									-80,
								'y',
									-27
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									130,
								'y',
									-2
							)
					)
			),
		'loginButton' :
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
									loginButton.w,
								'y',
									loginButton.n
							),
						'pse',
							Design.AnchorPoint.create(
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
		'passwordLabel',
		'errorLabel',
		'userInput',
		'passwordInput',
		'loginButton',
		'closeButton'
	]
};


} )( );
