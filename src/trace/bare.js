/*
| A bare part of a trace.
*/
'use strict';


tim.define( module, ( def, trace_bare ) => {


def.abstract = true;


if( TIM )
{
	// path of trace back.
	def.list = [ '< types' ];
}


const trace_doc = tim.require( './doc' );

const trace_item = tim.require( './item' );

const trace_offset = tim.require( './offset' );

const trace_para = tim.require( './para' );

const trace_space = tim.require( './space' );


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendDoc =
	function( )
{
	return trace_doc.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with an item part appended.
*/
def.lazyFuncStr.appendItem =
	function(
		key // key of the item
	)
{
	return trace_item.create( 'list:init', this, 'list:append', this, 'key', key );
};

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
| Returns a trace with a para appended.
*/
def.lazyFuncStr.appendPara =
	function(
		key // key of the para
	)
{
	return trace_para.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:init', this, 'list:append', this );
};


} );
