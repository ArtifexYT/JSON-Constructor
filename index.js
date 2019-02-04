const path = require("path");
const fs = require("fs-extra");

class JSONMaker {
    constructor(path) {
        this.json = {};
        if (path) this.load(path);
    }

    addField(title, data) {
        if (this.json[title]) return "This value already exists in the file.";
        this.json[title] = data;
        return this;
    }

    removeField(title) {
        if (!this.json[title]) return "This value doesn't exist in the file.";
        delete this.json[title];
        return this;
    }

    exists(title) {
        return !!this.json[title];
    }

    write(path) {
        return fs.writeFile(path, JSON.stringify(this.json, null, 4));
    }

    _verifyJSON(data) {
        return new Promise((resolve, reject) => {
            try {
                JSON.parse(data);
                return resolve();
            } catch (e) {
                return reject(e);
            }
        });
    }

    load(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) return reject(err);

                this._verifyJSON(data).then(() => {
                    this.json = JSON.parse(data);
                    return resolve();
                }).catch(err2 => reject(err2));
            });
        });
    }

    clear() {
        this.json = {};
    }

    get(title) {
        return this.json[title] || null;
    }
}

module.exports = JSONMaker;