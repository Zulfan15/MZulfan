export interface QuizQuestion {
  id: string;
  ask: string;
  options: string[];
  fact: string;
}

export const CHARIZARD_QUIZ: QuizQuestion[] = [
  {
    id: 'dex-no',
    ask: "What is my National Pokédex number?",
    options: ['NO. 006', 'NO. 003', 'NO. 009', 'NO. 025'],
    fact: "No. 006! Right after Charmander (004) and Charmeleon (005).",
  },
  {
    id: 'types',
    ask: "What are my primary dual types in my standard form?",
    options: ['FIRE / FLYING', 'FIRE / DRAGON', 'FIRE', 'DRAGON / FLYING'],
    fact: "Fire and Flying! I only gain the Dragon typing during Mega Evolution X.",
  },
  {
    id: 'evolution',
    ask: "At what level does Charmeleon evolve into Charizard?",
    options: ['LEVEL 36', 'LEVEL 32', 'LEVEL 16', 'LEVEL 40'],
    fact: "Level 36! Charmander evolves into Charmeleon at 16, and into me at 36.",
  },
  {
    id: 'starter',
    ask: "Which region's starter trio do I belong to?",
    options: ['KANTO', 'JOHTO', 'HOENN', 'SINNOH'],
    fact: "Kanto! Alongside Venusaur and Blastoise as Professor Oak's starters.",
  },
  {
    id: 'box-art',
    ask: "Which iconic Pokémon game featured me on the box cover?",
    options: ['POKÉMON RED', 'POKÉMON BLUE', 'POKÉMON YELLOW', 'POKÉMON GOLD'],
    fact: "Pokémon Red! And later Pokémon FireRed.",
  },
  {
    id: 'mega-x',
    ask: "When I Mega Evolve into Mega Charizard X, what dual typing do I gain?",
    options: ['FIRE / DRAGON', 'FIRE / DARK', 'DRAGON / FLYING', 'FIRE / FLYING'],
    fact: "Fire/Dragon! With blue flames and black scales.",
  },
  {
    id: 'tail-flame',
    ask: "What happens if the flame on a Charizard's tail goes out?",
    options: ['ITS LIFE ENDS', 'IT LOSES ITS FIRE TYPE', 'IT GOES TO SLEEP', 'IT CANNOT FLY'],
    fact: "According to Pokédex lore, the flame burns from birth; if it goes out, life ends.",
  },
  {
    id: 'gmax-move',
    ask: "What exclusive G-Max move can Gigantamax Charizard use?",
    options: ['G-MAX WILDFIRE', 'G-MAX FIREBALL', 'G-MAX FLAMESTORM', 'G-MAX INFERNO'],
    fact: "G-Max Wildfire! Dealing residual fire damage for 4 turns to non-Fire types.",
  },
  {
    id: 'shiny-color',
    ask: "What color is a shiny Charizard?",
    options: ['JET BLACK', 'BRIGHT BLUE', 'GOLDEN YELLOW', 'PURPLE'],
    fact: "Jet black with dark crimson inner wings!",
  },
  {
    id: 'champion',
    ask: "Which Galar Champion has Charizard as their undisputed ace partner?",
    options: ['LEON', 'CYNTHIA', 'STEVEN', 'LANCE'],
    fact: "Champion Leon! 'Let's have a champion time!'",
  },
  {
    id: 'ash-trainer',
    ask: "In the anime, who was Charmander's original neglectful trainer before Ash rescued it?",
    options: ['DAMIAN', 'GARY OAK', 'PAUL', 'CROSS'],
    fact: "Damian abandoned Charmander on a rock in the rain until Ash and Brock saved it.",
  },
  {
    id: 'ability',
    ask: "What is Charizard's standard ability in competitive Pokémon?",
    options: ['BLAZE', 'SOLAR POWER', 'DROUGHT', 'FLASH FIRE'],
    fact: "Blaze! Powering up Fire moves by 50% when HP drops below one-third.",
  },
  {
    id: 'hidden-ability',
    ask: "What is Charizard's Hidden Ability that boosts Special Attack in sunshine?",
    options: ['SOLAR POWER', 'DROUGHT', 'TURBOBLAZE', 'DESOLATE LAND'],
    fact: "Solar Power! It boosts Special Attack by 50% in harsh sunlight.",
  },
  {
    id: 'seismic',
    ask: "Which classic fighting-type move did Ash's Charizard use as its finishing move?",
    options: ['SEISMIC TOSS', 'SUBMISSION', 'DYNAMIC PUNCH', 'CROSS CHOP'],
    fact: "Seismic Toss! Spinning the foe in a circle before slamming them down.",
  },
  {
    id: 'mega-item',
    ask: "Which Mega Stone keeps my Fire/Flying typing but grants the Drought ability?",
    options: ['CHARIZARDITE Y', 'CHARIZARDITE X', 'FIRE STONE', 'BLASTOISINITE'],
    fact: "Charizardite Y! Transforming into a sleek wyvern that summons harsh sunlight.",
  },
  {
    id: 'magmar',
    ask: "In the Cinnabar Gym battle, which Pokémon did Ash's Charizard battle over a volcano?",
    options: ['MAGMAR', 'ARCANINE', 'NINETALES', 'RAPIDASH'],
    fact: "Blaine's Magmar! Winning with an epic Seismic Toss into the volcano.",
  },
  {
    id: 'category',
    ask: "What is Charizard's official category in the Pokédex?",
    options: ['FLAME POKÉMON', 'DRAGON POKÉMON', 'LIZARD POKÉMON', 'FIRE POKÉMON'],
    fact: "The Flame Pokémon! Charmander and Charmeleon are Lizard/Flame Pokémon.",
  },
  {
    id: 'height',
    ask: "According to the Pokédex, how tall is an average Charizard?",
    options: [`5'07" (1.7 M)`, `7'02" (2.2 M)`, `6'06" (2.0 M)`, `4'11" (1.5 M)`],
    fact: "5'07\" (1.7 meters)! Many fans are surprised that Charizard is human-sized.",
  },
  {
    id: 'weight',
    ask: "What is an average Charizard's weight in the Pokédex?",
    options: ['199.5 LBS (90.5 KG)', '350 LBS (158 KG)', '120 LBS (54 KG)', '280 LBS (127 KG)'],
    fact: "199.5 lbs (90.5 kg). Built for aerial agility and soaring flight.",
  },
  {
    id: 'valley',
    ask: "Where did Ash leave his Charizard to train in the Johto region?",
    options: ['CHARICIFIC VALLEY', 'MT. SILVER', "DRAGON'S DEN", 'CINNABAR ISLAND'],
    fact: "The Charicific Valley, a natural canyon reserve where wild Charizard train.",
  },
  {
    id: 'articuno',
    ask: "At the Battle Factory, which Legendary bird did Ash's Charizard famously defeat?",
    options: ['ARTICUNO', 'ZAPDOS', 'MOLTRES', 'LUGIA'],
    fact: "Noland's Articuno! One of the first times a regular Pokémon bested a Legendary.",
  },
  {
    id: 'red-origins',
    ask: "In the Pokémon Origins anime, whose Charizard Mega Evolves to defeat Mewtwo?",
    options: ['RED', 'BLUE', 'OAK', 'GREEN'],
    fact: "Red! Defeating Mewtwo in Cerulean Cave using Mega Charizard X.",
  },
  {
    id: 'tera-raid',
    ask: "In Pokémon Scarlet & Violet, what was the very first 7-star Tera Raid boss?",
    options: ['DRAGON TERA CHARIZARD', 'FIRE TERA CHARIZARD', 'FLYING TERA CHARIZARD', 'DARK TERA CHARIZARD'],
    fact: "Unrivaled Charizard with the Dragon Tera Type and the Mightiest Mark!",
  },
  {
    id: 'signature',
    ask: "Charizard's breath of fire is said to be hot enough to melt what?",
    options: ['BOULDERS & GLACIERS', 'ONLY WOOD', 'TITANIUM ONLY', 'DIAMOND'],
    fact: "Boulders, rocks, and massive glaciers! It can unintentionally cause forest fires.",
  },
  {
    id: 'generation',
    ask: "In which generation did Charizard gain the ability to fly outside of battle via HM02?",
    options: ['POKÉMON YELLOW', 'POKÉMON RED & BLUE', 'GENERATION 2', 'GENERATION 3'],
    fact: "Pokémon Yellow! In the original Red/Blue, Charizard couldn't learn HM Fly.",
  },
];
