import express from "express"

/** @type {express.RequestHandler} */
export const ping = (req, res) => {
    res.end("pong")
}

/** @type {express.RequestHandler} */
export const Pong = (req, res) => {
    res.end("ping")
}
