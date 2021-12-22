import koa from 'koa'
import { createStream } from '../utils.mjs'
import {
    Worker
} from 'worker_threads'
import {
    generateId,
    getConnection,
    clearId,
} from './sync.mjs'
import os from 'os'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

const { NODE_ENV = '' } = process.env
const IsProduction = NODE_ENV === 'production'

const WorkersCount = Number( IsProduction ) * Math.min( os.cpus().length, 1 )

const createWorker = ( filename ) => {
    return new Worker( path.resolve( __dirname, './serverWorker.mjs' ), {
        workerData: {
            filename,
            dirname: __dirname,
        },
    } )
        .on( 'message', ( [ reqId, buffer ] ) => {
            const stream = getConnection( reqId )
            stream.push( buffer )
            if ( !buffer ) {
                clearId( reqId )
            }
        } )
}

export const createRenderServer = ( filename, PORT ) => {

    const Workers = new Array( WorkersCount )
        .fill( null )
        .map( () => {
            return createWorker( filename )
        } )

    let iterator = 0;

    const Koa = new koa()

    Koa.use( ctx => {

        const { url } = ctx
        const responseStream = createStream()
        const reqId = generateId( responseStream )
    
        ctx.set( 'Content-Type', 'text/html' )
    
        ctx.body = responseStream
        ctx.type = 'html'
        
        responseStream.push( '<!DOCTYPE html>', 'utf-8' )
    
        /**
         * Generate new worker on request to pick up the application updates
         * for production (NODE_ENV) it will use a pool of workers
         */
        const serverWorker = IsProduction ? Workers[ iterator++ % Workers.length ]
            : createWorker( filename )
        serverWorker.postMessage( [ reqId,{
            url,
        } ] )
    
    
    } )
        .listen( PORT, ( err ) => {
            if ( err ) {
                throw err
            }
            console.log( `listening on port: ${ PORT }` )
        } )

}