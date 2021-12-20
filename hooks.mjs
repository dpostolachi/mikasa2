import {
    getRuntime,
} from './runtime.mjs'
import {
    ContextProvider
} from './jsx.mjs'


export const useContext = ( context ) => {
    const {
        contexts,
    } = getRuntime()

    if ( !( context instanceof ContextProvider ) ) {
        throw `Expected a context, got ${ context }`
    }

    const { contextId, value } = context

    return contexts.get( contextId ) || value

}