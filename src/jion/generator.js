/*
| Generates jion objects from a jion definition.
|
| FUTURE combine "Export" and "Import" vars into one block.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion_generator',
		attributes :
			{
				'jion' :
					{
						comment :
							'the jion definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	$,
	$and,
	$assign,
	$block,
	$call,
	astCapsule,
	$check,
	$comma,
	$comment,
	$condition,
	$differs,
	$equals,
	$fail,
	$func,
	$if,
	$instanceof,
	$new,
	$not,
	$number,
	$objLiteral,
	$or,
	$plus,
	$plusAssign,
	$return,
	$returnFalse,
	$returnTrue,
	$string,
	$switch,
	$this,
	$typeof,
	$var,
	generator,
	id,
	idRepository,
	jools,
	shorthand,
	validator;


generator = require( '../jion/this' )( module );

id = require( './id' );

idRepository = require( './idRepository' );

shorthand = require( '../ast/shorthand' );

jools = require( '../jools/jools' );

validator = require( './validator' );


/*
| Shorthanding Shorthands.
*/
$ = shorthand.$;

$and = shorthand.$and;

$assign = shorthand.$assign;

$block = shorthand.$block;

$call = shorthand.$call;

astCapsule = shorthand.astCapsule;

$check = shorthand.$check;

$comma = shorthand.$comma;

$comment = shorthand.$comment;

$condition = shorthand.$condition;

$differs = shorthand.$differs;

$equals = shorthand.$equals;

$fail = shorthand.$fail;

$func = shorthand.$func;

$if = shorthand.$if;

$instanceof = shorthand.$instanceof;

$new = shorthand.$new;

$not = shorthand.$not;

$number = shorthand.$number;

$objLiteral = shorthand.$objLiteral;

$or = shorthand.$or;

$plus = shorthand.$plus;

$plusAssign = shorthand.$plusAssign;

$return = shorthand.$return;

$string = shorthand.$string;

$switch = shorthand.$switch;

$this = shorthand.$var( 'this' );

$typeof = shorthand.$typeof;

$var = shorthand.$var;

// FUTURE remove this two
$returnTrue = $return( true );

$returnFalse = $return( false );


/*
| Initializes a generator.
*/
generator.prototype._init =
	function( )
{
	var
		a,
		aid,
		assign,
		attr,
		attributes,
		attrList,
		concerns,
		concernsID,
		constructorList,
		defaultValue,
		// sorted init list
		inits,
		jAttr,
		jdv,
		jion,
		name,
		rayDef,
		subID,
		// twig id
		t,
		type,
		tZ,
		// twig map to be used (the definition)
		twigDef,
		// units used
		units;

	attributes = { };

	constructorList = [ ];

	jion = this.jion;

	units = idRepository.create( );

	units = units.add( id.createFromString( 'jion_proto' ) );

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.singleton = !!jion.singleton;

	this.id = id.createFromString( jion.id );

	if( jion.subclass )
	{
		subID = id.createFromString( jion.subclass );

		units = units.add( subID );

		this.subclass = subID.$global;
	}

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		type = jAttr.type;

		if( jools.isString( type ) && type.substring( 0, 2 ) === '->' )
		{
			type = require( '../typemaps/' + type.substring( 2 ) );
		}

		if( !Array.isArray( type ) )
		{
			aid = id.createFromString( type );

			units = units.add( aid );
		}
		else
		{
			aid = [ ]; // FUTURE idRay

			for(
				t = 0, tZ = type.length;
				t < tZ;
				t++
			)
			{
				aid[ t ] = id.createFromString( type[ t ] );

				units = units.add( aid[ t ] );
			}
		}

		if( jAttr.json )
		{
			this.hasJSON = true;
		}

		assign =
			jAttr.assign !== undefined
			? jAttr.assign
			: name;

		if(
			assign !== null
			|| (
				this.init
				&& this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		defaultValue = null;

		concerns = jAttr.concerns;

		if( concerns && concerns.type )
		{
			concernsID = id.createFromString( concerns.type );

			units = units.add( concernsID );
		}

		// tests also if defaultValue is defined to be `undefined`
		if( Object.keys( jAttr ).indexOf( 'defaultValue' ) >= 0 )
		{
			jdv = jAttr.defaultValue;

			if( jdv === null )
			{
				defaultValue = shorthand.$null;
			}
			else if( jdv === undefined )
			{
				defaultValue = shorthand.$undefined;
			}
			else if( jdv === false )
			{
				defaultValue = shorthand.$false;
			}
			else if( jdv === true )
			{
				defaultValue = shorthand.$true;
			}
			else if( typeof( jdv ) === 'number' )
			{
				defaultValue = $number( jAttr.defaultValue );
			}
			else if( jools.isString( jdv ) )
			{
				if( jdv[ 0 ] === "'" )
				{
					throw new Error(
						'invalid default Value: ' + jdv
					);
				}

				defaultValue = $string( jdv );
			}
			else
			{
				throw new Error( );
			}
		}

		attr =
		attributes[ name ] =
			Object.freeze( { // FIXME
				allowsNull :
					jAttr.allowsNull
					|| shorthand.$null.equals( defaultValue ),
				allowsUndefined :
					jAttr.allowsUndefined
					|| shorthand.$undefined.equals( defaultValue ),
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns
					? Object.freeze( { // FIXME
							id : concernsID,
							func : jAttr.concerns.func,
							args : jAttr.concerns.args,
							member : jAttr.concerns.member
						} )
					: null,
				defaultValue :
					defaultValue,
				json :
					jAttr.json,
				name :
					name,
				id :
					aid,
				v : // FUTURE rename to vName
					$var( 'v_' + name )
			} );
	}

	attrList = Object.keys( attributes ).sort ( );

	if( FREEZE )
	{
		Object.freeze( attrList );

		Object.freeze( attributes );
	}

	this.attrList = Object.freeze( attrList );

	this.attributes = Object.freeze( attributes );

	constructorList.sort( );

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.ray )
	{
		constructorList.unshift( 'ray' );
	}

	if( jion.init )
	{
		inits = jion.init.slice( ).sort( );

		for(
			a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name = jion.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :
				case 'ray' :
				case 'rayDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	if( FREEZE )
	{
		Object.freeze( constructorList );
	}

	this.constructorList = constructorList;

	if( jion.twig )
	{
		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substring( 2 ) );
		}
		else
		{
			twigDef = jion.twig;
		}

		this.twig = idRepository.createFromIDStrings( twigDef );

		units = units.add( this.twig );

	}
	else
	{
		this.twig = null;
	}

	if( jion.ray )
	{
		if( jools.isString( jion.ray ) )
		{
			rayDef = require( '../typemaps/' + jion.ray.substring( 2 ) );
		}
		else
		{
			rayDef = jion.ray;
		}

		this.ray = idRepository.createFromIDStrings( rayDef );

		units = units.add( this.ray );
	}
	else
	{
		this.ray = null;
	}

	this.units = units;

	this.equals = jion.equals;

	this.alike = jion.alike;

	this.creatorHasFreeStringsParser =
		this.twig
		|| this.ray
		|| this.attrList.length > 0;
};


