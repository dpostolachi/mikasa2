import net from 'net'
import http from 'http'
import events from 'events'
import {
    Worker,
} from 'worker_threads'

const worker = new Worker( './serverWorker.mjs' )

net.createServer( socket => {

    socket.on( 'data', ( data ) => {
        const arrayBuffer = data.buffer
        worker.postMessage( arrayBuffer, [ arrayBuffer ] )
    } )

} )
.listen( 3000 )