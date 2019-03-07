/*
| Manages all fonts (on server and shell)
*/
'use strict';


tim.define( module, ( def, font_root ) => {


if( TIM )
{
	def.group = [ './family' ];
}


/*
| The dynamic pool
*/
def.staticLazy.pool =
	( ) => ( { root : font_root.create( ) } );


} );
