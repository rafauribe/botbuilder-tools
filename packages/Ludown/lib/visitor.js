const lp = require('./generated/LUFileParser').LUFileParser;
const LUISObjNameEnum = require('./enums/luisobjenum');

class Visitor {
    /**
     * @param {lp.NormalIntentStringContext} ctx
     * @returns {object}
     */
    static visitIntentUtteranceContext(ctx) {
        let utterance = '';
        let entities = [];
        for (const node of ctx.children) {
            const innerNode = node;
            switch (innerNode.symbol.type) {
                case lp.DASH: break;
                case lp.EXPRESSION: {
                    var entityObject = this.extractEntityFromUtterence(innerNode.getText());
                    if (entityObject.entityValue !== undefined) {
                        // simple entitiy
                        utterance = utterance.concat(entityObject.entityValue);
                        var startPos = utterance.lastIndexOf(entityObject.entityValue);
                        var endPos = startPos + entityObject.entityValue.length - 1;
                        entities.push({
                            type: LUISObjNameEnum.ENTITIES,
                            entity: entityObject.entityName,
                            startPos: startPos,
                            endPos: endPos
                        });
                    } else {
                        // pattern.any entity
                        utterance = utterance.concat(innerNode.getText());
                        entities.push({
                            type: LUISObjNameEnum.PATTERNANYENTITY,
                            entity: entityObject.entityName
                        })
                    }
                    break;
                }
                default: {
                    utterance = utterance.concat(innerNode.getText());
                    break;
                }
            }
        }

        return { utterance, entities };
    }

    static visitEntityContext(ctx) {
        
    }

    /**
     * @param {string} exp 
     * @returns {object}
     */
    static extractEntityFromUtterence(exp) {
        exp = exp.replace(/(^{*)/g, '')
                .replace(/(}*$)/g, '');
        
        var equalIndex = exp.indexOf('=');
        if (equalIndex != -1) {
            var entityName = exp.substring(0, equalIndex).trim();
            var entityValue = exp.substring(equalIndex + 1).trim();

            return { entityName, entityValue };
        } else {
            var entityName = exp.trim();

            return { entityName, undefined };
        }
    }
}

module.exports = Visitor;