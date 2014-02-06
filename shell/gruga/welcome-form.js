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
	fontPool;


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
Gruga.WelcomeForm =
{
	type :
		'Layout',

	twig :
	{
		'headline' :
		{
			type :
				'LabelWidget',

			text :
				'Welcome',

			font :
				fontPool.get( 22, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-120
				)
		},

		'message1' :
		{
			type :
				'LabelWidget',

			text :
				'Your registration was successful :-)',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
				Design.AnchorPoint.create(
					'anchor',
						'c',
					'x',
						0,
					'y',
						-50
				)
		},

		'closeButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
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

			caption :
			{
				type :
					'LabelWidget',

				text :
					'close',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
					Design.AnchorPoint.PC
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
					Design.AnchorPoint.PNW,

				pse :
					Design.AnchorPoint.PSE_M1
			}
		}
	},


	ranks :
	[
		'headline',
		'message1',
		'closeButton'
	]
};


} )( );
