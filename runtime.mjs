let currentRuntime = null

export const setRuntime = runtime =>
    currentRuntime = runtime

export const getRuntime = () => {
    if ( !currentRuntime ) {
        throw 'Hook called outside of a component'
    }

    return currentRuntime
}