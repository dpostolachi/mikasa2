import {
    jsx,
} from './jsx.mjs'
import { toStream } from './dom.mjs'
import koa from 'koa'
import { createStream, createRenderStream } from './utils.mjs'
import { App } from './app.mjs'

const Koa = new koa()

Koa.use( ctx => {

    ctx.set( 'Content-Type', 'text/html' )
    // html stream
    const responseStream = createStream()
    // rendering result stream
    const renderStream = createRenderStream( responseStream )

    ctx.body = responseStream
    ctx.type = 'html'
    
    responseStream.push( '<!DOCTYPE html>', 'utf-8' )
    toStream( jsx( App ), renderStream, {
        init: true,
        contexts: new Map(),
    } )

} )

Koa.listen( 3000 )