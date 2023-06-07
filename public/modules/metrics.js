import Router from "./router";

class Metrics {

    constructor() {
        this.metrics = [];
    }

    addMetric(url) {
        const perfNavigation = window.performance.getEntriesByType("navigation")[0];
        const entries = window.performance.getEntriesByType("resource");
        const memoryInfo = window.performance.memory;

        let fetchEntries = [];
        let resourceEntries = [];

        entries.forEach((request) => {
            if (request.initiatorType === 'fetch') {
                fetchEntries.push(request);
            } else {
                resourceEntries.push(request);
            }
        });

        let totalLoadTime = 0;
        resourceEntries.forEach((entry) => {
            totalLoadTime += entry.duration;
        });

        let totalLoadTimeFetch = 0;
        fetchEntries.forEach((entry) => {
            totalLoadTimeFetch += entry.duration;
        });

        const metricsList = [
            {name: 'Загружаемая страница', metricValue: url, metricValue2: Router.currentPage},
            {name: 'Новых запросов к api', metricValue: fetchEntries.length, metricValue2: fetchEntries},
            {name: 'Время ожидания api запросов', metricValue: totalLoadTimeFetch + 'мс'},
            {name: 'Новых запросов ресурсов', metricValue: resourceEntries.length, metricValue2: resourceEntries },
            {name: 'Время подгрузки ресурсов страницы', metricValue: totalLoadTime  + " мс"},
            {name: 'Всего запросов для данной страницы', metricValue: entries.length },
            {name: 'Общее время ожидание ресурсов', metricValue: totalLoadTimeFetch + totalLoadTime  + " мс"},
            {name: 'Выделенная память', metricValue: (memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'МБ'},
        ];

        window.performance.clearResourceTimings();
        localStorage.setItem('reqCount', '0');



        console.log(metricsList);
        this.metrics.push(metricsList);
    }

}

export default new Metrics();
