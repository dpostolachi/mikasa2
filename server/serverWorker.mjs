import {
    parentPort,
    workerData,
} from 'worker_threads'
import { jsx } from '../jsx.mjs'
import { toStream } from '../dom.mjs'
import { createStream, createRenderStream } from '../utils.mjs'
import path from 'path'

const { filename, dirname } = workerData

import( path.resolve( dirname, '../' ,filename ) )
    .then( ( { default: App } ) => {
        parentPort.on( 'message', ( [ reqId, reqContext ] ) => {

            const transferStream = createStream()
            const renderStream = createRenderStream( transferStream )
        
            transferStream
                .on( 'data', ( chunk ) => { parentPort.postMessage( [ reqId, chunk ] ) } )
                .on( 'end', () => { parentPort.postMessage( [ reqId, null ] ) } )
        
            toStream( jsx( App, reqContext ), renderStream, {
                init: true,
                contexts: new Map(),
            } )
        
        } )
        
    } )
    .catch( e => { throw e } )