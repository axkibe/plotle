/*
| The roster of all resources.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	resource;

resource = require( './resource' );


module.exports =
[
	resource.create(
		'aliases',
			[
				'ideoloom.html',
				'index.html',
				''
			],
		'filePath',
			'media/ideoloom.html',
		'maxage',
			'short',
		'postProcessor',
			'indexHtml'
	),
	resource.create(
		'aliases',
			[ 'devel.html' ],
		'filePath',
			'media/devel.html',
		'devel',
			true,
		'postProcessor',
			'develHtml'
	),
	resource.create(
		'filePath',
			'media/favicon.ico',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'webfont/webfont.js',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'src/jion/proto.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jools/jools.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jools/sha1.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/jion/path.js',
		'inBundle',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jion/sign.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jion/sign-ray.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jion/change.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jion/change-ray.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/jion/change-wrap.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/point.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/rect.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/shell/fontpool.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/shell/theme.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/constants.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/compass.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/margin.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/font.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/fabric.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/measure.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/shape.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/round-rect.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/ellipse.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/line.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/euclid/view.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/design/anchor-point.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/design/anchor-rect.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/design/anchor-ellipse.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/widget.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/getstyle.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/button.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/input.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/checkbox.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/widgets/label.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/style.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/accent.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/net/channel.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/net/ajax.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/net/link.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/peer.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/icons/normal.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/icons/moveto.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/icons/remove.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/discs/disc.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/discs/createdisc.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/discs/maindisc.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/discs/jockey.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/reply/hover.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/form.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/login.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/signup.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/moveto.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/user.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/welcome.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/no-access-to-space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/non-existing-space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/forms/jockey.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/maindisc.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/createdisc.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/login.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/moveto.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/no-access-to-space.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/non-existing-space.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/signup.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/space.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/user.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/gruga/welcome.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/visual/para.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/visual/scrollbar.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/visual/doc.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/visual/item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/visual/doc-item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/visual/note.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/visual/label.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/visual/relation.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/visual/portal.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/visual/space.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/shell/stubs.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/system.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/marks/caret.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/marks/item.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/marks/range.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/marks/vacant.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/marks/widget.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/action.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/none.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/create-generic.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/create-relation.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/item-drag.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/item-resize.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/pan.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/actions/scrolly.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/root.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'src/shell/fontloader.js',
		'inBundle',
			true
	),
	resource.create(
		'filePath',
			'media/dejavusans/style.css',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.eot',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.svg',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.ttf',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.woff',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/bold-webfont.eot',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/bold-webfont.svg',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/bold-webfont.ttf',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/bold-webfont.woff',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/oblique-webfont.eot',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/oblique-webfont.svg',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/oblique-webfont.ttf',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/oblique-webfont.woff',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/webfont.eot',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/webfont.svg',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/webfont.ttf',
		'maxage',
			'long'
	),
	resource.create(
		'filePath',
			'media/dejavusans/webfont.woff',
		'maxage',
			'long'
	),

	// --- TestPad ---
	resource.create(
		'aliases',
			[ 'testpad.html' ],
		'filePath',
			'media/testpad.html',
		'devel',
			true,
		'postProcessor',
			'testPadHtml'
	),
	resource.create(
		'filePath',
			'src/testpad/iface-sym.js',
		'devel',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/testpad/action.js',
		'devel',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'filePath',
			'src/testpad/testpad.js',
		'devel',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	resource.create(
		'aliases',
			[ 'torrent/PeridexisErrant%20LNP%20r53.torrent' ],
		'filePath',
			'torrent/PeridexisErrant%20LNP%20r53.torrent'
	),
];


} )( );
