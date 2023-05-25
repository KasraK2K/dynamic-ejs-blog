const generalService = require('../services/general.service')

class GeneralController {
  async upload(req, res, next) {
    await generalService
      .upload(req.body)
      .then((result) => res.json({ result: true, data: result }))
      .catch((err) => res.status(err.status).json({ result: false, errors: err.errors }))
  }
}

module.exports = new GeneralController()
