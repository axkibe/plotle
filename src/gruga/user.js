/*
| Default design for the space form.
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


/*
| Close control
*/
var closeButton =
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
Gruga.User =
	Forms.User.Create(
		'twig:add',
		'headline',
			Widgets.Label.Create(
				'text',
					'Hello',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-120
					)
			),
		'twig:add',
		'visitor1',
			Widgets.Label.Create(
				'text',
					'You\'re currently an anonymous visitor!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-50
					)
			),
		'twig:add',
		'visitor2',
			Widgets.Label.Create(
				'text',
					'Click on "sign up" or "log in"',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.PC
			),
		'twig:add',
		'visitor3',
			Widgets.Label.Create(
				'text',
					'on the control disc to the left',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							20
					)
			),
		'twig:add',
		'visitor4',
			Widgets.Label.Create(
				'text',
					'to register as an user.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							40
					)
			),
		'twig:add',
		'greeting1',
			Widgets.Label.Create(
				'text',
					'This is your profile page!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-50
					)
			),
		'twig:add',
		'greeting2',
			Widgets.Label.Create(
				'text',
					'In future you will be able to do stuff here,',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-10
					)
			),
		'twig:add',
		'greeting3',
			Widgets.Label.Create(
				'text',
					'like for example change your password.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.Create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							10
					)
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