/*
| Generates the imports.
*/
generator.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		nameList,
		unitList;

	capsule =
		capsule
		.$comment( 'Imports.' )
		.$varDec( 'jools' );

	// FUTURE: when type checking is there,
	// this might become needed always.

	unitList = this.units.unitList;

	// FUTURE this is akward
	// just put them all together into one simple id list
	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		nameList = this.units.nameListOfUnit( unitList[ a ] );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			capsule =
				capsule.$varDec(
					unitList[ a ] + '_' + nameList[ b ]
				);
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
generator.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		name,
		nameList,
		unitList,
		unitStr;

	capsule = capsule.$comment( 'Node includes.' );

	block =
		$block( )
		.$( 'jools = require( "../../src/jools/jools" )' );

	// generates the unit objects

	unitList = this.units.unitList;

	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		unitStr = unitList[ a ];

		nameList = this.units.nameListOfUnit( unitStr );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			name = nameList[ b ];

			if( unitStr + '_' + name === this.id.global )
			{
				continue;
			}

			block =
				block
				.$assign(
					$var( unitStr + '_' + name ),
					$call(
						'require',
						$string(
							'../../src/'
							+ unitStr
							+ '/'
							+ name
						)
					)
				);
		}
	}

	capsule = capsule.$if( 'SERVER', block );

	return capsule;
};


