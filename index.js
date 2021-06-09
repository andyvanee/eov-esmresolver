import path from "path"
import fs from "fs"

const esmresolver = basePath => {
    return {
        basePath,
        resolver: (basePath, route, apiDoc) => {
            const pathKey = route.openApiRoute.substring(route.basePath.length)
            const schema = apiDoc.paths[pathKey][route.method.toLowerCase()]

            // x-eov-operation-id takes priority over operationId
            const fn = schema["x-eov-operation-id"] || schema["operationId"]

            // x-eov-operation-handler with fallback to routes.js
            const handler = schema["x-eov-operation-handler"] || "routes"

            const handlerFile = `${handler}.js`
            const handlerPath = path.join(basePath, handlerFile)
            const mod = { id: `${handlerFile}:${fn}`, default: {}, error: null }

            try {
                fs.statSync(handlerPath)
                mod.default = import(handlerPath)
                mod.default.then(m => {
                    if (typeof m[fn] !== "function") {
                        console.error(`Function not found ${mod.id}`)
                    }
                })
            } catch (err) {
                console.error(`Loading error`, err)
                mod.error = err
            }

            return async (req, res, next) => {
                if (mod.error) {
                    return next(new Error(`Loading error ${mod.id}`))
                }
                try {
                    const obj = await mod.default
                    obj[fn](req, res)
                } catch (err) {
                    console.error(mod.id, `${err}`.split("\n").shift())
                    next(new Error(`Routing error ${mod.id}`))
                }
            }
        }
    }
}

export default esmresolver
