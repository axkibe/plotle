/*
| The user's form.
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
var User =
Forms.User =
	function(
		tag,
		inherit,
		path,
		screensize,
		traitSet,
		mark,
		hover
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

	var
		isGuest;

	if( user )
	{
		isGuest =
			user.substr( 0, 7 ) === 'visitor';
	}
	else
	{
		isGuest =
			true;
	}


	// appends new traits
	// FIXME only if changed

	traitSet =
		TraitSet.create(
			'set',
				traitSet,
			'trait',
				this._widgetPath( 'headline' ),
				'text',
				'hello ' + ( user || '' ),
			'trait',
				this._widgetPath( 'visitor1' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor2' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor3' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'visitor4' ),
				'visible',
				isGuest,
			'trait',
				this._widgetPath( 'greeting1' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'greeting2' ),
				'visible',
				!isGuest,
			'trait',
				this._widgetPath( 'greeting3' ),
				'visible',
				!isGuest
		);

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark,
		hover
	);
};


Jools.subclass(
	User,
	Forms.Form
);


/*
| Name of the form.
*/
User.prototype.reflect =
	'User';


/*
| The forms tree.
*/
User.prototype.tree =
	shellverse.grow( Design.UserForm );


/*
| A button of the form has been pushed.
*/
User.prototype.pushButton =
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
			path.get( 2 );

	switch( buttonName )
	{
		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};


})( );

