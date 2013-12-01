exports.BattleScripts = {
        inherit: 'gen6',
        gen: 6,
        init: function() {
                //Pokemon that can learn Contaminate
                this.modData('Learnsets', 'bulbasaur').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'ivysaur').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'venusaur').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'ekans').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'arbok').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'oddish').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'gloom').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'vileplume').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'bellsprout').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'weepinbell').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'victreebel').learnset.contaminate = ['5M'];
                this.modData('Learnsets', 'weezing').learnset.contaminate = ['5M'];
                
                //Weezing and Koffing has Contamination
                this.modData('Pokedex', 'koffing').abilities['1'] = 'Contamination';
                this.modData('Pokedex', 'weezing').abilities['1'] = 'Contamination';
        }
};
