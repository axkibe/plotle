/*
| Default design for the non-existing-space form.
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
	| 'no' control
	*/
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


	/*
	| yes control
	*/
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
Design.NonExistingSpaceForm =
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
				'Do you want to create it?',

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

		'noButton' :
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
						noButton.w,

					y :
						noButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						noButton.w + noButton.width,

					y :
						noButton.n + noButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'No',

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
		},

		'yesButton' :
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
						yesButton.w,

					y :
						yesButton.n
				},

				pse  :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						yesButton.w + yesButton.width,

					y :
						yesButton.n + yesButton.height
				}
			},

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Yes',

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
		'noButton',
		'yesButton'
	]
};

} )( );
