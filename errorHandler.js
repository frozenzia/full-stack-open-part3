const errorHandler = (error, request, response, next) => {
  console.error('in the errorHandler!', error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

module.exports = errorHandler;
