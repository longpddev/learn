import search from './search.js';
//listText = {
//    'date': {
//        text : {
//             text: text,
//             count: 1
//         }
//    },
//}
// search.search('long').exec(function () {
//     this.openPopup();
// });

class word {
    listText = {};
    constructor() {
        this.wrap = $('#body');
        this.content = this.wrap.find('.tab-content');
        this.tab = this.wrap.find('.nav-tabs');
        this.tabActive = (new Date).toLocaleDateString().replace(/\//g, '_');
        let _this = this;
        let getInCookie = this.getCookie();
        if (getInCookie) {
            this.listText = getInCookie
            this.render();
        }

        this.initTab();
        this.wrap.on('click', '.close', function () {
            let key = $(this).data('key');
            let tabKey = $(this).parents('.tab-pane').attr('id').replace(/_/g, '/');
            if (key in _this.listText[tabKey]) {
                delete _this.listText[tabKey][key]
                $(this).parents('li').fadeOut(function () {
                    _this.render();
                })
            }
        })

        this.wrap.on('click', '.translate_me', function () {
            let data = $(this).data('translate');
            let _this = $(this);

            if (!_this.attr('title') && false)
                $.get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&hl=en-GB&dt=t&dt=bd&dj=1&source=bubble&q=' + data, function (data) {
                    if (data) {
                        let listTrans = '';
                        'dict' in data && data.dict[0].terms.forEach(function (item) {
                            listTrans += item + ', ';
                        })
                        console.log(data.sentences[0].trans)
                        _this.attr('title', data.sentences[0].trans)
                            .attr('data-original-title', data.sentences[0].trans)
                            .attr('data-content', listTrans);
                    }
                })
        })

        this.initFeature();
    }
    storeCookie() {
        Cookies.remove('myLearn');
        Cookies.set('myLearn', JSON.stringify(this.listText), { expires: 365 });
        return this;
    }

    getCookie() {
        return Cookies.get('myLearn') ? JSON.parse(Cookies.get('myLearn')) : {};
    }
    setText(text) {
        let textLower = text.trim().toLowerCase().replace(/\s+/, '_');
        let tabByTime = (new Date).toLocaleDateString();

        if (tabByTime in this.listText && textLower in this.listText[tabByTime]) {
            this.listText[tabByTime][textLower].count++;
        } else if (tabByTime in this.listText) {
            this.listText[tabByTime][textLower] = {
                text: text,
                count: 1
            }
        } else {
            this.listText[tabByTime] = {
                [textLower]: {
                    text: text,
                    count: 1
                }
            }
        }
        this.render();
        return this;
    }
    templateItem(text, key) {
        return `<li><span class="translate_me cs_tooltip" data-translate="${text.text}"> ${text.text} - ${text.count} </span> <span class="close" data-key="${key}">X</span></li>`;
    }

    setTab(content, key) {
        let data = `<li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#${key.replace(/\//g, '_')}" data-active="${key.replace(/\//g, '_')}">
                        ${content}
                    </a>
                    <span class="badge badge-info">${Object.keys(this.listText[key]).length}</span>
                </li>`;
        this.tab.append($(data));
        return this;
    }

    setContent(content, key) {
        let data = `<div id="${key.replace(/\//g, '_')}" class="container tab-pane">
                            <ul>
                                ${content}
                            </ul>
                        </div>`;

        this.content.append($(data));
        return this;
    }

    render() {
        console.log(this.listText)
        this.tab.html('');
        this.content.html('');
        for (let key in this.listText) {
            let list = '';

            if (Object.keys(this.listText[key]).length === 0) {
                delete this.listText[key];
                continue;
            }

            for (let item in this.listText[key]) {
                list += this.templateItem(this.listText[key][item], item);
            }
            this.setTab(key, key);
            this.setContent(list, key);
        }
        this.activeTab();
        this.storeCookie();
        this.initTooltip();
    }

    initTooltip() {
        $('.cs_tooltip').each(function () {
            let translate = $(this).data('translate');
            let _this = $(this);
            $(this).popover(
                {
                    title: "",
                    html: true,
                    content: "<ul><li><a class='whatMean'>What mean!!</a></li></ul>",
                    placement: "right"
                }
            );

            $(this).on('shown.bs.popover', function () {
                setTimeout(function () {
                    _this.popover("hide");
                }, 2000);
            })
        })
    }

    initFeature() {
        // search 
        $('body').on('click', '.popover-body .whatMean', function (e) {
            e.preventDefault();
            let id = $(this).parents('.popover').attr('id');

            if (!id) return;

            let translate = $(`[aria-describedby="${id}"]`).attr('data-translate');

            translate && search.search(translate).exec(function () {
                this.openPopup();
            });
        })
    }

    initTab() {
        let _this = this;
        this.wrap.on('click', '[data-toggle="tab"]', function () {
            _this.tabActive = $(this).data('active');
            _this.activeTab();
        });
    }
    activeTab() {
        $('.tab-pane.active').removeClass('active');
        $('.nav-link.active').removeClass('active');
        $('#' + this.tabActive).tab('show');
        $(`[data-active="${this.tabActive}"]`).addClass('active');
    }
}

let instantWord = new word();
$(function () {
    $('#input').on('change', function () {
        let val = $(this).val();
        val.trim() && instantWord.setText(val), $(this).val('');
    });

    let watch;
    $('#input').on('focus', function () {
        clearTimeout(watch);
        let _this = this;
        watch = setTimeout(function () {
            let val = $(_this).val();
            val.trim() && instantWord.setText(val), $(_this).val('');
        }, 1000);
    })
})