/*
| Generates the constructor.
*/
generator.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		constructor,
		freezeBlock,
		initCall,
		name;

	capsule =
		capsule.$comment( 'Constructor.' );

	block =
		$block( )
		.$check(
			$if(
				'prototype.__lazy',
				$assign( 'this.__lazy', $objLiteral( ) )
			)
		);

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			$assign(
				$this.$dot( attr.assign ),
				attr.v
			);

		if( !attr.allowsUndefined )
		{
			block = block.append( assign );
		}
		else
		{
			block =
				block
				.$if(
					$differs( attr.v, undefined ),
					assign
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.$( 'this.twig = twig' )
			.$( 'this.ranks = ranks' );
	}


	if( this.ray )
	{
		block = block.$( 'this.ray = ray' );
	}

	// calls the initializer
	if( this.init )
	{
		initCall = $( 'this._init( )' );

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name = this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.addArgument( this.init[ a ] );

					continue;
			}

			attr = this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall = initCall.addArgument( ( attr.v ) );
		}

		block = block.append( initCall );
	}


	// immutes the new object
	freezeBlock = $block( );

	if( this.twig )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( twig )' )
			.$( 'Object.freeze( ranks )' );
	}

	if( this.ray )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( ray )' );
	}

	freezeBlock =
		freezeBlock
		.$( 'Object.freeze( this )' );

	block = block.$if( 'FREEZE', freezeBlock );

	constructor = $func( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor = constructor.$arg( 'inherit', 'inheritance' );

				break;

			case 'ranks' :

				constructor = constructor.$arg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				constructor = constructor.$arg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				constructor =
					constructor.$arg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				constructor =
					constructor.$arg( 'twig', 'twig' );

				break;

			case 'twigDup' :

				constructor =
					constructor.$arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.$arg(
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule
		.$varDec( 'Constructor' )
		.$varDec( 'prototype' )
		.$assign( 'Constructor', constructor );

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.$comment( 'Subclass.' )
			.$call(
				'jools.subclass',
				'Constructor',
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.$comment( 'Prototype shortcut' )
		.$assign( 'prototype', 'Constructor.prototype' )
		.$assign( this.id.$global.$dot( 'prototype' ), 'prototype' );

	return capsule;
};



/*
| Generates the singleton decleration.
*/
generator.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.$comment( 'Singleton' )
		.$varDec( '_singleton' )
		.$assign( '_singleton', null )
	);
};


