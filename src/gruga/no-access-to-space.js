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
	Forms.NoAccessToSpace.Create(
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
					'Sorry, you cannot port to this space or create it.',
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
		'okButton',
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
									okButton.w,
								'y',
									okButton.n
							),
						'pse',
							Design.AnchorPoint.Create(
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
