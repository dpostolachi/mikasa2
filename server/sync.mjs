import crypto from 'crypto'

const Collection = new Map()

export const randomString = () => {
    return crypto.randomBytes( 6 ).toString( 'hex' )
}

export const generateId = ( socket ) => {
    let id
    do {
        id = randomString()
    } while ( Collection.get( id ) )
    Collection.set( id, socket )
    return id
}

export const getConnection = ( id ) =>
    Collection.get( id )

export const clearId = id =>
    Collection.delete( id )