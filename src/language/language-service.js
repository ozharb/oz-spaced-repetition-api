
const SLL = require('../SLL/SLL')


// Set up initial data.
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
        'word.next',
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
  getList(db, user_id, head) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.next',
        'word.language_id',
        'language.total_score',
        'language.head'
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where('language.user_id', user_id)
      
      .returning()
      .then(words => {
      
        let LinkedWords = new SLL()
      
        let node = words.find(word => word.id === head); 
        while (node) { 
          LinkedWords.insertLast(node);
         node = words.find(word => word.id === node.next)
         }
         
         return LinkedWords.all()
      }
      )
  },
  getNewList(db, user_id, head) {
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.next',
        'word.language_id',
        
      )
      .join('language',
        'language.id',
        'word.language_id'
      )

      .where('language.user_id', user_id)
      
      .returning()
      .then(words => {
        let LinkedWords = new SLL()
      
        let node = words.find(word => word.id === head); 
        while (node) { 
          LinkedWords.insertLast(node);
         node = words.find(word => word.id === node.next)
         }
  
         LinkedWords.move(LinkedWords.head.value.memory_value)
         return LinkedWords.getNextIds()
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
        'word.next',
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
        memory: result[0].memory_value,
        next: result[0].next
       }
  })


},
  updateWord(knex, id, updatedFields){
    return knex('word')
    .where({ id })
    .update(updatedFields)
   
  },
  updateScore(knex, id, fieldstoUpdate){
   return knex('word')
   .where({id})
   .update(fieldstoUpdate)    

  },

  updateIds(knex, id, next){
   return knex('word')
   .where({id})
   .update(next)    

  },
  updateTotal(knex, id, total_score){
     return knex('language')
     .where({ id })
     .update(total_score)
    
   },
updateHead(knex, id, head){

  return knex('language')
  .where({ id })
  .update({head})
 
}


}



module.exports = LanguageService
