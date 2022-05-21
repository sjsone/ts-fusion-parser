import { AbstractArrayFusionObject } from "./abstractArrayFusionObject";
import { LazyProps } from "./helpers/LazyProps";

export class ComponentImplementation extends AbstractArrayFusionObject
{
    /**
     * Properties that are ignored and not included into the ``props`` context
     *
     * @var array
     */
    protected ignoreProperties = ['__meta', 'renderer'];

    /**
     * Evaluate the fusion-keys and transfer the result into the context as ``props``
     * afterwards evaluate the ``renderer`` with this context
     *
     * @return mixed
     */
    public evaluate()
    {
        const context = this.runtime.getCurrentContext();
        const renderContext = this.prepare(context);
        const result = this.render(renderContext);
        return result;
    }

    /**
     * Prepare the context for the renderer
     *
     * @param array context
     * @return array
     */
    protected prepare(context: {[key: string]: any} ): {[key: string]: any}
    {
        context['props'] = this.getProps(context);
        return context;
    }

    /**
     * Calculate the component props
     *
     * @param array context
     * @return \ArrayAccess
     */
    protected getProps(context: {[key: string]: any})
    {
        const sortedChildFusionKeys = this.sortNestedProperties();
        const props = new LazyProps(this, this.path, this.runtime, sortedChildFusionKeys, context);
        return props;
    }

    /**
     * Evaluate the renderer with the give context and return
     *
     * @param array context
     * @return mixed
     */
    protected render(context: any)
    {
        this.runtime.pushContextArray(context);
        const result = this.runtime.render(this.path + '/renderer');
        this.runtime.popContext();
        return result;
    }
}
