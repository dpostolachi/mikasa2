import {
    SUSPENSE_NODE,
    jsx,
    createContext,
} from './jsx.mjs'
import Suspense from './suspense.mjs'

const MockDb = {}

const MockDBContext = createContext( {
    db: {},
} )

const useSuspense = ( key, data ) => {

    const value = MockDb[ key ]

    if ( !value ) {
        throw new Suspense( ( resolve ) => {
            MockDb[ key ] = data

            setTimeout( () => {
                resolve()
            }, 3000 )
        } )
    }

    return value
}

const DisplayName = () => {
        const name = useSuspense( 'heyo', 'Dima' )

        return jsx( 'div', {}, [
            name,
            jsx( SUSPENSE_NODE, {
                fallback: jsx( 'h1', {}, [ 'loading...' ] )
            }, [
                jsx( DisplayName2, {} )
            ] )
        ] )
}

const DisplayName2 = () => {
    const name = useSuspense( 'heyo2', 'Dima2' )

    return jsx( 'h1', {}, [ name ] )
}

export const App = () => {

    return jsx( MockDBContext, {}, [
        jsx( 'html', {
            __noClose: true,
        }, [
            jsx( 'head', {}, [
                jsx( 'title', {}, [ 'hello world' ] ),
            ] ),
            jsx( 'body', {
                __noClose: true,
            }, [
                jsx( 'h1', {
                    className: 'heading'
                }, [ 'Hello world' ] ),
                jsx( SUSPENSE_NODE, {
                    fallback: jsx( 'h1', {}, [ 'loading...' ] )
                }, [
                    jsx( DisplayName, {} ),
                ] )
            ] )
        ] )
    ] )

}