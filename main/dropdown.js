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
        parent.append(menu.prop('outerHTML'))
        menu.remove();
        button.addClass('menu-button noselect');
        button.html(button.attr('name'));

        $(`#${id}`).click(this.show);
        $(`#menu-outer-${id}`).mouseleave(this.hide);
    }
    this.show = () => {
        $(`#menu-outer-${id}`).show();
    }
    this.hide = () => {
        $(`#menu-outer-${id}`).hide();
    }
}
