/*
| A position in a text.
*/
'use strict';


tim.define( module, 'change_mark_text', ( def, change_mark_text ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// path of the mark
			type : 'jion$path'
		},
		at :
		{
			// offset of the mark
			type : 'integer'
		}
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
/**/
/**/	if( this.at < 0 ) throw new Error( );
/**/}

};


} );
