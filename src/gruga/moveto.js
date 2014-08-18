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
	Forms,
	Widgets;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	ideoloomHomeButton =
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
	ideoloomSandboxButton =
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
		'ideoloomHomeButton',
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
									ideoloomHomeButton.w,
								'y',
									ideoloomHomeButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									ideoloomHomeButton.w +
									ideoloomHomeButton.width,
								'y',
									ideoloomHomeButton.n +
									ideoloomHomeButton.height
							)
					),
				'text',
					'ideoloom\nhome',
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
		'ideoloomSandboxButton',
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
									ideoloomSandboxButton.w,
								'y',
									ideoloomSandboxButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									ideoloomSandboxButton.w +
									ideoloomSandboxButton.width,
								'y',
									ideoloomSandboxButton.n +
									ideoloomSandboxButton.height
							)
					),
				'text',
					'ideoloom\nsandbox',
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
