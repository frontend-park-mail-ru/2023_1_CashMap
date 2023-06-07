import Router from "./router";

class Metrics {

    constructor() {
        this.metrics = [];
    }

    addMetric(url) {
        const perfNavigation = window.performance.getEntriesByType("navigation")[0];
        const resourceEntries = window.performance.getEntriesByType("resource");
        const memoryInfo = window.performance.memory;

        var performanceEntries = performance.getEntries();

        var requests = performanceEntries.filter(function(entry) {
            return entry.initiatorType === 'xmlhttprequest';
        });

        var requestCount = requests.length;

        const metricsList = [
            {name: 'Загружаемая страница', metricValue: url, metricValue2: Router.currentPage},
            /*{name: '', metricValue: ''},
            {name: 'Время загрузки страницы', metricValue: perfNavigation.loadEventEnd - perfNavigation.navigationStart  + " мс"},
            {name: 'Время установки соединения', metricValue: perfNavigation.connectEnd - perfNavigation.connectStart  + " мс"},
            {name: 'Время отправки запроса', metricValue: perfNavigation.responseStart - perfNavigation.requestStart  + " мс"},
            {name: 'Время получения ответа', metricValue: perfNavigation.responseEnd - perfNavigation.responseStart  + " мс"},*/
            {name: '', metricValue: ''},
            {name: 'Всего запросов', metricValue: localStorage.getItem('reqCount')},
            {name: 'Всего запросов', metricValue: requestCount},
            {name: '', metricValue: ''},
            {name: 'Выделенная память', metricValue: (memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'МБ'},
            {name: '', metricValue: ''},
        ];

        console.log(metricsList);
        this.metrics.push(metricsList);
    }

}

export default new Metrics();
