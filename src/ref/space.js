/*
| References a space.
*/
'use strict';


tim.define( module, 'ref_space', ( def, ref_space ) => {


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
| Reference to ideolooms home space.
*/
def.staticLazy.ideoloomHome = ( ) =>
	ref_space.create(
		'username', 'ideoloom',
		'tag', 'home'
	);

/*
| Reference to ideolooms sandbox space.
*/
def.staticLazy.ideoloomSandbox = ( ) =>
	ref_space.create(
		'username', 'ideoloom',
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
