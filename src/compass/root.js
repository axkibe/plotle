/*
| Compass root
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const compass_nw = tim.require( './nw' );

const compass_n = tim.require( './n' );

const compass_ne = tim.require( './ne' );

const compass_e = tim.require( './e' );

const compass_se = tim.require( './se' );

const compass_s = tim.require( './s' );

const compass_sw = tim.require( './sw' );

const compass_w = tim.require( './w' );


/*
| North-west.
*/
def.staticLazy.nw = ( ) => compass_nw.singleton;


/*
| North.
*/
def.staticLazy.n = ( ) => compass_n.singleton;


/*
| North-east.
*/
def.staticLazy.ne = ( ) => compass_ne.singleton;


/*
| East.
*/
def.staticLazy.e = ( ) => compass_e.singleton;


/*
| South-east.
*/
def.staticLazy.se = ( ) => compass_se.singleton;


/*
| South.
*/
def.staticLazy.s = ( ) => compass_s.singleton;


/*
| South-west.
*/
def.staticLazy.sw = ( ) => compass_sw.singleton;


/*
| West.
*/
def.staticLazy.w = ( ) => compass_w.singleton;


} );
