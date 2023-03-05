(function () {
  const template = Handlebars.template; const templates = Handlebars.templates = Handlebars.templates || {}
  templates.createPost = template({
    compiler: [8, '>= 4.3.0'],
    main: function (container, depth0, helpers, partials, data) {
      let helper; const lookupProperty = container.lookupProperty || function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName]
        }
        return undefined
      }

      return '<div class="post-creator-profile">\n    <img src=' +
    container.escapeExpression(((helper = (helper = lookupProperty(helpers, 'avatar') || (depth0 != null ? lookupProperty(depth0, 'avatar') : depth0)) != null ? helper : container.hooks.helperMissing), (typeof helper === 'function' ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}), { name: 'avatar', hash: {}, data, loc: { start: { line: 2, column: 13 }, end: { line: 2, column: 25 } } }) : helper))) +
    '>\n</div>\n<div class="post-input post-creator-element">\n    <input placeholder="Добавить запись">\n</div>\n<div class="post-creator-element">\n    <img src="static/img/post_icons/photo.svg">\n    <img src="static/img/post_icons/photo_hover.svg">\n</div>\n<div class="post-creator-element">\n    <img src="static/img/post_icons/smile.svg">\n    <img src="static/img/post_icons/smile_hover.svg">\n</div>'
    },
    useData: true
  })
})()
