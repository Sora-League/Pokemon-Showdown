exports.BattleItems = {
        "molarrock": {
                id: "Molar Rock",
		name: "Molar Rock",
		spritenum: 0,
		fling: {
			basePower: 10
	        },
		num: 1000,
		gen: 0,
		desc: "Holder's use of Acid Rain lasts 8 turns instead of 5."
	},
	"safetygoggles": {
		id: "safetygoggles",
		name: "Safety Goggles",
		spritenum: 0,
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'acidrain') return false;
		},
		onTryHit: function(pokemon, target, move) {
			if (move.isPowder) {
				this.add('-immune', pokemon, '[msg]', '[from] Safety Goggles');
				return null;
			}
		},
		num: -8,
		gen: 6,
		desc: "Protects the holder from weather-related damage and powder moves."
	}
};
