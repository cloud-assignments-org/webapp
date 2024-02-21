# Webapp


Author: Dhruv Parthasarathy
NUID: 002919280

## Overview

The API is built using Node.js, Express, and TypeScript, with route generation handled by tsoagit. We use github workflows to run tests and build the application before it get's pushed to the ORG main branch. 

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Clone the Repository

Clone the project repository to your local machine via SSH. Use the command:
    `git clone git@github.com:cloud-assignments-org/webapp.git`

### Running the Application

- Install all dependencies (`npm i`)
- Run all test cases (`npx jest`)
- Start the dev environment (`npm run dev`)
- Run the test cases (`sh testHealthz.sh`)

## Features

- **Health Check Endpoint**: Provides a `/healthz` GET endpoint to check the application's health, ensuring database connectivity and operational status.
- **Automatic Route Generation**: Utilizes `tsoa` for automatic generation of Express routes based on TypeScript decorators.
- **Error Handling**: 
  - Includes handling for `405 Method Not Allowed` errors, ensuring the API responds appropriately to unsupported HTTP methods on the `/healthz` endpoint. 
  - Throws a `400 Bad Request` error if requests are made with payload object or have query parameters
  - Throws a `503 Service Unavailable` Error when the database service is not reachable


## Steps followed in completing this assignment
1. [Setting up the database](./Documentation/DBSetup.md)
2. [Troubleshooting](./Documentation/Troubleshooting.md)
3. [Health Check API](./Documentation/HealthcheckAPI.md)
4. [Setting up packer](./Documentation/PackerSetup.md)

## API Endpoints

- `GET /healthz`: Checks the health of the application and returns an HTTP 200 status code if healthy, or HTTP 503 if there are issues with the database connectivity.

## Output 

```shell
===========================
Base case shows 200 when database is up and 503 when database is
down


===========================
curl -vvvv -XGET
http://localhost:3000/healthz
===========================

Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
Shows 405 Method not allowed for other types of
requests
===========================


===========================
curl -vvvv -XPUT
http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> PUT /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 405 Method Not Allowed
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
curl -vvvv -XPOST
http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> POST /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 405 Method Not Allowed
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
curl -vvvv -XPATCH
http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> PATCH /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 405 Method Not Allowed
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
curl -vvvv -XDELETE
http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> DELETE /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 405 Method Not Allowed
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
Shows 400 Bad request when url has any payload or query
param
===========================


===========================
curl -vvvv -XGET
http://localhost:3000/healthz?test=123
===========================

Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /healthz?test=123 HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
curl -vvvv -XGET -d "sample String"
http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
> Content-Length: 13
> Content-Type: application/x-www-form-urlencoded
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact

===========================
curl -vvvv -XGET -d {test : 123} http://localhost:3000/healthz
===========================

*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /healthz HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.84.0
> Accept: */*
> Content-Length: 12
> Content-Type: application/x-www-form-urlencoded
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< cache-control: no-cache
< max: 1
< timeout: 1
< Date: Tue, 06 Feb 2024 03:39:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 0
<
* Connection #0 to host localhost left intact
```
