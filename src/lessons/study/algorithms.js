export const algorithms = {
  topics: [
    {
      section: '7.1 · 113–114',
      en: {
        title: 'Centralized locking and its guarantees',
        paragraphs: [
          'Distributed mutual exclusion protects a critical resource shared by processes that coordinate through messages. Safety means at most one holder. Liveness means a requester eventually gets a turn under the stated assumptions. An algorithm may also aim to preserve causal request order.',
          'A central coordinator receives a request, issues a grant, and later receives a release. It can queue requests in arrival order. This uses three logical messages for a completed lock cycle but adds a shared coordinator and its failure state.',
        ],
        example: 'A sends its lock request, then signals B. B sends after receiving that signal. If B’s request reaches the coordinator first, an arrival-order coordinator can grant B first even though A causally preceded it.',
      },
      fi: {
        title: 'Keskitetty lukitus ja sen takuut',
        paragraphs: [
          'Hajautettu keskinäinen poissulkeminen suojaa resurssia prosesseilta, jotka koordinoivat käyttöä viesteillä. Turvallisuus sallii enintään yhden haltijan. Etenemistakuu tarkoittaa, että pyytäjä saa oletusten vallitessa lopulta vuoron. Algoritmi voi lisäksi tavoitella pyyntöjen syyjärjestystä.',
          'Keskuskoordinoija saa pyynnön, myöntää lukon ja saa myöhemmin vapautuksen. Se voi jonottaa pyynnöt saapumisjärjestyksessä. Yksi lukituskierros käyttää kolme loogista viestiä, mutta järjestelmään tulee yhteinen koordinoija ja sen vikatila.',
        ],
        example: 'A lähettää lukituspyynnön ja sitten viestin B:lle. B pyytää lukkoa viestin saatuaan. Jos B:n pyyntö saapuu koordinoijalle ensin, saapumisjärjestys voi myöntää lukon ensin B:lle, vaikka A edelsi sitä syyjärjestyksessä.',
      },
    },
    {
      section: '7.1 · 114–115',
      en: {
        title: 'Token ring and peer permissions',
        paragraphs: [
          'In a token ring, permission travels around a known sequence of processes. The token holder can use the resource, then passes the token. With one live token and a functioning ring, each requester can get a turn. A lost token stops progress, and recovery must avoid creating two valid tokens.',
          'Ricart–Agrawala sends a timestamped request to peers and waits for all their replies. A peer defers a reply while holding the lock or while waiting with an earlier request in the common timestamp order. After release it sends deferred replies. The base algorithm needs participating peers to respond.',
        ],
        example: 'Four peers require three request messages and three replies for one Ricart–Agrawala acquisition with point-to-point sends. In a token ring, the wait and messages depend on where the token currently is.',
      },
      fi: {
        title: 'Vuoropolettirengas ja vertaisten luvat',
        paragraphs: [
          'Vuoropolettirenkaassa lupa kiertää tunnetussa prosessijärjestyksessä. Haltija voi käyttää resurssia ja luovuttaa sitten poletin eteenpäin. Yksi toimiva poletti ja ehjä rengas antavat jokaiselle pyytäjälle vuoron. Kadonnut poletti pysäyttää etenemisen, ja toipumisessa on vältettävä kahden kelvollisen poletin synty.',
          'Ricart–Agrawala lähettää aikaleimatun pyynnön vertaisille ja odottaa kaikkien vastausta. Vertaisen vastaus viivästyy, jos se pitää lukkoa tai odottaa yhteisessä aikaleimajärjestyksessä aiemmalla pyynnöllä. Vapautuksen jälkeen se lähettää lykätyt vastaukset. Perusalgoritmi tarvitsee osallistujilta vastaukset.',
        ],
        example: 'Neljän vertaisen Ricart–Agrawala käyttää yhteen lukon saantiin kolme pyyntöä ja kolme vastausta pisteestä pisteeseen. Renkaassa viestimäärä ja odotus riippuvat poletin nykyisestä sijainnista.',
      },
    },
    {
      section: '7.2 · 116',
      en: {
        title: 'Reliable multicast and missing messages',
        paragraphs: [
          'Multicast distributes one logical message to a group. Lower layers can make sending efficient, while an application-level protocol supplies the intended delivery guarantees. Reliable multicast usually requires eventual delivery to the relevant correct participants, no invented deliveries, and no duplicate delivery.',
          'Sequence numbers reveal gaps. Some protocols use negative acknowledgements to request only missing data and reduce feedback when most deliveries succeed. Membership and retransmission rules determine which senders or peers can repair a gap.',
        ],
        example: 'A receiver has delivered messages 7 and 8, then receives 10. It can request 9 and discard any duplicate copy of 8. If ordered delivery is required, it holds 10 until 9 can be delivered.',
      },
      fi: {
        title: 'Luotettava ryhmälähetys ja puuttuvat viestit',
        paragraphs: [
          'Ryhmälähetys jakaa yhden loogisen viestin ryhmälle. Alemmat kerrokset voivat tehostaa lähetystä, ja sovellustason protokolla antaa halutut toimitustakuut. Luotettava ryhmälähetys vaatii yleensä lopullista toimitusta oleellisille toimiville osallistujille ilman keksittyjä tai moninkertaisia toimituksia.',
          'Järjestysnumerot paljastavat aukot. Osa protokollista pyytää kielteisellä kuittauksella vain puuttuvaa tietoa, mikä vähentää kuittauksia useimpien lähetysten onnistuessa. Jäsenyys- ja uusintasäännöt määräävät, kuka voi korjata aukon.',
        ],
        example: 'Vastaanottaja on toimittanut viestit 7 ja 8 ja saa sitten numeron 10. Se voi pyytää numeroa 9 ja hylätä numeron 8 kaksoiskappaleet. Järjestetyssä toimituksessa 10 odottaa numeron 9 toimittamista.',
      },
    },
    {
      section: '7.2 · 116–117',
      en: {
        title: 'FIFO, causal, and total delivery order',
        paragraphs: [
          'FIFO delivers messages from the same sender in that sender’s order. Causal delivery also preserves dependencies created when one sender reacts to another message. Total order makes all receivers agree on the delivery order of the messages they both deliver.',
          'These rules constrain different things. Two concurrent messages may have different delivery orders under a causal-only rule. A total-order protocol can choose one consistent order, and an application that also needs causes before effects can require both guarantees.',
        ],
        example: 'A publishes a meeting proposal. B receives it and publishes a correction. FIFO alone allows C to deliver the correction first because the senders differ. Causal delivery holds the correction until C has delivered the proposal.',
      },
      fi: {
        title: 'FIFO, syyjärjestys ja kokonaisjärjestys',
        paragraphs: [
          'FIFO toimittaa saman lähettäjän viestit tämän lähetysjärjestyksessä. Syyjärjestys säilyttää myös riippuvuudet, jotka syntyvät toisen lähettäjän viestiin reagoimisesta. Kokonaisjärjestys antaa kaikille vastaanottajille saman järjestyksen viesteille, jotka ne molemmat toimittavat.',
          'Säännöt rajoittavat eri asioita. Pelkällä syyjärjestyksellä kaksi samanaikaista viestiä voidaan toimittaa eri järjestyksessä. Kokonaisjärjestys valitsee yhden yhteisen järjestyksen. Syyt ennen seurauksia tarvitseva sovellus voi vaatia molemmat takuut.',
        ],
        example: 'A julkaisee tapaamisehdotuksen. B saa ehdotuksen ja julkaisee korjauksen. Pelkkä FIFO sallii C:n toimittaa korjauksen ensin, koska lähettäjät ovat eri. Syyjärjestys odottaa ehdotuksen toimittamista.',
      },
    },
    {
      section: '7.3 · 117–119',
      en: {
        title: 'Transactions, ACID, and nested work',
        paragraphs: [
          'Atomicity means all changes take effect together or are rolled back. Consistency preserves the required invariants. Isolation restricts interference between concurrent transactions. Durability keeps a committed result after failures covered by the storage model.',
          'A nested transaction can group parallel sub-work and isolate its rollback. A subtransaction’s success is provisional until the parent commits. Locks can protect reads and writes, but their granularity and duration affect concurrency. A cycle in the wait-for graph indicates a deadlock.',
        ],
        example: 'Reserving a room and booking catering belong to one parent transaction. A successful catering subtransaction alone does not make the whole booking committed. If the room step fails, the parent can roll back both related changes.',
      },
      fi: {
        title: 'Tapahtumat, ACID ja sisäkkäinen työ',
        paragraphs: [
          'Atomisuus tarkoittaa, että kaikki muutokset tulevat voimaan yhdessä tai perutaan. Eheys säilyttää vaaditut ehdot. Eristyvyys rajoittaa samanaikaisten tapahtumien häiriöitä. Pysyvyys säilyttää vahvistetun tuloksen tallennusmallin kattamien vikojen jälkeen.',
          'Sisäkkäinen tapahtuma voi ryhmitellä rinnakkaista osatyötä ja rajata sille oman peruutuksen. Alitapahtuman onnistuminen on ehdollista päätapahtuman vahvistamiseen asti. Lukot suojaavat lukuja ja kirjoituksia, mutta lukon tarkkuus ja kesto vaikuttavat samanaikaisuuteen. Odotusgraafin sykli tarkoittaa lukkiumaa.',
        ],
        example: 'Huonevaraus ja tarjoilutilaus kuuluvat samaan päätapahtumaan. Tarjoilun alitapahtuman onnistuminen ei yksin vahvista varausta. Jos huonevaihe epäonnistuu, päätapahtuma voi perua molemmat muutokset.',
      },
    },
    {
      section: '7.3 · 120–121',
      en: {
        title: 'Two-phase commit, durable votes, and recovery',
        paragraphs: [
          'In the prepare phase, a coordinator asks participants whether they can commit. A participant that votes yes records enough state durably to honor either final decision and holds relevant resources. A no vote makes the coordinator abort. Commit requires receipt of all yes votes.',
          'The coordinator records the decision and then announces it. A yes voter that has not received the decision is in an uncertain prepared state. It recovers from its durable state and may need the coordinator or another participant with the decision before releasing resources.',
        ],
        example: 'A and B vote yes. A receives commit, while B loses its connection. B must learn the existing decision when it reconnects. Treating the timeout as a unilateral abort could make A and B disagree.',
      },
      fi: {
        title: 'Kaksivaiheinen vahvistus, pysyvät äänet ja toipuminen',
        paragraphs: [
          'Valmisteluvaiheessa koordinoija kysyy osallistujilta, voivatko ne vahvistaa. Kyllä äänestävä tallentaa pysyvästi tarpeeksi tilaa kummankin lopullisen päätöksen toteuttamiseksi ja pitää tarvittavat resurssit varattuina. Ei-ääni peruu tapahtuman. Vahvistus edellyttää kaikkien kyllä-äänten saamista.',
          'Koordinoija kirjaa päätöksen ja ilmoittaa sen. Päätöstä vailla oleva kyllä-äänestäjä on epävarmassa valmistellussa tilassa. Se toipuu pysyvästä tilastaan ja voi tarvita päätöksen koordinoijalta tai sen tietävältä osallistujalta ennen resurssien vapauttamista.',
        ],
        example: 'A ja B äänestävät kyllä. A saa vahvistuksen, ja B:n yhteys katkeaa. B:n on saatava aiempi päätös yhteyden palauduttua. Yksipuolinen peruutus aikakatkaisulla voisi antaa A:lle ja B:lle eri tulokset.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE3 · 15 / § 7.1',
      en: {
        title: 'Compare the message costs of locking',
        prompt: 'Six processes compete for one resource. Count point-to-point messages for a single successful lock cycle with a central server and with Ricart–Agrawala.',
        tasks: [
          'List messages needed by each method.',
          'Identify one outage that can prevent progress in each design.',
        ],
        solution: 'A central server handles request, grant, and release, for three messages. Ricart–Agrawala needs five requests and five replies, for ten. A failed central coordinator stops new grants until recovery. A missing peer reply prevents the baseline peer protocol from completing an acquisition.',
      },
      fi: {
        title: 'Vertaa lukituksen viestikustannuksia',
        prompt: 'Kuusi prosessia kilpailee yhdestä resurssista. Laske yhden onnistuneen lukituskierroksen pisteestä pisteeseen -viestit keskuspalvelimella ja Ricart–Agrawalalla.',
        tasks: [
          'Listaa molempien menetelmien tarvitsemat viestit.',
          'Nimeä kummassakin yksi vika, joka voi estää etenemisen.',
        ],
        solution: 'Keskuspalvelin käsittelee pyynnön, luvan ja vapautuksen eli kolme viestiä. Ricart–Agrawala tarvitsee viisi pyyntöä ja viisi vastausta eli kymmenen. Koordinoijan vika estää uudet luvat toipumiseen asti. Puuttuva vertaisvastaus estää perusalgoritmin lukon saannin.',
      },
    },
    {
      reference: 'DE7 · 42',
      en: {
        title: 'Draw a causal inversion without overlapping grants',
        prompt: 'A informs B of its lock request before B makes a request. Vary only the network delay to the lock server.',
        tasks: [
          'Draw the causal edges from A’s request to B’s request and a delivery order that reverses them at the server.',
          'Mark when B releases the lock and when A can enter. Explain which guarantee remains intact.',
        ],
        solution: 'A’s request precedes its notification send, which precedes B’s receipt and request. Deliver B’s request to the server first and queue A when its request arrives. Grant A only after B releases. The grant order violates causal order while mutual exclusion holds.',
      },
      fi: {
        title: 'Piirrä syyjärjestyksen kääntyminen ilman päällekkäisiä lupia',
        prompt: 'A ilmoittaa pyynnöstään B:lle ennen B:n omaa lukituspyyntöä. Muuta vain lukkopalvelimen suuntaan kulkevaa verkkoviivettä.',
        tasks: [
          'Piirrä syy-yhteydet A:n pyynnöstä B:n pyyntöön ja toimitusjärjestys, joka kääntää ne palvelimella.',
          'Merkitse B:n vapautus ja A:n pääsy. Selitä, mikä takuu säilyy.',
        ],
        solution: 'A:n pyyntö edeltää ilmoituksen lähetystä, joka edeltää B:n vastaanottoa ja pyyntöä. Toimita B:n pyyntö ensin ja jonota A:n pyyntö sen saapuessa. Myönnä lupa A:lle vasta B:n vapautuksen jälkeen. Syyjärjestys vaihtuu, mutta keskinäinen poissulkeminen säilyy.',
      },
    },
    {
      reference: '§ 7.3',
      en: {
        title: 'Recover a prepared participant',
        prompt: 'Both participants vote yes. The coordinator records commit and delivers the decision to A, then B times out waiting.',
        tasks: [
          'Write the durable state each participant and the coordinator need before and after the decision.',
          'Explain what B may safely do when it recovers and why a timeout alone is insufficient.',
        ],
        solution: 'Each yes voter retains its prepared record and required resources. The coordinator retains commit before announcing it. A applies commit. B asks for the durable decision and can complete once it receives commit. B may have lost the message even if the coordinator acted, so it cannot infer abort from a timeout.',
      },
      fi: {
        title: 'Palauta valmisteltu osallistuja',
        prompt: 'Molemmat osallistujat äänestävät kyllä. Koordinoija kirjaa vahvistuksen ja toimittaa sen A:lle. B:n odotus aikakatkaistaan.',
        tasks: [
          'Kirjoita, mitä pysyvää tilaa osallistujat ja koordinoija tarvitsevat ennen päätöstä ja sen jälkeen.',
          'Selitä, mitä B voi turvallisesti tehdä toipuessaan ja miksi pelkkä aikakatkaisu ei riitä.',
        ],
        solution: 'Kyllä äänestänyt säilyttää valmistelutietueen ja tarvittavat resurssit. Koordinoija säilyttää vahvistuspäätöksen ennen ilmoitusta. A toteuttaa sen. B kysyy pysyvän päätöksen ja valmistuu saatuaan vahvistuksen. Viesti voi olla kadonnut päätöksen tekemisen jälkeen, joten aikakatkaisusta ei voi päätellä peruutusta.',
      },
    },
  ],
}
