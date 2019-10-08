/*
| References a space.
*/
'use strict';


tim.define( module, ( def, ref_space ) => {


if( TIM )
{
	def.attributes =
	{
		// name of the user the space belongs to
		username : { type : 'string', json : true },

		// tag of the space
		tag : { type : 'string', json : true },
	};

	def.json = 'ref_space';
}


/*
| Create Shortcut.
*/
def.static.createUsernameTag = ( username, tag ) =>
	ref_space.create( 'username', username, 'tag', tag );


/*
| Reference to plotles home space.
*/
def.staticLazy.plotleHome = ( ) =>
	ref_space.createUsernameTag( 'plotle', 'home' );


/*
| Reference to plotle sandbox space.
*/
def.staticLazy.plotleSandbox = ( ) =>
	ref_space.createUsernameag( 'plotle', 'sandbox' );


/*
| Fullname of the space reference.
*/
def.lazy.fullname =
	function( )
{
	return this.username + ':' + this.tag;
};


/*
| Key for the changes in database.
*/
def.lazy.dbChangesKey =
	function( )
{
	return 'changes:' + this.fullname;
};


} );
