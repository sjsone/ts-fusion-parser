

class EELLexer {


    

}



class EelUtility {

    public evaluateEelExpression(expression: string, eelEvaluator: any, contextVariables: {[key: string]: any}) {
        console.log("[EelUtility]::evaluateEelExpression", Object.keys(contextVariables), contextVariables.this)





        console.log("expression", expression.replace('{', '').replace('}', ''))


        process.exit()

        return `EEL<${expression}>`
    }
}

const EelUtilityInstance = new EelUtility

export { EelUtilityInstance as EelUtility }