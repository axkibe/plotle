/*
| A position in a text.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// path of the mark
		path : { type : 'tim.js/src/path/path' },

		// offset of the mark
		at : { type : 'integer' },
	};
}


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( this.path.isEmpty ) throw new Error( );
/**/
/**/		if( this.at < 0 ) throw new Error( );
/**/	};
/**/}


} );
