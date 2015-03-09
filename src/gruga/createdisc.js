/*
| Default design of the creation disc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	disc_createDisc,
	gruga_createDisc,
	shell_fontPool,
	widget_button;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	genericButtonModel,
	dv;

dv =
	{
		generic :
		{
			width : 70,
			height : 70,
		},

		note :
		{
			x : 62,
			y : 216
		},

		label :
		{
			x : 81,
			y : 284
		},

	relation :
		{
			x : 94,
			y : 354
		},

	portal :
		{
			x : 101,
			y : 425
		}
	};

genericButtonModel =
	widget_button.abstract(
		'font', shell_fontPool.get( 16, 'cm' ),
		'shape', design_anchorEllipse.fullSkewNW,
		'style', 'createButton',
		'textDesignPos', design_anchorPoint.c
	);


gruga_createDisc =
	disc_createDisc.create(
		'twig:add',
		'createNote',
			genericButtonModel.create(
				'text', 'Note',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.note.x,
								'y', dv.note.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.note.x + dv.generic.width,
								'y', dv.note.y + dv.generic.height
							)
					)
			),
		'twig:add',
		'createLabel',
			genericButtonModel.create(
				'text', 'Label',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.label.x,
								'y', dv.label.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.label.x + dv.generic.width,
								'y', dv.label.y + dv.generic.height
							)
					),
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'createRelation',
			genericButtonModel.create(
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.relation.x,
								'y', dv.relation.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.relation.x + dv.generic.width,
								'y', dv.relation.y + dv.generic.height
							)
					)
			),
		'twig:add',
		'createPortal',
			genericButtonModel.create(
				'text', 'Portal',
				'designFrame',
					design_anchorRect.create(
						'pnw',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.portal.x,
								'y', dv.portal.y
							),
						'pse',
							design_anchorPoint.create(
								'anchor', 'nw',
								'x', dv.portal.x + dv.generic.width,
								'y', dv.portal.y + dv.generic.height
							)
					)
			)
	);


} )( );
