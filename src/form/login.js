/*
| The login form.
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
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

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


const action_none = require( '../action/none' );

const form_form = require( '../form/form' );

const ref_space = require( '../ref/space' );

const reply_auth = require( '../reply/auth' );

const user_creds = require( '../user/creds' );

const user_passhash = require( '../user/passhash' );

const visual_mark_caret = require( '../visual/mark/caret' );


/*
| Clears all fields.
*/
def.proto.clear =
	function( )
{
	// FUTURE combine calls
	root.setPath( this.get( 'userInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'passwordInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'errorLabel' ).path.append( 'text' ), '' );

	root.setUserMark( undefined );
};


/*
| Logins the user
*/
def.proto.login =
	function( )
{
	const username = this.get( 'userInput' ).value;

	const pass = this.get( 'passwordInput' ).value;

	if( username.length < 4 )
	{
		this._setErrorMessage( 'Username too short, min. 4 characters' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'userInput' ).path, username.length )
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this._setErrorMessage( 'Username must not start with "visit"' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'userInput' ).path, 0 )
		);

		return;
	}

	if( pass.length < 5 )
	{
		this._setErrorMessage( 'Password too short, min. 5 characters' );

		root.setUserMark(
			visual_mark_caret.pathAt( this.get( 'passwordInput' ).path, pass.length )
		);

		return;
	}

	root.link.auth(
		user_creds.create(
			'name', username,
			'passhash', user_passhash.calc( pass )
		)
	);
};


/*
| An auth ( login ) operation completed.
*/
def.proto.onAuth =
	function(
		reply
	)
{
	if( reply.timtype !== reply_auth )
	{
		const message = reply.message;

		this._setErrorMessage( message );

		if( message.search( /Username/ ) >= 0 )
		{
			const userInput = this.get( 'userInput' );

			root.setUserMark(
				visual_mark_caret.pathAt( userInput.path, userInput.value.length )
			);
		}
		else
		{
			const passwordInput = this.get( 'passwordInput' );

			root.setUserMark(
				visual_mark_caret.pathAt( passwordInput.path, passwordInput.value.length )
			);
		}

		return;
	}

	reply.userCreds.saveToLocalStorage( );

	root.create( 'action', action_none.create( ), 'userCreds', reply.userCreds );

	this.clear( );

	root.moveToSpace( ref_space.plotleHome, false );
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
/**/	if( path.get( 2 ) !== 'login' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'loginButton' : this.login( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| Sets the error message.
*/
def.proto._setErrorMessage =
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
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


/*
| User is pressing a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// a return in the password field is made
	// to be a login command right away

	if( key === 'enter' )
	{
		const caret = this.mark.caret;

		if( caret && caret.path.get( 4 ) === 'passwordInput' )
		{
			this.login( );

			return;
		}
	}

	return form_form.specialKey.call( this, key, shift, ctrl );
};


} );
