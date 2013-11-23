exports.BattleAbilities = {
        "contamination": {
		desc: "When this Pokemon enters the battlefield, the weather becomes Acid Rain (for 5 turns normally, or 8 turns while holding Molar Rock).",
		shortDesc: "On switch-in, the weather becomes Acid Rain.",
		onStart: function(source) {
			this.setWeather('acidrain');
		},
		id: "contamination",
		name: "Contamination",
		rating: 4.5,
		num: 1000
	}
};
