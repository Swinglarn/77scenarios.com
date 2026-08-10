# 77scenarios - character page content audit

766 character pages. Four slots per page are character-specific; everything else
is generated from the type and reads identically across every character sharing it.

| Slot | Source | Pages with real content |
|---|---|---|
| The Verdict | `people[].desc` in `data/characters-en.js` | 766 |
| Who They Are | generated boilerplate, or `charContent[slug].who` | 42 |
| The Journey | `charContent[slug].journey` | 568 |
| Letter by Letter | `charContent[slug].letters` | 399 |
| Why Not Another Type? | `charContent[slug].mistype` | 568 |

Where a slot has no data the page falls back to a template with the character's
name slotted into generic function-stack prose, so it says nothing specific about
that character at all. Those are the worst pages and they are listed first.

**Rewritten so far (42):** Marge Simpson, Stewie Griffin, Jeff Winger, Liz Lemon, Tommy Shelby, Wendy Byrde, Phil Dunphy, Sterling Archer, Solid Snake, Lara Croft, Cloud Strife, Sephiroth, Nathan Drake, Leon S. Kennedy, Trevor Philips, John Marston, 2B, Princess Zelda, Commander Shepard, Queen Victoria, Simone de Beauvoir, Malcolm X, Sun Tzu, Ho Chi Minh, Janis Joplin, Stevie Wonder, Tina Turner, Madonna, Stevie Nicks, Whitney Houston, Sting, The Weeknd, Lorde, Tim Cook, Peter Thiel, Jean-Paul Sartre, Ronaldinho, Magic Johnson, Shaquille O'Neal, Marty McFly, Long John Silver, Tom Sawyer.
Each got a researched biography in place of the boilerplate, a new journey,
mistype and letter breakdown, a longer Verdict, and question-form subheadings.

Run `node scripts/sync-character-pages.mjs <slug>...` after editing the data files,
or the static English pages will not change.

## Tier 1 - fully generic (125 pages)

Ranked worst first by how little the Verdict says.

