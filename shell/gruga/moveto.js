/*
| Default design for the the move-to-form.
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
	meshcraftHomeButton =
	{
		w :
			-145,
		n :
			-100,
		width :
			130,
		height :
			130
	},
	meshcraftSandboxButton =
	{
		w :
			15,
		n :
			-100,
		width :
			130,
		height :
			130
	},
	userHomeButton =
	{
		w :
			-145,
		n :
			60,
		width :
			130,
		height :
			130
	};


/*
| Layout
*/
Gruga.MoveTo =
	Forms.MoveTo.create(
		'twig:add',
		'headline',
			Widgets.Label.create(
				'text',
					'move to another space',
				'font',
					fontPool.get( 22, 'ca' ),
				'designPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							-150
					)
			),
		'twig:add',
		'meshcraftHomeButton',
			Widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									meshcraftHomeButton.w,
								'y',
									meshcraftHomeButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									meshcraftHomeButton.w +
									meshcraftHomeButton.width,
								'y',
									meshcraftHomeButton.n +
									meshcraftHomeButton.height
							)
					),
				'text',
					'meshraft\nhome',
				'textNewline',
					25,
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					Design.AnchorEllipse.fullSkewNW
			),
		'twig:add',
		'meshcraftSandboxButton',
			Widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									meshcraftSandboxButton.w,
								'y',
									meshcraftSandboxButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									meshcraftSandboxButton.w +
									meshcraftSandboxButton.width,
								'y',
									meshcraftSandboxButton.n +
									meshcraftSandboxButton.height
							)
					),
				'text',
					'meshraft\nsandbox',
				'textNewline',
					25,
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					Design.AnchorEllipse.fullSkewNW
			),
		'twig:add',
		'userHomeButton',
			Widgets.Button.create(
				'style',
					'portalButton',
				'designFrame',
					Design.AnchorRect.create(
						'pnw',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									userHomeButton.w,
								'y',
									userHomeButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									userHomeButton.w +
									userHomeButton.width,
								'y',
									userHomeButton.n +
									userHomeButton.height
							)
					),
				'text',
					'your\nhome',
				'textNewline',
					25,
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.create(
						'anchor',
							'c',
						'x',
							0,
						'y',
							0
					),
				'shape',
					Design.AnchorEllipse.fullSkewNW
			)
	);

} )( );
