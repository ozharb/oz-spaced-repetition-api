
const SLL = require('../SLL/SLL')


// Set up initial data.
// --------------------


const LinkedWords = new SLL()



// store.cats.forEach(cat => pets.cats.enqueue(cat))
// store.dogs.forEach(dog => pets.dogs.enqueue(dog))

// --------------------



const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getUserWord(db, user_id) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'language.total_score',
        'language.head'
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where(function () {
        this
          .where('language.user_id', user_id)
          .whereRaw('word.id = language.head')
      })


  },
  getUserWords(db, user_id) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'language.total_score',
        'language.head'
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where(function () {
        this
          .where('language.user_id', user_id)

      })


  },
  getList(db, user_id) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'language.total_score',
        'language.head'
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where(function () {
        this
          .where('language.user_id', user_id)
      })
      .returning()
      .then(result => {
        result.forEach(word => LinkedWords.push(word))
        let headMove = LinkedWords.head.val.memory_value
         LinkedWords.move(headMove)
         return LinkedWords.all()
      }
      )
  },
  isGuessCorrect(db, user_id, guess) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'language.total_score',
        'language.head'
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where(function () {
        this
          .where('language.user_id', user_id)
          .whereRaw('word.id = language.head')
      })
      .returning()
      .then(result => {
       
       return{right:(result[0].translation===guess.guess),
        id: result[0].id,
        incorrect: result[0].incorrect_count,
        correct: result[0].correct_count,
        memory: result[0].memory_value
       }
  })


},
  updateWord(knex, id, updatedFields){
    return knex('word')
    .where({ id })
    .update(updatedFields)
   
  },


  

}


module.exports = LanguageService
// hasUserWithUserName(db, username) {
//   return db('user')
//     .where({ username })
//     .first()
//     .then(user => !!user)
// },