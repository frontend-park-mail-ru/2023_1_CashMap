(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<main-auth class=\"main-auth\">\n    <div class=\"auth-path\">\n        <div class=\"auth-table\">\n            <div class=\"title\">\n                Авторизация\n            </div>\n            <div class=\"input-block\" data-id=\"6\">\n                <input placeholder=\"Электронная почта\" type=\"email\" class=\"input-field correct-input\" id=\"email-field\">\n                <div class=\"error-text\" id=\"email-error\"></div>\n            </div>\n            <div class=\"input-block\"  data-id=\"7\">\n                <input placeholder=\"Пароль\" type=\"password\" class=\"input-field incorrect-input\" id=\"password-field\">\n                <div class=\"error-text\" id=\"password-error\">Введите пароль</div>\n            </div>\n            <a class=\"btn\" data-id=\"2\" id=\"auth\">Войти</a>\n        </div>\n        <div class=\"reg-table\">\n            <div class=\"reg\">\n                <a class=\"create-new-account\">У вас еще нет аккаунта? Зарегистрироваться</a>\n                <div class=\"text-reg\">\n                    После успешной регистрации вы получите доступ ко всем функциям Depeche\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"logo-path\" style=\"background-image: url("
    + alias4(((helper = (helper = lookupProperty(helpers,"fonPath") || (depth0 != null ? lookupProperty(depth0,"fonPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fonPath","hash":{},"data":data,"loc":{"start":{"line":26,"column":56},"end":{"line":26,"column":69}}}) : helper)))
    + ")\">\n        <div class=\"logo-table\">\n            <div class=\"logo-pic\" style=\"background-image: url("
    + alias4(((helper = (helper = lookupProperty(helpers,"picPath") || (depth0 != null ? lookupProperty(depth0,"picPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picPath","hash":{},"data":data,"loc":{"start":{"line":28,"column":63},"end":{"line":28,"column":76}}}) : helper)))
    + ")\"></div>\n            <div class=\"logo-text\">Depeche</div>\n            <div class=\"logo-table-text\">Сервис для общения</div>\n        </div>\n    </div>\n</main-auth>";
},"useData":true});
})();
