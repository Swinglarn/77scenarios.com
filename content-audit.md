# 77scenarios - character page content audit

766 character pages. Four slots per page are character-specific; everything else
is generated from the type and reads identically across every character sharing it.

| Slot | Source | Pages with real content |
|---|---|---|
| The Verdict | `people[].desc` in `data/characters-en.js` | 766 |
| Who They Are | generated boilerplate, or `charContent[slug].who` | 209 |
| The Journey | `charContent[slug].journey` | 680 |
| Letter by Letter | `charContent[slug].letters` | 566 |
| Why Not Another Type? | `charContent[slug].mistype` | 680 |

Where a slot has no data the page falls back to a template with the character's
name slotted into generic function-stack prose, so it says nothing specific about
that character at all. Those are the worst pages and they are listed first.

**Rewritten so far (209):** Joan Watson, Albus Severus Potter, Rihanna, Prince, Mick Jagger, Bruce Springsteen, Drake, Nicki Minaj, Radiohead / Thom Yorke, Ariana Grande, Mark Twain, Pablo Neruda, Marcel Proust, Michelangelo, Rembrandt, Joseph Stalin, Winston Churchill, Martin Luther, Justin Trudeau, Emmanuel Macron, Xi Jinping, Steve Bannon, Sheryl Sandberg, Richard Branson, Neil Armstrong, Michio Kaku, Jane Goodall, Simone Biles, Novak Djokovic, Pelé, Ayrton Senna, Neymar Jr., Rafael Nadal, Wayne Gretzky, Steph Curry, Ricky Gervais, Dave Chappelle, Chris Rock, Slavoj Žižek, Peter Singer, Yuval Noah Harari, Malcolm Gladwell, Jane Eyre, Miss Marple, Lolita narrator Humbert Humbert, Ignatius J. Reilly, Robinson Crusoe, Sancho Panza, Nora Durst, Kevin Garvey, Cousin Greg, St. Francis of Assisi, Thomas Aquinas, Rumi, Lao Tzu, Walt Disney, Nikola Tesla, P.T. Barnum, Moana, Mulan, Hercules, Marlin, M (Judi Dench), Vin Diesel / Dominic Toretto, Llewyn Davis, The Phantom, Marge Simpson, Stewie Griffin, Jeff Winger, Liz Lemon, Jake Peralta, Tommy Shelby, Wendy Byrde, Frasier Crane, Phil Dunphy, Sterling Archer, Yennefer of Vengerberg, Solid Snake, Lara Croft, Cloud Strife, Sephiroth, Nathan Drake, Ezio Auditore, Leon S. Kennedy, Trevor Philips, John Marston, 2B, Aloy, Princess Zelda, Commander Shepard, Victor Frankenstein, Willy Wonka, Scout Finch, Queen Victoria, Henry VIII, Elizabeth I, Galileo Galilei, Voltaire, Simone de Beauvoir, Ada Lovelace, Rosa Parks, Malcolm X, Simón Bolívar, Sun Tzu, Ho Chi Minh, Bob Marley, Janis Joplin, Stevie Wonder, Tina Turner, Madonna, Stevie Nicks, Tyler, the Creator, Whitney Houston, Sting, The Weeknd, Lorde, Tim Cook, Sam Altman, Peter Thiel, Hannah Arendt, Grace Hopper, Jean-Paul Sartre, Alan Watts, Diego Maradona, Ronaldinho, Zinedine Zidane, Magic Johnson, Shaquille O'Neal, Floyd Mayweather, Giannis Antetokounmpo, Zlatan Ibrahimović, Larry Bird, Marty McFly, Doc Brown, Holly Golightly, Achilles, Peter Pan, Long John Silver, Tom Sawyer, Boyd Crowder, Carrie Mathison, Peter Quill, Sonny Corleone, Fredo Corleone, G.O.B. Bluth, Kimmy Schmidt, Lewis Hamilton, Thierry Henry, Michel Foucault, Otto von Bismarck, Maya Angelou, Toni Morrison, Jack Kerouac, Simone Weil, W.E.B. Du Bois, Margaret Mead, Joseph Campbell, Pablo Picasso, Jean-Michel Basquiat, Georgia O'Keeffe, Spike Lee, Pedro Almodovar, Ingmar Bergman, Werner Herzog, Jordan Peele, Franklin D. Roosevelt, Mikhail Gorbachev, Richard Nixon, Rachel Carson, Ludwig Wittgenstein, Roald Dahl, Mycroft Holmes, Irene Adler, William Wallace, Eowyn, Bilbo Baggins, O-Ren Ishii, Paddington Bear, M. Gustave, Nina Simone, Louis Armstrong, Arthur Conan Doyle, Lady Jessica, Duncan Idaho, Alia Atreides, Stilgar, Leto II, Princess Irulan, Betty Draper, Johnny Silverhand, GLaDOS, Antigone, James Dean, Audrey Hepburn, Niko Bellic, Frédéric Chopin, Nora Helmer, Empress Wu Zetian, Rasputin, P.G. Wodehouse, George Hammond, Janet Fraiser, Jonas Quinn, Cameron Mitchell, Ba'al, Apophis, Bra'tac, Jacob Carter, Martouf.
Each got a researched biography in place of the boilerplate, a new journey,
mistype and letter breakdown, a longer Verdict, and question-form subheadings.

