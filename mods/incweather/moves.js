exports.BattleMovedex = {
              "contaminate": {
	              num: 1000,
		      accuracy: true,
		      basePower: 0,
		      category: "Status",
		      desc: "For 5 turns, the weather becomes Acid Rain. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Poison or Steel-type, or have the Abilities Magic Guard or Overcoat. The Defense of Poison-types is 1.5x and the power of Ground-type attacks is 0.5x during the effect. Lasts for 8 turns if the user is holding Molar Rock. Fails if the current weather is Acid Rain.",
		      shortDesc: "For 5 turns, corroding Acid Rain falls.",
		      id: "Contaminate",
		      name: "Contaminate",
		      pp: 10,
		      priority: 0,
		      weather: 'AcidRain',
		      secondary: false,
		      target: "all",
		      type: "Poison"
	      },
	      "gunkshot": {
		      num: 441,
		      accuracy: 80,
		      basePower: 120,
		      category: "Physical",
		      desc: "Deals damage to one adjacent target with a 30% chance to poison it.",
		      shortDesc: "30% chance to poison the target.",
		      id: "gunkshot",
		      isViable: true,
		      name: "Gunk Shot",
		      pp: 5,
		      priority: 0,
		      onModifyMove: function(move) {
			      if (this.isWeather('acidrain')) move.accuracy = true;
		      },
		      secondary: {
			      chance: 30,
			      status: 'psn'
		      },
		      target: "normal",
		      type: "Poison"
	      },
	      "weatherball": {
		      num: 311,
		      accuracy: 100,
		      basePower: 50,
		      basePowerCallback: function() {
			      if (this.weather) return 100;
			      return 50;
		      },
		      category: "Special",
		      desc: "Deals damage to one adjacent target. Power doubles during weather effects and this move's type changes to match; Ice-type during Hail, Water-type during Rain Dance, Rock-type during Sandstorm, and Fire-type during Sunny Day.",
		      shortDesc: "Power doubles and type varies in each weather.",
		      id: "weatherball",
		      isViable: true,
		      name: "Weather Ball",
		      pp: 10,
		      priority: 0,
		      isBullet: true,
		      onModifyMove: function(move) {
			      switch (this.effectiveWeather()) {
			      case 'sunnyday':
				       move.type = 'Fire';
				       break;
			      case 'raindance':
				       move.type = 'Water';
				       break;
			      case 'sandstorm':
				       move.type = 'Rock';
				       break;
			      case 'hail':
				       move.type = 'Ice';
				       break;
			      case 'acidrain':
				       move.type = 'Poison';
				       break;       
			      }
		     },
		     secondary: false,
		     target: "normal",
		     type: "Normal"
	      },
};
