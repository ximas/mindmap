function Menu(id) {
    this.id = id;
    this.init = () => {
        let button = $(`#${id}`)
        let menu = button.children()
        let parent = button.parent();
        menu.addClass('menu-outer');
        menu.attr('id', `menu-outer-${id}`)
        $.each(menu.children('div'), (i, elem) => {
            $(elem).addClass('menu-item noselect');
        });
        parent.append(menu.prop('outerHTML'));
        parent.addClass('menu-container');
        menu.remove();
        button.addClass('menu-button noselect');
        button.html(button.attr('name'));

        $(`#${id}`).click(this.show);
        $(`#menu-outer-${id}`).mouseleave(this.hide);
    }
    this.show = () => {
        $('.menu-outer').hide();
        $(`#menu-outer-${id}`).show();
    }
    this.hide = () => {
        $(`#menu-outer-${id}`).hide();
    }
    this.add = (text, handler) => {
        let menu = $(`#${this.id}`).siblings('.menu-outer');
        if (!this.findListItem(text)) {
            let elem = $('<div></div>').addClass('menu-item noselect').html(text).click(handler);
            menu.append(elem);
        }
    }
    this.remove = text => {
        let item = this.findListItem(text);
        if (item) {
            item.remove();
        }
    }
    this.findListItem = text => {
        let menu = $(`#${this.id}`).siblings('.menu-outer');
        for (let elem of menu.children()) {
            if ($(elem).html() == text) {
                return $(elem);
            }
        }
        return null;
    }
}
