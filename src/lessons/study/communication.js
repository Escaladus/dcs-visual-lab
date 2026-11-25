export const communication = {
  topics: [
    {
      section: '5.1',
      en: {
        title: 'Protocol layers and encapsulation',
        paragraphs: [
          'A layer provides a service to the layer above and exchanges data according to a protocol with its counterpart. Link protocols move frames on one link. IP routes packets between networks. A transport connects application endpoints, and the application decides the meaning of the transferred bytes.',
          'Encapsulation adds information needed by each layer. A receiving stack removes that information and delivers the payload upward. The OSI model names seven roles. Internet implementations often group several of those roles into an application layer.',
        ],
        example: 'An HTTP request is encoded as bytes and sent in a TCP stream. TCP segments are carried in IP packets, and each hop uses a local link frame. A router can forward the IP packet without interpreting the HTTP request.',
      },
      fi: {
        title: 'Protokollakerrokset ja kapselointi',
        paragraphs: [
          'Kerros tarjoaa palvelun ylemmälle kerrokselle ja vaihtaa tietoa vastinkerroksen kanssa protokollan mukaisesti. Siirtokerros siirtää kehyksiä yhdellä linkillä. IP reitittää paketteja verkkojen välillä. Kuljetus yhdistää sovellusten päätepisteet, ja sovellus määrittelee tavujen merkityksen.',
          'Kapselointi lisää kunkin kerroksen tarvitseman tiedon. Vastaanottava pino poistaa tiedon ja välittää hyötykuorman ylöspäin. OSI-malli nimeää seitsemän roolia. Internet-toteutukset kokoavat usein useita niistä sovelluskerrokseen.',
        ],
        example: 'HTTP-pyyntö koodataan tavuiksi TCP-virtaan. TCP-segmentit kulkevat IP-paketeissa, ja jokainen verkkohyppy käyttää paikallista kehystä. Reititin voi välittää IP-paketin tulkitsematta HTTP-pyyntöä.',
      },
    },
    {
      section: '5.2–5.3 · IP',
      en: {
        title: 'Addresses, routing, ports, and NAT',
        paragraphs: [
          'A host name can resolve through DNS to one or more IP addresses. An IP address identifies a network endpoint for routing. Routers forward packets toward the best available destination prefix. Transport ports distinguish services and connections at endpoints.',
          'IPv4 uses 32-bit addresses and IPv6 uses 128-bit addresses. Private IPv4 addresses can be reused on separate networks. A common NAT uses a mapping of private address and port to an external address and port, then uses that mapping to deliver replies back to the original endpoint.',
          'Internet-routable IPv6 prefixes are delegated to networks. A host can form an address from the local prefix or receive one through DHCPv6. Duplicate Address Detection normally checks that the address is free on that link before use.',
        ],
        example: 'Two home networks can both have a device at 192.168.1.10. Their routers maintain separate translations for outbound connections. The external peer replies to the observed address and port, and each router maps its own replies back.',
      },
      fi: {
        title: 'Osoitteet, reititys, portit ja NAT',
        paragraphs: [
          'DNS voi muuntaa koneen nimen yhdeksi tai useammaksi IP-osoitteeksi. IP-osoite tunnistaa verkkopäätepisteen reititystä varten. Reititin välittää paketin parhaiten täsmäävän kohde-etuliitteen suuntaan. Kuljetusportit erottavat palveluja ja yhteyksiä päätepisteissä.',
          'IPv4 käyttää 32-bittisiä osoitteita ja IPv6 128-bittisiä. Yksityisiä IPv4-osoitteita voidaan käyttää uudelleen eri verkoissa. Tavallinen NAT yhdistää yksityisen osoitteen ja portin ulkoiseen osoitteeseen ja porttiin ja välittää vastauksen muunnoksen perusteella takaisin.',
          'Internetissä reititettävät IPv6-etuliitteet jaetaan verkoille. Laite voi muodostaa osoitteen paikallisesta etuliitteestä tai saada sen DHCPv6:lla. Päällekkäisten osoitteiden tunnistus tarkistaa tavallisesti ennen käyttöä, että osoite on kyseisellä linkillä vapaa.',
        ],
        example: 'Kahdessa kotiverkossa voi olla laite osoitteessa 192.168.1.10. Reitittimet ylläpitävät erillisiä muunnoksia lähteville yhteyksille. Ulkoinen vastapuoli vastaa havaitsemaansa osoitteeseen ja porttiin, ja kukin reititin muuntaa omat vastauksensa takaisin.',
      },
    },
    {
      section: '5.3 · TCP / UDP',
      en: {
        title: 'Picking TCP or UDP for an application',
        paragraphs: [
          'TCP provides a connection and an ordered byte stream. Its stack handles retransmission, flow control, and congestion control. An application needs framing to divide the stream into messages. A failed TCP connection can still leave an application uncertain whether its last request took effect.',
          'UDP preserves datagram boundaries and has a lighter transport contract. Delivery and order can vary. The application decides how to react to an old or missing datagram and can add its own reliability and congestion behavior.',
        ],
        example: 'A file transfer needs all bytes in order, which fits a TCP stream. A live position feed may prefer a recent update over a late one. With datagrams it can include sequence numbers and keep only the newest usable position.',
      },
      fi: {
        title: 'TCP:n tai UDP:n valinta sovellukselle',
        paragraphs: [
          'TCP antaa yhteyden ja järjestetyn tavuvirran. Pino hoitaa uudelleenlähetyksen, vuonohjauksen ja ruuhkanhallinnan. Sovellus rajaa virrasta omat viestinsä. TCP-yhteyden katketessa sovellus voi jäädä epävarmaksi viimeisen pyynnön vaikutuksesta.',
          'UDP säilyttää datagrammien rajat ja tarjoaa kevyemmän kuljetussopimuksen. Toimitus ja järjestys voivat vaihdella. Sovellus päättää, mitä vanhalle tai puuttuvalle datagrammille tehdään, ja voi lisätä oman luotettavuuden ja ruuhkanhallinnan.',
        ],
        example: 'Tiedostonsiirto tarvitsee kaikki tavut järjestyksessä, mikä sopii TCP-virralle. Reaaliaikainen sijaintivirta voi suosia tuoretta päivitystä myöhäisen sijaan. Datagrammeihin voi lisätä järjestysnumerot ja säilyttää tuoreimman käyttökelpoisen sijainnin.',
      },
    },
    {
      section: '5.4–5.5',
      code: [
        'import java.io.*;',
        'import java.net.*;',
        'import java.nio.charset.StandardCharsets;',
        '',
        'class LineServer {',
        '    public static void main(String[] args) throws IOException {',
        '        InetAddress loopback = InetAddress.getLoopbackAddress();',
        '        try (ServerSocket listener = new ServerSocket(4040, 1, loopback);',
        '             Socket client = listener.accept()) {',
        '            client.setSoTimeout(5_000);',
        '            BufferedReader input = new BufferedReader(new InputStreamReader(',
        '                client.getInputStream(), StandardCharsets.UTF_8));',
        '            BufferedWriter output = new BufferedWriter(new OutputStreamWriter(',
        '                client.getOutputStream(), StandardCharsets.UTF_8));',
        '            String line = input.readLine();',
        '            if (line != null) {',
        '                output.write("PING".equals(line) ? "PONG\\n" : "ERROR\\n");',
        '                output.flush();',
        '            }',
        '        }',
        '    }',
        '}',
      ].join('\n'),
      en: {
        title: 'Socket programming and the connection lifecycle',
        paragraphs: [
          'The server binds a listening socket to an address and port. accept returns a connected socket for one client. A client connects to that address and port. Each side reads and writes through its connected socket, then closes it. A listener can continue accepting while a worker handles each connection.',
          'A blocking read waits for data, EOF, a timeout, or an error. For a simple server, a bounded set of workers can handle blocking connections. Event-driven implementations use readiness and callbacks. Java, Python, and C programs can interoperate when their bytes and protocol rules agree.',
        ],
        example: 'The loopback example accepts one connection, reads a UTF-8 line, and replies PONG to PING. The client must send a line ending so readLine can finish. Closing the connected socket ends this exchange.',
      },
      fi: {
        title: 'Pistokeohjelmointi ja yhteyden elinkaari',
        paragraphs: [
          'Palvelin sitoo kuuntelevan pistokkeen osoitteeseen ja porttiin. accept palauttaa yhdistetyn pistokkeen yhdelle asiakkaalle. Asiakas yhdistää osoitteeseen ja porttiin. Molemmat lukevat ja kirjoittavat omasta yhdistetystä pistokkeestaan ja sulkevat sen lopuksi. Kuuntelija voi jatkaa uusien yhteyksien vastaanottoa työntekijän käsitellessä yhtä yhteyttä.',
          'Estävä luku odottaa dataa, tiedoston loppua, aikakatkaisua tai virhettä. Yksinkertaisessa palvelimessa rajattu työntekijäjoukko voi käsitellä estäviä yhteyksiä. Tapahtumapohjainen toteutus käyttää valmiusilmoituksia ja takaisinkutsuja. Java-, Python- ja C-ohjelmat toimivat yhteen, kun tavut ja protokollasäännöt vastaavat toisiaan.',
        ],
        example: 'Paikallinen esimerkki hyväksyy yhden yhteyden, lukee UTF-8-rivin ja vastaa PING-viestiin PONG. Asiakkaan on lähetettävä rivinvaihto, jotta readLine päättyy. Yhdistetyn pistokkeen sulkeminen päättää vaihdon.',
      },
    },
    {
      section: '5.6',
      en: {
        title: 'Designing a protocol over a byte stream',
        paragraphs: [
          'Specify the sequence of messages, allowed operations, replies and errors, and the state each participant keeps. Define encoding and message boundaries. Text commands can use a delimiter with escaping rules. Binary frames can use a byte length and an agreed byte order.',
          'Stream reads can return part of a message or bytes belonging to multiple messages. Accumulate data until one full message is available. Bound sizes and timeouts, and define how retry and reconnection interact with request identifiers.',
        ],
        example: 'A two-byte length prefix says that a frame carries 12 bytes. The receiver first collects both prefix bytes, checks the length against its limit, then reads exactly 12 more bytes before decoding. The next byte begins the next frame.',
      },
      fi: {
        title: 'Protokollan suunnittelu tavuvirran päälle',
        paragraphs: [
          'Määrittele viestien järjestys, sallitut operaatiot, vastaukset ja virheet sekä osallistujien ylläpitämä tila. Sovi koodaus ja viestien rajat. Tekstikomento voi käyttää erotinta ja sen suojaussääntöjä. Binäärikehys voi käyttää tavupituutta ja yhteistä tavujärjestystä.',
          'Virran luku voi palauttaa osan viestistä tai usean viestin tavuja. Kerää dataa, kunnes yksi kokonainen viesti on käytettävissä. Rajaa koot ja aikakatkaisut sekä määritä, miten uusinta ja uudelleenyhdistäminen käyttävät pyyntötunnisteita.',
        ],
        example: 'Kaksitavuinen pituuskenttä kertoo kehyksen sisältävän 12 tavua. Vastaanottaja kerää ensin molemmat pituustavut, tarkistaa rajan ja lukee sitten tasan 12 tavua ennen tulkintaa. Seuraava tavu aloittaa seuraavan kehyksen.',
      },
    },
    {
      section: '5.7–5.9',
      en: {
        title: 'RPC, Java RMI, and XML-RPC',
        paragraphs: [
          'A remote procedure call represents an operation and its parameters in a message. The client stub marshals arguments. The server dispatches the request, reconstructs arguments, and marshals the result or error back. Remote calls still incur latency and can fail after the server has acted.',
          'Java RMI uses remote interfaces and can pass serializable values and references to remote objects. XML-RPC represents a method call and its parameters in XML over HTTP. Both approaches are method-oriented, with different data and interoperability contracts.',
        ],
        example: 'If reserveSeat returns late, the remote call timeout leaves open whether the server reserved the seat. A stable request identifier lets a retry recover the first result without applying the reservation twice.',
      },
      fi: {
        title: 'RPC, Java RMI ja XML-RPC',
        paragraphs: [
          'Etäproseduurikutsu esittää operaation ja sen parametrit viestinä. Asiakkaan tynkä pakkaa argumentit. Palvelin ohjaa pyynnön oikeaan kohteeseen, purkaa argumentit ja pakkaa tuloksen tai virheen vastausviestiin. Etäkutsu viivästyy verkossa ja voi epäonnistua senkin jälkeen, kun palvelin on toiminut.',
          'Java RMI käyttää etärajapintoja ja voi välittää sarjallistettavia arvoja sekä viittauksia etäolioihin. XML-RPC kuvaa metodikutsun ja parametrit XML:nä HTTP:n yli. Molemmat ovat metodikeskeisiä, mutta niiden tieto- ja yhteentoimivuussopimukset eroavat.',
        ],
        example: 'Jos reserveSeat-vastaus viivästyy, etäkutsun aikakatkaisu jättää varauksen tilan epävarmaksi. Pysyvä pyyntötunniste sallii tuloksen hakemisen uusinnalla tekemättä toista varausta.',
      },
    },
    {
      section: '5.10.1–5.10.2',
      en: {
        title: 'SOAP, REST, and HTTP message semantics',
        paragraphs: [
          'SOAP describes messages with XML envelopes and explicit operation contracts, often over HTTP. REST organizes an interface around resources and representations. In a typical RESTful HTTP API, GET reads, POST creates or submits work, and PUT replaces the state at a known resource URI.',
          'An HTTP request begins with a method and target. A response carries a status code. Headers describe representation and framing, and a body is present when the message calls for one. Use status codes and content types consistently so clients can interpret both success and failure.',
        ],
        example: 'The meeting service replies 201 Created with a Location header after POST /meetings. A successful PUT of availability can return 204 No Content. GET on the result URI returns 200 OK and a JSON representation when a decision is ready.',
      },
      fi: {
        title: 'SOAP, REST ja HTTP-viestien merkitys',
        paragraphs: [
          'SOAP kuvaa viestejä XML-kuorilla ja tarkalla operaatiosopimuksella, usein HTTP:n yli. REST jäsentää rajapinnan resurssien ja niiden esitysten ympärille. Tyypillisessä REST-rajapinnassa GET lukee, POST luo tai lähettää työn, ja PUT korvaa tunnetun URI:n resurssin tilan.',
          'HTTP-pyyntö alkaa metodilla ja kohteella. Vastaus sisältää tilakoodin. Otsakkeet kuvaavat esitystapaa ja viestin rajausta, ja runko kuuluu viestiin tarvittaessa. Käytä tilakoodeja ja sisältötyyppejä johdonmukaisesti, jotta asiakas voi tulkita onnistumisen ja virheen.',
        ],
        example: 'Tapaamispalvelu palauttaa POST /meetings -pyynnöstä vastauksen 201 Created ja Location-otsakkeen. Onnistunut aikojen PUT voi palauttaa 204 No Content. Tuloksen URI:n GET palauttaa päätöksen valmistuttua 200 OK ja JSON-esityksen.',
      },
    },
    {
      section: '5.10.3–5.11',
      en: {
        title: 'Browser requests, service architecture, and CORBA',
        paragraphs: [
          'AJAX describes browser code issuing requests without navigating away from the page. JSON responses are also common, sometimes called AJAJ in course material. The client handles loading, success, error, and stale responses explicitly.',
          'Service-oriented architecture composes independent services through contracts. CORBA is an object middleware design that describes interfaces with IDL and routes remote calls through an object request broker. These approaches illustrate different ways to make separately implemented components cooperate.',
        ],
        example: 'A meeting page fetches the result when a user selects a meeting. If the selection changes before an old reply comes back, the page associates replies with their original request and displays only the selected meeting.',
      },
      fi: {
        title: 'Selainpyynnöt, palveluarkkitehtuuri ja CORBA',
        paragraphs: [
          'AJAX kuvaa selaimessa tehtäviä pyyntöjä, joiden aikana sivulta ei siirrytä pois. Myös JSON-vastaukset ovat yleisiä, ja kurssimateriaalissa niistä käytetään nimeä AJAJ. Asiakas käsittelee erikseen latauksen, onnistumisen, virheen ja vanhentuneen vastauksen.',
          'Palvelukeskeinen arkkitehtuuri kokoaa itsenäisiä palveluita sopimusten avulla. CORBA on olioväliohjelmisto, joka kuvaa rajapinnat IDL:llä ja ohjaa etäkutsut oliopyyntövälittäjän kautta. Lähestymistavat osoittavat eri tapoja saada erikseen toteutetut komponentit yhteistyöhön.',
        ],
        example: 'Tapaamissivu hakee tuloksen, kun käyttäjä valitsee tapaamisen. Jos valinta muuttuu ennen vanhan vastauksen saapumista, sivu liittää vastaukset alkuperäisiin pyyntöihin ja näyttää valitun tapaamisen.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE5 · 28–31',
      en: {
        title: 'Specify a transport and an HTML fetch',
        prompt: 'A small application displays live room availability and also downloads a daily HTML summary to count links.',
        tasks: [
          'Choose delivery requirements for the live data and the daily download. Explain the role of host, IP address, and port.',
          'Describe how the client counts actual links in the document and handles an unsuccessful response.',
        ],
        solution: 'The daily file needs an ordered, complete stream, so HTTP over TCP is a reasonable fit. Live data can use a transport chosen for latency and tolerate stale samples. Resolve the host, connect to the service port, check the HTTP status, then parse HTML and count link elements that carry href.',
      },
      fi: {
        title: 'Määrittele kuljetus ja HTML-tiedoston haku',
        prompt: 'Pieni sovellus näyttää huoneiden saatavuuden reaaliajassa ja lataa päivittäisen HTML-yhteenvedon linkkien laskemiseen.',
        tasks: [
          'Valitse toimitusvaatimukset reaaliaikatiedolle ja päivittäiselle lataukselle. Selitä nimen, IP-osoitteen ja portin roolit.',
          'Kuvaa, miten asiakas laskee todelliset linkit ja käsittelee epäonnistuneen vastauksen.',
        ],
        solution: 'Päivätiedosto vaatii kokonaisen järjestetyn virran, joten HTTP TCP:n päällä sopii. Reaaliaikatiedolle voi valita viiveeseen sopivan kuljetuksen ja sietää vanhentuvia näytteitä. Selvitä osoite, yhdistä palveluporttiin, tarkista HTTP-tila, jäsennä HTML ja laske href-attribuutin sisältävät linkkielementit.',
      },
    },
    {
      reference: 'DE5 · 32 / DE6 · 33–36',
      en: {
        title: 'Recover a meeting client after reconnection',
        prompt: 'A client submits its available times. The connection closes just before it receives a reply. Later it needs the final result.',
        tasks: [
          'Define the request and response messages and identify which data goes in each.',
          'Show the reconnection sequence. Describe how a listening worker could also handle an unsolicited result while the main thread waits for input.',
        ],
        solution: 'Send a meeting ID, participant ID, request ID, and times. On reconnection, resend the same update ID or query its status. The server applies each logical update once. A dedicated reader can parse server messages and pass result notifications to the interface through a thread-safe queue.',
      },
      fi: {
        title: 'Palauta tapaamisasiakas yhteyskatkon jälkeen',
        prompt: 'Asiakas lähettää sopivat ajat. Yhteys katkeaa juuri ennen vastausta. Myöhemmin asiakas tarvitsee lopullisen tuloksen.',
        tasks: [
          'Määrittele pyyntö- ja vastausviestit ja nimeä kunkin sisältämä tieto.',
          'Näytä uudelleenyhdistämisen vaiheet. Kuvaa myös, miten kuuntelusäie voi vastaanottaa palvelimen itse lähettämän tuloksen pääsäikeen odottaessa syötettä.',
        ],
        solution: 'Lähetä tapaamis-, osallistuja- ja pyyntötunniste sekä ajat. Uudella yhteydellä toista sama päivitystunniste tai kysy sen tila. Palvelin toteuttaa saman loogisen päivityksen kerran. Erillinen lukija voi jäsentää viestit ja toimittaa tulosilmoitukset käyttöliittymälle säieturvallisen jonon kautta.',
      },
    },
    {
      reference: 'DE6 · 37–38',
      en: {
        title: 'Serve one document with an HTTP socket',
        prompt: 'Adapt the local socket example into a server that handles GET /hello and returns one fixed UTF-8 document.',
        tasks: [
          'Read the request line and headers. Send a status line, Content-Type, byte Content-Length, a blank line, then the body. Close the connection after the response.',
          'Check a supported path and an unknown path from a browser or HTTP client. Write down the expected status for each.',
        ],
        solution: 'Read the headers up to an empty line. For GET /hello send 200 OK with the document byte count and Connection: close. For an unknown path return 404 with a short response. Encode the body before counting bytes and use CRLF for the HTTP/1.1 header lines.',
      },
      fi: {
        title: 'Tarjoa yksi dokumentti HTTP-pistokkeella',
        prompt: 'Muuta paikallista pistoke-esimerkkiä siten, että palvelin käsittelee GET /hello -pyynnön ja palauttaa kiinteän UTF-8-dokumentin.',
        tasks: [
          'Lue pyyntörivi ja otsakkeet. Lähetä tilarivi, Content-Type, tavupituinen Content-Length, tyhjä rivi ja runko. Sulje yhteys vastauksen jälkeen.',
          'Testaa tuettu ja tuntematon polku selaimella tai HTTP-asiakkaalla. Kirjaa kummallekin odotettu tila.',
        ],
        solution: 'Lue otsakkeet tyhjään riviin asti. Palauta GET /hello -pyynnölle 200 OK, dokumentin tavumäärä ja Connection: close. Palauta tuntemattomalle polulle 404 ja lyhyt vastaus. Koodaa runko ennen tavujen laskua ja käytä HTTP/1.1-otsakeriveillä CRLF:ää.',
      },
    },
    {
      reference: 'DE7 · 39–41',
      en: {
        title: 'Design a REST resource and process JSON',
        prompt: 'A sample weekly menu gives the day, meal name, and component tags in JSON. A client wants complete vegan meals, with vegan components listed as a fallback.',
        tasks: [
          'Design a read URI for one restaurant and week. Identify the response status and media type.',
          'Describe how the client selects complete vegan meals and what it displays on days when only some components qualify.',
        ],
        solution: 'Use a GET such as /restaurants/r7/menus?week=2026-W18 and a 200 application/json response. For each day, accept a meal if it has at least one component and all its components carry the vegan tag. If no full meal qualifies, filter and display only tagged components.',
      },
      fi: {
        title: 'Suunnittele REST-resurssi ja käsittele JSONia',
        prompt: 'Esimerkkiviikkomenu antaa päivän, aterian nimen ja osien tunnisteet JSONina. Asiakas haluaa kokonaan vegaaniset ateriat ja varalle vegaanisten osien listan.',
        tasks: [
          'Suunnittele yhden ravintolan ja viikon luku-URI. Nimeä vastauksen tila ja mediatyyppi.',
          'Kuvaa, miten asiakas valitsee kokonaan vegaaniset ateriat ja mitä se näyttää päivinä, joina vain osa komponenteista sopii.',
        ],
        solution: 'Käytä esimerkiksi GET /restaurants/r7/menus?week=2026-W18 -pyyntöä ja 200 application/json -vastausta. Hyväksy ateria, kun siinä on ainakin yksi osa ja kaikilla osilla on vegaanitunniste. Jos yhtään kokonaista ateriaa ei löydy, suodata ja näytä vain tunnisteelliset osat.',
      },
    },
  ],
}