/*
| Generates the creators variable list.
*/
generator.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList;

	varList = [ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].v.name );
	}

	varList.push( 'inherit' );

	if( this.creatorHasFreeStringsParser )
	{
		varList.push( 'arg', 'a', 'aZ' );
	}

	if( this.twig )
	{
		varList.push(
			'key',
			'rank',
			'ranks',
			'twig',
			'twigDup'
		);
	}

	if( this.ray )
	{
		varList.push( 'ray', 'rayDup' );
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block = block.$varDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
generator.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		thisCheck,
		name,
		receiver;

	receiver = $block( ).$( 'inherit = this' );

	if( this.twig )
	{
		receiver =
			receiver
			.$( 'twig = inherit.twig' )
			.$( 'ranks = inherit.ranks' )
			.$( 'twigDup = false' );
	}

	if( this.ray )
	{
		receiver =
			receiver
			.$( 'ray = inherit.ray' )
			.$( 'rayDup = false' );
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.$assign(
				attr.v,
				$this.$dot( attr.assign )
			);
	}

	thisCheck =
		$if(
			$differs( $this, this.id.global ),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.$elsewise(
				$block( )
				.$assign( 'twig', $objLiteral( ) )
				.$( 'ranks = [ ]' )
				.$( 'twigDup = true' )
			);
	}

	if( this.ray )
	{
		thisCheck =
			thisCheck
			.$elsewise(
				$block( )
				.$( 'ray = [ ]' )
				.$( 'rayDup = true' )
			);
	}

	return block.append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
generator.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		rayDupCheck,
		switchExpr,
		twigDupCheck;

	loop =
		$block( )
		.$assign( 'arg', 'arguments[ a + 1 ]' );

	switchExpr = $switch( 'arguments[ a ]' );

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		switchExpr =
			switchExpr
			.$case(
				$string( name ),
				$if(
					'arg !== undefined',
					$assign( attr.v, 'arg' )
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			$if(
				'twigDup !== true',
				$block( )
				.$( 'twig = jools.copy( twig )' )
				.$( 'ranks = ranks.slice( )' )
				.$( 'twigDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"twig:add"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.push( key )' )
			)
			.$case(
				'"twig:set"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] === undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
			)
			.$case(
				'"twig:insert"',
				$block( )
				.append( twigDupCheck )
				.$( 'key = arg' )
				.$( 'rank = arguments[ a + 2 ]' )
				.$( 'arg = arguments[ a +  3 ]' )
				.$( 'a += 2' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$if(
					'rank < 0 || rank > ranks.length',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.splice( rank, 0, key )' )
			)
			.$case(
				'"twig:remove"',
				$block( )
				.append( twigDupCheck )
				.$if(
					'twig[ arg ] === undefined',
					$fail( )
				)
				.$( 'delete twig[ arg ]' )
				.$( 'ranks.splice( ranks.indexOf( arg ), 1 )' )
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			$if(
				'!rayDup',
				$block( )
				.$( 'ray = ray.slice( )' )
				.$( 'rayDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"ray:init"',
				$block( )
				.$check(
					$if( '!Array.isArray( arg )', $fail( ) )
				)
				.$( 'ray = arg' )
				.$( 'rayDup = "init"' )
			)
			.$case(
				'"ray:append"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.push( arg )' )
			)
			.$case(
				'"ray:insert"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 0, arguments[ ++a + 1 ] )' )
			)
			.$case(
				'"ray:remove"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 1 ) ' )
			)
			.$case(
				'"ray:set"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray[ arg ] = arguments[ ++a + 1 ]' )
			);
	}

	switchExpr =
		switchExpr
		.$default(
			$block( )
			.$check( $block( ).$fail( ) ) // FIXME remove $block
		);

	loop = loop.append( switchExpr );

	block =
		block
		.$for(
			$comma(
				'a = 0',
				'aZ = arguments.length'
			),
			'a < aZ',
			$plusAssign( 'a', 2 ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
generator.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue !== null )
		{
			block =
				block
				.$if(
					$equals( attr.v, undefined ),
					$assign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates a type check of a non set variable.
|
| It is true if the variable fails the check.
*/
generator.prototype.genSingleTypeCheckFailCondition =
	function(
		avar,
		id
	)
{
	switch( id.string )
	{
		case 'Boolean' :

			return $differs( $typeof( avar ), '"boolean"' );

		case 'Integer' :

			return(
				$or(
					$differs( $typeof( avar ), '"number"' ),
					$differs( $call( 'Math.floor', avar ), avar )
				)
			);

		case 'Number' :

			return $differs( $typeof( avar ), '"number"' );

		case 'String' :

			return(
				$and(
					$differs( $typeof( avar ), '"string"' ),
					$not( $instanceof( avar, 'String' ) )
				)
			);

		default :

			return $differs( avar.$dot( 'reflect' ), id.$string );
	}
};


/*
| Generates a type check of a variable.
*/
generator.prototype.genTypeCheckFailCondition =
	function(
		attr
	)
{
	var
		a,
		aZ,
		condArray;

	if(
		!Array.isArray( attr.id )
		|| attr.id.length === 1
	)
	{
		return this.genSingleTypeCheckFailCondition( attr.v, attr.id );
	}

	condArray = [ ];

	for(
		a = 0, aZ = attr.id.length;
		a < aZ;
		a++
	)
	{
		condArray.push(
			this.genSingleTypeCheckFailCondition( attr.v, attr.id[ a ] )
		);
	}

	return $and.apply( $and, condArray );
};



/*
| Generates the creators checks.
*/
generator.prototype.genCreatorChecks =
	function(
		block, // block to append to
		checkin  // do checks only when CHECKin
	)
{
	var
		a,
		attr,
		av,
		aZ,
		check,
		cond,
		name,
		tcheck;

	if( checkin )
	{
		check = $block( );
	}
	else
	{
		check = block;
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		av = attr.v;

		if( !attr.allowsUndefined )
		{
			check =
				check.$if(
					$equals( av, undefined ),
					$fail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.$if(
					$equals( av, null ),
					$fail( )
				);
		}

		switch( attr.id.string )
		{
			case 'Object' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond = $differs( av, null );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond = $differs( av, undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				$and(
					$differs( av, null ),
					$differs( av, undefined )
				);
		}
		else
		{
			cond = null;
		}

		tcheck = this.genTypeCheckFailCondition( attr );

		if( cond )
		{
			check =
				check
				.$if( cond, $if( tcheck, $fail( ) ) );
		}
		else
		{
			check = check.$if( tcheck, $fail( ) );
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	if( checkin )
	{
		block = block.$check( check );
	}

	return block;
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
generator.prototype.genCreatorConcerns =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		args,
		b,
		bZ,
		bAttr,
		cExpr,
		concerns,
		func,
		id,
		member,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		concerns = attr.concerns;

		if( !concerns )
		{
			continue;
		}

		args = concerns.args;

		func = concerns.func;

		id = concerns.id;

		member = concerns.member;

		if( func )
		{
			if( id )
			{
				cExpr = $call( id.$global.$dot( func ) );
			}
			else
			{
				cExpr = $call( func );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FUTURE, make a generator.getCreatorVarName func

				bAttr = this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr = cExpr.addArgument( bAttr.v );
			}
		}
		else
		{
			if( !member )
			{
				throw new Error(
					'concerns neither func or member'
				);
			}

			if( !args )
			{
				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error( 'FIXME' );
				}
				else if( attr.allowsNull )
				{
					cExpr =
						$condition(
							$differs( attr.v, null ),
							attr.v.$dot( member ),
							null
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						$condition(
							$differs( attr.v, undefined ),
							attr.v.$dot( member ),
							null
						);
				}
				else
				{
					cExpr = attr.v.$dot( member );
				}
			}
			else
			{
				cExpr = $call( attr.v.$dot( member ) );

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr =
						this.attributes[ args[ b ] ];

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args[ b ]
						);
					}

					cExpr = cExpr.append( bAttr.v );
				}
			}
		}

		block = block.$assign( attr.v, cExpr );
	}

	return block;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
generator.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		equalsCall,
		name;

	cond = $var( 'inherit' );

	if( this.twig )
	{
		cond = $and( cond, 'twigDup === false' );
	}

	if( this.ray )
	{
		cond = $and( cond, '!rayDup' );
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			cond = $and( cond, $equals( attr.v, null ) );

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.id.string )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'Object' : // FIXME
			case 'String' :

				ceq =
					$equals(
						attr.v,
						// FIXME make a $inherit shortcut
						$var( 'inherit' ).$dot( attr.assign )
					);

				break;

			default :

				equalsCall =
					$call(
						attr.v.$dot( 'equals' ),
						$var( 'inherit' ).$dot( attr.assign )
					);

				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error(
						'cannot have allowsNull and allowsUndefined'
					);
				}

				if( attr.allowsNull )
				{
					ceq =
						$or(
							$equals(
								attr.v,
								$var( 'inherit' ).$dot( attr.assign )
							),
							$and( attr.v, equalsCall )
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						$or(
							$equals(
								attr.v,
								$var( 'inherit' ).$dot( attr.assign )
							),
							$and( attr.v, equalsCall )
						);
				}
				else
				{
					ceq = equalsCall;
				}
		}

		cond = $and( cond, ceq );
	}

	block =
		block.$if(
			cond,
			$return( 'inherit' )
		);

	return block;
};


/*
| Generates the creators return statement
*/
generator.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.$if(
				'!_singleton',
				$( '_singleton = new Constructor( )' )
			)
			.$return( '_singleton' )
		);
	}

	call = $call( 'Constructor' );

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :
			case 'twig' :
			case 'twigDup' :
			case 'ranks' :
			case 'ray' :
			case 'rayDup' :

				call = call.addArgument( name );

				break;

			default :

				attr = this.attributes[ name ];

				call = call.addArgument( attr.v );
		}
	}

	return block.$return( $new( call ) );
};


