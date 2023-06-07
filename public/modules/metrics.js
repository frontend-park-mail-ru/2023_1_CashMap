import Router from "./router";

class Metrics {

    constructor() {
        this.metrics = [];
    }

    addMetric(url) {
        const perfNavigation = window.performance.getEntriesByType("navigation")[0];
        const resourceEntries = window.performance.getEntriesByType("resource");
        const memoryInfo = window.performance.memory;

        let totalLoadTime = 0;
        resourceEntries.forEach((entry) => {
            totalLoadTime += entry.duration;
        });

        const metricsList = [
            {name: 'Загружаемая страница', metricValue: url, metricValue2: Router.currentPage},
            /*{name: 'Время загрузки страницы', metricValue: perfNavigation.loadEventEnd - perfNavigation.navigationStart  + " мс"},
            {name: 'Время установки соединения', metricValue: perfNavigation.connectEnd - perfNavigation.connectStart  + " мс"},
            {name: 'Время отправки запроса', metricValue: perfNavigation.responseStart - perfNavigation.requestStart  + " мс"},
            {name: 'Время получения ответа', metricValue: perfNavigation.responseEnd - perfNavigation.responseStart  + " мс"},*/
            {name: 'Новых запросов к api', metricValue: Number(localStorage.getItem('reqCount'))},
            {name: 'Новых запросов ресурсов', metricValue: resourceEntries.length},
            {name: 'Время подгрузки ресурсов страницы', metricValue: totalLoadTime  + " мс"},
            {name: 'Выделенная память', metricValue: (memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'МБ'},
        ];

        window.performance.clearResourceTimings();
        localStorage.setItem('reqCount', '0');

        console.log(metricsList);
        this.metrics.push(metricsList);
    }

}

export default new Metrics();
