/*
| The space form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	shell,
	TraitSet;


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
			'Space',
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
							'undefined'
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
							'undefined'
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							'undefined'
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
	Space =
		Forms.Space;


/*
| The space form.
*/
Space.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	if( this.path )
	{
		traitSet =
			TraitSet.create(
				'set',
					traitSet,
				'trait',
					this._widgetPath( 'headline' ),
					'text',
					this.spaceUser + ':' + this.spaceTag
			);
	}

	Forms.Form.init.call(
		this,
		inherit,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 3 );

	switch( buttonName )
	{
		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


} )( );
