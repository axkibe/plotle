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
		path,
		screensize,
		traitSet,
		mark,
		hover,
		username
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

	this.path =
		path;

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
		mark,
		hover,
		username
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
				'unknown button pushed: ' + buttonName
			);
	}
};



} )( );
