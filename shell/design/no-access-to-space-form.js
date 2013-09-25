/*
| Default design for no access to space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Design;


Design =
	Design || { };


/*
| Imports
*/
var
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
Design.NoAccessToSpaceForm =
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
				'',

			font :
				fontPool.get( 22, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-120
			}
		},

		'message1' :
		{
			type :
				'LabelWidget',

			text :
				'Sorry, you cannot port to this space or create it.',

			font :
				fontPool.get( 16, 'ca' ),

			pos :
			{
				type :
					'AnchorPoint',

				anchor :
					'c',

				x :
					0,

				y :
					-50
			}
		},

		'okButton' :
		{
			type :
				'ButtonWidget',

			style :
				'genericButton',

			frame :
			{
				type :
					'Frame',

				pnw  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						okButton.w,

					y :
						okButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						okButton.w + okButton.width,

					y :
						okButton.n + okButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'ok',

				font :
					fontPool.get( 14, 'cm' ),

				pos  :
				{
					type:
						'AnchorPoint',

					anchor:
						'c',

					x :
						0,

					y :
						0
				}
			},

			shape :
			{
				type :
					'Ellipse',

				pnw :
				{
					type:
						'AnchorPoint',

					anchor:
						'nw',

					x :
						0,

					y :
						0
				},

				pse :
				{
					type:
						'AnchorPoint',

					anchor:
						'se',

					x :
						-1,

					y :
						-1
				}
			}
		}
	},


	ranks :
	[
		'headline',
		'message1',
		'okButton'
	]
};


} )( );
