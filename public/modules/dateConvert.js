class DateConvert {

    constructor() {

    }

    fromBackToPost(date) {
        const oldDate = new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const hz = new Date();
        hz.setDate(today.getDate() - 2);

        let res = null;

        if (oldDate.getDate() === today.getDate()) {
            res = new Date(date).toLocaleTimeString().split(':').slice(0, 2).join(':');
        } else if (oldDate.getDate() === yesterday.getDate()) {
            res = 'вчера в ' + new Date(date).toLocaleTimeString().split(':').slice(0, 2).join(':');
        } else if (oldDate.getDate() === hz.getDate()) {
            res = 'позавчера';
        } else {
            res = new Date(oldDate).toLocaleDateString();
        }

        return res;
    }

    fromBackToMsg(date) {
        const oldDate = new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const hz = new Date();
        hz.setDate(today.getDate() - 2);

        let res = null;

        if (oldDate.getDate() === today.getDate()) {
            res = new Date(date).toLocaleTimeString().split(':').slice(0, 2).join(':');
        } else if (oldDate.getDate() === yesterday.getDate()) {
            res = 'вчера';
        } else if (oldDate.getDate() === hz.getDate()) {
            res = 'позавчера';
        } else {
            res = new Date(oldDate).toLocaleDateString();
        }

        return res;
    }
}

export default new DateConvert();
