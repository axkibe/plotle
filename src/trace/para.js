/*
| A trace into a paragraph from a doc.
*/
'use strict';


tim.define( module, ( def, trace_para ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// key of the paragraph
		key : { type : 'string' },
	};


	// path of trace back.
	def.list = [ './root', './space', './item', './doc' ];
}


const trace_offset = tim.require( './offset' );


/*
| Returns a trace with an offset appended.
*/
def.lazyFuncInt.appendOffset =
	function(
		at // offset
	)
{
	return trace_offset.create( 'list:init', this, 'list:append', this, 'at', at );
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'twig' ).append( this.key );
};


/*
| This is the para trace.
*/
def.lazy.tracePara = function( ) { return this; };


} );
