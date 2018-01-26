/*
| Default design for the space form.
*/
'use strict';


tim.define( module, 'gruga_user', ( def, gruga_user ) => {


const form_user = require( '../form/user' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( './genericButton' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_button = require( '../widget/button' );

const widget_label = require( '../widget/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_user.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'Hello',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add',
		'visitor1',
			widget_label.abstract(
				'text', 'You\'re currently an anonymous visitor!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'visitor2',
			widget_label.abstract(
				'text', 'Click on "sign up" or "log in"',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.zero
			),
		'twig:add',
		'visitor3',
			widget_label.abstract(
				'text', 'on the control disc to the left',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 20 )
			),
		'twig:add',
		'visitor4',
			widget_label.abstract(
				'text', 'to register as an user.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 40 )
			),
		'twig:add',
		'greeting1',
			widget_label.abstract(
				'text', 'This is your profile page!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'greeting2',
			widget_label.abstract(
				'text', 'In future you will be able to do stuff here,',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -10 )
			),
		'twig:add',
		'greeting3',
			widget_label.abstract(
				'text', 'like for example change your password.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 10 )
			),
		'twig:add',
		'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} );