| Character | Source | Type | Verdict words | Journey | Mistype | Letters |
|---|---|---|---|---|---|---|
| Zinedine Zidane | French footballer | ISFP | 61 | - | - | - |
| Doc Brown | Back to the Future | ENTP | 62 | - | - | - |
| Louis Armstrong | Musician | ESFP | 62 | - | - | - |
| Willy Wonka | Charlie and the Chocolate Factory by Roald Dahl | ENTP | 63 | - | - | - |
| Cameron Mitchell | Stargate SG-1 | ESFP | 63 | - | - | - |
| Apophis | Stargate SG-1 | ENTJ | 63 | - | - | - |
| Scout Finch | To Kill a Mockingbird by Harper Lee | ENFP | 64 | - | - | - |
| Zlatan Ibrahimović | Swedish footballer | ESTP | 64 | - | - | - |
| Diego Maradona | Argentine footballer | ESFP | 65 | - | - | - |
| Giannis Antetokounmpo | NBA basketball player | ISFP | 65 | - | - | - |
| Princess Irulan | Dune (Frank Herbert) | INFJ | 65 | - | - | - |
| Simón Bolívar | South American revolutionary leader | ENTJ | 66 | - | - | - |
| Sam Altman | CEO of OpenAI | INTJ | 66 | - | - | - |
| Janet Fraiser | Stargate SG-1 | ISFJ | 66 | - | - | - |
| Leto II | Dune (Frank Herbert) | INFJ | 67 | - | - | - |
| Larry Bird | NBA basketball player and coach | ISTJ | 68 | - | - | - |
| Peter Pan | Peter Pan by J.M. Barrie | ESTP | 68 | - | - | - |
| Duncan Idaho | Dune (Frank Herbert) | ISFP | 68 | - | - | - |
| Rosa Parks | American civil rights activist | ISFJ | 69 | - | - | - |
| Ba'al | Stargate SG-1 | ENTJ | 70 | - | - | - |
| Bra'tac | Stargate SG-1 | ISTP | 72 | - | - | - |
| Martouf | Stargate SG-1 | INFJ | 73 | - | - | - |
| Stilgar | Dune (Frank Herbert) | ISTJ | 74 | - | - | - |
| George Hammond | Stargate SG-1 | ISFJ | 74 | - | - | - |
| Jonas Quinn | Stargate SG-1 | ENFJ | 77 | - | - | - |
| Jacob Carter | Stargate SG-1 | ESTJ | 77 | - | - | - |
| M (Judi Dench) | James Bond film series | ENTJ | 85 | - | - | - |
| Marcel Proust | French novelist | INFJ | 92 | - | - | - |
| Spike Lee | Film director | ENFJ | 94 | - | - | - |
| Rembrandt | Dutch painter | INFP | 95 | - | - | - |
| Richard Branson | Founder of Virgin Group | ENFP | 95 | - | - | - |
| Pedro Almodovar | Film director | ENFP | 95 | - | - | - |
| William Wallace | Braveheart | ENFP | 95 | - | - | - |
| Justin Trudeau | Prime Minister of Canada | ENFP | 96 | - | - | - |
| Lolita narrator Humbert Humbert | Lolita by Nabokov | INTJ | 96 | - | - | - |
| Ludwig Wittgenstein | Philosopher | INTJ | 96 | - | - | - |
| Neil Armstrong | Astronaut, first person on the moon | ISTJ | 97 | - | - | - |
| Sonny Corleone | The Godfather | ESTP | 97 | - | - | - |
| Jean-Michel Basquiat | Artist | ENFP | 97 | - | - | - |
| Moana | Moana | ENFP | 98 | - | - | - |
| Frédéric Chopin | Polish composer and pianist | INFP | 98 | - | - | - |
| Xi Jinping | President of China | ISTJ | 99 | - | - | - |
| Michio Kaku | Theoretical physicist and futurist | ENFP | 99 | - | - | - |
| Alia Atreides | Dune (Frank Herbert) | INTJ | 99 | - | - | - |
| Pelé | Brazilian footballer | ESFP | 100 | - | - | - |
| Mulan | Mulan | ISTP | 100 | - | - | - |
| Peter Quill | Guardians of the Galaxy | ESFP | 100 | - | - | - |
| Margaret Mead | Anthropologist | ENFJ | 100 | - | - | - |
| O-Ren Ishii | Kill Bill | INTJ | 100 | - | - | - |
| Niko Bellic | Grand Theft Auto IV | ISTP | 100 | - | - | - |
| Pablo Neruda | Chilean poet | INFP | 101 | - | - | - |
| Sheryl Sandberg | Facebook COO, author of Lean In | ENTJ | 101 | - | - | - |
| Sancho Panza | Don Quixote by Cervantes | ESFP | 101 | - | - | - |
| Robinson Crusoe | Robinson Crusoe by Daniel Defoe | ISTJ | 102 | - | - | - |
| Hercules | Hercules (Disney) | ESFP | 102 | - | - | - |
| Thierry Henry | Footballer | ISFJ | 102 | - | - | - |
| Simone Weil | Philosopher and mystic | INFJ | 102 | - | - | - |
| Werner Herzog | Film director | INTJ | 102 | - | - | - |
| Walt Disney | Animator, filmmaker, entrepreneur | ENFP | 103 | - | - | - |
| Voltaire | French Enlightenment philosopher and writer | ENTP | 103 | - | - | - |
| Joan Watson | Elementary (TV series) | ISTJ | 104 | - | - | - |
| Radiohead / Thom Yorke | Musician, Radiohead | INFP | 104 | - | - | - |
| Yuval Noah Harari | Israeli historian and author | INFJ | 104 | - | - | - |
| Llewyn Davis | Inside Llewyn Davis | INFP | 104 | - | - | - |
| Otto von Bismarck | German statesman | INTJ | 104 | - | - | - |
| Mikhail Gorbachev | Soviet leader | INFJ | 104 | - | - | - |
| Michelangelo | Renaissance sculptor and painter | INTJ | 105 | - | - | - |
| Rafael Nadal | Professional tennis player | ISFJ | 105 | - | - | - |
| Peter Singer | Australian philosopher, ethicist | INTP | 105 | - | - | - |
| St. Francis of Assisi | Catholic friar and saint | INFP | 105 | - | - | - |
| P.T. Barnum | Showman and circus founder | ENTP | 105 | - | - | - |
| Richard Nixon | US President | INTJ | 105 | - | - | - |
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

## Tier 2 - journey and mistype written, no letter breakdown (242 pages)

