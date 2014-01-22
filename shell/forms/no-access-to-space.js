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
	Design,
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
				path :
					{
						comment :
							'the path of the form',

						type :
							'Path'
					},

				screensize :
					{
						comment :
							'the screensize the form is made for',

						type :
							'Point'
					},

				mark :
					{
						comment :
							'the users mark',

						type :
							'Mark'
					},

				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
					},

				traitSet :
					{
						comment :
							'traits being set',

						type :
							'TraitSet',

						allowNull:
							true,

						defaultVal :
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

						allowNull:
							true,

						defaultVal :
							'null',

						assign :
							null
					}
			},

		subclass :
			'Forms.Form',

		init :
			[
				'inherit',
				'traitSet'
			]
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
		Design.NoAccessToSpaceForm,
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
/**/	if( path.get( 1 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'path mismatch'
/**/		);
/**/	}
/**/}

	var
		buttonName =
			path.get( 2 );

	switch( buttonName )
	{
		case 'okButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error(
				'unknown button pushed: ' + buttonName
			);
	}
};


} )( );
