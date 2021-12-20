export const TEXT_NODE = Symbol( 'textNode' )
export const SUSPENSE_NODE = Symbol( 'suspense' )
export const PENDING_NODE = Symbol( 'pending' )
export const COMP_NODE = Symbol( 'component' )
export const DEP_INJECT = Symbol( 'depInject' )
export const CONTEXT_PROVIDER = Symbol( 'contextProvider' )

export class ContextProvider {
    constructor( { value } ) {
        this.value = value
        this.contextId  = Symbol()
    }
}

export const extendNode = ( node, newProps ) => {
    const { nodeType, props = {} } = node

    switch( nodeType ) {
        case TEXT_NODE: {
            throw new Error( `Text nodes can't be extended` )
        }
        case COMP_NODE:
        case PENDING_NODE:
        case SUSPENSE_NODE: {
            return {
                ...node,
                props: {
                    ...props,
                    ...newProps,
                },
            }
        }
        default: {
            return {
                ...node,
                props: {
                    ...props,
                    ...newProps,
                },
            }
        }
    }

}

export const createContext = ( defaultValue ) => {
    return new ContextProvider( { value: defaultValue } )
}

export const jsx = ( nodeType, props = undefined, contents = undefined ) => {
    const isFn = typeof nodeType === 'function'

    if ( Array.isArray( contents ) ) {
        contents = contents.map( content => {
            return typeof content === 'string' ? {
                nodeType: TEXT_NODE,
                contents,
            } : content
        } )
    }
    
    if ( isFn ) {
        return {
            nodeType: COMP_NODE,
            contents,
            component: nodeType,
            props,
        }

    }

    if ( typeof nodeType !== 'string' ) {

        if ( nodeType instanceof ContextProvider ) {
            const { value } = props
            nodeType.value = value || nodeType.value

            return {
                nodeType: CONTEXT_PROVIDER,
                contents,
                context: nodeType,
            }
        }

        switch( nodeType ) {
            case SUSPENSE_NODE: {
                const { fallback } = props

                if ( !fallback ) {
                    throw new Error( `Expected a fallback for Suspense: got`, fallback )
                }
    
                return {
                    nodeType,
                    contents,
                    fallback,
                }
            }
            case DEP_INJECT: {
                return {
                    nodeType,
                    contents,
                    props,
                }
            }
            default: {
                throw new Error( `expected a node type: got ${ nodeType }` )
            }
        }

    }

    return {
        nodeType,
        props: props || {},
        contents,
    }

}