const router = require('express').Router();
const url = require('./url');

function validateRegister(req, res, next) {
  req.checkBody('url', 'You must supply a url!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ err: errors.map(e => ({
      param: e.param,
      msg: e.msg}))
    });
  } else
    next();
}

router.get('/:hash', async (req, res, next) => {

  const source = await url.getUrl(req.params.hash);

  // TODO: Respond accordingly when the hash wasn't found (404 maybe?)

  // TODO: Hide fields that shouldn't be public

  // TODO: Register visit


  // Behave based on the requested format using the 'Accept' header.
  // If header is not provided or is */* redirect instead.

  res.format({
    'text/plain':() => res.end(source.url),
    'application/json': () => res.json(source),
    default:() => res.redirect(source.url)
  })
});


router.post('/', validateRegister, async (req, res, next) => {
  try {
    let shortUrl = await url.shorten(req.body.url, url.generateHash());
    res.json(shortUrl);
  } catch (e) {
    res.status(500).send({error: "Unexpected Error,something went wrong please try agan later :)"})
    next(e);
  }
});


router.delete('/:hash/:removeToken', async (req, res, next) => {
  // TODO: Remove shortened URL if the remove token and the hash match
  let notImplemented = new Error('Not Implemented');
  notImplemented.status = 501;
  next(notImplemented);
});

module.exports = router;
