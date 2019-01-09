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


def.lazy.fullname =
	function( )
{
	return this.username + ':' + this.tag;
};


} );
