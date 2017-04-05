/*
| The roster of all resources.
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
	jion,
	server_resource,
	server_resourceRay,
	stringRay;


jion = require( 'jion' );

server_resource = require( './resource' );

server_resourceRay = require( './resourceRay' );

stringRay = jion.stringRay.stringRay; // FUTURE

module.exports =
server_resourceRay.create( 'ray:init', [
	server_resource.create(
		'aliases', stringRay( [ 'ideoloom.html', 'index.html', '' ] ),
		'filePath', 'media/ideoloom.html',
		'maxage', 'short',
		'postProcessor', 'indexHtml'
	),
	server_resource.create(
		'aliases', stringRay( [ 'devel.html' ] ),
		'filePath', 'media/devel.html',
		'devel', true,
		'postProcessor', 'develHtml'
	),
	server_resource.create(
		'aliases', stringRay( [ 'favicon.ico', 'media-favicon.ico' ] ),
		'filePath', 'media/favicon.ico',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'import/webfont.js',   // FIXME add version info
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'import/opentype.js',  // FIXME add version info
		'maxage', 'long'
	),
	server_resource.create(
		'aliases', stringRay( [ 'jion-proto.js' ] ),
		'coding', 'utf-8',
		'data', jion.proto.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringRay( [ 'jioncode-path.js' ] ),
		'coding', 'utf-8',
		'data', jion.path.jionCode,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringRay( [ 'jion-path.js' ] ),
		'coding', 'utf-8',
		'data', jion.path.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringRay( [ 'jioncode-pathRay.js' ] ),
		'coding', 'utf-8',
		'data', jion.pathRay.jionCode,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringRay( [ 'jion-pathRay.js' ] ),
		'coding', 'utf-8',
		'data', jion.pathRay.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/math/limit.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/math/maxInteger.js',
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/hash/sha1.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/session/uid.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/error.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/mark/text.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/mark/node.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/generic.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/grow.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/insert.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/join.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/remove.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/ray.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/set.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/shrink.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/split.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/wrap.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/change/wrapRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),

	server_resource.create(
		'filePath', 'src/gleam/color.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/border.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/borderRay.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/point.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/size.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/rect.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/rectGroup.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/colorStop.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/askew.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/gradient/radial.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/token.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/line.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/flow/block.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/fontPool.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/constants.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/margin.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/gleam/font.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/display/canvas.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/mask.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/border.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/fill.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/paint.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/text.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/window.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/glint/ray.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/measure.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/line.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/round.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape/start.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shape.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/shapeRay.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/roundRect.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/ellipse.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/line.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/connect.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/arrow.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/facet.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/facetRay.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/settings.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gleam/transform.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/widget.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/button.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/input.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/checkbox.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/widget/label.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/spaceRef.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/pointGroup.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/acquire.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/alter.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/auth.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/error.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/register.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/reply/update.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/acquire.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/alter.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/auth.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/register.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/request/update.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/requestWrap.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/requestWrapRay.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/channel.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/ajax.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/net/link.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/doTracker.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/disc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/createDisc.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/mainDisc.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/disc/jockey.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/result/hover.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/form.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/loading.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/login.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/signUp.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/space.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/moveTo.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/user.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/welcome.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/noAccessToSpace.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/nonExistingSpace.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/form/jockey.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/fonts.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/controls.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/highlight.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconCheck.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconMoveTo.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconNormal.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconHand.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconRemove.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/iconSelect.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericButton.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericCheckbox.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/genericInput.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/formFacet.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/mainDisc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/createDisc.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/selection.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/frame.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/scrollbar.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/handles.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/label.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/note.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/portal.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/relation.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/loading.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/login.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/moveto.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/noAccessToSpace.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/nonExistingSpace.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/select.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/signup.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/space.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/user.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/gruga/welcome.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/para.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/frame.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/scrollbar.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/doc.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/fabric/note.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/fabric/label.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/relation.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/portal.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/fabric/space.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/para.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/doc.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/item.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/docItem.js',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/visual/space.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/label.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/note.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/portal.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/relation.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/itemRay.js',
		'hasJion', true,
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/shell/system.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/text.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/caret.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/items.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/range.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/visual/mark/widget.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/create.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/createGeneric.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/createRelation.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/dragItems.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/form.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/pan.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/resizeItems.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/scrolly.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/action/select.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/user/creds.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/user/passhash.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/root.js',
		'hasJion', true,
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'src/shell/fontloader.js',
		'inBundle', true
	),
	server_resource.create(
		'filePath', 'media/dejavusans/style.css',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/cursor.css',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/DejaVuSans.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/DejaVuSansCondensed.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/Arimo-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/OpenSans-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/SourceSansPro-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/Oxygen-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/Quicksand-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'fonts/Roboto-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.eot',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.svg',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/boldoblique-webfont.woff',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/bold-webfont.eot',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/bold-webfont.svg',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/bold-webfont.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/bold-webfont.woff',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.eot',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.svg',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/oblique-webfont.woff',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/webfont.eot',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/webfont.svg',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/webfont.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'media/dejavusans/webfont.woff',
		'maxage', 'long'
	),

	// --- TestPad ---
	server_resource.create(
		'aliases', stringRay( [ 'testpad.html' ] ),
		'filePath', 'media/testpad.html',
		'devel', true,
		'postProcessor', 'testPadHtml'
	),
	server_resource.create(
		'filePath', 'src/testpad/repository.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/testpad/action.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'src/testpad/root.js',
		'devel', true,
		'hasJion', true,
		'inTestPad', true
	)
] );


} )( );
