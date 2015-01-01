/*
| The dotracker manages the undo and redo stacks.
*/


var
	ccot_changeWrapRay,
	config,
	root,
	shell_doTracker;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'shell_doTracker',
		attributes :
			{
				_undo :
					{
						comment :
							'the undo stack',
						type :
							'ccot_changeWrapRay',
						defaultValue :
							null
					},
				_redo :
					{
						comment :
							'the redo stack',
						type :
							'ccot_changeWrapRay',
						defaultValue :
							null
					}
			}
	};
}


/*
| Flushes the stacks.
*/
shell_doTracker.prototype.flush =
	function(

	)
{
	// FIXME
	root.doTracker =
		this.create(
			'_undo', ccot_changeWrapRay.create( ),
			'_redo', ccot_changeWrapRay.create( )
		);
};


/*
| Reporting the doTracker something has been altered.
| It will track it on the undo stack.
*/
shell_doTracker.prototype.track =
	function(
		changeWrap
	)
{
	var
		undo;

	undo = this._undo;

	undo = undo.append( changeWrap );

	if( undo.length > config.maxUndo )
	{
		undo = undo.remove( 0 );
	}

	// FIXME
	root.doTracker =
		this.create(
			'_undo', undo,
			'_redo', ccot_changeWrapRay.create( )
		);
};


/*
| Received server updates.
|
| These contain updates from this sessions own changes
| now enriched with sequence ids as well as genuine updates
| from others.
*/
shell_doTracker.prototype.update =
	function(
		changeWrapRay
	)
{
	var
		a,
		aZ,
		cw,
		undo,
		redo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	undo = this._undo;

	redo = this._redo;

	// nothing to do
	if( changeWrapRay.length === 0 )
	{
		return;
	}

	// Adapts the doTracker stacks

	// FUTURE this can be optimized
	//        by skipping all non-relevant
	//        loop iterations.

	for(
		a = 0, aZ = undo.length;
		a < aZ;
		a++
	)
	{
		cw = undo.get( a );

		console.log( 'UT', cw.seq, changeWrapRay.get( 0 ).seq );

		if( cw.seq < changeWrapRay.get( 0 ).seq )
		{
			cw = changeWrapRay.transform( cw );

			// the change vanished by transformation
			if( cw === null )
			{
				undo = undo.remove( a-- );

				aZ--;

				continue;
			}

			undo = undo.set( a, cw );
		}
	}

	for(
		a = 0, aZ = redo.length;
		a < aZ;
		a++
	)
	{
		cw = redo.get( a );

		if( cw.seq < changeWrapRay.get( 0 ).seq )
		{
			cw = changeWrapRay.transform( cw );

			// the change vanished by transformation
			if( cw === null )
			{
				redo = redo.remove( a-- );

				aZ--;

				continue;
			}

			redo = redo.set( a, cw );
		}
	}

	return this.create( '_undo', undo, '_redo', redo );
};


/*
| Reverts actions from the undo stack.
*/
shell_doTracker.prototype.undo =
	function( )
{
	var
		changeWrap,
		undo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	undo = this._undo;

	if( undo.length === 0 )
	{
		return;
	}

	changeWrap = undo.get( undo.length - 1 );

	undo = undo.remove( undo.length - 1 );

	root.doTracker =
		this.create(
			'_undo', undo,
			'_redo', this._redo.append( changeWrap )
		);

	root.link.alter( changeWrap.createInvert( ) );
};


/*
| Reverts undos from the redo stack.
*/
shell_doTracker.prototype.redo =
	function( )
{
	var
		changeWrap,
		redo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	redo = this._redo;

	if( redo.length === 0 )
	{
		return;
	}

	changeWrap = redo.get( redo.length - 1 );

	redo = redo.remove( redo.length - 1 );

	root.doTracker =
		this.create(
			'_redo', redo,
			'_undo', this._undo.append( changeWrap )
		);

	root.link.alter( changeWrap.createCopy( ) );
};


} )( );
