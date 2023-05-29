const generalService = require('../services/general.service')

class GeneralController {
  async getAllImages(req, res) {
    const { company } = req.params
    const result = await generalService.getAllImages(company)
    return res.json({ errorCode: null, errorText: '', result: result, success: true })
  }

  async upload(req, res) {
    await generalService
      .upload(req.body)
      .then((result) => res.json({ result: true, data: result }))
      .catch((err) => res.status(err.status).json({ result: false, errors: err.errors }))
  }

  async deleteImage(req, res) {
    const result = await generalService.deleteImage(req.body)
    return res.json({ result })
  }
}

module.exports = new GeneralController()
