
# Creating a user

1. As a user, I want to create an account by providing the following information.
Email Address
Password
First Name
Last Name

```shell
curl --location --request POST 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "ajay@northeastern.edu",
  "password": "ajay-pass-123",
  "firstName": "Ajay",
  "lastName": "Balasubramani"
}'
```
("./../images/Post-%20create%20user.png")

2. account_created field for the user should be set to the current time when user creation is successful.

Pending - this field only has the date not the time in the return value - check above resposne

3. Users should not be able to set values for account_created and account_updated. Any value provided for these fields must be ignored.

Failing - 

```shell
    at basicAuthMiddleware (file:///Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/[eval1]:1074:5) {
  fields: {
    'userDetails.dateCreated': {
      message: '"dateCreated" is an excess property and therefore is not allowed',
      value: 'dateCreated'
    }
  },
  status: 400
}
```

4. Invalid json object passed is faling with a 500 internal server error

```shell
curl --location --request POST 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "ajay-vishal@northeastern.edu",
  "password": "ajay-vishal-pass-123",
  "firstName": "Ajay",
  "lastName": "Balasubramani Visahl",
}'

SyntaxError: Expected double-quoted property name in JSON at position 144
    at JSON.parse (<anonymous>)
    at parse (/Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/node_modules/body-parser/lib/types/json.js:89:19)
    at /Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/node_modules/body-parser/lib/read.js:128:18
    at AsyncResource.runInAsyncScope (node:async_hooks:206:9)
    at invokeCallback (/Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/node_modules/raw-body/index.js:231:16)
    at done (/Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/node_modules/raw-body/index.js:220:7)
    at IncomingMessage.onEnd (/Users/dhruvparthasarathy/Documents/northeastern/cloud/cloud-assignments/webapp-fork/node_modules/raw-body/index.js:280:7)
    at IncomingMessage.emit (node:events:511:28)
    at endReadableNT (node:internal/streams/readable:1367:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  expose: true,
  statusCode: 400,
  status: 400,
  body: '{\n' +
    '  "email": "ajay-vishal@northeastern.edu",\n' +
    '  "password": "ajay-vishal-pass-123",\n' +
    '  "firstName": "Ajay",\n' +
    '  "lastName": "Balasubramani Visahl",\n' +
    '}',
  type: 'entity.parse.failed'
}

```

5. 400 bad request when email already exists

[](./images/400%20bad%20request%20when%20email%20already%20exists.png)


6. As a user, I expect my password to be stored securely using the BCrypt password hashing scheme with salt.

[](./images//password%20saved%20in%20db.png)

7. 