/*
| Generates the creator.
*/
generator.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block,
		creator;

	capsule =
		capsule.$comment(
			'Creates a new ' + this.id.name + ' object.'
		);

	block = $block( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	if( this.creatorHasFreeStringsParser )
	{
		block = this.genCreatorFreeStringsParser( block );
	}

	block = this.genCreatorDefaults( block, false );

	block = this.genCreatorChecks( block, true );

	block = this.genCreatorConcerns( block );

	block = this.genCreatorUnchanged( block );

	block = this.genCreatorReturn( block );

	creator =
		$func( block )
		.$arg( null, 'free strings' );


	capsule =
		capsule
		.$assign(
			$var( this.id.global ).$dot( 'create' ),
			$assign( 'prototype.create', creator )
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
generator.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList;

	varList = [ ];

	for( name in this.attributes )
	{
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.v.name );
	}

	varList.push( 'arg' );

	if( this.hasJSON )
	{
		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'ranks',
				'twig'
			);
		}

		if( this.ray )
		{
			varList.push( 'jray', 'ray', 'r', 'rZ' );
		}
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block = block.$varDec( varList[ a ] );
	}

	return block;
};

/*
| Generates a fromJSONCreator's JSON parser for one attribute
*/
generator.prototype.genFromJSONCreatorAttributeParser =
	function(
		attr
	)
{
	var
		code, // code to return
		cSwitch, // the code switch
		mif, // the multi if
		sif, // a signle if
		t,
		tZ;

	switch( attr.id.string )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Number' :
		case 'String' :
		case 'Object' : // FIXME remove

			code = $assign( attr.v, 'arg' );

			break;

		default :

			if( !Array.isArray( attr.id ) )
			{
				code =
					$assign(
						attr.v,
						$call(
							attr.id.$global.$dot( 'createFromJSON' ),
							'arg'
						)
					);
			}
			else
			{
				mif = null;

				code = $block( );

				cSwitch = null;

				for(
					t = 0, tZ = attr.id.length;
					t < tZ;
					t++
				)
				{
					switch( attr.id[ t ].string )
					{
						case 'Number' :

							sif =
								$if(
									$equals( $typeof( 'arg' ), '"number"' ),
									$assign( attr.v, 'arg' )
								);

							break;

						default :

							sif = null;

							break;
					}

					if( sif )
					{
						if( !mif )
						{
							mif = sif;
						}
						else
						{
							mif = mif.$elsewise( sif );
						}
					}
					else
					{
						if( cSwitch === null )
						{
							cSwitch =
								$switch( 'arg.type' )
								.$default( $fail( ) );
						}

						cSwitch =
							cSwitch
							.$case(
								attr.id[ t ].$string,
								$assign(
									attr.v,
									$call(
										attr.id[ t ].$global
										.$dot( 'createFromJSON' ),
										'arg'
									)
								)
							);
					}
				}

				if( mif )
				{
					if( cSwitch )
					{
						code = mif.$elsewise( cSwitch );
					}
					else
					{
						code = mif;
					}
				}
				else
				{
					if( !cSwitch )
					{
						throw new Error( );
					}

					code = cSwitch;
				}
			}
	}

	if( attr.allowsNull )
	{
		code =
			$if(
				'arg === null ',
				/* then */ $assign( attr.v, null ),
				/* else */ code
			);
	}

	return code;
};


