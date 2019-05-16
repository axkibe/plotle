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


/*
| Returns a trace with a doc part appended.
*/
def.proto.appendDoc =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 0 ) throw new Error( );
/**/}

	return trace_doc.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with an item part appended.
*/
def.proto.appendItem =
	function(
		key
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return trace_item.create( 'list:init', this, 'list:append', this, 'key', key );
};

/*
| Returns a trace with an offset appended.
*/
def.proto.appendOffset =
	function(
		at
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return trace_offset.create( 'list:init', this, 'list:append', this, 'at', at );
};


/*
| Returns a trace with a para appended.
*/
def.proto.appendPara =
	function(
		key
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return trace_para.create( 'list:init', this, 'list:append', this, 'key', key );
};


} );
