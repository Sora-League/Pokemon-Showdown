exports.BattleStatuses = {
        acidrain: {
	       effectType: 'Weather',
	       duration: 5,
	       durationCallback: function(source, effect) {
		       if (source && source.item === 'molarrock') {
				         return 8;
		       }
		       return 5;
	       },
	       // This should be applied directly to the stat before any of the other modifiers are chained
	       // So we give it increased priority.
	       onModifyDefPriority: 10, 
	       onModifyDef: function(def, pokemon) {
		       if (pokemon.hasType('Poison') && this.isWeather('acidrain')) {
			       return this.modify(def, 1.5);
		       }
	       },
	       onBasePower: function(basePower, attacker, defender, move) {
		       if (move.type === 'Ground') {
			       this.debug('Acid Rain ground suppress');
			       return this.chainModify(0.5);
		       }
	       },
	       onStart: function(battle, source, effect) {
		       if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
			       this.effectData.duration = 0;
			       this.add('-weather', 'AcidRain', '[from] ability: '+effect, '[of] '+source);
		       } else {
			       this.add('-weather', 'AcidRain');
		       }
	       },
	       onResidualOrder: 1,
               onResidual: function() {
		       this.add('-weather', 'AcidRain', '[upkeep]');
		       if (this.isWeather('acidrain')) this.eachEvent('Weather');
	       },
	       onWeather: function(target) {
		       this.damage(target.maxhp/16);
	       },
	       onEnd: function() {
		       this.add('-weather', 'none');
	       }
	}
};
