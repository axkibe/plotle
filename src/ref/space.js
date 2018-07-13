/*
| References a space.
*/
'use strict';


tim.define( module, ( def, ref_space ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


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


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| Reference to linklooms home space.
*/
def.staticLazy.linkloomHome = ( ) =>
	ref_space.create(
		'username', 'linkloom',
		'tag', 'home'
	);

/*
| Reference to linklooms sandbox space.
*/
def.staticLazy.linkloomSandbox = ( ) =>
	ref_space.create(
		'username', 'linkloom',
		'tag', 'sandbox'
	);


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/

def.lazy.fullname =
	function( )
{
	return this.username + ':' + this.tag;
};


} );
