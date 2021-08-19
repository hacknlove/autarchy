# autarchy

proxied/saved/mocked environment to test and develop microservices 

## Install

You can install it globally
```
npm -g autarchy
```

or as a dependency
```
npm -D autarchy
```

## Companions

### [webapp](https://github.com/hacknlove/autarchy-webapp)
Browse the recent requests 

### [server](https://github.com/hacknlove/autarchy-server)
Allow other to access your local services 
## Configuration

```
mkdir .autarchy

cd .autarchy

echo module.exports = {} > config.js
```

### Main config
The file `.autarchy/config.js` will eventually allow to set default configuration for all the services. Currently it's not used.
### Service

Create a folder for each service, with a `config.js` inside

#### Example

`.autarchy/foo/config.js`
```js
module.exports = {
  type: 'REST',
  remote: 'https://example.com/api',
  local: {
    ip: '127.0.0.1',
    port: 5000,
  }
}
```
#### type (required)
The type of the service. The provided types are REST and graphql

Custom types can be added.

#### name
It defaults to the folder name.

It's used to determine the collection's name `${type}-${name}`

In the example the `name` is `'foo'` and the collection name is `'REST-foo'` 

#### remote
The url of the service that you want to proxy

It is not required if you are mocking all the endpoints from the database or a `pre` or `post` function. 

#### local
Where to bind the local service.
* `local.ip` defaults to `'0.0.0.0`
* `local.port` defaults to `80` 

#### pre
`(context) => context`

it's executed just after matching the endpoint.

It can be used to modify the request that will be used to search on the database or to be sent to the proxy

It also can set a response, or modify the configuration.

Please refer to the service type documentation to further instructions regarding the context and the response

#### toQuery
`[(context) => ({ some mongo query }), ...]` | `false`

Requests are cached so after a first fetch you don't need the remote service to be up and running.

You can use `pre` to set `context.conf.toQuery` to false to disable the cache search

Otherwise it will loop the array running query after query until it returns a response.

Please refer to the service type documentation to further instructions regarding the defaults and the context schema regarding the request.

#### toDocument
`(context) => document`

You can use `pre` to set `context.conf.toDocument` to false to skip inserting the request and response in the database

Please refer to the service type documentation to further instructions regarding the defaults and the context schema regarding the request.

#### post
`(context) => context`

it's executed just before sending the response.

It can be used to modify the response that will be sent

Please refer to the service type documentation to further instructions regarding the context and the response

#### skipLogs

Requests are also logged, you can disable that setting `skipLogs` thuthy.

### REST

#### Endpoints

If you want an specific configuration for a endpoint, you need to create a file whose name is the http method (or `all`), and the file path is the `endpoint/` + the endpoint path

For instance: This file `.autarchy/foo/endpoints/some/endpoint/GET.js` will override `.autarchy/foo/config.js` when the request is a `GET` to `/some/endpoint` 

You can use parameters between brackets.

For instance this file `.autarchy/foo/endpoints/some/endpoint/[id]/all.js` will override `.autarchy/foo/config.js` when a `POST` is sent to `/some/endpoint/bar` or when a `GET` is sent to `/some/endpoint/buz`


#### context

```json
{
  "request": {
    "path": "",
    "params": {},
    "headers": {},
    "method": "",
    "body": {},
    "query": {}
  },
  "conf": {
    // ...foo/config.js,
    // ...foo/endoints/path/METHOD.js 
  },
  "response": {
    "status": 200,
    "headers": {},
    "body": {}
  }
}
```

### graphql

#### Queries

If you want to override `.autarchy/foo/config.js` in some queries you can create any file at any path inside `.autarchy/foo/queries/`

For instance

`.autarchy/foo/queries/bar.js`
```js
module.exports = {
  match: (context) => true // false 
}
```

It will loop over the files under `queries/` until some `match` returns `truthy`

First one that matches, will override the configuration

#### context
```json
{
  "request": {
    "headers": {},
    "method": "",
    "body": {},
    "query": {}
  },
  "conf": {
    // ...foo/config.js,
    // ...foo/queries/baz.js 
  },
  "response": {
    // the graphql response
  }
}
```