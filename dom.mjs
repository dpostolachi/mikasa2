import {
    TEXT_NODE,
    COMP_NODE,
    SUSPENSE_NODE,
    PENDING_NODE,
    DEP_INJECT,
    CONTEXT_PROVIDER,
    extendNode,
    jsx,
} from './jsx.mjs'
import { createStream } from './utils.mjs'
import Suspense from './suspense.mjs'
import { genRandomId, sanitizeString } from './utils.mjs'
import { setRuntime } from './runtime.mjs'

const __reduce_contents = contents =>
    contents.reduce( ( acc, node ) => {
        return acc + toString( node )
    }, '' )

const __reduce_props = props =>
    !Object.keys( props ).length ? '' : ' ' +
    Object.entries( props )
        .map( ( [ name, value ] ) => `${ name }="${ value }"` ,'' )
        .join( ' ' )

const __push_contents_stream = ( contents, stream, options ) =>
    contents.forEach( ( content ) => toStream( content, stream, options ) )


export const toStream = ( node, stream, srcOptions ) => {
    const { init, ...options } = srcOptions
    setRuntime( options )
    stream = stream || createStream()

    const { nodeType, contents, props } = node

    switch( nodeType ) {
        case TEXT_NODE: {
            stream.push( contents[ 0 ] )
        }
        break
        case SUSPENSE_NODE: {
            const { fallback, contents } = node

            try {
                toStream( contents[ 0 ], stream, options )

            } catch( e ) {


                if ( e instanceof Suspense ) {

                    const suspenseId = genRandomId( 'suspense-' )
                    const newFallback = extendNode( fallback, {
                        id: suspenseId,
                    } )

                    toStream( newFallback, stream, options )

                    e.then( () => {

                        toStream( jsx( DEP_INJECT, {
                            suspenseId,
                        }, contents ), stream, options )

                    } )

                    stream.suspend( e )

                    return
                }

                throw e

            }

        }
        break
        case COMP_NODE: {
            const { component } = node

            const data = component( {
                ...props,
                children: contents,
            } )

            toStream( data, stream, options )
        }
        break
        case PENDING_NODE: {
            stream.push( '' )
        }
        break
        case DEP_INJECT: {
            const { props: { suspenseId } } = node

            stream.push( `<script id="script:${ suspenseId }">` )
            stream.push( `document.getElementById('${suspenseId}').outerHTML = \`` )
            __push_contents_stream( contents, stream, options )
            stream.push( `\`;` )
            stream.push( `document.getElementById('script:${suspenseId}').remove();` )
            stream.push( `</script>` )
        }
        break
        case CONTEXT_PROVIDER: {
            const { contents, context: { value, contextId } } = node
            const { contexts } = options
            const newContexts = new Map( contexts )

            newContexts.set( contextId, value )

            const newOptions = {
                ...options,
                contexts: newContexts
            }

            __push_contents_stream( contents, stream, newOptions )
        }
        break
        default: {
            const { __noClose, ...restProps } = props

            stream.push( `<${ nodeType }${ __reduce_props( restProps ) }>` )
            __push_contents_stream( contents, stream, options )
            if ( !__noClose ) {
                stream.push( `</${ nodeType }>` )
            }
        }

    }

    if ( init ) {
        stream.tryEnd()
    }
    return stream

}

const toString = ( node ) => {
    const { nodeType, contents, props } = node

    switch( nodeType ) {
        case TEXT_NODE: {
            return sanitizeString( contents[ 0 ] )
        }
        case SUSPENSE_NODE: {
            return '<sus></sus>'
        }
        case COMP_NODE: {
            const { component } = node
            const data = component( {
                ...props,
                children: contents,
            } )

            return toString( data )
        }
        case PENDING_NODE: {
            return ''
        }

        default: {
            const { __noClose } = props

            return `<${ nodeType }${ __reduce_props( props ) }>${ __reduce_contents( contents ) }` + ( __noClose ? '' : `</${ nodeType }>` )
        }

    }

}

