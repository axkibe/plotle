/*
| A trace into a document.
*/
'use strict';

tim.define( module, ( def, trace_doc ) => {


def.extend = './bare';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space', './item' ];
}


const trace_para = tim.require( './para' );


/*
| Returns a trace with a para appended.
*/
def.lazyFuncStr.appendPara =
	function(
		key // key of the para
	)
{
	return trace_para.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );
