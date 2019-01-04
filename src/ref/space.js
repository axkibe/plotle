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
| Reference to plotles home space.
*/
def.staticLazy.plotleHome = ( ) =>
	ref_space.create(
		'username', 'plotle',
		'tag', 'home'
	);

/*
| Reference to plotle sandbox space.
*/
def.staticLazy.plotleSandbox = ( ) =>
	ref_space.create(
		'username', 'plotle',
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
