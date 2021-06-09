import express from "express"
import path from "path"
import bodyParser from "body-parser"
import * as OpenApiValidator from "express-openapi-validator"
import logger from "morgan"
const cwd = path.normalize(process.cwd())
const PORT = process.env.PORT || 8000
const app = express()
const apiSpec = path.join(cwd, "api.yaml")
import esmresolver from "../index.js"

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger("dev"))

app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateResponses: true,
        operationHandlers: esmresolver(cwd)
    })
)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors
    })
})

app.listen(PORT, () => console.log(`Server Listening`, { PORT }))

export default app
