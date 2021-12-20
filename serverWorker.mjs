import {
    parentPort   
} from 'worker_threads'
import http from 'http'

const HTTPParser = process.binding( 'http_parser' ).HTTPParser

parentPort.on( 'message', ( data ) => {
    console.log( data )
} )