/*
| Generates the fromJSONCreator's JSON parser.
*/
generator.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		attr,
		name,
		// the switch
		nameSwitch;

	nameSwitch =
		$switch( 'name' )
		.$case(
			'"type"',
			$if(
				$differs( 'arg', this.id.$string ),
				$fail( )
			)
		);

	if( this.twig )
	{
		nameSwitch =
			nameSwitch
			.$case( '"twig"', 'jwig = arg' )
			.$case( '"ranks"', 'ranks = arg' );
	}

	if( this.ray )
	{
		nameSwitch =
			nameSwitch
			.$case( '"ray"', 'jray = arg' );
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name = jsonList[ a ];

		if( name === 'twig' || name === 'ranks' || name === 'ray' )
		{
			continue;
		}

		attr = this.attributes[ name ];

		nameSwitch =
			nameSwitch
			.$case(
				$string( attr.name ),
				this.genFromJSONCreatorAttributeParser( attr )
			);
	}

	block =
		block
		.$forIn(
			'name',
			'json',
			$block( )
			.$( 'arg = json[ name ]' )
			.append( nameSwitch )
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
generator.prototype.genFromJSONCreatorRayProcessing =
	function(
		block // block to append to
	)
{
	var
		idList,
		loopSwitch,
		r,
		rid,
		rZ;

	block =
		block
		.$if( '!jray', $fail( ) )
		.$( 'ray = [ ]' );

	idList = this.ray.idList;

	loopSwitch =
		$switch( 'jray[ r ].type' )
		.$default( $fail( ) );

	for(
		r = 0, rZ = idList.length;
		r < rZ;
		r++
	)
	{
		rid = idList[ r ];

		loopSwitch =
			loopSwitch
			.$case(
				rid.$string,
				$assign(
					'ray[ r ]',
					$call(
						rid.$global.$dot( 'createFromJSON' ),
						'jray[ r ]'
					)
				)
			);
	}

	block =
		block
		.$for(
			$comma(
				'r = 0',
				'rZ = jray.length'
			),
			'r < rZ',
			'++r',
			loopSwitch
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
generator.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		loop,
		switchExpr,
		twigID,
		twigList;

	switchExpr = $switch( 'jval.type' );

	twigList = this.twig.idList;

	for(
		var a = 0, aZ = twigList.length;
		a < aZ;
		a++
	)
	{
		twigID = twigList[ a ];

		switchExpr =
			switchExpr
			.$case(
				twigID.$string,
				$assign(
					'twig[ key ]',
					$call(
						twigID.$global.$dot( 'createFromJSON' ),
						'jval'
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.$default(
			// invalid twig type
			$fail( )
		);

	loop =
		$block( )
		.$( 'key = ranks[ a ]' )
		.$if(
			'!jwig[ key ]',
			// JSON ranks/twig mismatch
			$fail( )
		)
		.$( 'jval = jwig[ key ]' )
		.append( switchExpr );

	block =
		block
		.$assign( 'twig', $objLiteral( ) )
		.$if(
			'!jwig || !ranks',
			// ranks/twig information missing
			$fail( )
		)
		.$for(
			$comma(
				'a = 0',
				'aZ = ranks.length'
			),
			'a < aZ',
			'++a',
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
generator.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call = $( 'Constructor( )' );

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call = call.addArgument( null );

				break;

			case 'rayDup' :
			case 'twigDup' :

				call = call.addArgument( true );

				break;

			case 'ranks' :
			case 'ray' :
			case 'twig' :

				call = call.addArgument( name );

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call = call.addArgument( null );
				}
				else
				{
					call = call.addArgument( attr.v );
				}
		}
	}

	return block.$return( $new( call ) );
};


/*
| Generates the fromJSONCreator.
*/
generator.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList;

	jsonList = [ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.$comment(
			'Creates a new ' + this.id.name + ' object from JSON.'
		);

	funcBlock = this.genFromJSONCreatorVariables( $block( ) );

	funcBlock = this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock = this.genCreatorDefaults( funcBlock, true );

	funcBlock = this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock = this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	if( this.ray )
	{
		funcBlock = this.genFromJSONCreatorRayProcessing( funcBlock );
	}

	funcBlock = this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.$assign(
			$var( this.id.global ).$dot( 'createFromJSON' ),
			$func( funcBlock )
			.$arg( 'json', 'the JSON object' )
		);

	return capsule;
};


/*
| Generates the node include section.
*/
generator.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.$comment( 'Reflection.' )
		.$assign( 'prototype.reflect', this.id.$string );

	capsule =
		capsule
		.$comment( 'Name Reflection.' )
		.$assign(
			'prototype.reflectName',
			$string( this.id.name )
		);

	return capsule;
};


/*
| Generates the jionProto stuff.
*/
generator.prototype.genJionProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.$comment( 'Sets values by path.' )
		.$( 'prototype.setPath = jion_proto.setPath' )

		.$comment( 'Gets values by path' )
		.$( 'prototype.getPath = jion_proto.getPath' );

	if( this.twig )
	{
		capsule =
			capsule
			.$comment( 'Returns a twig by rank.' )
			.$( 'prototype.atRank = jion_proto.twigAtRank' )

			.$comment( 'Gets the rank of a key.' )
			.$(
				'jools.lazyFunctionString( '
				+ 'prototype, "rankOf", jion_proto.twigRankOf '
				+ ')'
			)

			.$comment( 'Gets the rank of a key.' )
			.$( 'prototype.getKey = jion_proto.twigGetKey' )

			.$comment( 'Returns the length of the twig.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.twigLength )'
			)

			.$comment( 'Creates a new unique identifier.' )
			.$( 'prototype.newUID = jion_proto.newUID' );
	}

	if( this.ray )
	{
		capsule =
			capsule
			.$comment( 'Appends an entry to the ray.' )
			.$( 'prototype.append = jion_proto.rayAppend' )

			.$comment( 'Appends an entry to the ray.' )
			.$( 'prototype.appendRay = jion_proto.rayAppendRay' )

			.$comment( 'Returns the length of the ray.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.rayLength )'
			)

			.$comment( 'Gets one entry from the ray.' )
			.$( 'prototype.get = jion_proto.rayGet' )

			.$comment( 'Returns a jion with one entry inserted to the ray.' )
			.$( 'prototype.insert = jion_proto.rayInsert' )

			.$comment( 'Returns the jion with one entry of the ray set.' )
			.$( 'prototype.set = jion_proto.raySet' )

			.$comment( 'Returns a jion with one entry from the ray removed.' )
			.$( 'prototype.remove = jion_proto.rayRemove' );
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
generator.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		name,
		olit;

	block = $block( ).$varDec( 'json' );

	olit =
		$objLiteral( )
		.add( 'type', this.id.$string );

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.add(
				name,
				$this.$dot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.add( 'ranks', 'this.ranks' )
			.add( 'twig', 'this.twig' );
	}

	if( this.ray )
	{
		olit = olit.add( 'ray', 'this.ray' );
	}

	block =
		block
		.$assign( 'json', olit )
		.$if(
			'FREEZE',
			$( 'Object.freeze( json )' )
		)
		.$return(
			$func( $return( 'json' ) )
		);

	capsule =
		capsule
		.$comment( 'Converts a ' + this.id.name + ' into JSON.' )
		.$call(
			'jools.lazyValue',
			'prototype',
			'"toJSON"',
			$func( block )
		);

	return capsule;
};


/*
| Generates the equals condition for an attribute.
*/
generator.prototype.genAttributeEquals =
	function(
		name, // attribute name
		le, // this value expression
		re  // other value expression
	)
{
	var
		attr,
		ceq;

	attr = this.attributes[ name ];

	switch( attr.id.string )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Number' :
		case 'Object' :
		case 'String' :

			ceq = $equals( le, re );

			break;

		default :


			if( attr.allowNull && attr.allowsUndefined )
			{
				throw new Error(
					'cannot have allowsNull and allowsUndefined'
				);
			}

			if( attr.allowsNull)
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, null ),
							$call( le.$dot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, undefined ),
							$call( le.$dot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = $call( le.$dot( 'equals' ), re );
			}
	}

	return ceq;
};


/*
| Generates the equals test.
*/
generator.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond,
		ceq,
		name,
		rayTest,
		rayTestLoopBody,
		twigTest,
		twigTestLoopBody;

	cond = null;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.$comment( 'Tests equality of object.' )
				.$assign(
					'prototype.equals',
					$func( $return( 'this === obj' ) )
					.$arg( 'obj', 'object to compare to' )
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error( );
	}

	capsule = capsule.$comment( 'Tests equality of object.' );

	block = $block( );

	if( this.twig || this.ray )
	{
		block =
			block
			.$varDec( 'a' )
			.$varDec( 'aZ' );

		if( this.twig )
		{
			block =
				block
				.$varDec( 'key' );
		}
	}

	block =
		block
		.$if( 'this === obj', $returnTrue )
		.$if( '!obj', $returnFalse )
		.$if( $differs( 'obj.reflect', this.id.$string ), $returnFalse );

	if( this.twig )
	{
		twigTestLoopBody =
			$block( )
			.$( 'key = this.ranks[ a ]' )
			.$if(
				$or(
					'key !== obj.ranks[ a ]',
					$condition(
						'this.twig[ key ].equals',
						'!this.twig[ key ].equals( obj.twig[ key ] )', // XXX
						'this.twig[ key ] !== obj.twig[ key ]'
					)
				),
				$returnFalse
			);

		twigTest =
			$block( )
			.$if(
				'this.ranks.length !== obj.ranks.length',
				$returnFalse
			)
			.$for(
				$comma(
					'a = 0',
					'aZ = this.ranks.length'
				),
				'a < aZ',
				'++a',
				twigTestLoopBody
			);

		block =
			block
			.$if(
				$or(
					'this.tree !== obj.tree',
					'this.ranks !== obj.ranks'
				),
				twigTest
			);
	}

	if( this.ray )
	{
		rayTestLoopBody =
			$block( )
			.$if(
				$and(
					'this.ray[ a ] !== obj.ray[ a ]',
					$or(
						'!this.ray[ a ].equals',
						'!this.ray[ a ].equals( obj.ray[ a ] )'
					)
				),
				$returnFalse
			);

		rayTest =
			$block( )
			.$if(
				'this.ray.length !== obj.ray.length',
				$returnFalse
			)
			.$for(
				$comma(
					'a = 0',
					// FIXME this.length
					'aZ = this.ray.length'
				),
				'a < aZ',
				'++a',
				rayTestLoopBody
			);

		block = block.$if( 'this.ray !== obj.ray', rayTest );
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				$this.$dot( attr.assign ),
				$var( 'obj' ).$dot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: $and( cond, ceq );
	}

	if( cond )
	{
		block = block.$return( cond );
	}
	else
	{
		block = block.$return( true );
	}

	capsule =
		capsule
		.$assign(
			// FIXME use proto
			'prototype.equals',
			$func( block )
			.$arg( 'obj', 'object to compare to' )
		);

	return capsule;
};


