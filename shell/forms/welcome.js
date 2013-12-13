/*
| The welcome form.
|
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
	Jools,
	Path,
	shell,
	shellverse,
	TraitSet;

/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-39606038';


/*
| The login form
*/
var Welcome =
Forms.Welcome =
	function(
		tag,
		inherit,
		screensize,
		traitSet,
		mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'invalid tag'
			);
		}
	}

	var
		user;

	if( inherit )
	{
		user =
		this.user =
			inherit.user;
	}
	else
	{
		user =
		this.user =
			null;
	}

	if( traitSet )
	{
		for(
			var a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( this.path )
			)
			{
				switch( t.key )
				{

					case 'user' :

						this.user =
						user =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				'Welcome ' + ( user || '' ) + '!'
		);

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);
};


Jools.subclass(
	Welcome,
	Forms.Form
);


/*
| Reflexion.
*/
Welcome.prototype.reflect =
	'Welcome';


/*
| Path of the form.
*/
Welcome.prototype.path =
	new Path(
		[
			Welcome.prototype.reflect
		]
	);


/*
| The forms tree.
*/
Welcome.prototype.tree =
	shellverse.grow( Design.WelcomeForm );


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
	if( CHECK )
	{
		// TODO
	}

	var
		buttonName =
			path.get( 1 );

	switch( buttonName )
	{
		case 'closeButton' :

			shell.bridge.changeMode(
				'Normal'
			);

			break;

		default :

			throw new Error(
				'unknown button pushed: ' + buttonName
			);
	}

	shell.redraw =
		true;
};



} )( );
