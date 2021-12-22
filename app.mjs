import {
    SUSPENSE_NODE,
    jsx,
    createContext,
} from './jsx.mjs'
import Suspense from './suspense.mjs'
import {
    useContext
} from './hooks.mjs'
import { generateName } from './mock/index.mjs'
import { Router, RouterContext } from './router/index.mjs'

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
            }, Math.random() * 2000 )
        } )
    }

    return value
}


const UserList = () => {

    const randomNames = new Array( 5 + Math.ceil( Math.random() * 10 ) )
        .fill()
        .map( () => generateName() )

    const userList = useSuspense( 'userList', randomNames )

    return jsx( 'ul', {
        class: 'list-group'
    }, userList.map( ( user, index ) => {
        return jsx( SUSPENSE_NODE, {
            fallback: jsx( 'li', {
                class: 'list-group-item'
            }, [ `loading #User${ index }` ] )
        }, [
            jsx( DisplayName2, { user }, [] )
        ] )
    } ) )

}

const DisplayName2 = ( { user } ) => {
    const name = useSuspense( user, user )

    return jsx( 'li', {
        class: 'list-group-item',
    }, [ name ] )
}

const App = ( { url } ) => {

    return jsx( MockDBContext, {
        value: { db: {} },
    }, [
        jsx( RouterContext, {
            url,
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
                    jsx( Router, {}, [
                        jsx( 'div', {
                            class: 'container',
                            path: '/users'
                        }, [
                            jsx( 'h1', {}, [ 'Async example' ] ),
                            jsx( 'h2', {
                                className: 'heading'
                            }, [ `User list` ] ),
                            jsx( SUSPENSE_NODE, {
                                fallback: jsx( 'h5', {}, [ 'loading...' ] )
                            }, [
                                jsx( UserList, {}, [] ),
                            ] ),
                            jsx( 'p', {}, [
                                'Go to: ',
                                jsx( 'a', {
                                    href: '/',
                                }, [ 'home' ] ),
                            ] ),
                        ] ),
                        jsx( 'div', {
                            class: 'container',
                            path: '/',
                        }, [
                            jsx( 'h1', {}, [ 'Home page' ] ),
                            jsx( 'h2', {}, [ 'Just a random page' ] ),
                            jsx( 'p', {}, [
                                'Go to: ',
                                jsx( 'a', {
                                    href: '/users',
                                }, [ 'user list' ] ),
                            ] ),
                        ] )
                    ] )
                ] )
            ] )
        ] )
    ] )

}

export default App