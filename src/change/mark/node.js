/*
| A node mark.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// path of the mark
		path : { type : 'tim.js/src/path/path' },
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
/**/	};
/**/}


} );
