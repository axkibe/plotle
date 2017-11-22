/*
| Provides AJAX communications with the server.
*/
'use strict';


tim.define( module, 'net_ajax', ( def, net_ajax ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		'path' :
		{
			comment : 'the ajax path',
			type : 'jion$path'
		}
	};


	def.twig = [ 'net_channel' ];
}


} );
