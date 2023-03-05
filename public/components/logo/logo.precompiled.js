(function () {
  const template = Handlebars.template; const templates = Handlebars.templates = Handlebars.templates || {}
  templates.logo = template({
    compiler: [8, '>= 4.3.0'],
    main: function (container, depth0, helpers, partials, data) {
      let helper; const alias1 = depth0 != null ? depth0 : (container.nullContext || {}); const alias2 = container.hooks.helperMissing; const alias3 = 'function'; const alias4 = container.escapeExpression; const lookupProperty = container.lookupProperty || function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName]
        }
        return undefined
      }

      return '<div class="logo-path" style="background-image: url( ' +
    alias4(((helper = (helper = lookupProperty(helpers, 'fonPath') || (depth0 != null ? lookupProperty(depth0, 'fonPath') : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { name: 'fonPath', hash: {}, data, loc: { start: { line: 1, column: 53 }, end: { line: 1, column: 66 } } }) : helper))) +
    ' )">\n    <div class="logo-table">\n        <div class="logo-pic" style="background-image: url( ' +
    alias4(((helper = (helper = lookupProperty(helpers, 'logoPath') || (depth0 != null ? lookupProperty(depth0, 'logoPath') : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { name: 'logoPath', hash: {}, data, loc: { start: { line: 3, column: 60 }, end: { line: 3, column: 74 } } }) : helper))) +
    ' )"></div>\n        <div class="logo-text">Depeche</div>\n        <div class="logo-table-text">Сервис для общения</div>\n    </div>\n</div>'
    },
    useData: true
  })
})()
