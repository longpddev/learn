class search {

    searchForm = {
        url: 'https://www.dictionary.com/browse/$search',
        getBy: [
            function () {
                return this.searchForm.dom.querySelector('head > style:first-child');
            }.bind(this),
            function () {
                return this.searchForm.dom.querySelector('#top-definitions-section').parentNode;
            }.bind(this)
        ],
        dom: undefined,
    };
    maskURl = '/search?url=$url';
    searchText;
    popup;
    constructor() {
        this.popup = {
            $main: $('#myModal'),
            $content: $('#myModal .modal-body'),
        };
    }

    search(text) {
        this.searchText = text;
        return this;
    }

    callSearch() {
        let _this = this;
        if (_this.searchText) {
            let prepareUrl = _this.searchForm.url.replace('$search', _this.searchText);

            return fetch(_this.maskURl.replace('$url', encodeURIComponent(prepareUrl))).then((res) => {
                _this.searchForm.$dom = undefined;
                return res.text();
            }).catch(reject => {
                console.log(reject);
            })
        } else {
            return Promise.reject('cannot find text search');
        }
    }

    exec(callback) {
        let _this = this;
        return this.callSearch().then(function (res) {
            let dom = new DOMParser().parseFromString(res, 'text/html');
            _this.searchForm.dom = dom;
            return _this.searchForm.dom;
        }).then(res => {
            if (typeof callback === 'function') {
                callback.call(_this, res);
            }
            return res;
        });
    }

    openPopup() {
        let html = '';
        let _this = this;
        this.popup.$content.html('')
        try {
            this.searchForm.getBy.forEach(function (callback) {
                let data = callback();
                this.popup.$content.append(data)
            }.bind(this));
        } catch (e) {
            this.popup.$content.html('<h1> Cannot find result </h1>');
        }

        this.popup.$main.modal('show');
    }
}

export default (new search);