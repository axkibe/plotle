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
Gruga.UserForm =
{
	type :
		'Layout',
	twig :
	{
		'headline' :
			Widgets.Label.create(
				'text',
					'Hello',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-120
					)
			),
		'visitor1' :
			Widgets.Label.create(
				'text',
					'You\'re currently an anonymous visitor!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-50
					)
			),
		'visitor2' :
			Widgets.Label.create(
				'text',
					'Click on "sign up" or "log in"',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.PC
			),
		'visitor3' :
			Widgets.Label.create(
				'text',
					'on the control disc to the left',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							20
					)
			),
		'visitor4' :
			Widgets.Label.create(
				'text',
					'to register as an user.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							40
					)
			),
		'greeting1' :
			Widgets.Label.create(
				'text',
					'This is your profile page!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-50
					)
			),
		'greeting2' :
			Widgets.Label.create(
				'text',
					'In future you will be able to do stuff here,',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-10
					)
			),
		'greeting3' :
			Widgets.Label.create(
				'text',
					'like for example change your password.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							10
					)
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
		'visitor1',
		'visitor2',
		'visitor3',
		'visitor4',
		'greeting1',
		'greeting2',
		'greeting3',
		'closeButton'
	]
};


} )( );
