(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['commentArea'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"comments-list\">\r\n    \r\n</div>\r\n\r\n    <div class=\"create-comment-section\">\r\n        <div class=\"comment-profile-icon\">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"photoPath") : stack1), depth0))
    + ">\r\n        </div>\r\n\r\n        <div class=\"comment-input-block\">\r\n            <input placeholder=\"Написать комментарий\">\r\n        </div>\r\n\r\n        <div class=\"attach-photo-icon\">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"attachPhotoIconPath") : stack1), depth0))
    + ">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"attachHoveredPhotoIconPath") : stack1), depth0))
    + ">\r\n        </div>\r\n\r\n        <div class=\"choose-emoji-icon\">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"attachSmileIconPath") : stack1), depth0))
    + ">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"attachHoveredSmileIconPath") : stack1), depth0))
    + ">\r\n        </div>\r\n\r\n        <div class=\"send-icon\">\r\n            <img src="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"sendIconPath") : stack1), depth0))
    + ">\r\n        </div>\r\n</div>";
},"useData":true});
})();