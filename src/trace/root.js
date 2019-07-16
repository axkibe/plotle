/*
| A root of a trace
*/
'use strict';


tim.define( module, ( def, trace_root ) => {


def.singleton = true;

def.extend = './base';

if( TIM )
{
	def.json = './base';
}


const trace_discs = tim.require( './discs' );

const trace_forms = tim.require( './forms' );

const trace_space = tim.require( './space' );


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'root';


/*
| Returns a trace with a step to discs root appended.
*/
def.lazy.appendDiscs =
	function( )
{
	return trace_discs.create( 'list:append', this );
};


/*
| Returns a trace with a step to forms root appended.
*/
def.lazy.appendForms =
	function( )
{
	return trace_forms.create( 'list:append', this );
};


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:append', this );
};


/*
| Custom JSON converter.
*/
def.lazy.asJSON = ( ) => ( { type: 'trace', trace: [ ] } );


/*
| The trace step as string (for debugging).
| And in case of root also for the whole trace.
*/
def.lazy.asString =
def.lazy.asStringStep =
	( ) => 'root';


/*
| In case of a root trace returns the leaf.
*/
def.proto.graft = ( tree, leaf ) => leaf;


/*
| The root trace always has length 0.
*/
def.proto.length = 0;


/*
| Picks the traced leaf.
| In case of a root trace returns the tree.
*/
def.proto.pick = ( tree ) => tree;


} );
