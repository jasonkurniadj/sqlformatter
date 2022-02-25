// const keywords = require('./keywords');

class SQLFormatter {
    constructor(sqlType, isDebug=false) {
        this.sqlType = sqlType.toLowerCase();
        this.isDebug = isDebug;

        this._keywords = keywords;
        this.reserved = this._getKeywordByAttribute('isReserved');
        this.specialChar = this._getKeywordByAttribute('isSpecialChar');
        this.newLineBefore = this._getKeywordByAttribute('isNewLineBefore');
        this.newLineAfter = this._getKeywordByAttribute('isNewLineAfter');
        this.function = this._getKeywordByAttribute('isFunction');
        this.parenthesis = this._getKeywordAttrValue('parenthesisPair');
        this.numIndent = this._getKeywordAttrValue('numIdent');
    }

    _getKeywordByAttribute(attrName, attrValue=true) {
        let retKeyword = [];
        const keys = Object.keys(this._keywords);
        keys.forEach(key => {
            let currAttr = this._keywords[key];
            if(currAttr.hasOwnProperty(attrName)) {
                if(currAttr[attrName] === attrValue) {
                    retKeyword.push(key);
                }
            }
        });
        return retKeyword;
    }

    _getKeywordAttrValue(attrName) {
        let retKeyword = {};
        const keys = Object.keys(this._keywords);
        keys.forEach(key => {
            let currAttr = this._keywords[key];
            if(currAttr.hasOwnProperty(attrName)) {
                retKeyword[key] = currAttr[attrName];
            }
        });
        return retKeyword;
    }

    _log(msg) {
        if(this.isDebug)
            console.log(msg);
    }

    _split(sql) {
        const words = sql.replace(/^\s+|\s+$/g, '').split(/\s+/);
        const sz = words.length;
        let retWords = [];

        for(let i=0; i<sz; i++) {
            let word = words[i];
            if(word === '') continue;

            let tempWord = '';
            const sz2 = word.length;
            for(let j=0; j<sz2; j++) {
                let char = word[j];

                if(this.specialChar.some(c => char === c)) {
                    if(tempWord !== '') {
                        if( this.reserved.includes( tempWord.toUpperCase() ) )
                            tempWord = tempWord.toUpperCase();
                        retWords.push(tempWord);
                        tempWord = '';
                    }
                    retWords.push(char);
                }
                else {
                    tempWord += char;
                }
            }

            if(tempWord !== '') {
                if( this.reserved.includes( tempWord.toUpperCase() ) )
                    tempWord = tempWord.toUpperCase();
                retWords.push(tempWord);
            }
        }

        return retWords;
    }

    getTemplate() {
        let cr = '';
        cr += '/***\n';
        cr += ' * Generate by SQLFormatter\n';
        cr += ' */\n';
        cr += '\n';
        return cr;
    }

    _addIndent(total, indentBy='tabs', padding=4) {
        if(this.isDebug) indentBy = 'tabs';

        let retIndent = '';
        for(let i=0; i<total; i++) {
            if(indentBy === 'tabs') {
                if(this.isDebug) retIndent += '/\t\\';
                else retIndent += '\t';
            }
            else {
                for(let j=0; j<padding; j++) {
                    retIndent += ' ';
                }
            }
        }
        return retIndent;
    }

    _finalize(sql) {
        const rows = sql.split('\n');
        this._log(rows);
        let finalized = '';

        rows.forEach(row => {
            this._log(row);
            if( row.slice(-1) === ' ') finalized += row.slice(0, -1);
            else finalized += row;

            finalized += '\n';
        });

        return finalized;
    }

    format(sql, indentBy='tabs', padding=4) {
        const words = this._split(sql);
        this._log(words);
        const sz = words.length;
        let parenthesis = [];
        let funcParenthesis = [];
        let formatted = '';

        for(let i=0; i<sz; i++) {
            const word = words[i];
            this._log('Word: ' + word);

            if( this.parenthesis.hasOwnProperty(word) ) {
                this._log('Push: ' + word);
                parenthesis.push(word);
            }
            else if(this.parenthesis[parenthesis[parenthesis.length-1]] === word) {
                this._log('Pop : ' + word);
                parenthesis.pop();
            }

            if( this.newLineBefore.includes(word) ) {
                if(word === 'JOIN' &&
                    (words[i-1] === 'LEFT' || words[i-1] === 'RIGHT' ||
                    words[i-1] === 'INNER' || words[i-1] === 'FULL')
                ) {
                    // Do not new line
                }
                else {
                    if(funcParenthesis.length > 0) {
                        if(this.parenthesis[funcParenthesis[funcParenthesis.length-1]] === word) {
                            funcParenthesis.pop();
                        }
                        formatted += word + ' ';
                        continue;
                    }

                    this._log('Newline Before: ' + word);
                    formatted += '\n';
                    if(formatted[formatted.length-1] === '\n') {
                        let numIdent;
                        if( this.numIndent.hasOwnProperty(word) )
                            numIdent = parenthesis.length + 1;
                        else numIdent = parenthesis.length;
                        formatted += this._addIndent(numIdent, indentBy, padding);
                    }
                }
                formatted += word + ' ';
                continue;
            }

            if( this.newLineAfter.includes(word) ) {
                if( this.function.includes(words[i-1]) ) {
                    funcParenthesis.push(word);
                    formatted += word;

                    if(funcParenthesis.length = 1) continue;
                }

                this._log('Newline After: ' + word);
                formatted += word;
                formatted += '\n';
                if(formatted[formatted.length-1] === '\n') {
                    let numIdent;
                    if( this.numIndent.hasOwnProperty(word) )
                        numIdent = parenthesis.length + 1;
                    else numIdent = parenthesis.length;
                    formatted += this._addIndent(numIdent, indentBy, padding);
                }
                continue;
            }

            if(formatted[formatted.length-1] === '\n') {
                let numIdent;
                if( this.numIndent.hasOwnProperty(word) )
                    numIdent = parenthesis.length + 1;
                else numIdent = parenthesis.length;
                formatted += this._addIndent(numIdent, indentBy, padding);
            }
            formatted += word;

            if(
                (this.specialChar.includes(word) && this.specialChar.includes(words[i+1]) ) ||
                this.function.includes(word)
            ) {
                // Do Nothing
            }
            else formatted += ' ';
        }

        formatted = this._finalize(formatted);
        return formatted;
    }
}

// module.exports = SQLFormatter;
