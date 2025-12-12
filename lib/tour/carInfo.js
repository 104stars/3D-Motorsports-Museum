/**
 * Detailed information for each car in the museum exhibition.
 * Includes historic background, technical specifications, interesting facts, and media.
 */

export const CAR_INFO = {
  "audi-quattro": {
    name: "Audi Quattro",
    year: "1980-1991",
    category: "Rally",
    tagline: "The car that changed rallying forever",
    historic: {
      title: "A Revolution in Rally",
      content: `The Audi Quattro revolutionized motorsport when it debuted in 1980 as the first rally car to use a permanent all-wheel-drive system. Before the Quattro, rally cars were rear-wheel drive, limiting their ability to put power down on loose surfaces.

Audi's engineers, led by Ferdinand Piëch, created a system that distributed power to all four wheels through a center differential. This gave the Quattro an unprecedented advantage on gravel, snow, and mixed conditions.

The car dominated the World Rally Championship, winning manufacturer titles in 1982 and 1984, with legendary drivers like Hannu Mikkola and Stig Blomqvist claiming driver championships. The Quattro's success forced every major manufacturer to develop their own AWD systems, fundamentally changing rally car design forever.`,
    },
    technical: {
      engine: "2.1L Inline-5 Turbo",
      power: "306 hp (Group B spec)",
      torque: "350 Nm",
      weight: "1,290 kg",
      drivetrain: "Permanent AWD",
      transmission: "5-speed manual",
      topSpeed: "220 km/h",
      acceleration: "0-100 km/h in 4.8s",
    },
    facts: [
      "The 'Quattro' name comes from the Italian word for 'four', referring to its four-wheel-drive system.",
      "It was the first car to win a WRC rally on all four driven wheels (1981 Monte Carlo Rally).",
      "The distinctive boxy shape was designed by Martin Smith, who later designed the Ford Focus.",
      "Over 11,000 road-going Quattros were produced, making it one of the most successful homologation specials.",
      "The car's turbo lag was legendary - drivers had to anticipate corners and keep the turbo spooled.",
    ],
    media: [
      { type: "image", src: "/media/cars/audi-quattro/rally.jpg", alt: "Audi Quattro in rally action" },
      { type: "image", src: "/media/cars/audi-quattro/engine.jpg", alt: "Quattro's inline-5 turbo engine" },
    ],
  },

  "mazda-787b": {
    name: "Mazda 787B",
    year: "1991",
    category: "Endurance Racing",
    tagline: "The rotary engine's greatest triumph",
    historic: {
      title: "Le Mans Glory",
      content: `The Mazda 787B holds a unique place in motorsport history as the only Japanese car and the only car powered by a rotary engine to win the 24 Hours of Le Mans outright.

On June 23, 1991, the distinctive orange and green car crossed the finish line after 362 laps, piloted by Johnny Herbert, Volker Weidler, and Bertrand Gachot. The victory came in the final year before rotary engines were effectively banned from the race through rule changes.

Mazda had been competing at Le Mans since 1970, never giving up on their rotary dream. The 787B was the culmination of over two decades of development, featuring a quad-rotor R26B engine that produced its unmistakable high-pitched scream - reaching nearly 9,000 RPM and producing one of the most iconic sounds in motorsport history.`,
    },
    technical: {
      engine: "2.6L R26B Quad-Rotor",
      power: "700 hp @ 9,000 RPM",
      torque: "608 Nm",
      weight: "830 kg",
      drivetrain: "RWD",
      transmission: "5-speed sequential",
      topSpeed: "362 km/h",
      acceleration: "Classified (race car)",
    },
    facts: [
      "The R26B engine's distinctive scream can reach 130 decibels - louder than a jet engine at takeoff.",
      "After the win, rule changes effectively banned rotary engines from Le Mans prototype racing.",
      "The car's livery was designed by Mazda's motorsport division and has become iconic in racing culture.",
      "Only three 787B chassis were ever built, making surviving examples priceless.",
      "Mazda still runs the winning car at demonstration events, carefully maintaining the original engine.",
    ],
    media: [
      { type: "image", src: "/media/cars/787b/787header.webp", alt: "Mazda 787B at Circuit de la Sarthe" },
      { type: "image", src: "/media/cars/787b/lemans.jpg", alt: "787B at Le Mans 1991" },
      { type: "video", src: "/media/cars/787b/sound.mp4", alt: "The legendary rotary scream" },
    ],
  },

  "ferrari-499": {
    name: "Ferrari 499P",
    year: "2023",
    category: "Hypercar/Endurance",
    tagline: "Ferrari's return to Le Mans glory",
    historic: {
      title: "The Prancing Horse Returns",
      content: `The Ferrari 499P marked Ferrari's triumphant return to top-tier endurance racing after a 50-year absence. In 2023, the car achieved what many thought impossible - winning Le Mans on its debut season.

Ferrari last won Le Mans outright in 1965 with the 250 LM. The 499P was developed under the new Hypercar regulations, which aim to bring manufacturers closer together while maintaining the spirit of prototype racing.

The victory at the 2023 24 Hours of Le Mans was emotional for Ferrari, the fans, and motorsport as a whole. Car #51, driven by Alessandro Pier Guidi, James Calado, and Antonio Giovinazzi, led a Ferrari 1-2 finish, with the #50 car close behind. It was a statement that Ferrari's endurance racing DNA was very much alive.`,
    },
    technical: {
      engine: "3.0L Twin-Turbo V6 + Hybrid",
      power: "680 hp (combined)",
      torque: "Not disclosed",
      weight: "1,030 kg (minimum)",
      drivetrain: "AWD (electric front, ICE rear)",
      transmission: "7-speed sequential",
      topSpeed: "340+ km/h",
      acceleration: "0-100 km/h in ~2.5s",
    },
    facts: [
      "The 499P shares its V6 architecture with the Ferrari 296 road car, showcasing technology transfer.",
      "Its hybrid system recovers energy under braking to power the front axle motor.",
      "Ferrari engineers worked for over three years in secret before revealing the 499P program.",
      "The car's name '499P' refers to its 499cc displacement per cylinder - a Ferrari naming tradition.",
      "The 2023 Le Mans win made Ferrari only the fourth manufacturer to win in the Hypercar era.",
    ],
    media: [
      { type: "image", src: "/media/cars/ferrari499/499pheader.webp", alt: "499P at Sebring 2023" },
      { type: "image", src: "/media/cars/ferrari499/1.webp", alt: "Ferrari 499P doing a pit stop at Le Mans 2025" }
    ],
  },

  "porsche-917": {
    name: "Porsche 917",
    year: "1969-1973",
    category: "Sports Prototype",
    tagline: "The car that defined endurance racing",
    historic: {
      title: "Birth of a Legend",
      content: `The Porsche 917 is widely considered one of the greatest racing cars ever built. Developed to win Le Mans, it dominated endurance racing in the early 1970s and became a cultural icon through its appearance in Steve McQueen's film "Le Mans."

Porsche built 25 cars to meet homologation requirements, an enormous investment for the company at the time. Early versions were notoriously difficult to drive at high speed, with aerodynamic instability causing several accidents.

After extensive development, the 917K (Kurzheck/short-tail) became dominant. In 1970-71, Porsche finally achieved their Le Mans dream, winning both years with the Gulf-liveried 917s. The car's 12-cylinder engine produced over 600 horsepower in race trim and could exceed 240 mph on the Mulsanne Straight.`,
    },
    technical: {
      engine: "4.5L/4.9L/5.0L Flat-12",
      power: "580-630 hp (race spec)",
      torque: "540 Nm",
      weight: "800 kg",
      drivetrain: "RWD",
      transmission: "4/5-speed manual",
      topSpeed: "386 km/h",
      acceleration: "0-100 km/h in 2.3s",
    },
    facts: [
      "The 917's flat-12 engine was essentially two flat-6 911 engines joined together.",
      "Steve McQueen drove a real 917 in the film 'Le Mans' - some footage used actual race cars at speed.",
      "The famous Gulf livery (orange and blue) has become one of the most recognizable in motorsport.",
      "A turbocharged Can-Am version produced over 1,100 hp, making it one of the most powerful race cars ever.",
      "One 917 sold at auction in 2017 for $14 million, making it one of the most valuable Porsches ever.",
    ],
    media: [
      { type: "image", src: "/media/cars/917/917header.jpg", alt: "Porsche 917 Gulf-liveried" },
      { type: "image", src: "/media/cars/917/1.jpg", alt: " 917K at Le Mans" },
      { type: "image", src: "/media/cars/917/2.webp", alt: " 917K at Le Mans" },
      { type: "youtube", videoId: "Oj1bLHBmf3g", alt: "917 video" },
    ],
  },

  "yaris": {
    name: "Toyota Yaris",
    year: "2020-present",
    category: "World Rally",
    tagline: "Toyota's modern rally champion",
    historic: {
      title: "Modern Rally Excellence",
      content: `The Toyota Yaris WRC represents Toyota's successful return to the World Rally Championship, winning multiple manufacturers' and drivers' championships in the modern era.

The Yaris WRC debuted in 2017 and quickly established itself as a dominant force, with drivers like Sébastien Ogier and Kalle Rovanperä achieving championship success. The car's hybrid powertrain and advanced aerodynamics showcase the evolution of rally technology.

Toyota's commitment to rallying with the Yaris has brought the manufacturer back to the forefront of the sport, combining reliability, performance, and cutting-edge engineering.`,
    },
    technical: {
      engine: "1.6L Turbo",
      power: "380 hp (hybrid)",
      torque: "450 Nm",
      weight: "1,260 kg",
      drivetrain: "AWD",
      transmission: "5-speed sequential",
      topSpeed: "200 km/h",
      acceleration: "0-100 km/h in 3.8s",
    },
    facts: [
      "The Yaris WRC helped Toyota win multiple manufacturers' championships in the modern WRC era.",
      "Kalle Rovanperä became the youngest WRC champion in history driving the Yaris.",
      "The car features a hybrid powertrain, representing the future of rally technology.",
      "Toyota's Gazoo Racing division developed the Yaris WRC with extensive testing.",
      "The Yaris WRC has won championships across multiple seasons, proving its reliability and performance.",
    ],
    media: [
      { type: "image", src: "/media/cars/yaris/rally.jpg", alt: "Toyota Yaris WRC in action" },
      { type: "image", src: "/media/cars/yaris/jump.jpg", alt: "Yaris WRC airborne on gravel" },
    ],
  },

  "toyota-celica": {
    name: "Toyota Celica GT-Four",
    year: "1988-1999",
    category: "World Rally",
    tagline: "Toyota's turbocharged rally warrior",
    historic: {
      title: "The Rise and Controversy",
      content: `The Toyota Celica GT-Four represented Toyota's most successful foray into World Rally Championship competition, winning multiple championships but also becoming embroiled in one of rallying's biggest scandals.

The ST165, ST185, and ST205 generations of the Celica GT-Four competed at the highest level, with Carlos Sainz Sr. winning the drivers' championship in 1990 and 1992. The car's turbocharged 3S-GTE engine and sophisticated AWD system made it a formidable competitor.

However, in 1995, Toyota was caught using an illegal turbo restrictor that bypassed FIA regulations. The resulting disqualification and ban from WRC competition was a major blow to the manufacturer. Despite this controversy, the Celica GT-Four remains a beloved homologation special and a highly sought-after collector car.`,
    },
    technical: {
      engine: "2.0L 3S-GTE Turbo",
      power: "295 hp (WRC spec)",
      torque: "420 Nm",
      weight: "1,200 kg",
      drivetrain: "Full-time AWD",
      transmission: "6-speed sequential",
      topSpeed: "210 km/h",
      acceleration: "0-100 km/h in 4.0s",
    },
    facts: [
      "Carlos Sainz Sr. (father of current F1 driver Carlos Sainz Jr.) won two WRC titles with the Celica.",
      "The 1995 turbo restrictor scandal resulted in Toyota's exclusion from the WRC for an entire year.",
      "The road-going GT-Four (All-Trac in the US) featured genuine rally technology in a street-legal package.",
      "The ST205 generation featured the revolutionary Super Strut suspension system.",
      "Despite the controversy, the Celica GT-Four won 17 WRC rallies across its three generations.",
    ],
    media: [
      { type: "image", src: "/media/cars/celica/sainz.jpg", alt: "Carlos Sainz in the Celica GT-Four" },
      { type: "image", src: "/media/cars/celica/st205.jpg", alt: "ST205 Celica in competition" },
    ],
  },

  "mclaren-mp45": {
    name: "McLaren MP4/5",
    year: "1989",
    category: "Formula One",
    tagline: "Peak of the Senna-Prost rivalry",
    historic: {
      title: "Two Titans, One Team",
      content: `The McLaren MP4/5 was the car that hosted the most intense teammate rivalry in Formula One history - Ayrton Senna versus Alain Prost. The 1989 season saw these two legends in identical machinery, fighting for the championship with contrasting driving styles.

Designed by Neil Oatley and Gordon Murray's successor Steve Nichols, the MP4/5 was powered by Honda's naturally aspirated 3.5L V10 engine after turbo engines were banned. It was a beautifully balanced car that suited both drivers' styles, which only intensified their battle.

The season culminated in the infamous collision at Suzuka, where Prost turned into Senna at the chicane. Prost won the championship, but the incident would have repercussions for years to come. Despite the internal conflict, McLaren won 10 of 16 races that season.`,
    },
    technical: {
      engine: "Honda RA109E 3.5L V10",
      power: "685 hp @ 13,000 RPM",
      torque: "Not disclosed",
      weight: "500 kg (minimum)",
      drivetrain: "RWD",
      transmission: "6-speed manual",
      topSpeed: "350+ km/h",
      acceleration: "0-100 km/h in ~2.5s",
    },
    facts: [
      "Senna and Prost won 15 pole positions between them in 1989 - the team dominated qualifying.",
      "The MP4/5 was the first McLaren designed specifically for naturally aspirated engines in the turbo ban era.",
      "Honda's V10 engine was considered the class of the field, producing more power than any rival.",
      "The Suzuka collision led to Senna's famous suspension and subsequent appeal.",
      "This car represented the peak of the McLaren-Honda partnership that won four consecutive constructors' titles.",
    ],
    media: [
      { type: "image", src: "/media/cars/mp45/senna.jpg", alt: "Ayrton Senna in the MP4/5" },
      { type: "video", src: "/media/cars/mp45/suzuka89.mp4", alt: "The infamous Suzuka incident" },
    ],
  },

  "redbull-rb9": {
    name: "Red Bull RB9",
    year: "2013",
    category: "Formula One",
    tagline: "Vettel's fourth consecutive championship",
    historic: {
      title: "Dominance Personified",
      content: `The Red Bull RB9 was the pinnacle of Adrian Newey's dominant design era, carrying Sebastian Vettel to his fourth consecutive World Championship - a feat matched only by Juan Manuel Fangio and later equaled by Lewis Hamilton.

The RB9 was notable for its innovative exhaust-blown diffuser concept, which used exhaust gases to enhance downforce at the rear of the car. Combined with Newey's signature aggressive aerodynamics and the reliable Renault V8 engine, it created a package that was virtually unbeatable in the second half of the season.

Vettel's season was historic - after a competitive first half, he won nine consecutive races from Belgium to Brazil, a record-breaking streak. The car's performance, combined with Vettel's exceptional qualifying speed and tire management, made the RB9 one of the most dominant F1 cars ever built.`,
    },
    technical: {
      engine: "Renault RS27 2.4L V8",
      power: "750 hp @ 18,000 RPM",
      torque: "Not disclosed",
      weight: "642 kg (minimum)",
      drivetrain: "RWD",
      transmission: "7-speed semi-automatic",
      topSpeed: "340+ km/h",
      acceleration: "0-100 km/h in ~2.0s",
    },
    facts: [
      "Vettel's nine consecutive wins broke the record previously held by Alberto Ascari (1952-53).",
      "The RB9 was the last Red Bull car to use a naturally aspirated engine before the 2014 hybrid era.",
      "Adrian Newey's design won four consecutive constructors' championships with Red Bull (2010-2013).",
      "Vettel secured his fourth title in India with three races remaining - the earliest championship clinch.",
      "The car's distinctive step nose was a result of 2012 regulation changes that Red Bull adapted brilliantly.",
    ],
    media: [
      { type: "image", src: "/media/cars/rb9/vettel.jpg", alt: "Sebastian Vettel celebrating in the RB9" },
      { type: "image", src: "/media/cars/rb9/aero.jpg", alt: "RB9 aerodynamic details" },
    ],
  },
};

/**
 * Get car information by ID.
 * @param {string} carId - The car's unique identifier
 * @returns {object|null} The car information object or null if not found
 */
export function getCarInfo(carId) {
  return CAR_INFO[carId] || null;
}

/**
 * Get all car IDs that have information available.
 * @returns {string[]} Array of car IDs
 */
export function getAvailableCarIds() {
  return Object.keys(CAR_INFO);
}