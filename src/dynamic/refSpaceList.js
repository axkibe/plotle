/*
| A dynamic list of references to spaces.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'dynamic_refSpacesList',
		attributes :
		{
			current :
			{
				comment : 'the reference to the entity',
				type : 'ref_spaceList',
				json : true
			},
			seq :
			{
				comment : 'sequence number the dynamic is at',
				type : 'integer',
				defaultValue : '1',
				json : true
			},
			changeWraps :
			{
				comment : 'changeWraps cached in RAM',
				type : [ 'undefined', 'change_wrapList' ]
			}
		},
		init : [ ]
	};
}
	

var
	change_list,
	change_wrap,
	change_wrapList,
	dynamic_refSpacesList,
	ref_moment,
	ref_userSpacesList,
	session_uid;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


if( NODE )
{
	dynamic_refSpacesList = require( 'jion' ).this( module, 'source' );

	change_list = require( '../change/list' );

	change_wrap = require( '../change/wrap' );

	change_wrapList = require( '../change/wrapList' );

	session_uid = require( '../session/uid' );
}


prototype = dynamic_refSpacesList.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	if( !this.changeWraps )
	{
		// defaultValue is not user when coming from createFromJSON
		this.changeWraps = change_wrapList.create( );
	}
};



/*
| Returns the altered dynamic.
*/
prototype.alter =
	function(
		a1 // change, several changes or array of changes
		// // ...
	)
{
	var
		changeList,
		changeWrap;

	if( a1.reflect === 'change_list' )
	{
		changeList = a1;
	}
	else if( Array.isArray( a1 ) )
	{
		changeList = change_list.create( 'list:init', a1 );
	}
	else
	{
		changeList =
			change_list.create(
				'list:init',
				Array.prototype.slice.apply( arguments )
			);
	}

	changeWrap =
		change_wrap.create(
			'cid', session_uid( ),
			'changeList', changeList
		);

	return(
		this.create(
			'current', changeWrap.changeTree( this.current ),
			'changeWraps', this.changeWraps.append( changeWrap ),
			'seq', this.seq + 1
		)
	);
};


/*
| Applies a changeDynamic
*/
prototype.applyChangeDynamic =
	function(
		changeDynamic
	)
{
	var
		changeWrapList;

/**/if( CHECK )
/**/{
/**/	if( this.seq !== changeDynamic.seq ) throw new Error( );
/**/}

	changeWrapList = changeDynamic.changeWrapList;

	return(
		this.create(
			'current', changeWrapList.changeTree( this.current ),
			'changeWraps', this.changeWraps.appendList( changeWrapList ),
			'seq', this.seq + changeWrapList.length
		)
	);
};


/*
| The current state of the dynamic
| as reference to this moment.
*/
prototype.refMoment =
	function(
		username
	)
{
	return(
		ref_moment.create(
			'dynRef',
				ref_userSpacesList.create(
					'username', username
				),
			'seq', this.seq
		)
	);
};


}( ) );
