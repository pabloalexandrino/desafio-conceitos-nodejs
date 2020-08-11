const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isExists(req, res, next) {
  const { id } = req.params
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'The Repository does not have a valid ID.' })
  }
  const repoIndex = repositories.findIndex(r => r.id === id)
  if (repoIndex < 0) {
    return res.status(404).json({ error: 'Repository not found.' })
  }
  req.repoIndex = repoIndex
  return next()
}

app.use('/repositories/:id', isExists)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository)
  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params
  const { repoIndex } = request
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }
  repositories[repoIndex] = repository
  return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { repoIndex } = request
  repositories.splice(repoIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { repoIndex } = request
  repositories[repoIndex].likes += 1
  return response.status(200).json(repositories[repoIndex])
});

module.exports = app;
