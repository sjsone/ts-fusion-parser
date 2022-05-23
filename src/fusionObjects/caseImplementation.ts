import { AbstractArrayFusionObject } from "./abstractArrayFusionObject";

export class CaseImplementation extends AbstractArrayFusionObject
{
    /**
     * This constant should be returned by individual matchers if the matcher
     * did not match.
     *
     * You should not rely on the contents or type of this constant.
     */
    static MATCH_NORESULT = '_____________NO_MATCH_RESULT_____________';

    /**
     * Execute each matcher until the first one matches
     *
     * @return mixed
     */
    public evaluate()
    {
        const matcherKeys = this.sortNestedProperties();
        console.group("[CaseImplementation]")
        console.log("[CaseImplementation] matcherKeys", matcherKeys)

        for (const matcherName of matcherKeys ) {
            const renderedMatcher = this.renderMatcher(matcherName);
            console.log("[CaseImplementation] renderedMatcher", renderedMatcher)
            if (this.matcherMatched(renderedMatcher)) {
                console.log("[CaseImplementation] matcher has matched", renderedMatcher)
                console.groupEnd()
                return renderedMatcher;
            }
        }

        console.groupEnd()

        return null;
    }

    /**
     * Render the given matcher
     *
     * A result value of MATCH_NORESULT means that the condition of the matcher did not match and the case should
     * continue.
     *
     * @param string matcherKey
     * @return string
     * @throws UnsupportedObjectTypeAtPathException
     */
    protected renderMatcher(matcherKey: string)
    {
        let renderedMatcher = null;

        if (this.properties[matcherKey]['__objectType']) {
            // object type already set, so no need to set it
            console.log(`[CaseImplementation] 1. rendering matcher ${matcherKey} with path `, `${this.path}/${matcherKey}`)
            renderedMatcher = this.runtime.render(`${this.path}/${matcherKey}`);
            console.log(`[CaseImplementation] 2. rendered ${matcherKey}`, renderedMatcher)

            return renderedMatcher;
        } else if (!(typeof this.properties[matcherKey] === "object")) {
            throw new Error('"Case" Fusion object only supports nested Fusion objects; no simple values.');
        } else if (this.properties[matcherKey]['__eelExpression']) {
            throw new Error('"Case" Fusion object only supports nested Fusion objects; no Eel expressions.');
        } else {
            // No object type has been set, so we're using Neos.Fusion:Matcher as fallback
            console.log(`[CaseImplementation] 1. will render matcher ${matcherKey} with path `, `${this.path}/${matcherKey}<Neos.Fusion:Matcher>`)
            renderedMatcher = this.runtime.render(`${this.path}/${matcherKey}<Neos.Fusion:Matcher>`);
            console.log(`[CaseImplementation] 2. rendered ${matcherKey}`, renderedMatcher)

            return renderedMatcher;
        }
    }

    /**
     * Test whether the output of the matcher does not equal the MATCH_NORESULT
     *
     * If the debug mode is enabled, we have to strip the debug output before comparing the rendered result.
     *
     * @param string renderedMatcher
     * @return boolean
     */
    protected matcherMatched(renderedMatcher: any)
    {
        
        return renderedMatcher !== CaseImplementation.MATCH_NORESULT;
    }
}
