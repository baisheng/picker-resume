'use strict';

export default class extends think.controller.base {
    /**
     * init
     * @param  {[type]} http [description]
     * @return {[type]}      [description]
     */
    init(http) {
        super.init(http);
    }

    async __before() {
        let model = this.model('options');

        let options = await model.getOptions();
        this.options = options;

        if (!this.isAjax()) {
            this.assign('options', options);
        }

        // let theme = this.options.current_theme;
        let theme = "material";
        // "/resume_themes/material"

        this.THEME_VIEW_PATH = `${think.ROOT_PATH}${think.sep}www${think.sep}resume_themes${think.sep}${theme}${think.sep}`;
    }

    /**
     * display view page
     * @param  {} name []
     * @return {}      []
     */
    async displayView(name) {
        return this.display(this.THEME_VIEW_PATH + name + '.html');
    }
}
