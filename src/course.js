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
    },
    fi: {
      title: 'Hajautettujen järjestelmien perusteet',
      summary: 'Erota samanaikaisuus, rinnakkaisuus ja hajautus tarkastelemalla työn jakoa ja koordinointia.',
    },
  },
  {
    id: 'concurrency',
    en: {
      title: 'Concurrent programming',
      summary: 'See how the order of thread operations affects shared data and how synchronization protects critical sections.',
    },
    fi: {
      title: 'Samanaikainen ohjelmointi',
      summary: 'Tarkastele, miten säikeiden suoritusjärjestys vaikuttaa jaettuun tietoon ja miten synkronointi suojaa kriittisiä osia.',
    },
  },
  {
    id: 'design-principles',
    en: {
      title: 'Design principles',
      summary: 'Explore how communication, replication, and partial failures shape the design of a distributed service.',
    },
    fi: {
      title: 'Suunnitteluperiaatteet',
      summary: 'Tutki, miten viestintä, replikointi ja osittaiset viat vaikuttavat hajautetun palvelun suunnitteluun.',
    },
  },
  {
    id: 'logical-clocks',
    en: {
      title: 'Models, failures, and logical clocks',
      summary: 'Compare system architectures and trace the causal order of events when processes have no shared clock.',
    },
    fi: {
      title: 'Mallit, viat ja loogiset kellot',
      summary: 'Vertaa järjestelmäarkkitehtuureja ja seuraa tapahtumien syyjärjestystä, kun prosesseilla ei ole yhteistä kelloa.',
    },
  },
  {
    id: 'communication',
    en: {
      title: 'Network communication',
      summary: 'Follow a request through the network and see how transport protocols and application interfaces serve different needs.',
    },
    fi: {
      title: 'Verkkoviestintä',
      summary: 'Seuraa pyynnön kulkua verkossa ja tutustu siihen, mihin kuljetusprotokollia ja sovellusrajapintoja käytetään.',
    },
  },
  {
    id: 'security',
    en: {
      title: 'Security',
      summary: 'Identify where a distributed service needs to protect messages, verify identities, and enforce permissions.',
    },
    fi: {
      title: 'Tietoturva',
      summary: 'Tunnista, missä hajautetun palvelun on suojattava viestit, todennettava käyttäjät ja tarkistettava käyttöoikeudet.',
    },
  },
  {
    id: 'distributed-algorithms',
    en: {
      title: 'Distributed algorithms',
      summary: 'Trace how independent processes coordinate access, deliver group messages, and agree to commit a transaction.',
    },
    fi: {
      title: 'Hajautetut algoritmit',
      summary: 'Seuraa, miten itsenäiset prosessit koordinoivat resurssien käyttöä, toimittavat ryhmäviestejä ja sopivat tapahtuman vahvistamisesta.',
    },
  },
]
