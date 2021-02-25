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
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
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
    // implement me
    try {
      const nextWord = await LanguageService.getList(
        req.app.get('db'),
        req.user.id,
      )
     

      res.json({
        nextWord: nextWord[0].original,
        totalScore:  nextWord[0].total_score,
        wordCorrectCount: nextWord[0].correct_count,
        wordIncorrectCount: nextWord[0].incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
  })
  .get('/words', async (req, res, next) => {
    // implement me
    try {
      const words = await LanguageService.getList(
        req.app.get('db'),
        req.user.id,
      )
      res.json({
        words
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    // implement me

    const { guess } = req.body;
    const newGuess = { guess };

    for (const [key, value] of Object.entries(newGuess)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    } 

   
    const answer = await LanguageService.isGuessCorrect(req.app.get('db'),
    req.user.id, newGuess)
    // res.json({
    //   answer
    // })
    let fieldsToUpdate = {}
    if(!answer.right){
      
       fieldsToUpdate = {
        incorrect_count: ++answer.incorrect,
        memory_value: 1,
      }
    } else {
      fieldsToUpdate = {
        correct_count: ++answer.correct,
        memory_value: answer.memory * 2
    }
  }
      // res.json({
      //   fieldsToUpdate
      // })
    LanguageService.updateWord(
      req.app.get('db'),
      answer.id,
      fieldsToUpdate
    )
      .then(numRowsAffected => {
        res.status(200).end();
      })
      .catch(next);
    
     } )
    
    
module.exports = languageRouter
