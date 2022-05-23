import { CaseImplementation } from "./caseImplementation";
import { RendererImplementation } from "./rendererImplementation";

export class MatcherImplementation extends RendererImplementation
{
    /**
     * @return boolean
     */
    public getCondition()
    {
        return Boolean(this.fusionValue('condition'))
    }

    /**
     * The type to render if condition is true
     *
     * @return string
     */
    public getType()
    {
        return this.fusionValue('type');
    }

    /**
     * A path to a Fusion configuration
     *
     * @return string
     */
    public getRenderPath()
    {
        return this.fusionValue('renderPath');
    }

    /**
     * If condition matches, render type and return it. Else, return MATCH_NORESULT.
     *
     * @return mixed
     */
    public evaluate()
    {
        if (this.getCondition()) {
            return super.evaluate()
        } else {
            return CaseImplementation.MATCH_NORESULT;
        }
    }
}
