export const models = {
  topics: [
    {
      section: '4.1.1',
      en: {
        title: 'Client–server roles, tiers, and proxies',
        paragraphs: [
          'A client initiates requests and a server offers an interface. A server can become a client in a downstream call. A service might run as one process, use replicas, or divide presentation, application logic, and storage across tiers.',
          'A proxy forwards requests on behalf of a client or service. A caching proxy can serve a saved result when its freshness and permission rules allow it. Moving responsibilities between client and server changes latency, failure behavior, and what data each side needs.',
        ],
        example: 'A club site serves public event posters through a cache. The booking server keeps current seat counts authoritative. A cache hit avoids one downstream call for a poster, while a reservation still goes to the booking server.',
      },
      fi: {
        title: 'Asiakas–palvelinroolit, kerrokset ja välityspalvelimet',
        paragraphs: [
          'Asiakas aloittaa pyynnöt ja palvelin tarjoaa rajapinnan. Palvelin voi toimia asiakkaana seuraavassa kutsussa. Palvelu voi käyttää yhtä prosessia tai replikoita tai jakaa esityksen, sovelluslogiikan ja tallennuksen eri kerroksiin.',
          'Välityspalvelin välittää pyyntöjä asiakkaan tai palvelun puolesta. Välimuistia käyttävä välityspalvelin voi palauttaa tallennetun tuloksen, jos tuoreus- ja käyttöoikeussäännöt sallivat sen. Vastuun siirto asiakkaan ja palvelimen välillä muuttaa viivettä, vikakäyttäytymistä ja kummankin tarvitsemaa tietoa.',
        ],
        example: 'Kerhon sivusto jakaa julkiset julisteet välimuistista. Varauspalvelin pitää paikkamäärän ajan tasalla. Julisteen välimuistiosuma säästää yhden kutsun, mutta varaus menee edelleen varauspalvelimelle.',
      },
    },
    {
      section: '4.1.2',
      en: {
        title: 'Peer discovery, directories, and content',
        paragraphs: [
          'Peers can serve and request resources. Some systems give stable peers extra responsibilities. A discovery mechanism provides an initial contact, a directory says where a resource can be found, and the content service transfers it.',
          'Peer membership changes as machines join and leave. Decide how peers learn current membership and which operations can finish if someone becomes unavailable. A participant may coordinate one operation even when there is no permanent central service.',
        ],
        example: 'In the meeting simulator, Aino coordinates one round. Leo or Mika could start the next one. The application still needs rules for recognizing the current round and deciding which peers must reply.',
      },
      fi: {
        title: 'Vertaisten löytäminen, hakemistot ja sisältö',
        paragraphs: [
          'Vertaiset voivat tarjota ja pyytää resursseja. Joissakin järjestelmissä vakaammat vertaiset saavat lisävastuuta. Löytämismekanismi tarjoaa ensimmäisen yhteyshenkilön, hakemisto kertoo resurssin sijainnin ja sisältöpalvelu siirtää sen.',
          'Vertaisjoukko muuttuu, kun koneita tulee ja poistuu. Päätä, miten vertaiset saavat ajan tasalla olevan jäsenluettelon ja mitkä operaatiot voivat valmistua jonkun poistuessa. Osallistuja voi koordinoida yhden operaation, vaikka pysyvää keskuspalvelua ei ole.',
        ],
        example: 'Tapaamissimulaattorissa Aino koordinoi yhden kierroksen. Leo tai Mika voisi aloittaa seuraavan. Sovellus tarvitsee silti säännöt aktiivisen kierroksen tunnistamiseen ja tarvittavien vastaajien valitsemiseen.',
      },
    },
    {
      section: '4.2',
      en: {
        title: 'Timing assumptions and timeouts',
        paragraphs: [
          'A synchronous model assumes known bounds on relevant delays, such as processing and communication. An asynchronous model provides no known upper bound. A protocol can use a timeout in either model, but its meaning depends on the assumptions.',
          'With a reliable bound, missing a deadline shows that the expected timely behavior failed. In an asynchronous model a timeout can trigger suspicion and a retry while the original operation is still possible. Use an identifier to make the retry safe.',
        ],
        example: 'A meeting client waits five seconds for a confirmation. In an asynchronous model, a confirmation taking six seconds is compatible with a healthy server. The client can retry the same request identifier and accept either valid reply.',
      },
      fi: {
        title: 'Aikaoletukset ja aikakatkaisut',
        paragraphs: [
          'Synkronisessa mallissa olennaisille viiveille, kuten käsittelylle ja viestinnälle, oletetaan tunnetut rajat. Asynkronisessa mallissa tunnettua ylärajaa ei ole. Protokolla voi käyttää aikakatkaisua kummassakin, mutta sen merkitys riippuu oletuksista.',
          'Luotettavan aikarajan ylittyminen osoittaa, ettei odotettu oikea-aikainen toiminta toteutunut. Asynkronisessa mallissa aikakatkaisu voi herättää epäilyn ja laukaista uusinnan, vaikka alkuperäinen operaatio voi edelleen onnistua. Käytä tunnistetta turvalliseen uusintaan.',
        ],
        example: 'Tapaamisasiakas odottaa vahvistusta viisi sekuntia. Asynkronisessa mallissa kuuden sekunnin vastaus on mahdollinen toimivalta palvelimelta. Asiakas voi uusia samalla tunnisteella ja hyväksyä kumman tahansa kelvollisen vastauksen.',
      },
    },
    {
      section: '4.3.1 · 55–58',
      en: {
        title: 'Happened-before and Lamport timestamps',
        paragraphs: [
          'A happened-before edge comes from local program order or from sending a message before its receipt. The relation is transitive. Events with no path in either direction are concurrent in the causal sense.',
          'Lamport clocks attach a number to each event. A causally earlier event has a smaller number. A smaller number alone can also occur between unrelated events. A process identifier can break ties when an algorithm needs a total order.',
        ],
        example: 'A sends with clock 3 and B has clock 5. B timestamps receipt at max(5, 3) + 1 = 6. An independent event at C stamped 4 may be concurrent with that receipt despite having a smaller number.',
      },
      fi: {
        title: 'Tapahtui ennen -suhde ja Lamportin aikaleimat',
        paragraphs: [
          'Tapahtui ennen -suhde syntyy paikallisesta ohjelmajärjestyksestä tai viestin lähetyksestä ennen vastaanottoa. Suhde on transitiivinen. Ilman polkua kumpaankaan suuntaan tapahtumat ovat syyjärjestyksen kannalta samanaikaisia.',
          'Lamportin kello antaa jokaiselle tapahtumalle luvun. Syyjärjestyksessä aiemmalla tapahtumalla on pienempi luku. Pienempi luku voi esiintyä myös toisistaan riippumattomilla tapahtumilla. Prosessitunniste voi ratkaista tasatilanteen, jos algoritmi tarvitsee kokonaisjärjestyksen.',
        ],
        example: 'A lähettää arvolla 3 ja B:n kello on 5. B antaa vastaanotolle aikaleiman max(5, 3) + 1 = 6. C:n riippumaton, arvolla 4 merkitty tapahtuma voi olla vastaanoton kanssa samanaikainen.',
      },
    },
    {
      section: '4.3.1 · 59–60',
      en: {
        title: 'Vector clocks carry causal history',
        paragraphs: [
          'Each process keeps one vector entry for every participant. Its own entry counts its timestamped events. Other entries summarize events whose influence has reached it. A sender attaches the current vector, and a receiver merges components before incrementing its own entry.',
          'Compare two vectors coordinate by coordinate. If every entry of one is at most the corresponding entry of the other and at least one is smaller, the first event precedes the second. If each vector has a larger entry somewhere, the events are concurrent.',
        ],
        example: 'A sends with [2, 0]. B has [0, 1] and merges to [2, 1], then increments its own slot to [2, 2]. The send precedes receipt. A’s send and B’s earlier local event [0, 1] are concurrent.',
      },
      fi: {
        title: 'Vektorikellot kuljettavat syyhistoriaa',
        paragraphs: [
          'Prosessi ylläpitää yhtä vektorialkiota kutakin osallistujaa varten. Oma alkio laskee sen aikaleimatut tapahtumat. Muut alkiot kuvaavat tapahtumia, joiden vaikutus on saavuttanut prosessin. Lähettäjä liittää nykyisen vektorin, ja vastaanottaja yhdistää alkiot ennen omansa kasvattamista.',
          'Vertaa vektoreita alkioittain. Jos ensimmäisen kaikki alkiot ovat toisen vastaavia enintään yhtä suuria ja ainakin yksi on pienempi, ensimmäinen tapahtuma edeltää toista. Jos kummassakin on jossakin suurempi alkio, tapahtumat ovat samanaikaisia.',
        ],
        example: 'A lähettää vektorilla [2, 0]. B:llä on [0, 1]. B yhdistää vektorit muotoon [2, 1] ja kasvattaa omaa alkiotaan, jolloin tulos on [2, 2]. Lähetys edeltää vastaanottoa, mutta B:n aiempi paikallinen tapahtuma [0, 1] on lähetyksen kanssa samanaikainen.',
      },
    },
    {
      section: '4.3.2',
      en: {
        title: 'Consistent cuts and distributed snapshots',
        paragraphs: [
          'A global snapshot includes each process’s state and the messages in transit. A cut is consistent when every event it contains also includes its causal predecessors. A recorded receipt needs its send. A recorded send can have a receipt beyond the cut.',
          'In the Chandy–Lamport snapshot model, processes use marker messages over reliable FIFO channels to delimit records. A process records local state on its first marker, sends its markers, and records messages arriving on other incoming channels until their markers arrive.',
        ],
        example: 'A sends a transfer before its cut and B receives it after its cut. The snapshot records the transfer in transit. A snapshot showing the receipt but leaving out the send would violate causal consistency.',
      },
      fi: {
        title: 'Ehjät leikkaukset ja hajautetut tilannekuvat',
        paragraphs: [
          'Globaali tilannekuva sisältää prosessien tilat ja matkalla olevat viestit. Leikkaus on ehjä, kun siinä olevan tapahtuman kaikki syyjärjestyksessä aiemmat tapahtumat kuuluvat siihen. Vastaanoton mukana tarvitaan lähetys. Lähetyksen vastaanotto voi olla leikkauksen ulkopuolella.',
          'Chandyn ja Lamportin mallissa prosessit rajaavat tallennuksen merkkiviesteillä luotettavissa FIFO-kanavissa. Prosessi tallentaa paikallisen tilan ensimmäisen merkin saatuaan, lähettää omat merkkinsä ja kirjaa muiden saapuvien kanavien viestit niiden merkkeihin asti.',
        ],
        example: 'A lähettää siirron ennen omaa leikkaustaan ja B vastaanottaa sen oman leikkauksensa jälkeen. Tilannekuva kirjaa siirron matkalla olevaksi. Vastaanoton kirjaaminen ilman lähetystä rikkoisi syyjärjestyksen eheyttä.',
      },
    },
    {
      section: '4.4',
      en: {
        title: 'Failure taxonomy and masking',
        paragraphs: [
          'A fault can cause an erroneous internal state and then an externally visible failure. A crash stops a process. A fail-stop assumption additionally lets others detect the stop. An omission loses a send or receive, and a timing failure violates a bound in a timing model.',
          'A response failure can return a wrong value or take a wrong state transition. An arbitrary failure can exhibit any behavior permitted by the fault model. A retry can mask a transient omission. Validating results or comparing independent replicas addresses different failure classes.',
        ],
        example: 'A missing booking reply is an omission from the client’s viewpoint. A success response naming another booking is a value failure. One retry policy cannot establish that either result is correct.',
      },
      fi: {
        title: 'Vikatyyppien luokittelu ja peittäminen',
        paragraphs: [
          'Vika voi aiheuttaa virheellisen sisäisen tilan ja sen jälkeen ulospäin näkyvän toimintahäiriön. Kaatuminen pysäyttää prosessin. Fail-stop-oletus sallii muiden lisäksi havaita pysähdyksen. Laiminlyönti kadottaa lähetyksen tai vastaanoton, ja ajoitusvika rikkoo aikamallin rajaa.',
          'Vastausvika voi tuottaa väärän arvon tai väärän tilasiirtymän. Mielivaltaisessa viassa toiminta voi olla mitä tahansa mallin sallimaa. Uusinta voi peittää ohimenevän viestin katoamisen. Tulosten tarkistus ja riippumattomien replikoiden vertailu käsittelevät muita vikoja.',
        ],
        example: 'Puuttuva varausvastaus näyttäytyy asiakkaalle laiminlyöntinä. Onnistumisvastaus, joka nimeää väärän varauksen, on arvovirhe. Kummankin tapauksen varmistamiseen tarvitaan oma tarkistus.',
      },
    },
    {
      section: '4.5–4.6',
      en: {
        title: 'Trust and interaction assumptions',
        paragraphs: [
          'A security model states what an outside party can observe or change and which identities the system trusts. A secure channel protects traffic between authenticated endpoints according to its contract. Each service still validates its inputs and decides which resources the caller may access.',
          'Review architecture, timing, faults, and trust together. Choosing a peer for coordination also means deciding how peers prove identity, recognize stale messages, and recover from a missing coordinator.',
        ],
        example: 'A meeting update can travel over HTTPS and still contain an invalid time or name a meeting the caller cannot edit. The service checks the format and membership before applying the update.',
      },
      fi: {
        title: 'Luottamus ja vuorovaikutusoletukset',
        paragraphs: [
          'Turvallisuusmalli kertoo, mitä ulkopuolinen voi havaita tai muuttaa ja mihin identiteetteihin järjestelmä luottaa. Suojattu kanava suojaa liikennettä todennettujen päätepisteiden välillä oman sopimuksensa mukaisesti. Palvelu tarkistaa silti syötteen ja sen, mihin resursseihin pyytäjällä on oikeus.',
          'Tarkastele arkkitehtuuria, aikaa, vikoja ja luottamusta yhdessä. Vertaisen valitseminen koordinoijaksi tarkoittaa myös päätöstä identiteetin todentamisesta, vanhojen viestien tunnistamisesta ja koordinoijan katoamisesta toipumisesta.',
        ],
        example: 'Tapaamisen päivitys voi tulla HTTPS:n yli ja sisältää silti virheellisen ajan tai nimetä tapaamisen, jota pyytäjä ei voi muokata. Palvelu tarkistaa muodon ja osallistumisen ennen päivitystä.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE3 · 16–17 / DE4 · 21',
      en: {
        title: 'Compute a retry deadline and handle a lost acknowledgement',
        prompt: 'A sends a meeting update to B. One-way delivery takes at most 1 minute. B can take 3 minutes to react and 2 minutes to forward the update before acknowledging.',
        tasks: [
          'Find the latest acknowledgement arrival allowed by those bounds, assuming acknowledgement processing is immediate after forwarding.',
          'Describe the behavior if B receives the update but A never receives the acknowledgement.',
        ],
        solution: 'The bound is 1 + 3 + 2 + 1 = 7 minutes. After that bound A can retry the same update identifier. B recognizes that it already forwarded that update, repeats the acknowledgement, and keeps one logical copy of the update.',
      },
      fi: {
        title: 'Laske uusinnan aikaraja ja käsittele kadonnut kuittaus',
        prompt: 'A lähettää tapaamispäivityksen B:lle. Yhden suunnan siirto vie enintään minuutin. B voi käyttää 3 minuuttia reagoimiseen ja 2 minuuttia päivityksen edelleenlähettämiseen ennen kuittausta.',
        tasks: [
          'Laske näillä rajoilla myöhäisin kuittaushetki, kun kuittaus lähtee heti edelleenlähetyksen jälkeen.',
          'Kuvaa toiminta, jos B saa päivityksen mutta A ei saa kuittausta.',
        ],
        solution: 'Raja on 1 + 3 + 2 + 1 = 7 minuuttia. Sen jälkeen A voi uusia samalla päivitystunnisteella. B tunnistaa jo välitetyn päivityksen, toistaa kuittauksen ja säilyttää yhden loogisen päivityksen.',
      },
    },
    {
      reference: 'DE4 · 22–23',
      en: {
        title: 'Annotate a three-process trace',
        prompt: 'A has a local event and sends to B. Independently, B has one local event. B receives A’s message, then sends to C, which has done nothing yet.',
        tasks: [
          'Starting at zero, label the two sends and two receives with Lamport numbers and vectors in A, B, C order.',
          'Name one concurrent pair and give an example of an inconsistent cut.',
        ],
        solution: 'A’s send is 2 and [2,0,0]. B receives at 3 and [2,2,0], then sends at 4 and [2,3,0]. C receives at 5 and [2,3,1]. B’s local event [0,1,0] is concurrent with A’s send. A cut containing C’s receive but omitting B’s send is inconsistent.',
      },
      fi: {
        title: 'Merkitse kolmen prosessin tapahtumaketju',
        prompt: 'A tekee paikallisen tapahtuman ja lähettää B:lle. B tekee itsenäisesti yhden paikallisen tapahtuman. B vastaanottaa A:n viestin ja lähettää C:lle, jolla ei vielä ole tapahtumia.',
        tasks: [
          'Aloita nollasta. Merkitse kaksi lähetystä ja kaksi vastaanottoa Lamportin luvuilla ja vektoreilla järjestyksessä A, B, C.',
          'Nimeä yksi samanaikainen pari ja anna esimerkki epäehjästä leikkauksesta.',
        ],
        solution: 'A:n lähetys on 2 ja [2,0,0]. B vastaanottaa arvolla 3 ja [2,2,0] ja lähettää arvolla 4 ja [2,3,0]. C vastaanottaa arvolla 5 ja [2,3,1]. B:n paikallinen tapahtuma [0,1,0] on samanaikainen A:n lähetyksen kanssa. C:n vastaanoton sisältävä leikkaus ilman B:n lähetystä on epäehjä.',
      },
    },
    {
      reference: 'DE4 · 25–26',
      en: {
        title: 'Move meeting coordination to peers',
        prompt: 'In the server version, a single service accepts meeting creation, receives availability, and publishes a result. Move those responsibilities to a group of peers.',
        tasks: [
          'Draw the roles and indicate who can begin a round, identify it, collect times, and announce a result.',
          'Explain what happens if the coordinator disappears after some peers have received a decision.',
        ],
        solution: 'One peer can coordinate each numbered round while other peers reply with their available times. Record and name each decision so a replacement coordinator can ask peers for evidence about that round. A timeout alone leaves uncertainty. The protocol needs an explicit rule for adopting an existing decision or ending an undecided round.',
      },
      fi: {
        title: 'Siirrä tapaamisen koordinointi vertaisille',
        prompt: 'Palvelinversiossa yksi palvelu luo tapaamisen, vastaanottaa sopivat ajat ja julkaisee tuloksen. Siirrä vastuut vertaisryhmälle.',
        tasks: [
          'Piirrä roolit ja merkitse, kuka voi aloittaa kierroksen, tunnistaa sen, kerätä ajat ja julkaista tuloksen.',
          'Selitä, mitä tapahtuu, jos koordinoija katoaa sen jälkeen, kun osa vertaisista on saanut päätöksen.',
        ],
        solution: 'Yksi vertainen voi koordinoida numeroitua kierrosta ja muut vastaavat sopivilla ajoillaan. Nimeä ja kirjaa päätökset, jotta uusi koordinoija voi kysyä vertaisilta todisteita kierroksesta. Pelkkä aikakatkaisu jättää epävarmuuden. Protokolla tarvitsee säännön aiemman päätöksen hyväksymiseen tai avoimen kierroksen lopettamiseen.',
      },
    },
  ],
}
