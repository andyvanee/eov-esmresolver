import express from "express"

/** @type {express.RequestHandler} */
export const home = (req, res) => {
    res.end("hello world!")
}
