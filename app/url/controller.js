const url = require('./url');

exports.validateRegister = (req, res, next) => {
    req.checkBody('url', 'You must supply a url!').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(422).json({ err: errors.map(e => ({
            param: e.param,
            msg: e.msg}))
        });
    } else{
        next();
    }
};

exports.getUrl = async (req, res, next) => {
    const source = await url.getUrl(req.params.hash);
    if(!source) {
      return res.status(404).json({err: { msg: 'Hash not found'}});
    }
  
    source.visit = source.visit ? ++source.visit : 1;
  
    try {
      await url.updateUrl(source);
    } catch (e) {
        console.error(e)
        res.status(500).send({error: "Unexpected Error,something went wrong while it's found your url, please try agan later :)"})
        return next(e);
    }
  
    // Behave based on the requested format using the 'Accept' header.
    // If header is not provided or is */* redirect instead.
    res.format({
      'text/plain':() => res.end(source.url),
      'application/json': () => res.json({url: source.url, removeToken: source.removeToken, visit: source.visit}),
      default:() => res.redirect(source.url)
    })
  };

exports.saveUrl = async (req, res, next) => {
    try {
      let shortUrl = await url.shorten(req.body.url, url.generateHash());
      res.json(shortUrl);
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({error: e.message })
      //next(e);
    }
};

exports.deleteUrl = async (req, res, next) => {
    await url.removeUrl(req.param.hash, req.param.removeToken);
    res.status(204).json()
}