/*
| Generates the alike test(s).
*/
generator.prototype.genAlike =
	function(
		capsule // block to append to
	)
{
	var
		a, aZ,
		alikeList,
		alikeName,
		attr,
		block,
		ceq,
		cond,
		ignores,
		name;

	alikeList = Object.keys( this.alike );

	alikeList.sort( );

	cond = null;

	for(
		a = 0, aZ = alikeList.length;
		a < aZ;
		a++
	)
	{
		alikeName = alikeList[ a ];

		ignores = this.alike[ alikeName ].ignores;

		capsule = capsule.$comment( 'Tests partial equality.' );

		block =
			$block( )
			.$if( 'this === obj', $returnTrue )
			.$if( '!obj', $returnFalse );

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				$and(
					'this.tree === obj.tree',
					'this.ranks === obj.ranks'
				);
		}

		for(
			a = 0, aZ = this.attrList.length;
			a < aZ;
			a++
		)
		{
			name = this.attrList[ a ];

			attr = this.attributes[ name ];

			if( attr.assign === null || ignores[ name ] )
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					$this.$dot( attr.assign ),
					$var( 'obj' ).$dot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: $and( cond, ceq );
		}

		block = block.$return( cond );

		capsule =
			capsule
			.$assign(
				// FIXME use proto
				$var( 'prototype' ).$dot( alikeName ),
				$func( block )
				.$arg( 'obj', 'object to compare to' )
			);
	}

	return capsule;
};