Run `node scripts/sync-character-pages.mjs <slug>...` after editing the data files,
or the static English pages will not change.

## Tier 1 - fully generic (13 pages)

Ranked worst first by how little the Verdict says.

| Character | Source | Type | Verdict words | Journey | Mistype | Letters |
|---|---|---|---|---|---|---|
| Michael Phelps | Olympic swimmer | ISTJ | 119 | - | - | - |
| Théoden King | Lord of the Rings | ISTJ | 120 | - | - | - |
| Gabriel García Márquez | Colombian novelist | INFP | 120 | - | - | - |
| Steve Wozniak | Co-founder of Apple, engineer | INTP | 120 | - | - | - |
| Tom Brady | NFL quarterback | INTJ | 121 | - | - | - |
| Niccolò Machiavelli | Italian Renaissance political philosopher | INTJ | 123 | - | - | - |
| Beyoncé | Singer, songwriter, performer | ISFJ | 124 | - | - | - |
| Ciri | The Witcher | ISFP | 125 | - | - | - |
| Thomas Edison | American inventor and businessman | ENTP | 126 | - | - | - |
| Marie Curie | Physicist and chemist, Nobel laureate | INTJ | 134 | - | - | - |
| Maximus | Gladiator | ISFJ | 134 | - | - | - |
| Miles Davis | Musician | INTJ | 135 | - | - | - |
| Marty Byrde | Ozark | INTJ | 138 | - | - | - |

## Tier 2 - journey and mistype written, no letter breakdown (187 pages)

