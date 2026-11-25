export const security = {
  topics: [
    {
      section: '6 · 103–107',
      en: {
        title: 'Secure channels, proof of identity, and fresh messages',
        paragraphs: [
          'A secure channel combines several goals. Keep content confidential, detect unauthorized changes, and establish the identities required by the application. A server can prove control of a key without revealing it. A trusted authority can vouch for an identity or issue a ticket used to establish a session key.',
          'Freshness matters alongside identity. A nonce is a value used once, for example a random challenge in a session. A response bound to that challenge shows participation in this exchange. Identifiers or sequence information can also help an application recognize duplicates.',
        ],
        example: 'A service gives a client a fresh challenge and verifies an authenticated response tied to it. A recorded answer to an earlier challenge does not prove that the same client is present now.',
      },
      fi: {
        title: 'Suojatut kanavat, identiteetin todistus ja viestin tuoreus',
        paragraphs: [
          'Suojattu kanava yhdistää useita tavoitteita. Sisältö pidetään luottamuksellisena, luvattomat muutokset havaitaan ja sovelluksen vaatimat identiteetit todennetaan. Palvelin voi osoittaa hallitsevansa avainta paljastamatta sitä. Luotettu taho voi vahvistaa identiteetin tai myöntää istuntoavaimen muodostamiseen käytetyn lipun.',
          'Identiteetin lisäksi viestin tuoreus on tärkeää. Kertakäyttöarvo eli nonce voi olla istunnon satunnainen haaste. Haasteeseen sidottu vastaus osoittaa osallistumisen juuri tähän vaihtoon. Tunnisteet tai järjestystieto voivat auttaa sovellusta tunnistamaan toistot.',
        ],
        example: 'Palvelu antaa asiakkaalle uuden haasteen ja tarkistaa siihen sidotun todennetun vastauksen. Aikaisempaan haasteeseen tallennettu vastaus ei osoita, että sama asiakas on nyt mukana.',
      },
    },
    {
      section: '6.1 · 108–109',
      en: {
        title: 'Symmetric keys, public keys, and signatures',
        paragraphs: [
          'Symmetric encryption uses shared key material to encrypt and decrypt. It is efficient for bulk data, but participants need a secure way to obtain the key. Public-key schemes use a public and private key pair and support tasks such as key establishment or digital signatures.',
          'A signature is created with a private signing key and verified with a corresponding public key. It can show authenticity and integrity when the verifier trusts the key’s association with the signer. A certificate binds identity information to a public key through a trusted issuer.',
        ],
        example: 'Two clients can verify a signed course handout using the same public key, while the signer’s private key stays with the publisher. The document remains readable. The signature is evidence about who approved those bytes.',
      },
      fi: {
        title: 'Symmetriset avaimet, julkiset avaimet ja allekirjoitukset',
        paragraphs: [
          'Symmetrinen salaus käyttää yhteistä avainmateriaalia salaamiseen ja purkamiseen. Se sopii suuren datamäärän käsittelyyn, mutta osallistujat tarvitsevat turvallisen tavan saada avain. Julkisen avaimen menetelmät käyttävät avainparia esimerkiksi avaimen muodostamiseen tai digitaalisiin allekirjoituksiin.',
          'Allekirjoitus luodaan yksityisellä allekirjoitusavaimella ja tarkistetaan vastaavalla julkisella avaimella. Kun tarkistaja luottaa avaimen ja allekirjoittajan väliseen yhteyteen, allekirjoitus voi todentaa alkuperän ja eheyden. Varmenne sitoo identiteettitiedon julkiseen avaimeen luotetun myöntäjän avulla.',
        ],
        example: 'Kaksi asiakasta voi tarkistaa allekirjoitetun luentomonisteen samalla julkisella avaimella. Yksityinen avain pysyy julkaisijalla ja itse dokumentti on edelleen luettavissa. Allekirjoitus kertoo, kuka hyväksyi kyseiset tavut.',
      },
    },
    {
      section: '6.1 · 109–110',
      en: {
        title: 'Hashes, message authentication, and key agreement',
        paragraphs: [
          'A cryptographic hash produces a digest of data. A digest can help detect changes when the expected value comes from a trusted source. A message authentication code uses a shared secret so a participant with the secret can verify integrity and authenticity.',
          'Diffie–Hellman is a way to derive a common shared secret from each participant’s private input and exchanged public values. It must be combined with authentication when the parties need assurance about whose public values they received.',
        ],
        example: 'A trusted download page publishes a file digest. Comparing the downloaded file’s digest to that value detects accidental changes. When a publisher needs independent verification of origin, a digital signature can bind the digest to a known signing key.',
      },
      fi: {
        title: 'Tiivisteet, viestin todennus ja avaimesta sopiminen',
        paragraphs: [
          'Kryptografinen tiiviste kuvaa dataa määräpituisella arvolla. Se voi auttaa muutosten havaitsemisessa, jos odotettu arvo saadaan luotetusta lähteestä. Viestin todennuskoodi käyttää yhteistä salaisuutta, jonka haltija voi tarkistaa eheyden ja alkuperän.',
          'Diffie–Hellman johtaa yhteisen salaisuuden kunkin osallistujan yksityisestä syötteestä ja vaihdetuista julkisista arvoista. Siihen on yhdistettävä todennus, jos osapuolten on varmistuttava julkisten arvojen lähettäjästä.',
        ],
        example: 'Luotettu lataussivu julkaisee tiedoston tiivisteen. Latauksen tiivisteen vertaaminen siihen paljastaa tahattomat muutokset. Jos julkaisijan alkuperä on voitava tarkistaa itsenäisesti, digitaalinen allekirjoitus voi sitoa tiivisteen tunnettuun avaimeen.',
      },
    },
    {
      section: '6.2',
      en: {
        title: 'What a TLS connection establishes',
        paragraphs: [
          'During setup the parties agree on cryptographic parameters, authenticate the endpoint identities required by the connection, and derive traffic keys. A web browser normally validates the certificate chain and checks that the certificate covers the requested host name.',
          'The established channel encrypts and authenticates application traffic. HTTPS uses this protection for HTTP messages. Application permissions are still checked by the service. A TLS-terminating proxy becomes one of the endpoints and can read traffic at that boundary.',
        ],
        example: 'A browser connects to meeting.example. The certificate check binds the connection to that host. If a reverse proxy terminates TLS, the service designer separately decides how to protect the proxy-to-service hop.',
      },
      fi: {
        title: 'Mitä TLS-yhteys muodostaa',
        paragraphs: [
          'Muodostuksessa osapuolet sopivat salausparametreista, todentavat yhteyden vaatimat päätepisteiden identiteetit ja johtavat liikenneavaimet. Selain tarkistaa yleensä varmenneketjun ja sen, että varmenne kattaa pyydetyn isäntänimen.',
          'Muodostettu kanava salaa ja todentaa sovellusliikenteen. HTTPS käyttää suojaa HTTP-viesteille. Palvelu tarkistaa edelleen sovelluksen käyttöoikeudet. TLS:n päättävä välityspalvelin on yksi päätepisteistä ja voi lukea liikennettä sillä rajalla.',
        ],
        example: 'Selain yhdistää osoitteeseen meeting.example. Varmenteen tarkistus sitoo yhteyden kyseiseen nimeen. Jos käänteinen välityspalvelin päättää TLS:n, suunnittelija päättää erikseen, miten väli palvelulle suojataan.',
      },
    },
    {
      section: '6.3',
      en: {
        title: 'Java security APIs and standard libraries',
        paragraphs: [
          'The java.security API includes digests and signatures. The javax.crypto API includes ciphers and message authentication, and javax.net.ssl provides TLS abstractions. A cryptographic provider implements the algorithm selected by name for each operation.',
          'Use a platform TLS client with its normal certificate and host verification for HTTPS. Keep protocol choices, key handling, and certificate trust explicit. A data checksum, a signature, and an encrypted payload answer separate questions.',
        ],
        example: 'For a local exercise, compute a file’s digest with MessageDigest to compare against an expected digest. For sending that file to an authenticated service, use an HTTPS client. The two operations serve different purposes.',
      },
      fi: {
        title: 'Javan tietoturvarajapinnat ja vakiokirjastot',
        paragraphs: [
          'Javan java.security-rajapinta sisältää tiivisteet ja allekirjoitukset. Rajapinta javax.crypto tarjoaa salaimet ja viestin todennuksen, ja javax.net.ssl tarjoaa TLS-abstraktiot. Kryptografiapalveluntarjoaja toteuttaa operaatiolle nimellä valitun algoritmin.',
          'Käytä HTTPS:ään alustan TLS-asiakasta tavallisella varmenne- ja isäntänimitarkistuksella. Tee protokollavalinnat, avainten käsittely ja varmenneluottamus selkeiksi. Tarkistussumma, allekirjoitus ja salattu hyötykuorma vastaavat eri kysymyksiin.',
        ],
        example: 'Paikallisessa harjoituksessa tiedoston tiivisteen voi laskea MessageDigestillä ja verrata odotettuun arvoon. Tiedoston lähettämiseen todennettuun palveluun käytetään HTTPS-asiakasta. Toimet palvelevat eri tarkoituksia.',
      },
    },
    {
      section: '6.4',
      en: {
        title: 'Practical security checks for the meeting service',
        paragraphs: [
          'Define what a participant, organizer, and service operator can read and change. Validate the shape and size of requests at the boundary. Prefer narrowly scoped permissions and keep sensitive identifiers or meeting contents out of unnecessary logs.',
          'Keep key material separate from the source code and plan replacement and expiry. Monitor service health and unusual access while preserving data minimization. Test authorized and unauthorized requests against the same endpoints.',
        ],
        example: 'A visitor can log in and still lack access to m42. The server looks up the caller’s participation before returning the decision, and a test verifies that an unauthorized request gets a permission error with no meeting data.',
      },
      fi: {
        title: 'Tapaamispalvelun käytännön tietoturvatarkistukset',
        paragraphs: [
          'Määrittele, mitä osallistuja, järjestäjä ja ylläpitäjä saavat lukea ja muuttaa. Tarkista pyynnön muoto ja koko järjestelmän rajalla. Suosi rajattuja oikeuksia ja jätä arkaluonteiset tunnisteet tai tapaamissisällöt pois tarpeettomista lokeista.',
          'Pidä avainmateriaali erillään lähdekoodista ja suunnittele sen vaihto ja vanheneminen. Seuraa palvelun terveyttä ja poikkeavia käyttötilanteita keräten vain tarpeellisen tiedon. Testaa samojen päätepisteiden oikeutetut ja oikeudettomat pyynnöt.',
        ],
        example: 'Vierailija voi kirjautua sisään ilman oikeutta m42:een. Palvelin tarkistaa osallistumisen ennen päätöksen palauttamista. Testi varmistaa, että oikeudeton pyyntö saa käyttöoikeusvirheen ilman tapaamistietoa.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE5 · 27',
      en: {
        title: 'Make a threat and protection table',
        prompt: 'The meeting service accepts changes to availability and returns a decision. Consider the browser, the network, the service, and its logs.',
        tasks: [
          'For confidentiality, integrity, and availability, name one concrete failure and the component that can prevent or limit it.',
          'Explain where to verify identity and where to check membership.',
        ],
        solution: 'TLS protects the network exchange, the server authenticates the caller and checks membership, and input validation protects the operation’s meaning. Limit work that each request can consume and redact meeting content from general logs. These checks cover different boundaries.',
      },
      fi: {
        title: 'Tee uhka- ja suojaustaulukko',
        prompt: 'Tapaamispalvelu ottaa vastaan aikamuutoksia ja palauttaa päätöksen. Tarkastele selainta, verkkoa, palvelua ja sen lokeja.',
        tasks: [
          'Nimeä luottamuksellisuudelle, eheydelle ja saatavuudelle yksi konkreettinen vika ja komponentti, joka voi estää tai rajata sen.',
          'Selitä, missä identiteetti todennetaan ja missä osallistuminen tarkistetaan.',
        ],
        solution: 'TLS suojaa verkkoviestinnän. Palvelin todentaa pyytäjän, tarkistaa osallistumisen ja varmistaa syötteen oikeellisuuden. Rajaa yhden pyynnön käyttämä työ ja poista tapaamisen sisältö yleisistä lokeista. Tarkistukset kattavat eri rajat.',
      },
    },
    {
      reference: 'DE5 · 27 / DE7 · 41',
      en: {
        title: 'Test a permission boundary',
        prompt: 'A signed-in organizer can close meeting m42, a participant can submit their own times, and a visitor can read only public information.',
        tasks: [
          'Write one allowed and one denied request for each privileged operation.',
          'Name what the denied response and its log entry can reveal without exposing the protected data.',
        ],
        solution: 'Test organizer close versus participant close, then own availability versus another person’s availability. The service can return a permission status with a request ID. The internal log can record the outcome and reason without including the meeting result or submitted times.',
      },
      fi: {
        title: 'Testaa käyttöoikeusraja',
        prompt: 'Kirjautunut järjestäjä voi sulkea m42:n, osallistuja voi ilmoittaa omat aikansa ja vierailija saa lukea julkista tietoa.',
        tasks: [
          'Kirjoita yksi sallittu ja yksi hylättävä pyyntö kummallekin rajatulle toiminnolle.',
          'Nimeä, mitä hylkäysvastaus ja sen lokimerkintä voivat paljastaa suojatun tiedon pysyessä yksityisenä.',
        ],
        solution: 'Vertaa järjestäjän ja osallistujan sulkemispyyntöjä. Vertaa sitten omien ja toisen osallistujan aikojen päivitystä. Palvelu voi palauttaa käyttöoikeustilan ja pyyntötunnisteen. Sisäinen loki voi kirjata tuloksen ja syyn ilman tapaamisaikaa tai ilmoitettuja aikoja.',
      },
    },
  ],
}
