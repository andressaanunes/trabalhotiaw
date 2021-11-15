const axios = require('axios')
module.exports = async function testeReq(){
    try {
      let resp = await axios('https://ipinfo.io/ip') 
      console.log(resp)
      return resp
    } catch (error) {
      console.log(error)
      
    }
  }
  /* 
  { Error: certificate has expired
        at TLSSocket.<anonymous> (_tls_wrap.js:1105:38)
        at emitNone (events.js:106:13)
        at TLSSocket.emit (events.js:208:7)
        at TLSSocket._finishInit (_tls_wrap.js:639:8)
        at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
      code: 'CERT_HAS_EXPIRED',
      config:
       { url: 'https://sandbox.melhorenvio.com.br/oauth/token',
         method: 'post',
         data:
          FormData {
            _overheadLength: 543,
            _valueLength: 1786,
            _valuesToMeasure: [],
            writable: false,
            readable: true,
            dataSize: 0,
            maxDataSize: 2097152,
            pauseStreams: true,
            _released: true,
            _streams: [],
            _currentStream: null,
            _insideLoop: false,
            _pendingNext: false,
            _boundary: '--------------------------692851545268331793207325',
            _events: [Object],
            _eventsCount: 1 },
         headers:
          { Accept: 'application/json',
            'Content-Type': 'multipart/form-data; boundary=--------------------------692851545268331793207325',
            'User-Agent': 'CrialuthProd kayrodanyell@gmail.com' },
         transformRequest: [ [Function: transformRequest] ],
         transformResponse: [ [Function: transformResponse] ],
         timeout: 0,
         adapter: [Function: httpAdapter],
         xsrfCookieName: 'XSRF-TOKEN',
         xsrfHeaderName: 'X-XSRF-TOKEN',
         maxContentLength: -1,
         maxBodyLength: -1,
         validateStatus: [Function: validateStatus],
         transitional:
          { silentJSONParsing: true,
            forcedJSONParsing: true,
            clarifyTimeoutError: false } },
      request:
       Writable {
         _writableState:
          WritableState {
            objectMode: false,
            highWaterMark: 16384,
            finalCalled: false,
            needDrain: false,
            ending: false,
            ended: false,
            finished: false,
            destroyed: false,
            decodeStrings: true,
            defaultEncoding: 'utf8',
            length: 0,
            writing: false,
            corked: 0,
            sync: true,
            bufferProcessing: false,
            onwrite: [Function: bound onwrite],
            writecb: null,
            writelen: 0,
            bufferedRequest: null,
            lastBufferedRequest: null,
            pendingcb: 0,
            prefinished: false,
            errorEmitted: false,
            bufferedRequestCount: 0,
            corkedRequestsFree: [Object] },
         writable: true,
         domain: null,
         _events:
          { response: [Function: handleResponse],
            error: [Function: handleRequestError] },
         _eventsCount: 2,
         _maxListeners: undefined,
         _options:
          { maxRedirects: 21,
            maxBodyLength: 10485760,
            protocol: 'https:',
            path: '/oauth/token',
            method: 'POST',
            headers: [Object],
            agent: undefined,
            agents: [Object],
            auth: undefined,
            hostname: 'sandbox.melhorenvio.com.br',
            port: null,
            nativeProtocols: [Object],
            pathname: '/oauth/token' },
         _ended: true,
         _ending: true,
         _redirectCount: 0,
         _redirects: [],
         _requestBodyLength: 2385,
         _requestBodyBuffers:
          [ [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object] ],
         _onNativeResponse: [Function],
         _currentRequest:
          ClientRequest {
            domain: null,
            _events: [Object],
            _eventsCount: 7,
            _maxListeners: undefined,
            output: [],
            outputEncodings: [],
            outputCallbacks: [],
            outputSize: 0,
            writable: true,
            _last: true,
            upgrading: false,
            chunkedEncoding: true,
            shouldKeepAlive: false,
            useChunkedEncodingByDefault: true,
            sendDate: false,
            _removedConnection: false,
            _removedContLen: false,
            _removedTE: false,
            _contentLength: null,
            _hasBody: true,
            _trailer: '',
            finished: true,
            _headerSent: true,
            socket: [Object],
            connection: [Object],
            _header: 'POST /oauth/token HTTP/1.1\r\nAccept: application/json\r\nContent-Type: multipart/form-data; boundary=--------------------------692851545268331793207325\r\nUser-Agent: CrialuthProd kayrodanyell@gmail.com\r\nHost: sandbox.melhorenvio.com.br\r\nConnection: close\r\nTransfer-Encoding: chunked\r\n\r\n',
            _onPendingData: [Function: noopPendingOutput],
            agent: [Object],
            socketPath: undefined,
            timeout: undefined,
            method: 'POST',
            path: '/oauth/token',
            _ended: false,
            res: null,
            aborted: undefined,
            timeoutCb: null,
            upgradeOrConnect: false,
            parser: null,
            maxHeadersCount: null,
            _redirectable: [Circular],
            [Symbol(outHeadersKey)]: [Object] },
         _currentUrl: 'https://sandbox.melhorenvio.com.br/oauth/token' },
      response: undefined,
      isAxiosError: true,
      toJSON: [Function: oJSON] }



      Error: certificate has expired
         at TLSSocket.<anonymous> (_tls_wrap.js:1105:38)
         at emitNone (events.js:106:13)
         at TLSSocket.emit (events.js:208:7)
         at TLSSocket._finishInit (_tls_wrap.js:639:8)
         at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
       code: 'CERT_HAS_EXPIRED', */