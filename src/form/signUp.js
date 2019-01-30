/*
| The signup form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './form';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types' ] },

		// space has grid
		hasGrid : { type : 'undefined' },

		// space has snapping
		hasSnapping : { type : 'undefined' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the reference to the current space
		spaceRef : { type : 'undefined' },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const form_form = require( './form' );

const ref_space = require( '../ref/space' );

const reply_error = require( '../reply/error' );

const show_form= require( '../show/form' );

const user_creds = require( '../user/creds' );

const user_passhash = require( '../user/passhash' );

const visual_mark_caret = require( '../visual/mark/caret' );


/*
| Clears all fields.
*/
def.proto.clear =
	function( )
{
	// FUTURE make this in one call, somehow

	root.setPath( this.get( 'userInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'emailInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'passwordInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'password2Input' ).path.append( 'value' ), '' );

	root.setPath(
		this.get( 'newsletterCheckBox' ).path.append( 'checked' ), true
	);

	root.setPath( this.get( 'errorLabel' ).path.append( 'text' ), '' );

	root.setUserMark( undefined );
};


/*
| A register operation completed.
*/
def.proto.onRegister =
	function(
		request,
		reply
	)
{
	if( reply.timtype === reply_error )
	{
		const message = reply.message;

		root.setPath(
			this.get( 'errorLabel' ).path.append( 'text' ),
			message
		);

		const userInput = this.get( 'userInput' );

		if( message.search( /Username/ ) >= 0 )
		{
			root.setUserMark(
				visual_mark_caret.pathAt( userInput.path, userInput.value.length )
			);
		}

		return;
	}

	this.clear( );

	root.moveToSpace( ref_space.plotleHome, false );

	root.create( 'show', show_form.welcome, 'userCreds', request.userCreds );
};


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'signUp' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'signupButton' : this.signup( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


/*
| Sets the error message.
*/
def.proto.setErrorMessage =
	function(
		message
	)
{
	root.setPath(
		this.get( 'errorLabel' ).path.append( 'text' ),
		message
	);
};


/*
| Signs a new user up
*/
def.proto.signup =
	function( )
{
	const username = this.get( 'userInput' ).value;

	const email = this.get( 'emailInput' ).value;

	const pass = this.get( 'passwordInput' ).value;

	const pass2 = this.get( 'password2Input' ).value;

	const newsletter = this.get( 'newsletterCheckBox' ).checked;

	if( username.length < 4 )
	{
		this.setErrorMessage( 'Username too short, min. 4 characters' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'userInput' ).path, username.length )
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this.setErrorMessage( 'Username must not start with "visit"' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'userInput' ).path, 0 )
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setErrorMessage( 'Password too short, min. 5 characters' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'passwordInput' ).path, pass.length )
		);

		return;
	}

	if( pass !== pass2 )
	{
		this.setErrorMessage( 'Passwords do not match' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'password2Input' ).path, pass2.length )
		);

		return;
	}

	root.link.register(
		user_creds.create(
			'name', username,
			'passhash', user_passhash.calc( pass )
		),
		email,
		newsletter
	);
};


} );
