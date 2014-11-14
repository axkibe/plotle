/*
| Generates jion objects from a jion definition.
|
| Authors: Axel Kittenberger
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
			'jion.generator',
		node :
			true,
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
	astAnd,
	astArrayLiteral,
	astAssign,
	astBlock,
	astCall,
	astCapsule,
	astCheck,
	astCommaList,
	astComment,
	astCondition,
	astDiffers,
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
	astString,
	astSwitch,
	astThis,
	astTypeof,
	astVar,
	astVList,
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

astAnd = shorthand.astAnd;

astArrayLiteral = shorthand.astArrayLiteral;

astAssign = shorthand.astAssign;

astBlock = shorthand.astBlock;

astCall = shorthand.astCall;

astCapsule = shorthand.astCapsule;

astCheck = shorthand.astCheck;

astCommaList = shorthand.astCommaList;

astComment = shorthand.astComment;

astCondition = shorthand.astCondition;

astDiffers = shorthand.astDiffers;

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

astString = shorthand.astString;

astSwitch = shorthand.astSwitch;

astThis = shorthand.astVar( 'this' );

astTypeof = shorthand.astTypeof;

astVar = shorthand.astVar;

astVList = shorthand.astVList;

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
		assign,
		attr,
		attributes,
		attrList,
		concerns,
		concernsID,
		constructorList,
		defaultValue,
		// sorted init list
		idParts,
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

	units = units.add( id.createFromString( 'jion.proto' ) );

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.node = !!jion.node;

	this.singleton = !!jion.singleton;

	idParts = jion.id.split( '.' );

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
			units = units.add( id.createFromString( jAttr.type ) );
		}
		else
		{
			for(
				t = 0, tZ = jAttr.type.length;
				t < tZ;
				t++
			)
			{
				units = units.add( id.createFromString( jAttr.type[ t ] ) );
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
				defaultValue = shorthand.astFalse;
			}
			else if( jdv === true )
			{
				defaultValue = shorthand.astTrue;
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

				defaultValue = astString( jdv );
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
				type :
					jAttr.type,
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

	this.reference =
		( this.id.unit === this.id.name )
		? this.id.name + 'Obj'
		: this.id.name;

	this.equals = jion.equals;

	this.alike = jion.alike;
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
		unitList;

	capsule =
		capsule
		.astComment( 'Imports.' )
		.astVarDec( 'jion' )
		.astVarDec( 'jools' );

	// FUTURE: when type checking is there,
	// this might become needed always.

	if( this.hasJSON || this.node )
	{
		unitList = this.units.unitList;

		for(
			a = 0, aZ = unitList.length;
			a < aZ;
			a++
		)
		{
			capsule = capsule.astVarDec( unitList[ a ] );
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

	capsule = capsule.astComment( 'Node includes.' );

	block =
		astBlock( )
		.ast( 'jools = require( "../../src/jools/jools" )' );

	// generates the unit objects

	unitList = this.units.unitList;

	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		block =
			block
			.astAssign( unitList[ a ], astObjLiteral( ) );
	}

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
				.astAssign(
					astVar( unitStr ).astDot( name ),
					astCall(
						'require',
						astString(
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
		initCall,
		jionObj,
		name;

	capsule = capsule.astComment( 'Constructor.' );

	block = astBlock( );

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
			astAssign(
				astThis.astDot( attr.assign ),
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
					astDiffers( attr.v, undefined ),
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
	// FIXME use object.freeze and only in checking
	block =
		block
		/*
		.astCheck(
			astBlock( )
				.astCall(
				astObjectFreezeCall.append
				( astThis )
				)
		);
		*/
		.ast( 'jools.immute( this )' );

	if( this.twig )
	{
		// FIXME use object.freeze and only in checking
		block =
			block
			.ast( 'jools.immute( twig )' )
			.ast( 'jools.immute( ranks )' );
	}

	if( this.ray )
	{
		block =
			block
			.astCheck(
				// FIXME remove ast call
				ast( 'Object.freeze( ray )' )
			);
	}

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
		capsule.astVarDec( 'Constructor', constructor );

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.astComment( 'Subclass.' )
			.astCall(
				'jools.subclass',
				'Constructor',
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.astComment( 'Prototype shortcut' )
		.astVarDec( 'prototype' )
		.astAssign( 'prototype', 'Constructor.prototype' );

	// the exported object
	capsule = capsule.astComment( 'Jion.' );

	jionObj =
		astObjLiteral( )
		.add( 'prototype', 'prototype' );

	capsule =
		capsule
		.astVarDec( this.reference )
		.astAssign(
			this.reference,
			astAssign( this.id.astVar, jionObj )
		)
		.astIf(
			'SERVER',
			astAssign( 'module.exports', this.reference )
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
		.astComment( 'Singleton' )
		.astVarDec( '_singleton', null )
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
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].v.name );
	}

	varList.push( 'inherit' );

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
		varList.push(
			'ray',
			'rayDup'
		);
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

	receiver = astBlock( ).ast( 'inherit = this' );

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
			.astAssign(
				attr.v,
				astThis.astDot( attr.assign )
			);
	}

	thisCheck =
		astIf(
			astDiffers( astThis, this.reference ),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.astElsewise(
				astBlock( )
				.astAssign( 'twig', astObjLiteral( ) )
				.astAssign( 'ranks', astArrayLiteral( ) )
				.ast( 'twigDup = true' )
			);
	}

	if( this.ray )
	{
		thisCheck =
			thisCheck
			.astElsewise(
				astBlock( )
				.astAssign( 'ray', astArrayLiteral( ) )
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

	if(
		!this.twig
		&& !this.ray
		&& this.attrList.length === 0
	)
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		astBlock( )
		.astVarDec( 'arg', 'arguments[ a + 1 ]' );

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
			.astCase(
				astString( name ),
				astIf(
					'arg !== undefined',
					astAssign( attr.v, 'arg' )
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			astIf(
				'!twigDup',
				astBlock( )
				.ast( 'twig = jools.copy( twig )' )
				.ast( 'ranks = ranks.slice( )' )
				.ast( 'twigDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				'"twig:add"',
				astBlock( )
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
			.astCase(
				'"twig:set"',
				astBlock( )
				.ast( twigDupCheck )
				.ast( 'key = arg' )
				.ast( 'arg = arguments[ ++a + 1 ]' )
				.astIf(
					'twig[ key ] === undefined',
					astFail( )
				)
				.ast( 'twig[ key ] = arg' )
			)
			.astCase(
				'"twig:insert"',
				astBlock( )
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
			.astCase(
				'"twig:remove"',
				astBlock( )
				.append( twigDupCheck )
				.astIf(
					'twig[ arg ] === undefined',
					astFail( )
				)
				.astDelete( 'twig[ arg ]' )
				.ast( 'ranks.splice( ranks.indexOf( arg ), 1 )' )
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			astIf(
				'!rayDup',
				astBlock( )
				.ast( 'ray = ray.slice( )' )
				.ast( 'rayDup = true' )
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				'"ray:init"',
				astBlock( )
				.ast( 'ray = arg' )
				.ast( 'rayDup = false' )
			)
			.astCase(
				'"ray:append"',
				astBlock( )
				.append( rayDupCheck )
				.ast( 'ray.push( arg )' )
			)
			.astCase(
				'"ray:insert"',
				astBlock( )
				.append( rayDupCheck )
				.ast( 'ray.splice( arg, 0, arguments[ ++a + 1 ] )' )
			)
			.astCase(
				'"ray:remove"',
				astBlock( )
				.append( rayDupCheck )
				.ast( 'ray.splice( arg, 1 ) ' )
			)
			.astCase(
				'"ray:set"',
				astBlock( )
				.append( rayDupCheck )
				.ast( 'ray[ arg ] = arguments[ ++a + 1 ]' )
			);
	}

	switchExpr =
		switchExpr
		.astDefault(
			astBlock( )
			.astCheck(
				astBlock( )
				//.astFail( 'invalid argument' )
				.astFail( )
			)
		);

	loop = loop.append( switchExpr );

	block =
		block
		.astFor(
			astVList( )
				.astVarDec( 'a', 0 )
				.astVarDec( 'aZ', 'arguments.length' ),
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
					astAssign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates a type check of a non set variable.
| It is true if the variable fails the check.
*/
generator.prototype.genSingleTypeCheckFailCondition =
	function(
		avar,
		type
	)
{
	switch( type )
	{
		case 'Boolean' :

			return astDiffers( astTypeof( avar ), '"boolean"' );

		case 'Integer' :

			return(
				astOr(
					astDiffers( astTypeof( avar ), '"number"' ),
					astDiffers( astCall( 'Math.floor', avar ), avar )
				)
			);

		case 'Number' :

			return astDiffers( astTypeof( avar ), '"number"' );

		case 'String' :

			return(
				astAnd(
					astDiffers( astTypeof( avar ), '"string"' ),
					astNot( astInstanceof( avar, 'String' ) )
				)
			);

		default :

			return(
				astDiffers(
					avar.astDot( 'reflect' ),
					astString( type )
				)
			);
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
		!Array.isArray( attr.type )
		|| attr.type.length === 1
	)
	{
		return this.genSingleTypeCheckFailCondition( attr.v, attr.type );
	}

	condArray = [ ];

	for(
		a = 0, aZ = attr.type.length;
		a < aZ;
		a++
	)
	{
		condArray.push(
			this.genSingleTypeCheckFailCondition( attr.v, attr.type[ a ] )
		);
	}

	return(
		astAnd.apply( astOr, condArray )
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
		check = astBlock( );
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

		switch( attr.type )
		{
			case 'Array' :
			case 'Function' :
			case 'Object' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond = astDiffers( av, null );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond = astDiffers( av, undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				astAnd(
					astDiffers( av, null ),
					astDiffers( av, undefined )
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
		block = block.astCheck( check );
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
				cExpr = astCall( id.astVar.astDot( func ) );
			}
			else
			{
				cExpr = astCall( func );
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
						astCondition(
							astDiffers( attr.v, null ),
							attr.v.astDot( member ),
							null
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						astCondition(
							astDiffers( attr.v, undefined ),
							attr.v.astDot( member ),
							null
						);
				}
				else
				{
					cExpr =
						attr.v.astDot( member );
				}
			}
			else
			{
				cExpr =
					astCall(
						attr.v.astDot( member )
					);

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

		block = block.astAssign( attr.v, cExpr );
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
		cond = astAnd( cond, '!twigDup' );
	}

	if( this.ray )
	{
		cond = astAnd( cond, '!rayDup' );
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
			cond = astAnd( cond, astEquals( attr.v, null ) );

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.type )
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
						astVar( 'inherit' ).astDot( attr.assign )
					);

				break;

			default :

				equalsCall =
					astCall(
						attr.v.astDot( 'equals' ),
						astVar( 'inherit' ).astDot( attr.assign )
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
								astVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						astOr(
							astEquals(
								attr.v,
								astVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else
				{
					ceq = equalsCall;
				}
		}

		cond = astAnd( cond, ceq );
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
				astAssign(
					'_singleton',
					astNew( ast( 'Constructor( )' ) )
				)
			)
			.astReturn( '_singleton' )
		);
	}

	call = astCall( 'Constructor' );

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
		capsule.astComment(
			'Creates a new ' + this.id.name + ' object.'
		);

	block = astBlock( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	block = this.genCreatorFreeStringsParser( block );

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
		.astAssign(
			astVar( this.reference ).astDot( 'create' ),
			astAssign( 'prototype.create', creator )
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
		base,
		name,
		// the switch
		nameSwitch,
		t,
		tZ;

	nameSwitch =
		astSwitch( 'name' )
		.astCase(
			'"type"',
			astIf(
				astDiffers( 'arg', this.id.astString ),
				astFail( )
			)
		);

	if( this.twig )
	{
		nameSwitch =
			nameSwitch
			.astCase( '"twig"', 'jwig = arg' )
			.astCase( '"ranks"', 'ranks = arg' );
	}

	if( this.ray )
	{
		nameSwitch =
			nameSwitch
			.astCase( '"ray"', 'jray = arg' );
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

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :
			case 'Object' : // FIXME remove

				attrCode = astAssign( attr.v, 'arg' );

				break;

			default :

				if( !Array.isArray( attr.type ) )
				{
					base = ast( attr.type );

					attrCode =
						astAssign(
							attr.v,
							astCall(
								ast( attr.type ).astDot( 'createFromJSON' ),
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
						t = 0, tZ = attr.type.length;
						t < tZ;
						t++
					)
					{
						attrCode =
							attrCode
							.astCase(
								astString( attr.type[ t ] ),
								astAssign(
									attr.v,
									astCall(
										ast( attr.type[ t ] )
										.astDot( 'createFromJSON' ),
										'arg'
									)
								)
							);
					}
				}
		}

		nameSwitch =
			nameSwitch
			.astCase(
				astString( attr.name ),
				attrCode
			);
	}

	block =
		block
		.astForIn(
			'name',
			'json',
			astBlock( )
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
		.astAssign( 'ray', astArrayLiteral( ) );

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
			.astCase(
				rid.astString,
				astAssign(
					'ray[ r ]',
					astCall(
						rid.astVar.astDot( 'createFromJSON' ),
						'jray[ r ]'
					)
				)
			);
	}

	block =
		block
		.astFor(
			astCommaList( )
			.astAssign( 'r', 0 )
			.astAssign( 'rZ', 'jray.length' ),
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
			.astCase(
				twigID.astString,
				astAssign(
					'twig[ key ]',
					astCall(
						twigID.astVar.astDot( 'createFromJSON' ),
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
		astBlock( )
		.ast( 'key = ranks[ a ]' )
		.astIf(
			'!jwig[ key ]',
			astFail( 'JSON ranks/twig mismatch' )
		)
		.ast( 'jval = jwig[ key ]' )
		.append( switchExpr );

	block =
		block
		.astAssign( 'twig', astObjLiteral( ) )
		.astIf(
			'!jwig || !ranks',
			// ranks/twig information missing
			astFail( )
		)
		.astFor(
			astCommaList( )
			.astAssign( 'a', 0 )
			.astAssign( 'aZ', 'ranks.length' ),
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
		capsule.astComment(
			'Creates a new ' + this.id.name + ' object from JSON.'
		);

	funcBlock = this.genFromJSONCreatorVariables( astBlock( ) );

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
		.astAssign(
			astVar( this.reference ).astDot( 'createFromJSON' ),
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
		.astComment( 'Reflection.' )
		.astAssign( 'prototype.reflect', this.id.astString );

	capsule =
		capsule
		.astComment( 'Name Reflection.' )
		.astAssign(
			'prototype.reflectName',
			astString( this.id.name )
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
		.astComment( 'Sets values by path.' )
		.ast( 'prototype.setPath = jion.proto.setPath' )

		.astComment( 'Gets values by path' )
		.ast( 'prototype.getPath = jion.proto.getPath' );

	if( this.twig )
	{
		capsule =
			capsule
			.astComment( 'Returns a twig by rank.' )
			.ast( 'prototype.atRank = jion.proto.atRank' )

			.astComment( 'Gets the rank of a key.' )
			.ast( 'prototype.rankOf = jion.proto.rankOf' )

			.astComment( 'Creates a new unique identifier.' )
			.ast( 'prototype.newUID = jion.proto.newUID' );
	}

	if( this.ray )
	{
		capsule =
			capsule
			.astComment( 'Appends an entry to the ray.' )
			.ast( 'prototype.append = jion.proto.rayAppend' )

			.astComment( 'Returns the length of the ray.')
			.ast(
				'jools.lazyValue( prototype, "length", jion.proto.rayLength )'
			)

			.astComment( 'Gets one entry from the ray.' )
			.ast( 'prototype.get = jion.proto.rayGet' )

			.astComment( 'Returns a jion with one entry inserted to the ray.' )
			.ast( 'prototype.insert = jion.proto.rayInsert' )

			.astComment( 'Returns the jion with one entry of the ray set.' )
			.ast( 'prototype.set = jion.proto.raySet' )

			.astComment( 'Returns a jion with one entry from the ray removed.' )
			.ast( 'prototype.remove = jion.proto.rayRemove' );
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

	block = astBlock( ).astVarDec( 'json' );

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
				astThis.astDot( attr.assign )
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
		.astAssign( 'json', olit )
		.astCheck(
			ast( 'Object.freeze( json )' )
		)
		.astReturn(
			astFunc( astReturn( 'json' ) )
		);

	capsule =
		capsule
		.astComment( 'Converts a ' + this.id.name + ' into JSON.' )
		.astCall(
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

	switch( attr.type )
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
						astAnd(
							astDiffers( le, null ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					astOr(
						astEquals( le, re ),
						astAnd(
							astDiffers( le, undefined ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = astCall( le.astDot( 'equals' ), re );
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
				.astComment( 'Tests equality of object.' )
				.astAssign(
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
		.astComment( 'Tests equality of object.' );

	block = astBlock( );

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
			astBlock( )
			.ast( 'key = this.ranks[ a ]' )
			.astIf(
				astOr(
					'key !== obj.ranks[ a ]',
					astCondition(
						'this.twig[ key ].equals',
						astNot(
							astCall(
								'this.twig[ key ].equals',
								'obj.twig[ key ]'
							)
						),
						astDiffers(
							'this.twig[ key ]',
							'obj.twig[ key ]'
						)
					)
				),
				astReturnFalse
			);

		twigTest =
			astBlock( )
			.astIf(
				'this.ranks.length !== obj.ranks.length',
				astReturnFalse
			)
			.astFor(
				astCommaList( )
				.astAssign( 'a', 0 )
				.astAssign( 'aZ', 'this.ranks.length' ),
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
				astThis.astDot( attr.assign ),
				astVar( 'obj' ).astDot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: astAnd( cond, ceq );
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
		.astAssign(
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

		capsule = capsule.astComment( 'Tests partial equality.' );

		block =
			astBlock( )
			.astIf( 'this === obj', astReturnTrue )
			.astIf( '!obj', astReturnFalse );

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				astAnd(
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
					astThis.astDot( attr.assign ),
					astVar( 'obj' ).astDot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: astAnd( cond, ceq );
		}

		block = block.astReturn( cond );

		capsule =
			capsule
			.astAssign(
				// FIXME use proto
				astVar( 'prototype' ).astDot( alikeName ),
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
	block = block.astComment( 'Export.' );

	block =
		block
		.astVarDec( this.id.unit )
		.astAssign(
			astVar( this.id.unit ),
			astOr( this.id.unit, astObjLiteral( ) )
		);

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

	capsule = astBlock( );

	capsule = capsule.append( astString( 'use strict' ) );

	if( this.node )
	{
		capsule = this.genNodeIncludes( capsule );
	}

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
		.astComment( 'Capsule' )
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

	/*
	if( skim )
	{
		file =
			astFile( )
			.create(
				'jionID', gi.id.astString.string,
				'hasJSON', gi.hasJSON
			);

	}
	else
	{
		file =
			astFile( )
			.create(
				'header',
					astComment(
						'This is an auto generated file.',
						'',
						'DO NOT EDIT!'
					),
				'preamble', gi.genPreamble( ),
				'capsule', gi.genCapsule( ),
				'jionID', gi.id.astString.string, // FIXME
				'hasJSON', gi.hasJSON
			);
	}

	return file;
	*/

	result =
		astBlock( )
		.astComment(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		);

	result = gi.genPreamble( result );

	result = gi.genCapsule( result );

	return result;
};


} )( );
