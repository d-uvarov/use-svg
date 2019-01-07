const fs = require('fs');
const path = require("path");
const tagSearch = 'icon';

let files = {};
let symbols = [];
let regExp = new RegExp(`<${tagSearch}(.+?)\\/>`, 'i');

/**
 *
 * @param attr
 * @param content
 * @returns {*}
 */
function getAttrValue(attr, content) {
    let regx = new RegExp(`${attr}="(.+?)"`, "g");
    let find = regx.exec(content);

    if (find) {
        return find[1];
    }

    return find;
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let options = this.query;

    if (!options.path || !options.path.trim()) {
        throw new Error(
            `Option "path" is required`
        );
    }

    if (!options.output || !options.output.trim()) {
        throw new Error(
            `Option "output" is required`
        );
    }

    if (regExp.test(content)) {
        let svgFolder = path.resolve(options.path);
        let output = path.resolve(options.output);
        let insertBasename = options.basename === false ? false : true;

        content = content.replace(new RegExp(regExp, 'g'), function (tag) {
            let id = getAttrValue('id', tag);

            if (id === null) {
                throw new Error(
                    `Attribute "id" is required`
                );
            }

            if (files.hasOwnProperty(id)) {
                return files[id];
            }

            let file = svgFolder + '/' + id + '.svg';

            if (!fs.existsSync(file)) {
                throw new Error(
                    `Svg {${file}} not found`
                );
            }

            let svgFile = fs.readFileSync(file);
            let svg = svgFile.toString();
            let bodySvg = /<svg[^\>]+\>(.*?)<\/svg\>/mgsi.exec(svg);
            let viewBox = getAttrValue('viewBox', svg);

            viewBox = viewBox === null ? '' : `viewBox="${viewBox}"`

            if (bodySvg) {
                bodySvg = bodySvg[1];
            }

            let out = `
                <svg class="${id}">
                	<use class="${id}" xlink:href="${insertBasename ? path.basename(output) : ''}#${id}"></use>
                </svg>
            `;

            symbols.push(`
                    <symbol id="${id}" ${viewBox}>
                        ${bodySvg}
                    </symbol>
            `);

            let resultSvg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`;

            resultSvg = resultSvg.replace(/\s{2,}/g, ' ');
            resultSvg = resultSvg.replace(/\>\s{1,}\</g, '><');

            files[id] = out;

            fs.writeFile(output, resultSvg.trim(), function (err) {
                if (err) {
                    return console.error(err);
                }

                console.log("The file was saved!");
            });

            return out;
        });
    }

    return content;
};