| Character | Source | Type | Verdict words | Journey | Mistype | Letters |
|---|---|---|---|---|---|---|
| Ramsay Bolton | Game of Thrones | ESTP | 49 | y | y | - |
| Eric Cartman | South Park | ENTJ | 51 | y | y | - |
| Jack Donaghy | 30 Rock | ENTJ | 52 | y | y | - |
| Amélie Poulain | Amélie (2001) | INFP | 52 | y | y | - |
| Anna Karenina | Anna Karenina by Leo Tolstoy | ENFP | 53 | y | y | - |
| Javert | Les Misérables by Victor Hugo | ISTJ | 55 | y | y | - |
| Alice | Alice in Wonderland by Lewis Carroll | ENFP | 55 | y | y | - |
| Professor Moriarty | Sherlock Holmes stories | INTJ | 56 | y | y | - |
| Agent 47 | Hitman series | ISTP | 57 | y | y | - |
| Edmond Dantès | The Count of Monte Cristo by Alexandre Dumas | INTJ | 57 | y | y | - |
| Albert Camus | French-Algerian author and philosopher | INFP | 57 | y | y | - |
| Huckleberry Finn | Adventures of Huckleberry Finn by Mark Twain | ISFP | 57 | y | y | - |
| Agatha Christie | Author | ISTJ | 57 | y | y | - |
| Jean Valjean | Les Misérables by Victor Hugo | INFP | 59 | y | y | - |
| Bart Simpson | The Simpsons | ESTP | 60 | y | y | - |
| Joan Holloway | Mad Men | ESTJ | 61 | y | y | - |
| Levi Ackerman | Attack on Titan | ISTP | 62 | y | y | - |
| Baron Vladimir Harkonnen | Dune (Frank Herbert) | ENTJ | 64 | y | y | - |
| John Muir | Naturalist and conservationist | INFP | 66 | y | y | - |
| Duke Leto Atreides | Dune (Frank Herbert) | ENFJ | 66 | y | y | - |
| Katharine Hepburn | Actor | ENTJ | 66 | y | y | - |
| Steve Carell | Actor, comedian, and filmmaker | INFP | 66 | y | y | - |
| Clint Eastwood | Actor, director, and producer | ISTP | 67 | y | y | - |
| Michael Bluth | Arrested Development | ISTJ | 68 | y | y | - |
| Dennis Reynolds | It's Always Sunny in Philadelphia | ENTJ | 69 | y | y | - |
| Paul Miller | Muay Thai kickboxer, boxer, and independent journalist | ESTP | 69 | y | y | - |
| Gustaf VI Adolf | King of Sweden 1950–1973, archaeologist and scholar | INTP | 69 | y | y | - |
| Moira Rose | Schitt's Creek | ENFJ | 70 | y | y | - |
| Alfred Hitchcock | Film director | INTJ | 71 | y | y | - |
| Shinji Ikari | Neon Genesis Evangelion | INFP | 73 | y | y | - |
| Carl XVI Gustaf | King of Sweden since 1973 | ISTJ | 73 | y | y | - |
| Emma Bovary | Madame Bovary (Flaubert) | ENFP | 74 | y | y | - |
| Ruth Langmore | Ozark | ESTP | 75 | y | y | - |
| Marco Rubio | US Senator and Secretary of State | ESFJ | 75 | y | y | - |
| Larry David | Curb Your Enthusiasm | INTP | 76 | y | y | - |
| Edward Elric | Fullmetal Alchemist: Brotherhood | ENTP | 76 | y | y | - |
| Meursault | The Stranger (Albert Camus) | ISTP | 78 | y | y | - |
| Spike Spiegel | Cowboy Bebop | ISTP | 78 | y | y | - |
| Sawyer | Lost | ESTP | 81 | y | y | - |
| Chris Traeger | Parks and Recreation | ENFJ | 82 | y | y | - |
| Abby Anderson | The Last of Us Part II | ISTJ | 82 | y | y | - |
| Vincent Vega | Pulp Fiction | ISTP | 83 | y | y | - |
| Billie Holiday | Jazz musician | ISFP | 84 | y | y | - |
| Mufasa | The Lion King | ENFJ | 85 | y | y | - |
| Polly Gray | Peaky Blinders | ENTJ | 86 | y | y | - |
| Emmeline Pankhurst | British suffragette leader | ENTJ | 87 | y | y | - |
| Donkey | Shrek (2001) | ESFP | 88 | y | y | - |
| Simba | The Lion King | ENFP | 89 | y | y | - |
| Buzz Lightyear | Toy Story | ESTJ | 90 | y | y | - |
| WALL-E | WALL-E (Pixar) | INFP | 90 | y | y | - |

_...and 137 more._

## Tier 3 - all slots written (493 pages)

No action needed.