/*
| Returns the generated export block.
*/
generator.prototype.genExport =
	function( block )
{
	return(
		block
		.$comment( 'Export.' )
		.$varDec( this.id.global )
		.$if(
			'SERVER',
			$assign( this.id.global, 'module.exports' ),
			$assign( this.id.global, $objLiteral( ) )
		)
	);
};


/*
| Generates the preamble.
*/
generator.prototype.genPreamble =
	function(
		block // block to append to
	)
{
	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
generator.prototype.genCapsule =
	function(
		block // block to append to
	)
{
	var
		capsule;

	capsule = $block( );

	capsule = capsule.append( $string( 'use strict' ) );

	capsule = this.genNodeIncludes( capsule );

	capsule = this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule = this.genSingleton( capsule );
	}

	capsule = this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule = this.genReflection( capsule );

	capsule = this.genJionProto( capsule );

	if( this.hasJSON )
	{
		capsule = this.genToJSON( capsule );
	}

	capsule = this.genEquals( capsule );

	if( this.alike )
	{
		capsule = this.genAlike( capsule );
	}

	block =
		block
		.$comment( 'Capsule' )
		.append( astCapsule( capsule ) );

	return block;
};


/*
| Generates code from a jools object definition.
*/
generator.generate =
	function(
		jion // the jion definition
	)
{
	var
		// file,
		result,
		gi;

	validator.check( jion );

	gi = generator.create( 'jion', jion );

	result =
		$block( )
		.$comment(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		);

	result = gi.genPreamble( result );

	result = gi.genCapsule( result );

	return result;
};


} )( );
