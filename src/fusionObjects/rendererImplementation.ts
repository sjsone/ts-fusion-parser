import { AbstractFusionObject } from "./abstractFusionObject";

export class RendererImplementation extends AbstractFusionObject
{

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
     * Render type and return it.
     *
     * @return mixed
     */
    public evaluate()
    {

        console.log("+++++Evaluating Renderer")

        const rendererPath =  this.path + '/renderer'
        const canRenderWithRenderer = this.runtime.canRender(rendererPath);
        const renderPath = this.getRenderPath();
        let renderedElement
        if (canRenderWithRenderer) {
            renderedElement = this.runtime.evaluate(rendererPath, this);
        } else if (renderPath !== null) {
            if (renderPath.substr(0, 1) === '/') {
                renderedElement = this.runtime.render(renderPath.substr(1));
            } else {
                renderedElement = this.runtime.render(this.path + '/' + renderPath.replace('.', '/', ));
            }
        } else {
            renderedElement = this.runtime.render(`${this.path}/element<${this.getType()}>`);
        }
        return renderedElement;
    }
}
