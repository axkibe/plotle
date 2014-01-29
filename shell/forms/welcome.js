/*
| The welcome form.
| Shown only after successfull signing up.
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
			'Welcome',

		unit :
			'Forms',

		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
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
							}
					},

				path :
					{
						comment :
							'the path of the form',

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
							'null'
					},

				view :
					{
						comment :
							'the current view',

						type :
							'View',

						concerns :
							{
								func :
									'view.sizeOnly',

								args :
									null
							}
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
	Welcome =
		Forms.Welcome;


/*
| The welcome form.
*/
Welcome.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				'Welcome ' + ( this.username || '' ) + '!'
		);

	Forms.Form.init.call(
		this,
		inherit,
		Design.WelcomeForm,
		traitSet
	);
};


/*
| A button of the form has been pushed.
*/
Welcome.prototype.pushButton =
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
		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error(
				CHECK
				&&
				(
					'unknown button pushed: ' + buttonName
				)
			);
	}
};



} )( );
