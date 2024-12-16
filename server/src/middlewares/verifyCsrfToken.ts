import { RequestHandler } from "express"

export const verifyCsrfToken: RequestHandler = (req, res, next) => {
  const { code, state } = req.query
  if (!code || !state) {
    res.sendStatus(401)
    return
  }

  if (state !== req.session.state) {
    res.sendStatus(401)
    return
  }
  next()
}
