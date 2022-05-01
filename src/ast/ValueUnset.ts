









class ValueUnset extends AbstractOperation
{
    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitValueUnset(this, ...args);
    }
}
