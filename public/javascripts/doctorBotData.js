'use strict';

var  botKeywords =[
    'headache','nausea','vomit','fever','cough','shiver'
]

var timeQueries = [
    'How many days have you been suffering from [1] ?',
    'That must be terrible. For how many days have you been experiencing [1] ?',
    'Is it acute (just started) or chronic (old and recurring)?'
]

var genericResopnses = {
    generic: ['I\'m very young so I couldn\'t understand what you said. Please explain differently.'],
    symptomSpecific:['Like all doctors, I\'m limited in scope. Here are some symptoms I can understand :\n\t\t'+botKeywords.join(', ')]
}

var botQuitStatements = [
    'no','none','nope','nothing'
]