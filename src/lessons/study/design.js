export const design = {
  topics: [
    {
      section: '3.1',
      en: {
        title: 'Communication costs belong in the design',
        paragraphs: [
          'A remote operation includes work at the caller and receiver, data conversion, network transfer, and waiting. A chain of remote calls adds those delays to the request path. Message size and the number of round trips both matter.',
          'Batch calls that naturally belong together and define time budgets at each boundary. When the caller may retry, decide whether a repeated request has the same intended effect and how a previous success is recognized.',
        ],
        example: 'Fetching ten book records one at a time with a 30 ms round trip costs roughly 300 ms in network waits when calls are serial. A batch request can trade a larger response for one round trip.',
      },
      fi: {
        title: 'Viestintäkustannukset kuuluvat suunnitteluun',
        paragraphs: [
          'Etäoperaatioon kuuluu työtä kutsujalla ja vastaanottajalla, tiedon muunnosta, verkkosiirtoa ja odotusta. Peräkkäiset etäkutsut lisäävät nämä viiveet pyyntöpolulle. Viestin koolla ja verkon edestakaisten kierrosten määrällä on väliä.',
          'Yhdistä luontevasti yhteen kuuluvat kutsut eräpyynnöksi ja määrittele aikabudjetti kullekin rajalle. Jos kutsuja voi yrittää uudelleen, päätä, onko toistolla sama tavoitevaikutus ja miten aiempi onnistuminen tunnistetaan.',
        ],
        example: 'Kymmenen kirjatiedon hakeminen erikseen vie pelkkään verkko-odotukseen noin 300 ms, jos peräkkäisen kutsun kierrosaika on 30 ms. Eräpyyntö voi vaihtaa suuremman vastauksen yhteen kierrokseen.',
      },
    },
    {
      section: '3.2',
      en: {
        title: 'Concurrent users and conflicting updates',
        paragraphs: [
          'A server often handles requests from many clients at once. Copies of a resource can also be updated in different processes. Define which operations can overlap and which need an order to preserve a shared rule.',
          'A lock can serialize a protected operation. An optimistic update can use a version number to reject a write based on an outdated read. Each approach affects latency and the experience of a user whose update collides with another.',
        ],
        example: 'Two editors open document version 12. The first save produces version 13. The second request still names 12, so the server can report a conflict and offer a merge instead of silently replacing version 13.',
      },
      fi: {
        title: 'Samanaikaiset käyttäjät ja päivitysristiriidat',
        paragraphs: [
          'Palvelin käsittelee usein monen asiakkaan pyyntöjä samaan aikaan. Resurssin kopioita voidaan myös päivittää eri prosesseissa. Määrittele, mitkä operaatiot voivat limittyä ja millä on oltava järjestys yhteisen säännön säilyttämiseksi.',
          'Lukko voi järjestää suojatut operaatiot peräkkäin. Optimistinen päivitys voi käyttää versionumeroa vanhaan lukuun perustuvan kirjoituksen hylkäämiseen. Valinta vaikuttaa viiveeseen ja ristiriidan kohdanneen käyttäjän kokemukseen.',
        ],
        example: 'Kaksi muokkaajaa avaa dokumentin version 12. Ensimmäinen tallennus tuottaa version 13. Toisessa pyynnössä on vielä versio 12, jolloin palvelin voi ilmoittaa ristiriidasta ja tarjota yhdistämistä.',
      },
    },
    {
      section: '3.3',
      en: {
        title: 'Latency, throughput, and scalability',
        paragraphs: [
          'Latency measures how long one request takes. Throughput measures completed work per unit of time. Capacity is a sustainable upper limit. Arrivals above capacity create a growing backlog until work is rejected or demand falls.',
          'Vertical scaling gives a component more resources. Horizontal scaling adds components. Replicating one tier helps while that tier is the bottleneck. A serial fraction and shared dependencies limit speedup even as more workers are added.',
        ],
        example: 'If 20 percent of a job is serial and four workers share the rest evenly, ideal time is 0.20 + 0.80/4 = 0.40 of the original, a 2.5× speedup before communication overhead.',
      },
      fi: {
        title: 'Viive, läpimeno ja skaalautuvuus',
        paragraphs: [
          'Viive kertoo yhden pyynnön keston. Läpimeno kertoo aikayksikössä valmistuneen työn. Kapasiteetti on jatkuvasti ylläpidettävä yläraja. Kapasiteetin ylittävä kysyntä kasvattaa jonoa, kunnes työtä hylätään tai kysyntä vähenee.',
          'Pystysuora skaalaus lisää komponentin resursseja. Vaakasuora skaalaus lisää komponentteja. Yhden kerroksen monistaminen auttaa, kun kyseinen kerros on pullonkaula. Sarjallinen osuus ja yhteiset riippuvuudet rajoittavat nopeutusta työntekijöiden määrän kasvaessa.',
        ],
        example: 'Jos työn osuudesta 20 prosenttia on sarjallista ja neljä työntekijää jakaa loput tasan, ihanneaika on 0,20 + 0,80/4 = 0,40 alkuperäisestä. Nopeutus on 2,5-kertainen ennen viestintäkustannuksia.',
      },
    },
    {
      section: '3.4–3.5',
      en: {
        title: 'Heterogeneity, middleware, and open interfaces',
        paragraphs: [
          'A distributed system can mix hardware, operating systems, languages, versions, and organizations. An agreed interface specifies both the data representation and its meaning. Middleware can provide a shared messaging, naming, or serialization layer across platforms.',
          'An open interface gives independent implementers enough information to interoperate. Document types, errors, and version changes. Adding an optional field that older readers can ignore is easier to roll out than changing the meaning of an existing field.',
        ],
        example: 'A Java service and a Python client agree on UTF-8 JSON and ISO 8601 timestamps. The server adds an optional room field. An older client can continue reading the original time field.',
      },
      fi: {
        title: 'Monimuotoisuus, väliohjelmisto ja avoimet rajapinnat',
        paragraphs: [
          'Hajautettu järjestelmä voi yhdistää laitteita, käyttöjärjestelmiä, kieliä, versioita ja organisaatioita. Yhteinen rajapinta määrittelee tiedon esitystavan ja merkityksen. Väliohjelmisto voi tarjota eri alustoille yhteisen viestintä-, nimi- tai sarjallistamiskerroksen.',
          'Avoin rajapinta antaa itsenäisille toteuttajille yhteistyöhön tarvittavat tiedot. Dokumentoi tyypit, virheet ja versiomuunnokset. Vanhojen lukijoiden ohitettavissa oleva valinnainen kenttä on helpompi ottaa käyttöön kuin vanhan kentän merkityksen muuttaminen.',
        ],
        example: 'Java-palvelu ja Python-asiakas sopivat UTF-8-koodatusta JSONista ja ISO 8601 -aikaleimoista. Palvelin lisää valinnaisen huonekentän. Vanha asiakas voi edelleen lukea alkuperäisen aikakentän.',
      },
    },
    {
      section: '3.6',
      en: {
        title: 'Reliability, availability, and partial failure',
        paragraphs: [
          'Availability asks whether a service can answer when requested. Reliability concerns continued correct operation over an interval. Fast recovery can improve availability even when failures still occur. Fault tolerance describes how the service keeps meeting some or all of its contract after a fault.',
          'Replication is useful when replicas have independent failure modes and a way to recover or replace state. Trace shared dependencies such as a database or network connection. If a dependency is lost, decide which user operations can still complete and how to signal reduced service.',
        ],
        example: 'Two catalogue replicas can keep search available when one fails. If both require one shared storage service and that storage fails, two healthy replicas alone cannot answer searches.',
      },
      fi: {
        title: 'Luotettavuus, saatavuus ja osittainen vika',
        paragraphs: [
          'Saatavuus kertoo, voiko palvelu vastata pyydettäessä. Luotettavuus kuvaa toiminnan pysymistä oikeana tietyn ajan. Nopea toipuminen voi parantaa saatavuutta, vaikka vikoja edelleen esiintyisi. Vikasietoisuus kertoo, miten palvelu täyttää osan tai kaikki lupauksensa vian jälkeen.',
          'Monistaminen auttaa, kun kopiot voivat vikaantua itsenäisesti ja tila voidaan palauttaa tai korvata. Selvitä yhteiset riippuvuudet, kuten tietokanta ja verkkoyhteys. Päätä, mitkä käyttäjäoperaatiot voivat jatkua riippuvuuden vikaantuessa ja miten rajoitettu toiminta ilmoitetaan.',
        ],
        example: 'Kaksi luetteloreplikaa voi pitää haun saatavilla toisen vikaantuessa. Jos molemmat tarvitsevat samaa tallennuspalvelua ja se vikaantuu, kaksi toimivaa replikaa eivät yksin pysty vastaamaan hakuihin.',
      },
    },
    {
      section: '3.7',
      en: {
        title: 'Security as a system property',
        paragraphs: [
          'Confidentiality limits who can read data. Integrity protects data and decisions from unauthorized changes. Availability keeps operations usable for authorized users. Evaluate all three at each boundary where a request crosses to another component.',
          'Identify the caller and check what they may do. Decide which information must stay private in messages, storage, and logs. Plan capacity and request limits so one caller cannot consume the resources needed by everyone else.',
        ],
        example: 'A meeting service can encrypt its network traffic and still leak a result by logging the response body into a widely accessible log. The design must include the logging boundary as well as the network boundary.',
      },
      fi: {
        title: 'Tietoturva järjestelmän ominaisuutena',
        paragraphs: [
          'Luottamuksellisuus rajoittaa tiedon lukijoita. Eheys suojaa tietoa ja päätöksiä luvattomilta muutoksilta. Saatavuus pitää toiminnot oikeutettujen käyttäjien käytössä. Arvioi kaikki kolme silloin, kun pyyntö ylittää komponenttien välisen rajan.',
          'Todenna pyytäjä ja tarkista, mitä hän saa tehdä. Päätä, minkä tiedon on pysyttävä yksityisenä viesteissä, tallennuksessa ja lokeissa. Suunnittele kapasiteetti ja pyyntörajat niin, ettei yksi kutsuja vie muiden tarvitsemia resursseja.',
        ],
        example: 'Tapaamispalvelu voi salata verkkoliikenteensä ja silti paljastaa tuloksen kirjoittamalla vastauksen runkoa laajasti luettuun lokiin. Suunnittelussa on huomioitava lokien rajapinta verkon lisäksi.',
      },
    },
    {
      section: '3.8',
      en: {
        title: 'What the service can hide',
        paragraphs: [
          'Transparency is the ability to hide aspects of distribution. Access transparency offers a familiar operation across resource types. Location transparency lets callers use a name without specifying a machine. Migration can preserve the name after moving a resource, and relocation can preserve its use during the move.',
          'Replication transparency hides which copy responds. Concurrency transparency hides interference between users under the service’s rules. Failure and performance transparency have limits. Mask a brief retry when safe and inform the user when their operation may need a decision.',
        ],
        example: 'A library search can keep its URL after the catalogue moves and can quietly switch replicas during a brief fault. A library loan with an uncertain result benefits from a clear pending state that prevents an accidental duplicate.',
      },
      fi: {
        title: 'Mitä palvelu voi piilottaa',
        paragraphs: [
          'Läpinäkyvyys tarkoittaa hajautuksen yksityiskohtien piilottamista. Käytön läpinäkyvyys tarjoaa tutun toiminnon eri resursseille. Sijainnin läpinäkyvyys sallii nimen käytön ilman koneen valintaa. Siirrossa nimi voidaan säilyttää, ja uudelleensijoittamisessa käyttö voi jatkua siirron aikana.',
          'Monistuksen läpinäkyvyys piilottaa vastaavan kopion. Samanaikaisuuden läpinäkyvyys piilottaa palvelun sääntöjen mukaan käyttäjien välisen häirinnän. Vika- ja suorituskykyläpinäkyvyydellä on rajat. Piilota turvallinen lyhyt uudelleenyritys ja kerro käyttäjälle päätöstä vaativasta tilanteesta.',
        ],
        example: 'Kirjastohaku voi säilyttää URL-osoitteensa luettelon siirtyessä ja vaihtaa replikaa lyhyen vian aikana. Epävarma lainaustulos kannattaa näyttää odottavana, jotta käyttäjä välttää kaksoispyynnön.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE2 · 10–11 / DE3 · 15',
      en: {
        title: 'Estimate the cost of frequent conflicts',
        prompt: 'An update occupies a shared resource for 1 ms. Each of N independent processes starts an update at an average rate of one per minute. Assume independent Poisson arrivals and rare overlaps.',
        tasks: [
          'Explain why possible conflicting pairs grow as N(N−1)/2.',
          'Use approximately 2λ²d overlaps per second for each pair, where λ is the rate per process and d is the update duration. Compare N = 2 and N = 100.',
        ],
        solution: 'For N = 2 there is one pair. At λ = 1/60 and d = 0.001 its overlap rate is about 0.000000556 per second. For N = 100 there are 4,950 pairs, yielding about 0.00275 per second, or one overlap every six minutes. A coordination protocol must also be evaluated for its message cost.',
      },
      fi: {
        title: 'Arvioi törmäysten yleistymistä',
        prompt: 'Päivitys varaa yhteisen resurssin 1 ms ajaksi. Jokainen N itsenäisestä prosessista aloittaa päivityksen keskimäärin kerran minuutissa. Oleta riippumattomat Poisson-saapumiset ja harvinaiset päällekkäisyydet.',
        tasks: [
          'Selitä, miksi mahdollisten ristiriitaparien määrä on N(N−1)/2.',
          'Käytä parin päällekkäisyystiheytenä likiarvoa 2λ²d sekunnissa, jossa λ on yhden prosessin tahti ja d päivityksen kesto. Vertaa tapauksia N = 2 ja N = 100.',
        ],
        solution: 'Kun N = 2, pareja on yksi. Arvoilla λ = 1/60 ja d = 0,001 tiheys on noin 0,000000556 sekunnissa. Kun N = 100, pareja on 4 950 ja tiheys noin 0,00275 sekunnissa eli yksi päällekkäisyys noin kuudessa minuutissa. Arvioi koordinointiprotokollasta myös viestikustannus.',
      },
    },
    {
      reference: 'DE4 · 24',
      en: {
        title: 'Choose recovery for two different services',
        prompt: 'A brief network outage affects a file download and a live lecture stream. Both use the same unreliable connection.',
        tasks: [
          'Decide which data each service should recover and what the user should see while the connection is interrupted.',
          'Explain whether a replication strategy by itself would remove the interruption.',
        ],
        solution: 'Resume the file from a verified offset because it needs all bytes. A live stream may skip late segments and resume close to live time, using buffering when latency permits. Replicas help with server failure. An outage on the shared access link can still affect every replica.',
      },
      fi: {
        title: 'Valitse toipumistapa kahdelle palvelulle',
        prompt: 'Lyhyt verkkokatko vaikuttaa tiedoston lataukseen ja suoraan luentolähetykseen. Molemmat käyttävät samaa epäluotettavaa yhteyttä.',
        tasks: [
          'Päätä, mikä tieto kummankin palvelun on palautettava ja mitä käyttäjän pitäisi nähdä katkon aikana.',
          'Selitä, poistaisiko replikointi yksin katkon.',
        ],
        solution: 'Jatka tiedostoa tarkistetusta kohdasta, koska kaikki tavut tarvitaan. Suora lähetys voi ohittaa myöhäisiä osia ja palata lähelle nykyhetkeä, käyttäen puskurointia viiveen salliessa. Replikat auttavat palvelinviassa. Katko yhteisellä liityntäyhteydellä voi silti vaikuttaa kaikkiin replikoihin.',
      },
    },
  ],
}
