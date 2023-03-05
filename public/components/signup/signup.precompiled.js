(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signup'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<main-reg class=\"main-reg\">\n    <div class=\"logo-path\" style=\"background-image: url("
    + alias4(((helper = (helper = lookupProperty(helpers,"fonPath") || (depth0 != null ? lookupProperty(depth0,"fonPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fonPath","hash":{},"data":data,"loc":{"start":{"line":2,"column":56},"end":{"line":2,"column":69}}}) : helper)))
    + ")\">\n        <div class=\"logo-table\">\n            <div class=\"logo-pic\" style=\"background-image: url("
    + alias4(((helper = (helper = lookupProperty(helpers,"picPath") || (depth0 != null ? lookupProperty(depth0,"picPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picPath","hash":{},"data":data,"loc":{"start":{"line":4,"column":63},"end":{"line":4,"column":76}}}) : helper)))
    + ")\"></div>\n            <div class=\"logo-text\">Depeche</div>\n            <div class=\"logo-table-text\">Сервис для общения</div>\n        </div>\n    </div>\n    <div class=\"reg-path\">\n        <div class=\"reg-table1\">\n            <div class=\"title\">\n                Регистрация\n            </div>\n            <div class=\"input-block\" data-id=\"1\">\n                <input placeholder=\"Имя\" type=\"text\" class=\"input-field correct-input\">\n                <div class=\"error-text\"></div>\n            </div>\n            <div class=\"input-block\"  data-id=\"2\">\n                <input placeholder=\"Фамилия\" type=\"text\" class=\"input-field incorrect-input\">\n                <div class=\"error-text\">Введите фамилию</div>\n            </div>\n            <div class=\"input-block\"  data-id=\"3\">\n                <input placeholder=\"Электронная почта\" type=\"email\" class=\"input-field correct-input\">\n                <div class=\"error-text\"></div>\n            </div>\n            <div class=\"input-block\"  data-id=\"4\">\n                <input placeholder=\"Пароль\" type=\"password\" class=\"input-field correct-input\">\n                <div class=\"error-text\"></div>\n            </div>\n            <div class=\"input-block\"  data-id=\"5\">\n                <input placeholder=\"Повторите пароль\" type=\"password\" class=\"input-field correct-input\">\n                <div class=\"error-text\"></div>\n            </div>\n            <a class=\"btn\" href=\"news.html\" data-id=\"1\">Зарегистрироваться</a>\n            <a class=\"under-reg-text\" href=\"authorization.html\">У вас уже есть аккаунт? Войти</a>\n        </div>\n    </div>\n</main-reg>\n";
},"useData":true});
})();
