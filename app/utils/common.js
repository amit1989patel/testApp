
module.exports = {
    isExists: function (data, key) {
        if (this.notEmpty(data)) {
            if (this.notEmpty(data[key])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    notEmpty: function (data) {
        var res = true;
        var dataType = typeof data;
        switch (dataType) {
            case 'object':
            case 'array':
                if (data == null || data.length < 1)
                    res = false;
                break;

            case 'undefined':
                res = false;
                break;

            case 'number':
                if (data == "")
                    res = false;
                break;
            case 'string':
                if (data.trim() == "")
                    res = false;
                break;
        }
        return res;
    },
    remove_empty: function (data) {
        var y;
        for (var x in data) {
            y = data[x];
            if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
                delete data[x];
            }
            if (y instanceof Object)
                y = this.remove_empty(y);
        }
        return data;
    },
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
};