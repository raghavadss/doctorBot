'use strict';

var botKeywords = {
    symptoms: [
        {id: 1, name: 'headache',
            specifics: [
                {
                    id: 'S1',
                    name: 'location',
                    allowedValues: [
                        {id: 1, name: 'forehead'},
                        {id: 2, name: 'temple'},
                        {id: 3, name: 'around'},
                        {id: 4, name: 'both sides'},
                        {id: 5, name: 'one side'}
                    ]
                }
            ]},
        {id: 2, name: 'nausea',specifics:[]},
        {id: 3, name: 'vomit',specifics:[]},
        {id: 4, name: 'fever',specifics:[]},
        {id: 5, name: 'cough',specifics:[]},
        {id: 6, name: 'shiver',specifics:[]}
    ]
}

var commons = [
    {
        id: 'C1',
        name: 'onset',
        allowedValues: [{id: 1, name: 'acute'}, {id: 2, name: 'chronic'}],
        queries: [
             'What is the onset of your [1]? [2] ',
             'Please tell me if your [1] is acute (just started) or chronic (old and recurring) ?'
            // 'Is it acute (just started) or chronic (old and recurring)?'
        ]
    },
    {
        id: 'C2',
        name: 'severity',
        allowedValues: [{id: 1, name: 'mild'}, {id: 2, name: 'moderate'}, {id: 3, name: 'severe'}],
        queries: [
            'How would you rate your [1]? [2]. \n\t\tIf none applies say \'NO\'',
            'Which category would you put your [1] in? [2]. \n\t\tIf none applies say \'NO\''
        ]
    },
    {
        id: 'C3',
        name: 'trigger',
        allowedValues: [{id: 1, name: 'Sleep loss'}, {id: 2, name: 'stress'}, {id: 3, name: 'physical activity'}],
        queries: [
            'What increases or worsens your [1]? [2]. \n\t\tIf none applies say \'NO\'',
            'Which actions worsens your [1]? [2]. \n\t\tIf none applies say \'NO\''
        ]
    },
    {
        id: 'C4',
        name: 'relievers',
        allowedValues: [{id: 1, name: 'sleep'}, {id: 2, name: 'rest'}, {id: 3, name: 'OTC drugs'}],
        queries: [
            'What do you do to relieve [1]? [2]',
            'What relieves your [1]? [2]'
        ]
    }
]

var commonQueries = [
    'Can you tell about the [1] of [2]? [3]. \n\t\tIf none applies say \'NO\'',
    'What is the [1] of [2]? [3]. \n\t\tIf none applies say \'NO\''
]

var allowedValuesString = [
    'I can understand these:\n\t\t',
    'Select one of these:\n\t\t',
    'You can pick form:\n\t\t',
    'Choose an answer from these:\n\t\t'
]

var objectToNameArray = function(arrayname){
    var tempArray = new Array();
    arrayname.forEach(function (sym) {
        tempArray.push(sym.name);
    }, this);
    return tempArray;
}

var genericResponses = {
    generic: ['I couldn\'t understand what you said. Please give from suggested values'],
    symptomSpecific: ['Like all doctors, I\'m limited in scope. Here are some symptoms I can understand :\n\t\t' + objectToNameArray(botKeywords.symptoms).join(', ')]
}

var botQuitStatements = [
    'no', 'none', 'nope', 'nothing'
]