| Character | Source | Type | Verdict words | Journey | Mistype | Letters |
|---|---|---|---|---|---|---|
| Ramsay Bolton | Game of Thrones | ESTP | 49 | y | y | - |
| Galileo Galilei | Italian astronomer and physicist | INTJ | 50 | y | y | - |
| Eric Cartman | South Park | ENTJ | 51 | y | y | - |
| Grace Hopper | American computer scientist and Navy admiral | ENTJ | 51 | y | y | - |
| Jack Donaghy | 30 Rock | ENTJ | 52 | y | y | - |
| Amélie Poulain | Amélie (2001) | INFP | 52 | y | y | - |
| Anna Karenina | Anna Karenina by Leo Tolstoy | ENFP | 53 | y | y | - |
| Aloy | Horizon Zero Dawn | ISTJ | 54 | y | y | - |
| Ada Lovelace | English mathematician, first computer programmer | INTJ | 54 | y | y | - |
| Javert | Les Misérables by Victor Hugo | ISTJ | 55 | y | y | - |
| Alice | Alice in Wonderland by Lewis Carroll | ENFP | 55 | y | y | - |
| Alan Watts | British philosopher and writer | ENFP | 56 | y | y | - |
| Professor Moriarty | Sherlock Holmes stories | INTJ | 56 | y | y | - |
| Agent 47 | Hitman series | ISTP | 57 | y | y | - |
| Edmond Dantès | The Count of Monte Cristo by Alexandre Dumas | INTJ | 57 | y | y | - |
| Victor Frankenstein | Frankenstein by Mary Shelley | INTJ | 57 | y | y | - |
| Albert Camus | French-Algerian author and philosopher | INFP | 57 | y | y | - |
| Floyd Mayweather | Professional boxer | INTJ | 57 | y | y | - |
| Huckleberry Finn | Adventures of Huckleberry Finn by Mark Twain | ISFP | 57 | y | y | - |
| Agatha Christie | Author | ISTJ | 57 | y | y | - |
| Jean Valjean | Les Misérables by Victor Hugo | INFP | 59 | y | y | - |
| Elizabeth I | Queen of England | ENTJ | 59 | y | y | - |
| Bart Simpson | The Simpsons | ESTP | 60 | y | y | - |
| Joan Holloway | Mad Men | ESTJ | 61 | y | y | - |
| Arthur Conan Doyle | Author | INFP | 61 | y | y | - |
| Henry VIII | King of England | ESTP | 62 | y | y | - |
| Levi Ackerman | Attack on Titan | ISTP | 62 | y | y | - |
| Baron Vladimir Harkonnen | Dune (Frank Herbert) | ENTJ | 64 | y | y | - |
| John Muir | Naturalist and conservationist | INFP | 66 | y | y | - |
| Lady Jessica | Dune (Frank Herbert) | INTJ | 66 | y | y | - |
| Duke Leto Atreides | Dune (Frank Herbert) | ENFJ | 66 | y | y | - |
| Katharine Hepburn | Actor | ENTJ | 66 | y | y | - |
| Steve Carell | Actor, comedian, and filmmaker | INFP | 66 | y | y | - |
| Clint Eastwood | Actor, director, and producer | ISTP | 67 | y | y | - |
| Michael Bluth | Arrested Development | ISTJ | 68 | y | y | - |
| Audrey Hepburn | Actor | INFP | 68 | y | y | - |
| Dennis Reynolds | It's Always Sunny in Philadelphia | ENTJ | 69 | y | y | - |
| James Dean | Actor | ISTP | 69 | y | y | - |
| Paul Miller | Muay Thai kickboxer, boxer, and independent journalist | ESTP | 69 | y | y | - |
| Gustaf VI Adolf | King of Sweden 1950–1973, archaeologist and scholar | INTP | 69 | y | y | - |
| Moira Rose | Schitt's Creek | ENFJ | 70 | y | y | - |
| Alfred Hitchcock | Film director | INTJ | 71 | y | y | - |
| Antigone | Antigone (Sophocles) | ISFJ | 73 | y | y | - |
| Shinji Ikari | Neon Genesis Evangelion | INFP | 73 | y | y | - |
| Carl XVI Gustaf | King of Sweden since 1973 | ISTJ | 73 | y | y | - |
| Emma Bovary | Madame Bovary (Flaubert) | ENFP | 74 | y | y | - |
| Ruth Langmore | Ozark | ESTP | 75 | y | y | - |
| Johnny Silverhand | Cyberpunk 2077 | ENTP | 75 | y | y | - |
| Marco Rubio | US Senator and Secretary of State | ESFJ | 75 | y | y | - |
| Larry David | Curb Your Enthusiasm | INTP | 76 | y | y | - |

_...and 192 more._

## Tier 3 - all slots written (326 pages)

No action needed.
