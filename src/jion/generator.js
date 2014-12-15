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
	ast,
	$and,
	$assign,
	$block,
	$call,
	astCapsule,
	$check,
	$commaList,
	$comment,
	$condition,
	$differs,
	astEquals,
	astFail,
	astFile,
	astFunc,
	astIf,
	astInstanceof,
	astNew,
	astNot,
	astNumber,
	astObjLiteral,
	astOr,
	astPlus,
	astPlusAssign,
	astReturn,
	astReturnFalse,
	astReturnTrue,
	$string,
	astSwitch,
	astThis,
	astTypeof,
	astVar,
	generator,
	id,
	idRepository,
	jools,
	shorthand,
	validator;


generator = require( '../jion/this' )( module );

id = require( './id' );

idRepository = require( './id-repository' );

shorthand = require( '../ast/shorthand' );

jools = require( '../jools/jools' );

validator = require( './validator' );


/*
| Shorthanding Shorthands.
*/
ast = shorthand.ast;

$and = shorthand.$and;

$assign = shorthand.$assign;

$block = shorthand.$block;

$call = shorthand.$call;

astCapsule = shorthand.astCapsule;

$check = shorthand.$check;

$commaList = shorthand.$commaList;

$comment = shorthand.$comment;

$condition = shorthand.$condition;

$differs = shorthand.$differs;

astEquals = shorthand.astEquals;

astFail = shorthand.astFail;

astFile = shorthand.astFile;

astFunc = shorthand.astFunc;

astIf = shorthand.astIf;

astInstanceof = shorthand.astInstanceof;

astNew = shorthand.astNew;

astNot = shorthand.astNot;

astNumber = shorthand.astNumber;

astObjLiteral = shorthand.astObjLiteral;

astOr = shorthand.astOr;

astPlus = shorthand.astPlus;

astPlusAssign = shorthand.astPlusAssign;

astReturn = shorthand.astReturn;

$string = shorthand.$string;

astSwitch = shorthand.astSwitch;

astThis = shorthand.astVar( 'this' );

astTypeof = shorthand.astTypeof;

astVar = shorthand.astVar;

astReturnTrue = astReturn( true );

astReturnFalse = astReturn( false );


