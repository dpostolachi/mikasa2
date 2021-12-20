import {
    SUSPENSE_NODE,
    jsx,
    createContext,
} from './jsx.mjs'
import Suspense from './suspense.mjs'
import {
    useContext
} from './hooks.mjs'

const MockDBContext = createContext( {
    db: {},
} )

const useSuspense = ( key, data ) => {

    const { db } = useContext( MockDBContext )
    const value = db[ key ]

    if ( !value ) {
        throw new Suspense( ( resolve ) => {
            db[ key ] = data

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

const UserList = () => {

    const userList = useSuspense( 'heyo', [
        'Random',
        'List',
        'Of',
        'People',
    ] )

    return jsx( 'ul', {}, userList.map( user => {
        return jsx( SUSPENSE_NODE, {
            fallback: jsx( 'span', {}, [ 'loading...' ] )
        }, [
            // jsx( DisplayName, {} )
        ] )
    } ) )

}

const DisplayName2 = () => {
    const name = useSuspense( 'heyo2', 'Dima2' )

    return jsx( 'h1', {}, [ name ] )
}

export const App = () => {

    return jsx( MockDBContext, {
        value: { db: {} },
    }, [
        jsx( 'html', {
            __noClose: true,
        }, [
            jsx( 'head', {}, [
                jsx( 'title', {}, [ 'hello world' ] ),
                jsx( 'style', {}, [ `
                    body {
                        margin: 0;
                        font-family: sans-serif;
                        background: #fefefe;
                    }
                ` ] ),
                jsx( 'link', {
                    rel: 'stylesheet',
                    href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
                }, [] )
            ] ),
            jsx( 'body', {
                __noClose: true,
            }, [
                jsx( 'div', {
                    class: 'container',
                }, [
                    jsx( 'h1', {
                        className: 'heading'
                    }, [ 'User list' ] ),
                    jsx( SUSPENSE_NODE, {
                        fallback: jsx( 'h1', {}, [ 'loading...' ] )
                    }, [
                        // jsx( 'div', {}, [ 'hello' ] )
                        jsx( UserList, {} ),
                    ] )
                ] )
            ] )
        ] )
    ] )

}