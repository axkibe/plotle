/*
| Default design of the creation disc.
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


/*
| All important design variables for convenience
*/
var design = {

	generic :
	{
		width :
			70,

		height :
			70,

		font :
			fontPool.get( 16, 'cm' )
	},

	note :
	{
		x :
			62,

		y :
			216
	},

	label :
	{
		x :
			81,

		y :
			284
	},

	relation :
	{
		x :
			94,

		y :
			354
	},

	portal :
	{
		x :
			101,

		y :
			425
	}
};

Design.CreateDisc =
{
	type :
		'Layout',

	twig :
	{
		'createNote' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Note',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},


			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.note.x,

					y :
						design.note.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.note.x +
							design.generic.width,

					y :
						design.note.y +
							design.generic.height
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

		'createLabel' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Label',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},


			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.label.x,

					y :
						design.label.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.label.x +
							design.generic.width,

					y :
						design.label.y +
							design.generic.height
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

		'CreateRelation' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Rela-\ntion',

				newline :
					20,

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},


			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.relation.x,

					y :
						design.relation.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.relation.x +
							design.generic.width,

					y :
						design.relation.y +
							design.generic.height
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

		'createPortal' :
		{
			type :
				'ButtonWidget',

			style :
				'createButton',

			caption :
			{
				type :
					'LabelWidget',

				text :
					'Portal',

				font :
					design.generic.font,

				pos :
				{
					type :
						'AnchorPoint',

					anchor :
						'c',

					x :
						0,

					y :
						0
				}
			},


			frame :
			{
				type :
					'Frame',

				pnw :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.portal.x,

					y :
						design.portal.y
				},

				pse :
				{
					type :
						'AnchorPoint',

					anchor :
						'nw',

					x :
						design.portal.x +
							design.generic.width,

					y :
						design.portal.y +
							design.generic.height
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
		'createNote',
		'createLabel',
		'CreateRelation',
		'createPortal'
	]
};


} )( );
