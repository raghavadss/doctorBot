function DoctorBot() {
    this.keywordRegex = null;
    this.quitStatementRegex = null;
    this._init();
    this.symptomCheckedFlag = false;
    this.symptomCheckCount = 0;
    this.foundSymptoms = [];
    this.queries = [];
    this.checkRelatedInfo = false;
    this.symptomSpecificsProcessed = false;
    this.commonsProcessed = false;
    this.quitSymptomCheckFlag = false;
    this.processedAllQueriesFlag = false;
    this.processedQueryCount = 0;
    this.diagReport = [];
}

DoctorBot.prototype.getBotResponse = function (input) {

    var inputWorker = input;
    var findings = [];


    if (!this.symptomCheckedFlag) {

        //Check for quit statements
        findings = input.toLowerCase().match(this.quitStatementRegex);
        if (findings) {
            this.quitSymptomCheckFlag = true;
            if (!this.foundSymptoms.length) return 'Well, you haven\'t talked about any foundSymptoms I would understand.';
        }

        if (!this.quitSymptomCheckFlag) {
            //find all foundSymptoms in the input
            findings = input.toLowerCase().match(this.keywordRegex);
            if (!findings) return pickRandom(genericResponses.symptomSpecific);
            findings.forEach(function (sym) {
                sym = sym.toLowerCase();
                if (!this.foundSymptoms.find(x => x.name === sym)) {
                    this.foundSymptoms.push({processed: false, name: sym});
                    this.symptomCheckCount++;
                }
            }, this);
            if (this.symptomCheckCount < 2) return 'Seeing any other foundSymptoms? If yes, mention now. Else, say no.';
        }
        this.symptomCheckedFlag = true;
    }

    if (!this.checkRelatedInfo && this.symptomCheckedFlag) {
        let symObj = {};
        let symSpecifics = [];


        if (!this.symptomSpecificsProcessed) {
            let foundSymptomsCopy = JSON.parse(JSON.stringify(this.foundSymptoms));
            foundSymptomsCopy.forEach(function (symptom) {
                if (!symptom.processed) {
                    symObj = botKeywords.symptoms.find(x => x.name === symptom.name);

                    symObj.specifics.forEach(function (specs) {
                        symSpecifics.push({processed: false, specs: specs})
                    });

                    symSpecifics.forEach(function (symspec) {
                        if (!symspec.processed) {
                            let query = pickRandom(commonQueries)
                                .replace('[1]', symspec.specs.name)
                                .replace('[2]', symObj.name)
                                .replace('[3]', pickRandom(allowedValuesString) + objectToNameArray(symspec.specs.allowedValues).join(', '));
                            this.queries.push({flag:false,symId: symObj.id, specId: symspec.specs.id, query: query});
                            symspec.processed = true;
                        }
                    }, this);

                    symptom.processed = true;
                }
            }, this);
            this.symptomSpecificsProcessed = true;
        }

        if (!this.commonsProcessed) {
            let foundSymptomsCopy = JSON.parse(JSON.stringify(this.foundSymptoms));
            foundSymptomsCopy.forEach(function (symptom) {
                if (!symptom.processed) {
                    symObj = botKeywords.symptoms.find(x => x.name === symptom.name);
                    commons.forEach(function (spec) {
                        "use strict";
                        this.queries.push({
                            flag:false,
                            symId: symObj.id,
                            specId: spec.id,
                            query: pickRandom(spec.queries).replace('[1]', symptom.name).replace('[2]',
                                pickRandom(allowedValuesString) + objectToNameArray(spec.allowedValues).join(', '))
                        });
                    }, this);
                    symptom.processed = true;
                }

            }, this);
            this.commonsProcessed = true;
        }
        this.checkRelatedInfo=true;
        console.log(this.queries);
    }

    if(!this.processedAllQueriesFlag && this.checkRelatedInfo){
        let responses =[];
        let queryValueRegex =new RegExp();
        let query = this.queries[this.processedQueryCount];
        let csRegex = new RegExp(`(commons|specifics)`,'i');
        let specType = '';
        let symId = 0;
        let specId = 0;
        let matchId = '';
        if(!query.flag){
            query.flag = true;
            return query.query;
        }
        if(query.flag){
            symId = query.symId;
            specId = query.specId;
            specType = specId.replace(/[0-9]/g, '');
            if(specType==='C') {
                queryValueRegex = new RegExp(`(${objectToNameArray(commons.find(x => x.id === specId).allowedValues).join('|')})`, 'gi');
                console.log(queryValueRegex);
            }
            if(specType==='S'){
                queryValueRegex = new RegExp(`(${objectToNameArray(botKeywords.symptoms.find(x => x.id === symId)
                    .specifics.find(x => x.id === specId).allowedValues).join('|')})`, 'gi');
                console.log(queryValueRegex);
            }

            findings = input.toLowerCase().match(queryValueRegex);
            if (!findings) {
                findings = input.toLowerCase().match(this.quitStatementRegex);
                if (findings) {
                    this.processedQueryCount += 1;
                    if (this.processedQueryCount < this.queries.length) {
                        query = this.queries[this.processedQueryCount];
                        query.flag = true;
                        return query.query;
                    }
                    if(this.processedQueryCount === this.queries.length){
                        return this.getReport();

                    }
                }

                return pickRandom(genericResponses.generic) + '\n\t\t' + query.query;
                query.flag = false;
            }
            if(findings){
                findings.forEach(function (finding) {
                    if (specType === 'C') {
                        matchId = commons.find(x => x.id === specId).allowedValues.find(x => x.name.toLowerCase() === finding.toLowerCase()).id;
                    }
                    if (specType === 'S') {
                        matchId = botKeywords.symptoms.find(x => x.id === symId)
                            .specifics.find(x => x.id === specId).allowedValues.find(x => x.name.toLowerCase() === finding.toLowerCase()).id;
                    }

                    this.diagReport.push(symId+'-'+specId+'-'+matchId);

                },this);

                this.processedQueryCount += 1;
                if (this.processedQueryCount < this.queries.length) {
                    query = this.queries[this.processedQueryCount];
                    query.flag = true;
                    return query.query;
                }
                if(this.processedQueryCount === this.queries.length){
                    return this.getReport();

                }
            }
        }
    }

    return('Something went wrong! Please reset');
};

DoctorBot.prototype._init = function () {
    //convert the keywords to a Regex
    this.keywordRegex = new RegExp(`(${objectToNameArray(botKeywords.symptoms).join('|')})`, 'gi');

    //convert the quit statements to a Regex
    this.quitStatementRegex = new RegExp(`(${botQuitStatements.join('|')})`, 'gi')
}

var pickRandom = function (array) {
    return array[Math.floor((Math.random() * array.length))];
}

DoctorBot.prototype.getReport = function () {
    console.log(this.diagReport);
    return this.diagReport.join(', ')+'\n\t\t Please click reset to start next session';
}