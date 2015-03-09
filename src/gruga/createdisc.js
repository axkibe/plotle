/*
| Default design of the creation disc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	disc_createDisc,
	euclid_point,
	gruga_createDisc,
	shell_fontPool,
	widget_button;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	dnw,
	genericButtonModel,
	genericButtonSize,
	labelButtonPnw,
	noteButtonPnw,
	portalButtonPnw,
	relationButtonPnw;


dnw = design_anchorPoint.nw;

noteButtonPnw = dnw.create( 'x', 62, 'y', 216 );

labelButtonPnw = dnw.create( 'x', 81, 'y', 284 );

portalButtonPnw = dnw.create( 'x', 101, 'y', 425 );

relationButtonPnw = dnw.create( 'x', 94, 'y', 354 );

genericButtonSize = euclid_point.create( 'x', 70, 'y', 70 );

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
						'pnw', noteButtonPnw,
						'pse', noteButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createLabel',
			genericButtonModel.create(
				'text', 'Label',
				'designFrame',
					design_anchorRect.create(
						'pnw', labelButtonPnw,
						'pse', labelButtonPnw.add( genericButtonSize )
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
						'pnw', relationButtonPnw,
						'pse', relationButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createPortal',
			genericButtonModel.create(
				'text', 'Portal',
				'designFrame',
					design_anchorRect.create(
						'pnw', portalButtonPnw,
						'pse', portalButtonPnw.add( genericButtonSize )
					)
			)
	);


} )( );
