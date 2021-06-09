# EOV-esmresolver

A resolver for <https://github.com/cdimascio/express-openapi-validator> which
allows for ESM imports.

### Install

    yarn add eov-esmresolver

or

    npm install eov-esmresolver

### Example

Follow setup example for passing the `operationHandlers` parameter
<https://github.com/cdimascio/express-openapi-validator/blob/master/examples/3-eov-operations/app.js>
and replace the handler with the following:

```javascript
import esmresolver from "eov-esmresolver"
app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateResponses: true,
        operationHandlers: esmresolver(modulePath)
    })
)
```

[Full example](./example/)
