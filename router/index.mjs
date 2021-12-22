import { useContext } from "../hooks.mjs"
import { createContext, jsx } from "../jsx.mjs"

const routerContext = createContext( {
    url: new URL( "http://localhost" )
} )

export const RouterContext = ( { url, children } ) => {

    const value = new URL( `http://localhost${ url }` )

    return jsx( routerContext, {
        value,
    }, children )

}

export const Router = ( { children } ) => {

    const { pathname } = useContext( routerContext )

    return children.find( ( { props } ) => {
        return props && pathname.startsWith( props.path )
    } )
}