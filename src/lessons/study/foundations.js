export const foundations = {
  topics: [
    {
      section: '1.1',
      en: {
        title: 'Independent nodes and a single service',
        paragraphs: [
          'A node can be a physical computer, a virtual machine, or a process with its own failure and execution boundary. The nodes communicate across a network and together present one service. They can progress at different rates, restart independently, and learn about other nodes only through communication.',
          'Distribution lets an organization share resources across sites, add capacity, and keep serving requests after some failures. It also adds network latency, partial failures, and coordination work. A local pointer identifies memory in one process. A distributed reference uses a name or address that another process can interpret.',
        ],
        example: 'A library website can use one service for the catalogue and another for loans. A catalogue search might succeed while loans are unavailable. Both operations belong to the same service from the reader’s point of view.',
      },
      fi: {
        title: 'Itsenäiset solmut ja yhteinen palvelu',
        paragraphs: [
          'Solmu voi olla fyysinen tietokone, virtuaalikone tai prosessi, jolla on oma suoritus- ja vikarajansa. Solmut viestivät verkossa ja muodostavat yhdessä yhden palvelun. Ne voivat edetä eri tahtiin, käynnistyä uudelleen itsenäisesti ja saada tietoa toisistaan vain viestinnän kautta.',
          'Hajautus auttaa jakamaan resursseja toimipaikkojen välillä, lisäämään kapasiteettia ja palvelemaan käyttäjiä joidenkin vikojen aikana. Se tuo myös verkkoviivettä, osittaisia vikoja ja koordinointityötä. Paikallinen osoitin viittaa yhden prosessin muistiin. Hajautettu viittaus käyttää nimeä tai osoitetta, jonka toinen prosessi voi tulkita.',
        ],
        example: 'Kirjaston verkkopalvelu voi käyttää yhtä palvelua teoshakuun ja toista lainaamiseen. Teoshaku voi onnistua, vaikka lainaaminen olisi poissa käytöstä. Lukijalle molemmat toiminnot kuuluvat samaan palveluun.',
      },
    },
    {
      section: '1.2–1.3',
      en: {
        title: 'Concurrency, parallelism, and execution units',
        paragraphs: [
          'Concurrency describes how tasks overlap and interact. One core can switch between runnable tasks, and several cores can execute tasks in parallel. The scheduler can choose a different order on each run, so an application must enforce any ordering that its correctness requires.',
          'A process normally has its own address space. Its threads share objects in that address space but have separate stacks and execution state. Parallel computing divides a computation to finish sooner. Some stages may still run serially and limit the overall speedup.',
        ],
        example: 'A music player can decode audio while its interface handles a click. On a single core those tasks can take turns. Two cores can work at the same instant. If decoding and playback run on different networked computers, the service is also distributed.',
      },
      fi: {
        title: 'Samanaikaisuus, rinnakkaisuus ja suoritusyksiköt',
        paragraphs: [
          'Samanaikaisuus kuvaa tehtävien päällekkäisyyttä ja vuorovaikutusta. Yksi ydin voi vuorotella suoritusvalmiiden tehtävien välillä, ja useat ytimet voivat suorittaa tehtäviä rinnakkain. Vuorottaja voi valita eri järjestyksen kullakin suorituskerralla, joten sovelluksen on varmistettava oikeellisuuden vaatima järjestys.',
          'Prosessilla on yleensä oma osoiteavaruutensa. Sen säikeet jakavat siellä olevat oliot, mutta niillä on omat pinot ja suoritustilansa. Rinnakkaislaskennassa laskentaa jaetaan ajan säästämiseksi. Sarjalliset vaiheet voivat silti rajoittaa kokonaisnopeutusta.',
        ],
        example: 'Musiikkisoitin voi purkaa ääntä samalla, kun käyttöliittymä käsittelee klikkauksen. Yhdellä ytimellä tehtävät voivat vuorotella. Kahdella ytimellä työ voi edetä samalla hetkellä. Jos purku ja toisto toimivat eri verkkokoneilla, palvelu on myös hajautettu.',
      },
    },
    {
      section: '1.4',
      en: {
        title: 'Recognizing distributed systems',
        paragraphs: [
          'Look for a common task, independent components, and messages between them. A replicated catalogue, a multiplayer game, or a distributed file service can each appear as one application even when many machines participate.',
          'The Internet provides communication infrastructure for many services. To describe a particular distributed system, draw its boundary and identify which components collaborate to provide its service. The same machine can belong to several systems in different roles.',
        ],
        example: 'For a photo-sharing application, the browser, upload service, storage, and thumbnail worker form a useful boundary. The network carries messages between components, while the application decides what a completed upload means.',
      },
      fi: {
        title: 'Hajautetun järjestelmän tunnistaminen',
        paragraphs: [
          'Etsi yhteinen tehtävä, itsenäiset komponentit ja niiden väliset viestit. Monistettu luettelo, moninpeli tai hajautettu tiedostopalvelu voi näyttää yhdeltä sovellukselta, vaikka siihen osallistuu monta tietokonetta.',
          'Internet tarjoaa viestintäinfrastruktuurin monille palveluille. Tietyn hajautetun järjestelmän kuvaamiseksi piirrä sen raja ja nimeä palvelun toteuttamiseen osallistuvat komponentit. Sama kone voi kuulua eri rooleissa useaan järjestelmään.',
        ],
        example: 'Kuvanjakopalvelun voi rajata selaimeen, latauspalveluun, tallennustilaan ja esikatselukuvien tekijään. Verkko välittää viestit, ja sovellus määrittelee, milloin lataus on valmis.',
      },
    },
    {
      section: '1.5',
      en: {
        title: 'Messages, latency, and independent failures',
        paragraphs: [
          'A message is data with an agreed meaning. A request can name an operation and a resource. A response can report a result or an error. Network delay includes transmission and waiting, and a recipient may also need time to process the message.',
          'When a reply is late, the caller has several possibilities to consider. The request may be in transit, the server may be slow, or the response may have been lost after the operation succeeded. Protocols often use acknowledgements, timeouts, and request identifiers to handle these cases.',
        ],
        example: 'A client sends booking request r17 and gets no reply. If it retries r17, a server that records request identifiers can return the previous result without booking a second seat.',
      },
      fi: {
        title: 'Viestit, viive ja itsenäiset viat',
        paragraphs: [
          'Viestillä on yhdessä sovittu merkitys. Pyyntö voi nimetä operaation ja resurssin. Vastaus voi kertoa tuloksen tai virheen. Verkkoviiveeseen kuuluu siirtoa ja odotusta, ja vastaanottaja tarvitsee lisäksi aikaa viestin käsittelyyn.',
          'Kun vastaus viivästyy, pyytäjän on huomioitava useita vaihtoehtoja. Pyyntö voi olla matkalla, palvelin voi olla hidas tai vastaus on voinut kadota onnistuneen operaation jälkeen. Protokollat käyttävät usein kuittauksia, aikakatkaisuja ja pyyntötunnisteita näiden tilanteiden käsittelyyn.',
        ],
        example: 'Asiakas lähettää varauspyynnön r17 eikä saa vastausta. Jos asiakas lähettää uudelleen tunnisteen r17, tunnisteet muistava palvelin voi palauttaa aiemman tuloksen varaamatta toista paikkaa.',
      },
    },
    {
      section: '1.6',
      en: {
        title: 'An experiment with local knowledge',
        paragraphs: [
          'In a message-passing exercise, each participant sees their own notes and the messages delivered to them. Give each participant an explicit role and agree on the meaning of the available messages before starting. Record sends and receives separately.',
          'Repeat the same rules with one delayed message. Compare what each participant knows at the same observation point. A shared decision requires a protocol whose rules say when enough information has arrived to proceed.',
        ],
        example: 'Aino announces that a reading group starts at 15:00. Leo receives the announcement while Mika’s copy is delayed. Leo can mark the time in his own calendar. To claim everyone agreed, the group needs evidence from Mika as well.',
      },
      fi: {
        title: 'Koe paikallisesta tiedosta',
        paragraphs: [
          'Viestinvälityskokeessa osallistuja näkee omat muistiinpanonsa ja hänelle toimitetut viestit. Anna jokaiselle selkeä rooli ja sovitaan viestien merkitykset ennen aloitusta. Kirjaa lähetykset ja vastaanotot erikseen.',
          'Toista koe samoilla säännöillä ja viivästytä yhtä viestiä. Vertaa, mitä kukin tietää samalla havaintohetkellä. Yhteisen päätöksen tekeminen edellyttää protokollaa, jonka säännöt kertovat, milloin tietoa on riittävästi etenemiseen.',
        ],
        example: 'Aino ilmoittaa lukupiirin alkavan kello 15.00. Leo saa ilmoituksen ja Mikan viesti viivästyy. Leo voi merkitä ajan kalenteriinsa. Kaikkien suostumuksen toteamiseen tarvitaan myös tieto Mikalta.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE1 · 1–2',
      en: {
        title: 'Compare two plans for sorting a stack',
        prompt: 'Four volunteers have 48 sheets to sort. Sorting takes 3 seconds per sheet. Handing out work costs 6 seconds in total. Combining four sorted stacks costs 48 seconds.',
        tasks: [
          'Calculate the total time for one volunteer, four equal stacks, and a split of 24, 8, 8, and 8.',
          'Explain which stage limits the time in the uneven split and find the advantage of the even split over one volunteer.',
        ],
        solution: 'One volunteer needs 144 s. Four equal stacks need 6 + 36 + 48 = 90 s. The uneven split needs 6 + 72 + 48 = 126 s because the biggest stack controls the sorting stage. The even split saves 54 s.',
      },
      fi: {
        title: 'Vertaa kahta pinon lajittelusuunnitelmaa',
        prompt: 'Neljä vapaaehtoista lajittelee 48 arkkia. Yhden arkin lajittelu vie 3 sekuntia. Työn jakelu vie yhteensä 6 sekuntia ja neljän lajitellun pinon yhdistäminen 48 sekuntia.',
        tasks: [
          'Laske kokonaisajat yhdelle lajittelijalle, neljälle samankokoiselle pinolle sekä jaolle 24, 8, 8 ja 8.',
          'Selitä, mikä vaihe rajoittaa aikaa epätasaisessa jaossa, ja laske tasajaon etu yhteen lajittelijaan verrattuna.',
        ],
        solution: 'Yksi lajittelija tarvitsee 144 s. Tasajako vie 6 + 36 + 48 = 90 s. Epätasainen jako vie 6 + 72 + 48 = 126 s, sillä suurin pino määrää lajitteluvaiheen keston. Tasajako säästää 54 s.',
      },
    },
    {
      reference: 'DE1 · 3–4',
      en: {
        title: 'Draw two independent views of a shared resource',
        prompt: 'Two students reserve the last available room from different devices. Both initially see the room as free.',
        tasks: [
          'Draw the two clients and the reservation service, including one read and one write from each client.',
          'Choose one place to enforce the rule that at most one reservation succeeds. Explain what the other student sees.',
        ],
        solution: 'Place the check and reservation in one atomic operation at the reservation service. Both clients can have read the earlier free state. The first accepted update takes the slot and the later update returns a conflict.',
      },
      fi: {
        title: 'Piirrä kaksi näkymää yhteiseen resurssiin',
        prompt: 'Kaksi opiskelijaa varaa viimeistä vapaata huonetta eri laitteilta. Aluksi molemmat näkevät huoneen vapaana.',
        tasks: [
          'Piirrä kaksi asiakasta ja varauspalvelu. Lisää kummallekin asiakkaalle yksi luku- ja yksi kirjoitusoperaatio.',
          'Valitse, missä varmistetaan, että enintään yksi varaus onnistuu. Selitä, mitä toinen opiskelija näkee.',
        ],
        solution: 'Tee vapaan paikan tarkistus ja varaus yhtenä atomisena operaationa varauspalvelussa. Molemmat asiakkaat voivat lukea aiemman vapaan tilan. Ensimmäinen hyväksytty päivitys varaa paikan, ja myöhempi päivitys palauttaa ristiriidan.',
      },
    },
  ],
}
