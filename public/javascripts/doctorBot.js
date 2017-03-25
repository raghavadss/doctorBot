function DoctorBot(){
    this.keywordRegex = null;
    this.quitStatementRegex = null;
    this._init();
    this.symptomCheckedFlag = false;
    this.symptomCheckCount = 0;
    this.symptoms = new Array();
    this.chronicCheckFlag = false;
    this.diagReport={};
}

DoctorBot.prototype.getBotResponse = function (input) {

    var inputWorker = input;
    var findings = new Array();

    if(!this.symptomCheckedFlag){

        //Check for quit statements
        findings = input.toLowerCase().match(this.quitStatementRegex);
        if(findings){
            if(!this.symptoms) return 'Well, you haven\'t given any symptoms I would understand. So you are hail and healthy. Stay happy!';
            else return 'thanks';
        }

        //find all symptoms in the input
        findings = input.toLowerCase().match(this.keywordRegex);
        if(!findings) return pickRandom(genericResopnses.symptomSpecific);
        findings.forEach(function (sym) {
            this.symptoms.push(sym);
            this.symptomCheckCount++;
        },this);
        if(this.symptomCheckCount < 2) return 'Seeing any other symptoms? If yes, mention now. Else, say no.';
        this.symptomCheckedFlag = true;
        console.log(this);
    }

    if(!this.chronicCheckFlag && this.symptomCheckedFlag){




    }

    return 'Hello! I\'m glad to meet you';
};

DoctorBot.prototype._init = function () {
    //convert the keywords to a Regex
    this.keywordRegex = new RegExp(`(${botKeywords.join('|')})`,'gi');
    console.log(this.keywordRegex);
    console.log(this);

    //convert the quit statements to a Regex
    this.quitStatementRegex = new RegExp(`(${botQuitStatements.join('|')})`,'gi')
}

var pickRandom = function (array) {
    return array[Math.floor((Math.random() * array.length))];
}