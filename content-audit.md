# 77scenarios - character page content audit

766 character pages. Four slots per page are character-specific; everything else
is generated from the type and reads identically across every character sharing it.

| Slot | Source | Pages with real content |
|---|---|---|
| The Verdict | `people[].desc` in `data/characters-en.js` | 766 |
| Who They Are | generated boilerplate, or `charContent[slug].who` | 169 |
| The Journey | `charContent[slug].journey` | 640 |
| Letter by Letter | `charContent[slug].letters` | 526 |
| Why Not Another Type? | `charContent[slug].mistype` | 640 |

Where a slot has no data the page falls back to a template with the character's
name slotted into generic function-stack prose, so it says nothing specific about
that character at all. Those are the worst pages and they are listed first.

**Rewritten so far (169):** Joan Watson, Prince, Bruce Springsteen, Drake, Radiohead / Thom Yorke, Ariana Grande, Pablo Neruda, Marcel Proust, Michelangelo, Rembrandt, Joseph Stalin, Winston Churchill, Justin Trudeau, Xi Jinping, Sheryl Sandberg, Richard Branson, Neil Armstrong, Michio Kaku, Jane Goodall, Pelé, Ayrton Senna, Rafael Nadal, Dave Chappelle, Chris Rock, Peter Singer, Yuval Noah Harari, Jane Eyre, Lolita narrator Humbert Humbert, Ignatius J. Reilly, Robinson Crusoe, Sancho Panza, Kevin Garvey, Cousin Greg, St. Francis of Assisi, Lao Tzu, Walt Disney, Nikola Tesla, P.T. Barnum, Moana, Mulan, Hercules, M (Judi Dench), Llewyn Davis, Marge Simpson, Stewie Griffin, Jeff Winger, Liz Lemon, Jake Peralta, Tommy Shelby, Wendy Byrde, Frasier Crane, Phil Dunphy, Sterling Archer, Solid Snake, Lara Croft, Cloud Strife, Sephiroth, Nathan Drake, Ezio Auditore, Leon S. Kennedy, Trevor Philips, John Marston, 2B, Aloy, Princess Zelda, Commander Shepard, Victor Frankenstein, Willy Wonka, Scout Finch, Queen Victoria, Henry VIII, Elizabeth I, Galileo Galilei, Voltaire, Simone de Beauvoir, Ada Lovelace, Rosa Parks, Malcolm X, Simón Bolívar, Sun Tzu, Ho Chi Minh, Janis Joplin, Stevie Wonder, Tina Turner, Madonna, Stevie Nicks, Whitney Houston, Sting, The Weeknd, Lorde, Tim Cook, Sam Altman, Peter Thiel, Hannah Arendt, Grace Hopper, Jean-Paul Sartre, Alan Watts, Diego Maradona, Ronaldinho, Zinedine Zidane, Magic Johnson, Shaquille O'Neal, Floyd Mayweather, Giannis Antetokounmpo, Zlatan Ibrahimović, Larry Bird, Marty McFly, Doc Brown, Holly Golightly, Achilles, Peter Pan, Long John Silver, Tom Sawyer, Boyd Crowder, Carrie Mathison, Peter Quill, Sonny Corleone, Fredo Corleone, G.O.B. Bluth, Thierry Henry, Otto von Bismarck, Jack Kerouac, Simone Weil, Margaret Mead, Joseph Campbell, Pablo Picasso, Jean-Michel Basquiat, Georgia O'Keeffe, Spike Lee, Pedro Almodovar, Ingmar Bergman, Werner Herzog, Jordan Peele, Franklin D. Roosevelt, Mikhail Gorbachev, Richard Nixon, Ludwig Wittgenstein, Irene Adler, William Wallace, Eowyn, Bilbo Baggins, O-Ren Ishii, Louis Armstrong, Arthur Conan Doyle, Lady Jessica, Duncan Idaho, Alia Atreides, Stilgar, Leto II, Princess Irulan, Betty Draper, Johnny Silverhand, GLaDOS, Antigone, James Dean, Audrey Hepburn, Niko Bellic, Frédéric Chopin, Nora Helmer, Empress Wu Zetian, George Hammond, Janet Fraiser, Jonas Quinn, Cameron Mitchell, Ba'al, Apophis, Bra'tac, Jacob Carter, Martouf.
Each got a researched biography in place of the boilerplate, a new journey,
mistype and letter breakdown, a longer Verdict, and question-form subheadings.

