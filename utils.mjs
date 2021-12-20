import stream from 'stream'
import crypto from 'crypto'

const ReadStream = stream.Readable

class RenderStream {
    respStream = null
    pendingTasks = []

    constructor( respStream ) {
        this.respStream = respStream
    }

    stream() {
        return this.stream
    }

    push( chunk ) {
        this.respStream.push( chunk )
    }

    tryEnd( force = false ) {
        if ( force || !this.pendingTasks.length ) {
            this.respStream.push( '</body></html>' )
            this.respStream.push( null )
        }
    }

    suspend( e ) {
        // push to dependencies
        const { pendingTasks } = this
        pendingTasks.push( e )

        // clear from dependencies
        e.finally( () => {

            const index = pendingTasks.indexOf( e )
            pendingTasks.splice( index, 1 )

            if ( !pendingTasks.length ) {
                this.tryEnd( true )
            }
        } )

    }

}

export const createRenderStream = ( respStream ) => {
    return new RenderStream( respStream )
}

export const createStream = () => {
    return new ReadStream( {
        read: chunk => {},
        encoding: 'utf-8',
    } )
}

export const genRandomId = ( prefix = '' ) => {
    return prefix + crypto.randomBytes( 6 ).toString( 'hex' )
}

export const sanitizeString = ( str ) => {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}