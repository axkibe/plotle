/*
| Default design for the non-existing-space form.
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
	// 'no' control
	noButton =
	{
		width :
			75,
		height :
			75,
		w :
			-100,
		n :
			28
	},

	// yes control
	yesButton =
	{
		width :
			75,
		height :
			75,
		w :
			25,
		n :
			28
	};


/*
| Layout
*/
Gruga.NonExistingSpace =
	Forms.NonExistingSpace.Create(
		'twig:add',
		'headline',
			Widgets.Label.Create(
				'text',
					'',
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
		'message1',
			Widgets.Label.Create(
				'text',
					'Do you want to create it?',
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
		'noButton',
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
									noButton.w,
								'y',
									noButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									noButton.w +
									noButton.width,
								'y',
									noButton.n +
									noButton.height
							)
					),
				'text',
					'No',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			),
		'twig:add',
		'yesButton',
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
									yesButton.w,
								'y',
									yesButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
								'anchor',
									'c',
								'x',
									yesButton.w +
									yesButton.width,
								'y',
									yesButton.n +
									yesButton.height
							)
					),
				'text',
					'Yes',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			)
	);

} )( );
