export type ParteQuoteCategory =
  | 'literary'
  | 'religious'
  | 'father'
  | 'mother'
  | 'universal'
  | 'children';

export interface ParteQuote {
  id: string;
  text: string;
  author?: string;
  category: ParteQuoteCategory;
}

export const parteQuoteCategoryLabels: Record<ParteQuoteCategory, string> = {
  literary: 'Citáty',
  religious: 'Církevní verše',
  father: 'Pro tatínka',
  mother: 'Pro maminku',
  universal: 'Pro muže i ženy',
  children: 'Pro děti a mladé',
};

export const parteQuotes: ParteQuote[] = [
  { id: 'q-literary-101', text: 'Tak krátko jsem šel s vámi. Hle, tu se cesta dělí - a ptáci nad hlavou mi píseň nedopěli…', author: 'J. Wolker', category: 'literary' },
  { id: 'q-literary-102', text: 'Zvedám jí ruku. Je v ní chlad. Prsty jsou přitisknuté k dlani. Kytičku chci jí do nich dát, už naposledy tentokrát…a ještě se mi brání.', author: 'J. Seifert', category: 'literary' },
  { id: 'q-literary-103', text: 'Život měříme skutky, a ne časem.', author: 'Seneca', category: 'literary' },
  { id: 'q-literary-104', text: 'Žádná smrt nemůže být zlá, které předchází dobrý život.', author: 'V. M. Kramerius', category: 'literary' },
  { id: 'q-literary-105', text: 'Bolest zná jen málo slov a smutek nejtěžší je jako kámen němý.', author: 'V. Závada', category: 'literary' },
  { id: 'q-literary-107', text: 'Až umřu, nic na tomto světě se nestane a nezmění, jen srdcí několik se zachvěje v rose, jak k ránu květiny. Tisíce umřely, tisíce umřou, tisíce na smrt jsou znaveni, neboť v smrti a zrození nikdo nezůstal jediný.', author: 'J. Wolker', category: 'literary' },
  { id: 'q-literary-109', text: 'Smrti se nebojím, smrt není zlá, smrt je jen kus života těžkého, co strašné je, co zlé je, to umírání je.', author: 'J. Wolker', category: 'literary' },
  { id: 'q-literary-110', text: 'Není smrti, je věčně živý, kdo spravedlivý byl a dobrotivý.', author: 'F. Halas', category: 'literary' },
  { id: 'q-literary-111', text: 'A tak zmizí vše, co znáš, všecko, co jsme milovali.', author: 'J. Wolker', category: 'literary' },
  { id: 'q-literary-112', text: 'Bílým šátkem mává, kdo se loučí, každého dne se něco končí, něco překrásného se končí…', author: 'J. Seifert', category: 'literary' },
  { id: 'q-literary-114', text: 'Odplouvá vlna, hory jsou v mlhách - odešel člověk.', author: 'Zpěvy staré Číny', category: 'literary' },
  { id: 'q-literary-115', text: 'A přišla dlouhá noc - a po ní žádné ráno…', author: 'O. Scheinpflugová', category: 'literary' },
  { id: 'q-literary-116', text: 'Cokoliv jsme na tobě milovali a čemukoliv jsme se obdivovali, trvá a potrvá v srdcích všech a ve věčnosti časů.', author: 'Tacitus', category: 'literary' },
  { id: 'q-literary-117', text: 'Až umřu, nic na tomto světě se nestane a nezmění, jen srdcí několik se zachvěje v rose, jak k ránu květiny.', author: 'J. Wolker', category: 'literary' },
  { id: 'q-literary-119', text: 'Odešla…Jediná na světě jež nikdy nezradí, na ni nám zůstane nejhezčí vzpomínka, to byla nejdražší, to byla maminka.', author: 'J. Seifert', category: 'literary' },
  { id: 'q-literary-120', text: 'Nemáme moci, abychom Tě zdrželi, máme jen své slzy…', author: 'Thákur', category: 'literary' },
  { id: 'q-literary-121', text: 'Nic z toho dobrého a krásného cos učinil se neztratí. Vše zůstane.', author: 'A. France', category: 'literary' },
  { id: 'q-literary-122', text: 'Kdo v srdcích žije - neumírá…', author: 'F. Hrubín', category: 'literary' },
  { id: 'q-literary-123', text: 'Já půjdu tam, kam všechna pokolení odešla, a lesy budou dále v slunci snít a vody budou dřímat v lesku bílých hvězd.', author: 'J. Zeyer', category: 'literary' },
  { id: 'q-literary-124', text: 'Nikdo mne nemusí slzami ctít a pohřbívat s pláčem. Když o mně hovoříte a myslíte na mne, žiji přece dál…', author: 'Ennius', category: 'literary' },
  { id: 'q-literary-128', text: 'Žít je tak složité a umřít tak prosté…', author: 'O. Scheinpflugová', category: 'literary' },
  { id: 'q-literary-135', text: 'Smrti, zápas s tebou je vždy nerovný.', author: 'Vítězslav Nezval', category: 'literary' },
  { id: 'q-literary-137', text: 'Člověk je ten, kdo v sobě nosí větší bytost, než je sám.', author: 'Saint - Exupéry', category: 'literary' },
  { id: 'q-literary-139', text: 'Až jednou zemřu, dopřejte mi k vám navrátit se rodnou zemí.', author: 'František Bronislav', category: 'literary' },
  { id: 'q-literary-142', text: 'A nikdo nemůže srp času odvrátit, jen v dětech můžeš mu navzdor - ač mrtev - žít.', author: 'W. Shakespeare', category: 'literary' },
  { id: 'q-literary-145', text: 'A za vše, za vše dík. Za lásku jaká byla, za život jaký byl…', author: 'D. Šajner', category: 'literary' },
  { id: 'q-literary-146', text: 'Ať cesty nikam nevedou, tys po nich šel a šel jsi rád, těch cest se nesmíš, nesmíš ptát, snad není cest, jen lidé jdou a jedna z hvězd je vždycky tvou a z té Ti zazní odpověď, až přestaneš se ptát.', author: 'Fráňa Šrámek', category: 'literary' },
  { id: 'q-literary-149', text: 'Kdo smrti bojí se, ten netrpěl, ten na životě lpí. Kdo tisíce nocí protrpěl, ten ví, jak sladce tomu, kdo spí.', author: 'J. V. Sládek', category: 'literary' },
  { id: 'q-literary-150', text: 'V náručí Boží, odkud jsme vyšli, všichni se navečer sejdeme zas.', author: 'J. V. Sládek', category: 'literary' },
  { id: 'q-religious-201', text: 'Bože, tys nám dal naději, že jako tvůj Syn vstal z mrtvých, vstaneme k věčnému životu i my.', category: 'religious' },
  { id: 'q-religious-203', text: 'Budu kráčet před Hospodinem v zemi živých.', author: 'Žl 114', category: 'religious' },
  { id: 'q-religious-204', text: 'Nevyhnutelnost smrti nás sice skličuje, ale utěšuje nás zaslíbení věčného života, vždyť život těch, kdo v tebe věří, nezaniká, ale ve smrti se naplňuje.', category: 'religious' },
  { id: 'q-religious-205', text: 'Já jsem vzkříšení a život, praví Pán, kdo věří ve mne, i kdyby umřel, bude žít, a žádný, kdo žije a věří ve mne, neumře navěky.', author: 'Jan 11, 25-26', category: 'religious' },
  { id: 'q-religious-206', text: 'Věčné světlo ať mu svítí, Pane, u tvých svatých navěky, vždyť ty jsi plný dobroty a lásky.', category: 'religious' },
  { id: 'q-religious-207', text: 'Pane, můj Vykupiteli, tělo, kterés mi utvořil z prachu země, probuď k životu v den poslední. Hojné je tvé slitování, Hospodine, řekni jen slovo a budu žít.', category: 'religious' },
  { id: 'q-religious-208', text: 'Smiluj se, Bože, nad těmi, kdo odešli z tohoto světa k tobě.', category: 'religious' },
  { id: 'q-religious-209', text: 'Buď vůle Tvá…', author: 'Mt 6, 10', category: 'religious' },
  { id: 'q-religious-210', text: 'Hle, já umírám, ale Bůh bude s vámi…', author: 'Gn 48, 21', category: 'religious' },
  { id: 'q-religious-211', text: 'Buď vůle tvá, jako v nebi, tak i na zemi.', author: 'Mt 6, 10', category: 'religious' },
  { id: 'q-religious-212', text: 'Hospodin dal, Hospodin vzal, jméno Hospodinovo buď požehnáno.', author: 'Jb 1, 21', category: 'religious' },
  { id: 'q-religious-213', text: 'Věříme-li, že Ježíš zemřel a vstal z mrtvých, pak také víme, že Bůh ty, kdo zemřeli ve víře v Ježíše, přivede spolu s ním k životu.', category: 'religious' },
  { id: 'q-religious-216', text: 'Ačkoliv já vím, že vykupitel můj živ jest a v den nejposlednější nad prachem mým se postaví.', author: 'Jb 15, 25', category: 'religious' },
  { id: 'q-religious-218', text: 'Ač tělo i srdce mé hyne skála srdce mého, a díl můj Bůh jest navěky.', author: 'Žl 73, 26', category: 'religious' },
  { id: 'q-religious-219', text: 'Aj, na dlaň odměřil jsi mi dnů, a věk můj je jako nic před Tebou.', author: 'Žl 39, 6', category: 'religious' },
  { id: 'q-religious-220', text: 'Otče náš, jež jsi na nebesích…Buď vůle Tvá.', author: 'Mt 6, 10', category: 'religious' },
  { id: 'q-religious-221', text: 'Dnové moji jsou jako stín nachýlený a já jako tráva uvadla jsem.', author: 'Žl 102, 12', category: 'religious' },
  { id: 'q-religious-222', text: 'Já jsem vzkříšení i život. Kdo věří ve mne, byť pak umřel, živ bude. Jan 11, 25 - 26', category: 'religious' },
  { id: 'q-religious-223', text: 'Léta mně odečtená přicházejí, a cestou, kterou se zase nenavrátím, již se beru.', author: 'Jb 16, 22', category: 'religious' },
  { id: 'q-religious-224', text: 'Ježíš řekl: Kdo slovo mé slyší a věří tomu, jenž mne poslal, má život věčný a na soud nepřijde, ale vešel ze smrti do života.', author: 'Bible', category: 'religious' },
  { id: 'q-religious-225', text: 'Byť se mi dostalo jíti přes údolí stínu smrti, nebudu se báti zlého nebo ty se mnou jsi.', author: 'Bible', category: 'religious' },
  { id: 'q-religious-227', text: 'Blahoslavení čistého srdce, neboť oni Boha viděti budou.', author: 'Mt 5, 8', category: 'religious' },
  { id: 'q-father-301', text: 'Za všechnu lásku Tvou, za každé pohlazení, děkujeme Ti, tatínku, v bolestném rozloučení.', category: 'father' },
  { id: 'q-father-302', text: 'Jak tiše žil, tak tiše zemřel.', category: 'father' },
  { id: 'q-father-303', text: 'Život je tak krásný a já ho měl tak rád - proč osud je tak krutý a musel mi ho brát.', category: 'father' },
  { id: 'q-father-304', text: 'Navždycky uhasl v Tvých očích svit, bude se nám, tatínku, bez Tebe těžko žít.', category: 'father' },
  { id: 'q-father-305', text: 'Já opustil vás, věřte, s bolestí, já miloval vás celým životem, já pro vás vzlykal pláčem, radostí, jen pro vás žil jsem, pracoval, své srdce zaživa vám daroval.', category: 'father' },
  { id: 'q-father-306', text: 'Tys odešel a není slov, jak poděkovat za Tvou lásku, za Tvou péči, za Tvou starost.', category: 'father' },
  { id: 'q-father-307', text: 'Neplačte, že jsem odešel, ten klid a mír mi přejte a vzpomínky jen v srdci svém mi stále zachovejte.', category: 'father' },
  { id: 'q-father-309', text: 'Měl jsem vás rád, žil jsem jen pro vás, ale musím odejít.', category: 'father' },
  { id: 'q-father-311', text: 'Číms nám byl, to ví jen ten, kdo ztrácí.', category: 'father' },
  { id: 'q-father-312', text: 'S Pánem Bohem už jdu od Vás, neublížil jsem žádnému z Vás.', category: 'father' },
  { id: 'q-father-313', text: 'Ztichlo navždy srdce zlaté, zhasl nám Tvých očí svit, bude se nám, náš tatínku, bez Tebe teď smutně žít.', category: 'father' },
  { id: 'q-father-314', text: 'Je skončen boj, ač život jsem měl rád, jsem v duši spokojen, a chci jen tiše spát.', category: 'father' },
  { id: 'q-father-315', text: 'Neplačte nad mým osudem, nerušte můj věčný sen, vždyť útrapy a mnoho bolu mě provázelo osudem.', category: 'father' },
  { id: 'q-father-319', text: 'Buď sbohem, tatínku náš milý, vzpomínka zůstala, bol v srdcích mnohých. Žil jsi jen prací své drahé rodině, vzpomeneme na Tebe v každičké hodině.', category: 'father' },
  { id: 'q-father-320', text: 'Nezemřel jsem, neboť vím, že budu žít stále v srdcích těch, kteří mne milovali.', category: 'father' },
  { id: 'q-father-321', text: 'Světem prošel jako dobrý člověk. Čím byl svým to ví jen ti, kdo jej ztrácí.', category: 'father' },
  { id: 'q-father-322', text: 'Což možno zapomenout, což možno v noci spáti, když předrahý náš tatínek se více nevrátí.', category: 'father' },
  { id: 'q-father-324', text: 'Dotlouklo srdce Tvé znavené, uhasl oka svit, budiž Ti, drahý tatínku, za všechno vřelý dík.', category: 'father' },
  { id: 'q-father-325', text: 'Jak tiše žil, tak tiše odešel, skromný ve svém životě, velký ve své lásce a dobrotě.', category: 'father' },
  { id: 'q-father-327', text: 'Rád jsi pro nás žil, tak rád jsi pro nás pracoval, zlý osud nám Tebe náhle vzal a co my za lásku Tvou Ti můžem dát? Jen hrst krásných květů a v slzách vzpomínat.', category: 'father' },
  { id: 'q-father-328', text: 'Život můj je u konce. Vás, drazí, cesta vede dál – loučím se s Vámi, stisk ruky Vám již nemohu dát, měl jsem Vás všechny, měl jsem Vás rád.', category: 'father' },
  { id: 'q-father-329', text: 'Odešel jsem od Vás, kteří jste mě rádi měli, aniž by rty mé, Vám sbohem zašeptaly.', category: 'father' },
  { id: 'q-father-331', text: 'Teskno nám tatínku nevýslovně teskno, když ztratili jsme Tebe, ztratili jsme všechno.', category: 'father' },
  { id: 'q-father-333', text: 'Úsměv měl na rtech, dobrotu v srdci, lásku v duši.', category: 'father' },
  { id: 'q-father-334', text: 'Nezemřel. Spí. Má-li sen, je krásný. Zdá se mu o těch, které miloval a kteří milovali jeho.', category: 'father' },
  { id: 'q-father-335', text: 'Odešel. Zhasly oči, které vždy jen s lásku na nás hledívaly, umlkla ústa, jež nikdy nedovedla ranit, dotlouklo srdce nejlaskavější.', category: 'father' },
  { id: 'q-father-336', text: 'Až tady nebudu, zmizí jak sen, co jsem si ponechal pro sebe jen. Až tady nebudu, žít bude dál v druhých, co jsem jim v životě dal.', category: 'father' },
  { id: 'q-mother-401', text: 'Za všechnu lásku Tvou, za každé pohlazení, děkujeme Ti, maminko, v bolestném rozloučení.', category: 'mother' },
  { id: 'q-mother-402', text: 'Jak tiše žila, tak tiše zemřela.', category: 'mother' },
  { id: 'q-mother-403', text: 'Odešlas, maminko, neznámo kam, vzpomínka po Tobě zůstane nám, vzpomínka krásná, maminko milá, Ty že jsi pro nás vždycky jen žila.', category: 'mother' },
  { id: 'q-mother-404', text: 'Navždycky uhasl v Tvých očích svit, bude se nám, maminko, bez Tebe těžko žít.', category: 'mother' },
  { id: 'q-mother-406', text: 'Tys odešla a není slov, jak poděkovat za Tvou lásku, za Tvou péči, za Tvou starost.', category: 'mother' },
  { id: 'q-mother-407', text: 'Neplačte, že jsem odešla, ten klid a mír mi přejte a vzpomínky jen v srdci svém mi stále zachovejte.', category: 'mother' },
  { id: 'q-mother-409', text: 'Měla jsem vás ráda, žila jsem jen pro vás, ale musím odejít.', category: 'mother' },
  { id: 'q-mother-411', text: 'Číms nám byla, to ví jen ten, kdo ztrácí.', category: 'mother' },
  { id: 'q-mother-412', text: 'Nikdo nám neřekne, nikdo nám nepoví, čím byla maminka každému z nás, nikdo ji nevrátí, nikdo ji nevzbudí, nikdy už nezazní nám její hlas.', category: 'mother' },
  { id: 'q-mother-413', text: 'Pro vás, mé milé děti, život jsem dožila, do chvíle poslední na vás jen myslela.', category: 'mother' },
  { id: 'q-mother-415', text: 'Zhasly oči plné lásky naší drahé maminky, nezhasnou však nikdy na ni v srdcích našich vzpomínky.', category: 'mother' },
  { id: 'q-mother-418', text: 'Zemřela, ale žije v duších nás všech, kteří ji tolik milovali.', category: 'mother' },
  { id: 'q-mother-420', text: 'Maminko - jak slovo to krásně zní, když zemře, zbude jen bolest a vzpomínka na tu, jež dala vše - i poslední…', category: 'mother' },
  { id: 'q-mother-421', text: 'Maminka spí…Je dlouhá noc, jsou marná slova, touhy, sliby. Nám nepřijde již na pomoc. A maminka nám tolik chybí.', category: 'mother' },
  { id: 'q-mother-426', text: 'Dotlouklo srdce Tvé znavené, uhasl oka svit, budiž Ti, drahá maminko, za všechno vřelý dík.', category: 'mother' },
  { id: 'q-mother-427', text: 'Když matka nám navždy odchází, srdce se bolem chvěje, stesk a tok slzy vyprovází - a tíseň beznaděje.', category: 'mother' },
  { id: 'q-mother-428', text: 'Maminko naše, těžké je moc zašeptat poslední sbohem, poslední dobrou noc.', category: 'mother' },
  { id: 'q-mother-429', text: 'Nezemřela jsem, neboť vím, že budu žít stále v srdcích těch, kteří mne milovali.', category: 'mother' },
  { id: 'q-mother-430', text: 'V životě se loučíme mnohokrát, s maminkou jenom jednou. Kdybychom si oči vyplakali, její už se neohlédnou.', category: 'mother' },
  { id: 'q-mother-431', text: 'Jak tiše žila, tak tiše odešla, skromná ve svém životě, velká ve své lásce a dobrotě.', category: 'mother' },
  { id: 'q-mother-432', text: 'Nejdražší poklad na světě, je zlaté srdce matky, a kdo ji ztratil, chudý jest byť měl sebevětší statky.', category: 'mother' },
  { id: 'q-mother-433', text: 'Proč musíme, i když nám slzy kanou, jen vroucné sbohem dát, a na rozloučenou s maminkou, jen smutně zamávat.', category: 'mother' },
  { id: 'q-mother-434', text: 'Odešla…Zhasly oči, které vždy jen s láskou na nás hledívaly. Umlkla ústa, jež nikdy nechtěla ranit. Dotlouklo srdce maminky nejdražší.', category: 'mother' },
  { id: 'q-mother-436', text: 'Za Tvou něžnou lásku, péči o nás, za všechna milá slova, starosti, zachováme v srdci vždy Tvůj obraz a pocit neskonalé vděčnosti.', category: 'mother' },
  { id: 'q-mother-437', text: 'Tvé zlaté srdce, maminko, zůstane navždy s námi, bude nám svítit na cestu, kterou teď půjdeme sami.', category: 'mother' },
  { id: 'q-mother-439', text: 'Úsměv měla na rtech, dobrotu v srdci, lásku v duši.', category: 'mother' },
  { id: 'q-mother-440', text: 'Nezemřela. Spí. Má-li sen, je krásný. Zdá se jí o těch, které milovala a kteří milovali ji.', category: 'mother' },
  { id: 'q-universal-501', text: 'Kdo umírá - neodchází navždy, zůstává stále živý ve vzpomínkách těch, kteří ho měli rádi.', category: 'universal' },
  { id: 'q-universal-504', text: 'Slunce vychází, zapadá a opět vychází - člověk přichází, odchází a již se nevrací.', category: 'universal' },
  { id: 'q-universal-505', text: 'Předobré srdce na světě jsme měli, jež dovedlo nás milovat. I kdybychom láskou vzbudit je chtěli, neozve se vícekrát.', category: 'universal' },
  { id: 'q-universal-506', text: 'Za všechnu lásku a péči Tvou, co dnes Ti můžem dát? Hrst krásných květů naposled a pak jen vzpomínat…', category: 'universal' },
  { id: 'q-universal-508', text: 'Ten nezemřel, kdo v srdcích našich žije…', category: 'universal' },
  { id: 'q-universal-511', text: 'Vše zmizí, jen stopy Tvé práce a Tvé lásky zůstanou.', category: 'universal' },
  { id: 'q-universal-512', text: 'Zhasly oči, které vždy s láskou na nás hledívaly…', category: 'universal' },
  { id: 'q-universal-516', text: 'Kdo žije v srdcích těch, které opustil, ten neodešel.', category: 'universal' },
  { id: 'q-universal-517', text: 'Kdo byl milován, nebude nikdy zapomenut.', category: 'universal' },
  { id: 'q-universal-518', text: '…a láska zůstane, jež smrti nezná.', category: 'universal' },
  { id: 'q-universal-519', text: 'Odešel dobrý člověk.', category: 'universal' },
  { id: 'q-universal-522', text: 'Když se naplní čas, člověk odchází. Žije v nás, v našich myšlenkách a vzpomínkách.', category: 'universal' },
  { id: 'q-universal-523', text: 'Když ztratili jsme Tebe, tak ztratili jsme všechno.', category: 'universal' },
  { id: 'q-universal-524', text: 'Kdo žil pro jiné, nežil marně.', category: 'universal' },
  { id: 'q-universal-525', text: 'Kdo není zapomenut, žije navěky.', category: 'universal' },
  { id: 'q-universal-526', text: 'Jen jediné srdce na světě jsme měli, jež dovedlo nás milovat. Kdybychom láskou vzbudit je chtěli, neozve se nám vícekrát. Utichlo, umlklo, šlo již spát.', category: 'universal' },
  { id: 'q-universal-527', text: 'Co v srdci skryto, není zapomenuto.', category: 'universal' },
  { id: 'q-universal-528', text: 'Dotlouklo Tvé srdce, umlkl Tvůj hlas, však ve vzpomínkách a v našich srdcích stále zůstáváš.', category: 'universal' },
  { id: 'q-universal-531', text: 'Po utrpení – klid…', category: 'universal' },
  { id: 'q-universal-533', text: 'Lidé, měl jsem Vás rád…', category: 'universal' },
  { id: 'q-universal-534', text: 'Smrt prošla kolem. Život jde dál. Rozprostřel závoj, protkaný bolem, v něm ukryt je žal.', category: 'universal' },
  { id: 'q-universal-535', text: 'Do smrti nejdelší Tě ve všech dobrých lidech hledat nepřestanu.', category: 'universal' },
  { id: 'q-universal-536', text: 'Každému z nás je souzen jen doušek z poháru věčnosti.', category: 'universal' },
  { id: 'q-universal-537', text: 'Loučím se s Vámi, přátelé milí, ruky stisk dnes už Vám nemohu dát, srdce mi dotlouklo, odešly síly, loučím se se všemi, kdo měl mne rád.', category: 'universal' },
  { id: 'q-universal-539', text: 'Dotlouklo šlechetné srdce, které nás tolik milovalo.', category: 'universal' },
  { id: 'q-universal-540', text: 'Zhasly oči, které tak rády viděly, zapadlo slunce našich nadějí.', category: 'universal' },
  { id: 'q-universal-542', text: 'Nezemřel, kdo celý život obětoval druhým a zbudoval si v jejich srdcích mohylu lásky a vděčnosti…', category: 'universal' },
  { id: 'q-universal-543', text: 'Odešel člověk spravedlivý…', category: 'universal' },
  { id: 'q-children-601', text: 'Život tak krátký je pro toho, kdo má rád. Proč osud bere tam, kde hodně měl by dát?', category: 'children' },
  { id: 'q-children-602', text: 'Jak je těžko najít útěchy, když bolest nedá spáti, dítě tak náhle ztracené nikdo nám nenavrátí.', category: 'children' },
  { id: 'q-children-603', text: 'Tak krátko šel jsem s vámi, hle, tu se cesta dělí, a ptáci nad hlavami mi píseň nedopěli.', category: 'children' },
  { id: 'q-children-604', text: 'Po krátkých cestách chodili jsme spolu, na dalekou cestu musím jíti sám.', category: 'children' },
  { id: 'q-children-605', text: '…a lesy budou dále v slunci snít a vody třpytit se ve svitu hvězd.', category: 'children' },
  { id: 'q-children-606', text: 'Rozvilo poupátko, zvadlo však záhy, zemřel náš synáček, nám všem tak drahý.', category: 'children' },
  { id: 'q-children-607', text: 'Odešel´s, drahý, bez slůvka rozloučení, tak náhle, že těžko k uvěření.', category: 'children' },
  { id: 'q-children-608', text: 'Odešla´s, drahá, bez slůvka rozloučení, tak náhle, že těžko k uvěření.', category: 'children' },
  { id: 'q-children-610', text: '…já chtěl jsem žít, já chtěl se smát, já chtěl jsem síly své do práce dát. V rodinném kruhu si s dětmi hrát, musel jsem zemřít, ač byl jsem tak mlád…', category: 'children' },
];