Run `node scripts/sync-character-pages.mjs <slug>...` after editing the data files,
or the static English pages will not change.

## Tier 1 - fully generic (53 pages)

Ranked worst first by how little the Verdict says.

| Character | Source | Type | Verdict words | Journey | Mistype | Letters |
|---|---|---|---|---|---|---|
| Rasputin | Imperial Russian mystic | ENFJ | 105 | - | - | - |
| Novak Djokovic | Professional tennis player | INTJ | 106 | - | - | - |
| The Phantom | Phantom of the Opera | INFP | 106 | - | - | - |
| Lewis Hamilton | Formula 1 driver | INTJ | 106 | - | - | - |
| P.G. Wodehouse | English comic novelist | ENFP | 106 | - | - | - |
| Mark Twain | American author and humorist | ENTP | 107 | - | - | - |
| Martin Luther | Protestant reformer, theologian | INFJ | 107 | - | - | - |
| Neymar Jr. | Brazilian footballer | ESFP | 107 | - | - | - |
| Toni Morrison | Author | INFJ | 107 | - | - | - |
| W.E.B. Du Bois | Sociologist and activist | INTJ | 107 | - | - | - |
| Mick Jagger | Singer, The Rolling Stones | ESTP | 108 | - | - | - |
| Steve Bannon | Political strategist | ENTP | 108 | - | - | - |
| Ricky Gervais | Comedian, writer, actor | ENTP | 108 | - | - | - |
| Malcolm Gladwell | Canadian journalist and author | ENFP | 109 | - | - | - |
| Miss Marple | Agatha Christie novels | ISFJ | 109 | - | - | - |
| Tyler, the Creator | American rapper and producer | ENTP | 109 | - | - | - |
| Wayne Gretzky | Professional ice hockey player | INFP | 110 | - | - | - |
| Steph Curry | NBA basketball player | ISFP | 110 | - | - | - |
| Slavoj Žižek | Slovenian philosopher | ENTP | 110 | - | - | - |
| Thomas Aquinas | Catholic theologian and philosopher | INTP | 110 | - | - | - |
| Maya Angelou | Author and poet | ENFJ | 110 | - | - | - |
| Nicki Minaj | Rapper | ENTJ | 111 | - | - | - |
| M. Gustave | The Grand Budapest Hotel | ENFJ | 111 | - | - | - |
| Nina Simone | Musician | INTJ | 111 | - | - | - |
| Albus Severus Potter | Harry Potter (Cursed Child) | INFP | 112 | - | - | - |
| Kimmy Schmidt | Unbreakable Kimmy Schmidt | ENFP | 112 | - | - | - |
| Paddington Bear | Paddington films | ISFJ | 112 | - | - | - |
| Nora Durst | The Leftovers | ISTJ | 113 | - | - | - |
| Michel Foucault | Philosopher and historian | INTP | 113 | - | - | - |
| Rachel Carson | Marine biologist and author | INFJ | 113 | - | - | - |
| Simone Biles | Olympic gymnast | ISFP | 115 | - | - | - |
| Rumi | Persian poet and Sufi mystic | INFP | 115 | - | - | - |
| Marlin | Finding Nemo | ISTJ | 115 | - | - | - |
| Bob Marley | Jamaican reggae singer-songwriter | INFP | 116 | - | - | - |
| Mycroft Holmes | Sherlock Holmes stories | INTJ | 116 | - | - | - |
| Emmanuel Macron | President of France | ENTJ | 117 | - | - | - |
| Vin Diesel / Dominic Toretto | Fast and Furious franchise | ESFJ | 117 | - | - | - |
| Yennefer of Vengerberg | The Witcher | ENTJ | 117 | - | - | - |
| Roald Dahl | Author | ENTP | 117 | - | - | - |
| Rihanna | Singer, songwriter, entrepreneur | ESTP | 119 | - | - | - |
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

## Tier 3 - all slots written (453 pages)

No action needed.
