/*
| A node mark.
*/
'use strict';


tim.define( module, 'change_mark_node', ( def, change_mark_node ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// path of the mark
		path : { type : 'tim.js/path' },
	};

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty ) throw new Error( );
/**/}

};


} );
