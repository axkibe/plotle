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
	design,
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
	Forms.User.create(
		'twig:add',
		'headline',
			Widgets.Label.create(
				'text',
					'Hello',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'You\'re currently an anonymous visitor!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'Click on "sign up" or "log in"',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.PC
			),
		'twig:add',
		'visitor3',
			Widgets.Label.create(
				'text',
					'on the control disc to the left',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'to register as an user.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'This is your profile page!',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'In future you will be able to do stuff here,',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Label.create(
				'text',
					'like for example change your password.',
				'font',
					fontPool.get( 16, 'ca' ),
				'designPos',
					design.anchorPoint.create(
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
			Widgets.Button.create(
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
