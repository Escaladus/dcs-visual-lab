export const text = {
  en: {
    overview: 'Course overview',
    courseTitle: 'Distributed and Concurrent Systems',
    introduction: 'Explore how threads share resources, how computers exchange messages, and how distributed systems keep working when parts fail.',
    start: 'Start with the basics',
    chapters: 'Course chapters',
    menu: 'Chapters',
    skip: 'Skip to content',
    language: 'Language',
    topics: 'In this chapter',
    previous: 'Previous chapter',
    next: 'Next chapter',
    chapterNavigation: 'Adjacent chapters',
  },
  fi: {
    overview: 'Kurssin yleiskatsaus',
    courseTitle: 'Hajautetut ja samanaikaiset järjestelmät',
    introduction: 'Tutustu siihen, miten säikeet käyttävät yhteisiä resursseja, miten tietokoneet vaihtavat viestejä ja miten hajautetut järjestelmät jatkavat toimintaansa vikatilanteissa.',
    start: 'Aloita perusteista',
    chapters: 'Kurssin luvut',
    menu: 'Luvut',
    skip: 'Siirry sisältöön',
    language: 'Kieli',
    topics: 'Tässä luvussa',
    previous: 'Edellinen luku',
    next: 'Seuraava luku',
    chapterNavigation: 'Edellinen ja seuraava luku',
  },
}

export const chapters = [
  {
    id: 'introduction',
    en: {
      title: 'Distributed systems basics',
      summary: 'Distinguish concurrency, parallelism, and distribution by looking at how work is divided and coordinated.',
      topics: ['Processes and threads', 'Parallel execution', 'Independent computers and message passing'],
    },
    fi: {
      title: 'Hajautettujen järjestelmien perusteet',
      summary: 'Erota samanaikaisuus, rinnakkaisuus ja hajautus tarkastelemalla työn jakoa ja koordinointia.',
      topics: ['Prosessit ja säikeet', 'Rinnakkainen suoritus', 'Itsenäiset tietokoneet ja viestinvälitys'],
    },
  },
  {
    id: 'concurrency',
    en: {
      title: 'Concurrent programming',
      summary: 'See how the order of thread operations affects shared data and how synchronization protects critical sections.',
      topics: ['Java threads and their lifecycle', 'Race conditions and locks', 'Communication through queues'],
    },
    fi: {
      title: 'Samanaikainen ohjelmointi',
      summary: 'Tarkastele, miten säikeiden suoritusjärjestys vaikuttaa jaettuun tietoon ja miten synkronointi suojaa kriittisiä osia.',
      topics: ['Java-säikeet ja niiden elinkaari', 'Kilpailutilanteet ja lukot', 'Viestintä jonojen avulla'],
    },
  },
  {
    id: 'design-principles',
    en: {
      title: 'Design principles',
      summary: 'Explore how communication, replication, and partial failures shape the design of a distributed service.',
      topics: ['Performance and scalability', 'Reliability and fault tolerance', 'Distribution transparency'],
    },
    fi: {
      title: 'Suunnitteluperiaatteet',
      summary: 'Tutki, miten viestintä, replikointi ja osittaiset viat vaikuttavat hajautetun palvelun suunnitteluun.',
      topics: ['Suorituskyky ja skaalautuvuus', 'Luotettavuus ja vikasietoisuus', 'Hajautuksen läpinäkyvyys'],
    },
  },
  {
    id: 'logical-clocks',
    en: {
      title: 'Models, failures, and logical clocks',
      summary: 'Compare system architectures and trace the causal order of events when processes have no shared clock.',
      topics: ['Client–server and peer-to-peer architectures', 'Interaction and failure models', 'Lamport and vector clocks'],
    },
    fi: {
      title: 'Mallit, viat ja loogiset kellot',
      summary: 'Vertaa järjestelmäarkkitehtuureja ja seuraa tapahtumien syyjärjestystä, kun prosesseilla ei ole yhteistä kelloa.',
      topics: ['Asiakas–palvelin- ja vertaisverkkoarkkitehtuurit', 'Vuorovaikutus- ja vikamallit', 'Lamportin kellot ja vektorikellot'],
    },
  },
  {
    id: 'communication',
    en: {
      title: 'Network communication',
      summary: 'Follow a request through the network and see how transport protocols and application interfaces serve different needs.',
      topics: ['IP addressing and protocol layers', 'TCP, UDP, and sockets', 'Remote calls, HTTP, and REST'],
    },
    fi: {
      title: 'Verkkoviestintä',
      summary: 'Seuraa pyynnön kulkua verkossa ja tutustu siihen, mihin kuljetusprotokollia ja sovellusrajapintoja käytetään.',
      topics: ['IP-osoitteet ja protokollakerrokset', 'TCP, UDP ja pistokkeet', 'Etäkutsut, HTTP ja REST'],
    },
  },
  {
    id: 'security',
    en: {
      title: 'Security',
      summary: 'Identify where a distributed service needs to protect messages, verify identities, and enforce permissions.',
      topics: ['Confidentiality and integrity', 'Authentication and authorization', 'Encryption and TLS'],
    },
    fi: {
      title: 'Tietoturva',
      summary: 'Tunnista, missä hajautetun palvelun on suojattava viestit, todennettava käyttäjät ja tarkistettava käyttöoikeudet.',
      topics: ['Luottamuksellisuus ja eheys', 'Todentaminen ja valtuuttaminen', 'Salaus ja TLS'],
    },
  },
  {
    id: 'distributed-algorithms',
    en: {
      title: 'Distributed algorithms',
      summary: 'Trace how independent processes coordinate access, deliver group messages, and agree to commit a transaction.',
      topics: ['Distributed mutual exclusion', 'Multicast delivery order', 'Distributed transactions and two-phase commit'],
    },
    fi: {
      title: 'Hajautetut algoritmit',
      summary: 'Seuraa, miten itsenäiset prosessit koordinoivat resurssien käyttöä, toimittavat ryhmäviestejä ja sopivat tapahtuman vahvistamisesta.',
      topics: ['Hajautettu keskinäinen poissulkeminen', 'Ryhmäviestien toimitusjärjestys', 'Hajautetut tapahtumat ja kaksivaiheinen vahvistus'],
    },
  },
]
