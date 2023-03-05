(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sidebar'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        \n            <a href="
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"ref") : depth0), depth0))
    + ">\n                <li class=\"nav-item\">\n                    <img class=\"nav-item-icon\" src="
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"iconPath") : depth0), depth0))
    + "/>\n                    <img class=\"nav-item-icon\" src="
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"hoveredIconPath") : depth0), depth0))
    + "/>\n                    <div class=\"nav-item-text\"><span>"
    + alias2(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":14,"column":53},"end":{"line":14,"column":64}}}) : helper)))
    + "</span></div>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"notifies") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":20},"end":{"line":17,"column":27}}})) != null ? stack1 : "")
    + "                </li>\n            </a>\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <div class=\"nav-item-notify\"><p>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"notifies") || (depth0 != null ? lookupProperty(depth0,"notifies") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"notifies","hash":{},"data":data,"loc":{"start":{"line":16,"column":56},"end":{"line":16,"column":70}}}) : helper)))
    + "</p></div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"logo-block\">\n    <img class=\"logo-pic\" src="
    + alias4(((helper = (helper = lookupProperty(helpers,"logoPath") || (depth0 != null ? lookupProperty(depth0,"logoPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoPath","hash":{},"data":data,"loc":{"start":{"line":2,"column":30},"end":{"line":2,"column":44}}}) : helper)))
    + "/>\n    <div class=\"logo-text\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"logoTitle") || (depth0 != null ? lookupProperty(depth0,"logoTitle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoTitle","hash":{},"data":data,"loc":{"start":{"line":3,"column":27},"end":{"line":3,"column":42}}}) : helper)))
    + "</div>\n</div>\n\n<div class=\"nav-list\">\n    <ol>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"itemsList") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":8},"end":{"line":21,"column":17}}})) != null ? stack1 : "")
    + "    </ol>\n</div>\n";
},"useData":true});
})();