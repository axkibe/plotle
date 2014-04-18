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
	Forms,
	fontPool,
	Widgets;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	// Login control
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
Gruga.Login =
	Forms.Login.Create(
		'twig:add',
		'headline',
			Widgets.Label.Create(
				'text',
					'Log In',
				'font',
					fontPool.get( 22, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'username',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
			Widgets.Label.Create(
				'text',
					'password',
				'font',
					fontPool.get( 16, 'la' ),
				'designPos',
					Design.AnchorPoint.Create(
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
							-83
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
									-67
							),
						'pse',
							Design.AnchorPoint.Create(
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
									-27
							),
						'pse',
							Design.AnchorPoint.Create(
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
									loginButton.w,
								'y',
									loginButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
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
