const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonParser = express.json();
const languageRouter = express.Router()



languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })


languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getList(
        req.app.get('db'),
        req.user.id,
        req.language.head,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getUserWord(
        req.app.get('db'),
        req.user.id,
      )
      res.json({
        nextWord: nextWord[0].original,
        totalScore: nextWord[0].total_score,
        wordCorrectCount: nextWord[0].correct_count,
        wordIncorrectCount: nextWord[0].incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .use(requireAuth)
  .post('/guess', jsonParser, async (req, res, next) => {
    // update word table in db with new score
    // updated linked list according new memory value
    // update language table in db with new head according
    // to linked list

    const { guess } = req.body;
    const newGuess = { guess };

    for (const [key, value] of Object.entries(newGuess)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    // make Linked List:
    const words = await LanguageService.getList(
      req.app.get('db'), req.user.id,
      req.language.head,
    )
    /// Linked list ⬆⬆     
    let guessedWord = words[0]

    let isCorrect = guessedWord.translation === newGuess.guess
    if (!isCorrect) {
      score = {
        incorrect_count: ++guessedWord.incorrect_count,
        memory_value: 1
      }

    } else {

      score = {
        correct_count: ++guessedWord.correct_count,
        memory_value: (guessedWord.memory_value >= 8) ? 10 : guessedWord.memory_value * 2
      }

      LanguageService.updateTotal(
        req.app.get('db'),
        req.language.id,
        { total_score: ++guessedWord.total_score },
      )

        .catch(next);
    }

    try {
      await LanguageService.updateScore(
        req.app.get('db'),
        guessedWord.id,
        score)

    } catch (error) {
      next(error)
    }

    const newList = await LanguageService.getNewList(
      req.app.get('db'),
      req.user.id,
      req.language.head
    )

    ///****UPDATE NEXT IDS IN DB****////
    newList.forEach(el => {
      LanguageService.updateIds(
        req.app.get('db'), el.id, el)
        .catch(next);
    })

    //***Update Head****//
    try {
      await LanguageService.updateHead(
        req.app.get('db'),
        req.language.id,
        newList[0].id,
      )
    } catch (error) {
      next(error)
    }

    if (!isCorrect) {
      try {
        const newWords = await LanguageService.getList(
          req.app.get('db'),
          req.user.id,
          req.language.head)
        res.status(200).json({
          nextWord: words[1].original,
          totalScore: req.language.total_score,
          wordCorrectCount: words[1].correct_count,
          wordIncorrectCount: words[1].incorrect_count,
          answer: words[0].translation,
          isCorrect: false
        })
        next()
      } catch (error) {
        next(error)
      }
    } else {

      try {
        const newWords = await LanguageService.getList(
          req.app.get('db'),
          req.user.id,
          req.language.head,
        )

        res.status(200).json({
          nextWord: words[1].original,
          totalScore: newWords[0].total_score,
          wordCorrectCount: words[1].correct_count,
          wordIncorrectCount: words[1].incorrect_count,
          answer: guessedWord.translation,
          isCorrect: true
        })
        next()
      } catch (error) {
        next(error)
      }
    }
  })


module.exports = languageRouter
