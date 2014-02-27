/*
| User has no access to a space s/he tried to port to.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;

Forms =
	Forms || { };


/*
| Imports
*/
var
	shell;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'NoAccessToSpace',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								func :
									'Forms.Form.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'Path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							'undefined',
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							'undefined',
						assign :
							null
					},
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						defaultValue :
							'null',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							'null',
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							'null'
					}
			},
		subclass :
			'Forms.Form',
		init :
			[
				'inherit',
				'traitSet'
			],
		twig :
			{
				'Button' :
					'Widgets.Button',
				'CheckBox' :
					'Widgets.Checkbox',
				'Input' :
					'Widgets.Input',
				'Label' :
					'Widgets.Label'
			}
	};
}


var
	NoAccessToSpace =
		Forms.NoAccessToSpace;


/*
| The no access to space form.
*/
NoAccessToSpace.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	Forms.Form.init.call(
		this,
		inherit,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
NoAccessToSpace.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'path mismatch'
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 3 );

	switch( buttonName )
	{
		case 'okButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


} )( );
