/*
| Provides AJAX communications with the server.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the ajax path
		path : { type : 'tim.js/src/path' }
	};


	def.twig = [ './channel' ];
}


} );
