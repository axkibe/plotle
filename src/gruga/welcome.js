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

Gruga = Gruga || { };


/*
| Imports
*/
var
	design,
	fontPool,
	forms,
	widgets;


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
	forms.Welcome.create(
		'twig:add',
		'headline',
			widgets.Label.create(
				'text',
					'Welcome',
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
		'message1',
			widgets.Label.create(
				'text',
					'Your registration was successful :-)',
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
		'closeButton',
			widgets.Button.create(
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