/*
| Converts a CamelCaseString to a dash-seperated-string.
*/
var
camelCaseToDash =
	function( s )
{
	return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase( );
};


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

		this.subclass = subID.astVar;
	}

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		if( !Array.isArray( jAttr.type ) )
		{
			aid = id.createFromString( jAttr.type );

			units = units.add( aid );
		}
		else
		{
			aid = [ ]; // FUTURE idRay

			for(
				t = 0, tZ = jAttr.type.length;
				t < tZ;
				t++
			)
			{
				aid[ t ] = id.createFromString( jAttr.type[ t ] );

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
				defaultValue = shorthand.astNull;
			}
			else if( jdv === undefined )
			{
				defaultValue = shorthand.astUndefined;
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
				defaultValue = astNumber( jAttr.defaultValue );
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
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					|| shorthand.astNull.equals( defaultValue ),
				allowsUndefined :
					jAttr.allowsUndefined
					|| shorthand.astUndefined.equals( defaultValue ),
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns
					? Object.freeze( {
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
					astVar( 'v_' + name )
			} );
	}

	attrList = Object.keys( attributes ).sort ( );

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

	this.constructorList = Object.freeze( constructorList );

	if( jion.twig )
	{
		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substr( 2 ) );
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
		this.ray = idRepository.createFromIDStrings( jion.ray );

		if( jools.isString( jion.ray ) )
		{
			rayDef = require( '../typemaps/' + jion.ray.substr( 2 ) );
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
		.astVarDec( 'jools' );

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
				capsule.astVarDec(
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
		.ast( 'jools = require( "../../src/jools/jools" )' );

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

			block =
				block
				.$assign(
					astVar( unitStr + '_' + name ),
					$call(
						'require',
						$string(
							'../../src/'
							+ camelCaseToDash( unitStr )
							+ '/'
							+ camelCaseToDash( name )
						)
					)
				);
		}
	}

	capsule = capsule.astIf( 'SERVER', block );

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
		jionObj,
		name;

	capsule =
		capsule.$comment( 'Constructor.' );

	block =
		$block( )
		.$check(
			astIf(
				'prototype.__lazy',
				$assign( 'this.__lazy', astObjLiteral( ) )
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
				astThis.$dot( attr.assign ),
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
				.astIf(
					$differs( attr.v, undefined ),
					assign
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.ast( 'this.twig = twig' )
			.ast( 'this.ranks = ranks' );
	}


	if( this.ray )
	{
		block = block.ast( 'this.ray = ray' );
	}

	// calls the initializer
	if( this.init )
	{
		initCall = ast( 'this._init( )' );

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
		// FIXME use object.freeze and only in checking
		freezeBlock =
			freezeBlock
			.ast( 'Object.freeze( twig )' )
			.ast( 'Object.freeze( ranks )' );
	}

	if( this.ray )
	{
		freezeBlock =
			freezeBlock
			.ast( 'Object.freeze( ray )' );
	}

	freezeBlock =
		freezeBlock
		.ast( 'Object.freeze( this )' );

	block = block.$check( freezeBlock );

	constructor = astFunc( block );

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

				constructor = constructor.astArg( 'inherit', 'inheritance' );

				break;

			case 'ranks' :

				constructor = constructor.astArg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				constructor = constructor.astArg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				constructor =
					constructor.astArg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				constructor =
					constructor.astArg( 'twig', 'twig' );

				break;

			case 'twigDup' :

				constructor =
					constructor.astArg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.astArg(
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule
		.astVarDec( 'Constructor' )
		.astVarDec( 'prototype' )
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
		.$assign( 'prototype', 'Constructor.prototype' );

	// the exported object
	capsule = capsule.$comment( 'Jion.' );

	jionObj =
		astObjLiteral( )
		.add( 'prototype', 'prototype' );

	capsule =
		capsule
		.$assign( this.id.global, jionObj );

	capsule =
		capsule
		.astIf(
			'SERVER',
			$assign( 'module.exports', this.id.global )
		);

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
		.astVarDec( '_singleton' )
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
		block = block.astVarDec( varList[ a ] );
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

	receiver = $block( ).ast( 'inherit = this' );

	if( this.twig )
	{
		receiver =
			receiver
			.ast( 'twig = inherit.twig' )
			.ast( 'ranks = inherit.ranks' )
			.ast( 'twigDup = false' );
	}

	if( this.ray )
	{
		receiver =
			receiver
			.ast( 'ray = inherit.ray' )
			.ast( 'rayDup = false' );
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
				astThis.$dot( attr.assign )
			);
	}

	thisCheck =
		astIf(
			$differs( astThis, this.id.global ),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.astElsewise(
				$block( )
				.$assign( 'twig', astObjLiteral( ) )
				.ast( 'ranks = [ ]' )
				.ast( 'twigDup = true' )
			);
	}

	if( this.ray )
	{
		thisCheck =
			thisCheck
			.astElsewise(
				$block( )
				.ast( 'ray = [ ]' )
				.ast( 'rayDup = true' )
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

	switchExpr = astSwitch( 'arguments[ a ]' );

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
				astIf(
					'arg !== undefined',
					$assign( attr.v, 'arg' )
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			astIf(
				'twigDup !== true',
				$block( )
				.ast( 'twig = jools.copy( twig )' )
				.ast( 'ranks = ranks.slice( )' )
				.ast( 'twigDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"twig:add"',
				$block( )
				.ast( twigDupCheck )
				.ast( 'key = arg' )
				.ast( 'arg = arguments[ ++a + 1 ]' )
				.astIf(
					'twig[ key ] !== undefined',
					astFail( )
				)
				.ast( 'twig[ key ] = arg' )
				.ast( 'ranks.push( key )' )
			)
			.$case(
				'"twig:set"',
				$block( )
				.ast( twigDupCheck )
				.ast( 'key = arg' )
				.ast( 'arg = arguments[ ++a + 1 ]' )
				.astIf(
					'twig[ key ] === undefined',
					astFail( )
				)
				.ast( 'twig[ key ] = arg' )
			)
			.$case(
				'"twig:insert"',
				$block( )
				.append( twigDupCheck )
				.ast( 'key = arg' )
				.ast( 'rank = arguments[ a + 2 ]' )
				.ast( 'arg = arguments[ a +  3 ]' )
				.astPlusAssign( 'a', 2 )
				.astIf(
					'twig[ key ] !== undefined',
					astFail( )
				)
				.astIf(
					'rank < 0 || rank > ranks.length',
					astFail( )
				)
				.ast( 'twig[ key ] = arg' )
				.ast( 'ranks.splice( rank, 0, key )' )
			)
			.$case(
				'"twig:remove"',
				$block( )
				.append( twigDupCheck )
				.astIf(
					'twig[ arg ] === undefined',
					astFail( )
				)
				.$delete( 'twig[ arg ]' )
				.ast( 'ranks.splice( ranks.indexOf( arg ), 1 )' )
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			astIf(
				'!rayDup',
				$block( )
				.ast( 'ray = ray.slice( )' )
				.ast( 'rayDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.$case(
				'"ray:init"',
				$block( )
				.ast( 'ray = arg' )
				.ast( 'rayDup = "init"' )
			)
			.$case(
				'"ray:append"',
				$block( )
				.append( rayDupCheck )
				.ast( 'ray.push( arg )' )
			)
			.$case(
				'"ray:insert"',
				$block( )
				.append( rayDupCheck )
				.ast( 'ray.splice( arg, 0, arguments[ ++a + 1 ] )' )
			)
			.$case(
				'"ray:remove"',
				$block( )
				.append( rayDupCheck )
				.ast( 'ray.splice( arg, 1 ) ' )
			)
			.$case(
				'"ray:set"',
				$block( )
				.append( rayDupCheck )
				.ast( 'ray[ arg ] = arguments[ ++a + 1 ]' )
			);
	}

	switchExpr =
		switchExpr
		.astDefault(
			$block( )
			.$check(
				$block( )
				//.astFail( 'invalid argument' )
				.astFail( )
			)
		);

	loop = loop.append( switchExpr );

	block =
		block
		.astFor(
			$commaList( )
			.$assign( 'a', 0 )
			.$assign( 'aZ', 'arguments.length' ),
			'a < aZ',
			astPlusAssign( 'a', 2 ),
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
				.astIf(
					astEquals( attr.v, undefined ),
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

			return $differs( astTypeof( avar ), '"boolean"' );

		case 'Integer' :

			return(
				astOr(
					$differs( astTypeof( avar ), '"number"' ),
					$differs( $call( 'Math.floor', avar ), avar )
				)
			);

		case 'Number' :

			return $differs( astTypeof( avar ), '"number"' );

		case 'String' :

			return(
				$and(
					$differs( astTypeof( avar ), '"string"' ),
					astNot( astInstanceof( avar, 'String' ) )
				)
			);

		default :

			return $differs( avar.$dot( 'reflect' ), id.astString );
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

	return(
		$and.apply( astOr, condArray )
	);
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
				check.astIf(
					astEquals( av, undefined ),
					astFail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.astIf(
					astEquals( av, null ),
					astFail( )
				);
		}

		switch( attr.id.string )
		{
			case 'Array' :
			case 'Function' :
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
				.astIf( cond, astIf( tcheck, astFail( ) ) );
		}
		else
		{
			check = check.astIf( tcheck, astFail( ) );
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
				cExpr = $call( id.astVar.$dot( func ) );
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

	cond = astVar( 'inherit' );

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
			cond = $and( cond, astEquals( attr.v, null ) );

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.id.string )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Number' :
			case 'Object' :
			case 'String' :

				ceq =
					astEquals(
						attr.v,
						astVar( 'inherit' ).$dot( attr.assign )
					);

				break;

			default :

				equalsCall =
					$call(
						attr.v.$dot( 'equals' ),
						astVar( 'inherit' ).$dot( attr.assign )
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
						astOr(
							astEquals(
								attr.v,
								astVar( 'inherit' ).$dot( attr.assign )
							),
							$and( attr.v, equalsCall )
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						astOr(
							astEquals(
								attr.v,
								astVar( 'inherit' ).$dot( attr.assign )
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
		block.astIf(
			cond,
			astReturn( 'inherit' )
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
			.astIf(
				'!_singleton',
				$assign(
					'_singleton',
					astNew( ast( 'Constructor( )' ) )
				)
			)
			.astReturn( '_singleton' )
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

	return block.astReturn( astNew( call ) );
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
		astFunc( block )
		.astArg( null, 'free strings' );


	capsule =
		capsule
		.$assign(
			astVar( this.id.global ).$dot( 'create' ),
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
		block = block.astVarDec( varList[ a ] );
	}

	return block;
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
		attrCode,
		name,
		// the switch
		nameSwitch,
		t,
		tZ;

	nameSwitch =
		astSwitch( 'name' )
		.$case(
			'"type"',
			astIf(
				$differs( 'arg', this.id.astString ),
				astFail( )
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

		if(
			name === 'twig'
			|| name === 'ranks'
			|| name === 'ray'
		)
		{
			continue;
		}

		attr = this.attributes[ name ];

		switch( attr.id.string )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :
			case 'Object' : // FIXME remove

				attrCode = $assign( attr.v, 'arg' );

				break;

			default :

				if( !Array.isArray( attr.id ) )
				{
					attrCode =
						$assign(
							attr.v,
							$call(
								attr.id.astVar.$dot( 'createFromJSON' ),
								'arg'
							)
						);
				}
				else
				{
					attrCode =
						astSwitch( 'arg.type' )
						.astDefault( astFail( ) );

					for(
						t = 0, tZ = attr.id.length;
						t < tZ;
						t++
					)
					{
						attrCode =
							attrCode
							.$case(
								attr.id[ t ].astString,
								$assign(
									attr.v,
									$call(
										attr.id[ t ].astVar
										.$dot( 'createFromJSON' ),
										'arg'
									)
								)
							);
					}
				}
		}

		nameSwitch =
			nameSwitch
			.$case(
				$string( attr.name ),
				attrCode
			);
	}

	block =
		block
		.astForIn(
			'name',
			'json',
			$block( )
			.ast( 'arg = json[ name ]' )
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
		.astIf( '!jray', astFail( ) )
		.ast( 'ray = [ ]' );

	idList = this.ray.idList;

	loopSwitch =
		astSwitch( 'jray[ r ].type' )
		.astDefault( astFail( ) );

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
				rid.astString,
				$assign(
					'ray[ r ]',
					$call(
						rid.astVar.$dot( 'createFromJSON' ),
						'jray[ r ]'
					)
				)
			);
	}

	block =
		block
		.astFor(
			$commaList( )
			.$assign( 'r', 0 )
			.$assign( 'rZ', 'jray.length' ),
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

	switchExpr = astSwitch( 'jval.type' );

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
				twigID.astString,
				$assign(
					'twig[ key ]',
					$call(
						twigID.astVar.$dot( 'createFromJSON' ),
						'jval'
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.astDefault(
			// invalid twig type
			astFail( )
		);

	loop =
		$block( )
		.ast( 'key = ranks[ a ]' )
		.astIf(
			'!jwig[ key ]',
			astFail( 'JSON ranks/twig mismatch' )
		)
		.ast( 'jval = jwig[ key ]' )
		.append( switchExpr );

	block =
		block
		.$assign( 'twig', astObjLiteral( ) )
		.astIf(
			'!jwig || !ranks',
			// ranks/twig information missing
			astFail( )
		)
		.astFor(
			$commaList( )
			.$assign( 'a', 0 )
			.$assign( 'aZ', 'ranks.length' ),
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

	call = ast( 'Constructor( )' );

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

	return block.astReturn( astNew( call ) );
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
			astVar( this.id.global ).$dot( 'createFromJSON' ),
			astFunc( funcBlock )
			.astArg( 'json', 'the JSON object' )
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
		.$assign( 'prototype.reflect', this.id.astString );

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
		.ast( 'prototype.setPath = jion_proto.setPath' )

		.$comment( 'Gets values by path' )
		.ast( 'prototype.getPath = jion_proto.getPath' );

	if( this.twig )
	{
		capsule =
			capsule
			.$comment( 'Returns a twig by rank.' )
			.ast( 'prototype.atRank = jion_proto.twigAtRank' )

			.$comment( 'Gets the rank of a key.' )
			.ast(
				'jools.lazyFunctionString( '
				+ 'prototype, "rankOf", jion_proto.twigRankOf '
				+ ')'
			)

			.$comment( 'Gets the rank of a key.' )
			.ast( 'prototype.getKey = jion_proto.twigGetKey' )

			.$comment( 'Returns the length of the twig.')
			.ast(
				'jools.lazyValue( prototype, "length", jion_proto.twigLength )'
			)

			.$comment( 'Creates a new unique identifier.' )
			.ast( 'prototype.newUID = jion_proto.newUID' );
	}

	if( this.ray )
	{
		capsule =
			capsule
			.$comment( 'Appends an entry to the ray.' )
			.ast( 'prototype.append = jion_proto.rayAppend' )

			.$comment( 'Appends an entry to the ray.' )
			.ast( 'prototype.appendRay = jion_proto.rayAppendRay' )

			.$comment( 'Returns the length of the ray.')
			.ast(
				'jools.lazyValue( prototype, "length", jion_proto.rayLength )'
			)

			.$comment( 'Gets one entry from the ray.' )
			.ast( 'prototype.get = jion_proto.rayGet' )

			.$comment( 'Returns a jion with one entry inserted to the ray.' )
			.ast( 'prototype.insert = jion_proto.rayInsert' )

			.$comment( 'Returns the jion with one entry of the ray set.' )
			.ast( 'prototype.set = jion_proto.raySet' )

			.$comment( 'Returns a jion with one entry from the ray removed.' )
			.ast( 'prototype.remove = jion_proto.rayRemove' );
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

	block = $block( ).astVarDec( 'json' );

	olit =
		astObjLiteral( )
		.add( 'type', this.id.astString );

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
				astThis.$dot( attr.assign )
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
		.$check(
			ast( 'Object.freeze( json )' )
		)
		.astReturn(
			astFunc( astReturn( 'json' ) )
		);

	capsule =
		capsule
		.$comment( 'Converts a ' + this.id.name + ' into JSON.' )
		.$call(
			'jools.lazyValue',
			'prototype',
			'"toJSON"',
			astFunc( block )
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

			ceq = astEquals( le, re );

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
					astOr(
						astEquals( le, re ),
						$and(
							$differs( le, null ),
							$call( le.$dot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					astOr(
						astEquals( le, re ),
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
					astFunc( astReturn( 'this === obj' ) )
					.astArg( 'obj', 'object to compare to' )
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error(
				'invalid equals value'
			);
	}

	capsule =
		capsule
		.$comment( 'Tests equality of object.' );

	block = $block( );

	if( this.twig )
	{
		block =
			block
			.astVarDec( 'a' )
			.astVarDec( 'aZ' )
			.astVarDec( 'key' );
	}

	block =
		block
		.astIf( 'this === obj', astReturnTrue )
		.astIf( '!obj', astReturnFalse );

	if( this.twig )
	{
		twigTestLoopBody =
			$block( )
			.ast( 'key = this.ranks[ a ]' )
			.astIf(
				astOr(
					'key !== obj.ranks[ a ]',
					$condition(
						'this.twig[ key ].equals',
						astNot(
							$call( // FIXME
								'this.twig[ key ].equals',
								'obj.twig[ key ]'
							)
						),
						$differs( // FIXME
							'this.twig[ key ]',
							'obj.twig[ key ]'
						)
					)
				),
				astReturnFalse
			);

		twigTest =
			$block( )
			.astIf(
				'this.ranks.length !== obj.ranks.length',
				astReturnFalse
			)
			.astFor(
				$commaList( )
				.$assign( 'a', 0 ) // FIXME ast()
				.$assign( 'aZ', 'this.ranks.length' ), // FIXME ast()
				'a < aZ',
				'++a',
				twigTestLoopBody
			);

		block =
			block
			.astIf(
				astOr(
					'this.tree !== obj.tree',
					'this.ranks !== obj.ranks'
				),
				twigTest
			);
	}

	// FIXME this.ray!

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
				astThis.$dot( attr.assign ),
				astVar( 'obj' ).$dot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: $and( cond, ceq );
	}

	if( cond )
	{
		block = block.astReturn( cond );
	}
	else
	{
		block = block.astReturn( true );
	}

	capsule =
		capsule
		.$assign(
			// FIXME use proto
			'prototype.equals',
			astFunc( block )
			.astArg( 'obj', 'object to compare to' )
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
			.astIf( 'this === obj', astReturnTrue )
			.astIf( '!obj', astReturnFalse );

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

			if(
				attr.assign === null
				||
				ignores[ name ]
			)
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					astThis.$dot( attr.assign ),
					astVar( 'obj' ).$dot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: $and( cond, ceq );
		}

		block = block.astReturn( cond );

		capsule =
			capsule
			.$assign(
				// FIXME use proto
				astVar( 'prototype' ).$dot( alikeName ),
				astFunc( block )
				.astArg( 'obj', 'object to compare to' )
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
	block = block.$comment( 'Export.' );

	block =
		block
		.astVarDec( this.id.global );

	return block;
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
