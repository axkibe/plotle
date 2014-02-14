/*
| Default design for no-access-to-space form.
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
	| Close control
	*/
	okButton =
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
Gruga.NoAccessToSpace =
	Forms.NoAccessToSpace.create(
		'twig:add',
		'headline',
			Widgets.Label.create(
				'text',
					'',
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
					'Sorry, you cannot port to this space or create it.',
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
		'okButton',
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
									okButton.w,
								'y',
									okButton.n
							),
						'pse',
							Design.AnchorPoint.create(
								'anchor',
									'c',
								'x',
									okButton.w +
									okButton.width,
								'y',
									okButton.n +
									okButton.height
							)
					),
				'text',
					'ok',
				'font',
					fontPool.get( 14, 'cm' ),
				'textDesignPos',
					Design.AnchorPoint.PC,
				'shape',
					Design.AnchorEllipse.fullSkewNW
			)
	);


} )( );
