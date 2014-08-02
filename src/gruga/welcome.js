/*
| Default design for the welcome form.
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
Gruga.Welcome =
	Forms.Welcome.create(
		'twig:add',
		'headline',
			Widgets.Label.create(
				'text',
					'Welcome',
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
		'twig:add',
		'message1',
			Widgets.Label.create(
				'text',
					'Your registration was successful :-)',
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
		'twig:add',
		'closeButton',
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
	);


} )( );
