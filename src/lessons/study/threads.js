export const threads = {
  topics: [
    {
      section: '2.1',
      en: {
        title: 'Scheduling and shared state',
        paragraphs: [
          'A schedule is an interleaving of thread operations. Each thread follows its own program order, while the scheduler can switch threads at points the program does not choose. A run that happens to work is evidence about one schedule.',
          'Shared mutable state needs a coordination rule. Keep the state local to one thread, pass immutable messages, or protect related accesses with the same synchronization mechanism. Write down the invariant first. A ticket counter, for example, must never fall below zero.',
        ],
        example: 'Checking for one remaining ticket and decrementing the counter are separate operations. If both threads check first, each can decide to sell the last ticket. Put both operations under the same lock or use an atomic operation that performs the whole reservation.',
      },
      fi: {
        title: 'Vuorotus ja jaettu tila',
        paragraphs: [
          'Suoritusjärjestys kertoo, miten säikeiden operaatiot lomittuvat. Kukin säie noudattaa omaa ohjelmajärjestystään, ja vuorottaja voi vaihtaa säiettä ohjelman kannalta ennalta määräämättömissä kohdissa. Onnistunut ajo kertoo yhden järjestyksen toimivuudesta.',
          'Jaettu muuttuva tila tarvitsee koordinointisäännön. Pidä tila yhden säikeen omistuksessa, välitä muuttumattomia viestejä tai suojaa toisiinsa liittyvät operaatiot samalla synkronointimekanismilla. Kirjoita ensin muuttumaton ehto. Lippulaskuri ei esimerkiksi saa mennä alle nollan.',
        ],
        example: 'Viimeisen lipun tarkistus ja laskurin pienennys ovat erillisiä operaatioita. Jos molemmat säikeet tarkistavat määrän ensin, kumpikin voi myydä viimeisen lipun. Suojaa molemmat samalla lukolla tai varaa lippu yhtenä atomisena operaationa.',
      },
    },
    {
      section: '2.2',
      code: [
        'class ThreadDemo {',
        '    public static void main(String[] args) throws InterruptedException {',
        '        Runnable task = () -> System.out.println(Thread.currentThread().getName());',
        '        Thread a = new Thread(task, "A");',
        '        Thread b = new Thread(task, "B");',
        '        a.start();',
        '        b.start();',
        '        a.join();',
        '        b.join();',
        '        System.out.println("Finished");',
        '    }',
        '}',
      ].join('\n'),
      en: {
        title: 'Java threads, start, join, and interruption',
        paragraphs: [
          'A Thread represents an execution. A Runnable represents work that can run on a thread. Calling start schedules a new execution. A direct run call executes the method on the calling thread. A thread can also subclass Thread and override run.',
          'A thread can be new, runnable, blocked on a monitor, waiting, timed waiting, or terminated. join waits for another thread to finish. sleep suspends the current thread for a time. interrupt requests cooperation, and an interruptible wait can report it through InterruptedException.',
        ],
        example: 'Run ThreadDemo several times. A and B may appear in either order. Finished must follow both because main waits for both joins. Calling b.run() in place of b.start() would execute that work on main.',
      },
      fi: {
        title: 'Java-säikeet, start, join ja keskeytys',
        paragraphs: [
          'Thread edustaa suoritusta. Runnable kuvaa työn, jonka säie voi suorittaa. start käynnistää uuden suorituksen. Suora run-kutsu suorittaa metodin kutsuvassa säikeessä. Säikeen voi toteuttaa myös perimällä Thread-luokan ja määrittelemällä run-metodin.',
          'Säie voi olla uusi, suoritusvalmis, monitorilukon estämä, odottava, määräajan odottava tai päättynyt. join odottaa toisen säikeen päättymistä. sleep pysäyttää nykyisen säikeen määräajaksi. interrupt pyytää säikeeltä yhteistyötä, ja keskeytettävä odotus voi ilmoittaa pyynnöstä InterruptedException-poikkeuksella.',
        ],
        example: 'Suorita ThreadDemo useita kertoja. A ja B voivat näkyä kummassa tahansa järjestyksessä. Finished tulee molempien jälkeen, koska main odottaa kumpaakin join-kutsulla. Jos korvaisit b.start()-kutsun kutsulla b.run(), työ tapahtuisi main-säikeessä.',
      },
    },
    {
      section: '2.3',
      en: {
        title: 'Monitor locks, atomic values, and semaphores',
        paragraphs: [
          'A synchronized block acquires the monitor of a particular Java object. All threads accessing the same invariant must use the same lock. Hold it across the complete read–modify–write operation. ReentrantLock provides explicit acquire and release and is usually released in a finally block.',
          'An AtomicInteger can allocate a distinct sequence number with getAndIncrement. It does not order a later action such as printing. A semaphore permits a fixed number of simultaneous holders. A semaphore with three permits can limit work to three concurrent users.',
        ],
        example: 'A gets sequence 4 and pauses. B gets 5 and prints first. Allocation is atomic even though output is out of order. For consecutive output, put sequence assignment and printing under a common lock or send numbered results to a dedicated writer.',
      },
      fi: {
        title: 'Monitorilukot, atomiset arvot ja semaforit',
        paragraphs: [
          'Javan synchronized-lohko ottaa tietyn olion monitorilukon. Samaa ehtoa käsittelevien säikeiden on käytettävä samaa lukkoa. Pidä lukko koko luku–muutos–kirjoitusoperaation ajan. ReentrantLock otetaan ja vapautetaan erikseen. Vapautus tehdään yleensä finally-lohkossa.',
          'AtomicInteger voi antaa yksilöllisen järjestysnumeron metodilla getAndIncrement. Myöhemmät toimet, kuten tulostus, voivat tapahtua eri järjestyksessä. Semafori sallii ennalta määrätyn määrän samanaikaisia haltijoita. Kolme lupaa voi rajoittaa työn kolmeen samanaikaiseen käyttäjään.',
        ],
        example: 'A saa numeron 4 ja jää tauolle. B saa numeron 5 ja tulostaa ensin. Numeron jakaminen on atomista, vaikka tulostusjärjestys vaihtuu. Haluttu tulostusjärjestys vaatii yhteisen lukon numerolle ja tulostukselle tai oman tulostussäikeen numeroiduille tuloksille.',
      },
    },
    {
      section: '2.3, 2.7',
      en: {
        title: 'Waiting for a condition and avoiding deadlock',
        paragraphs: [
          'Use a condition to state when a thread may proceed, such as queue size greater than zero. With a Java monitor, check the condition with a while loop. wait releases that monitor and reacquires it before returning. Recheck the condition after waking because another thread may have changed it. notifyAll wakes waiters so they can compete to reacquire the monitor.',
          'Deadlock can occur when each thread in a cycle holds a lock needed by the next thread. A common lock order prevents that cycle. Keep protected regions small and avoid waiting on unrelated work while holding a lock.',
        ],
        example: 'If A locks the catalogue then the reservation table, and B locks them in the reverse order, each can hold one lock while waiting for the other. Have both threads acquire catalogue before reservations.',
      },
      fi: {
        title: 'Ehdon odottaminen ja lukkiuman välttäminen',
        paragraphs: [
          'Määrittele ehto, joka sallii säikeen etenemisen, esimerkiksi että jonossa on ainakin yksi alkio. Tarkista ehto Javan monitorissa while-silmukassa. wait vapauttaa monitorin ja ottaa sen uudelleen ennen paluuta. Tarkista ehto heräämisen jälkeen, koska toinen säie on voinut muuttaa sitä. notifyAll herättää odottajat kilpailemaan monitorista.',
          'Lukkiuma voi syntyä, kun jokainen syklin säie pitää lukkoa, jota seuraava tarvitsee. Yhteinen lukitusjärjestys estää tämän syklin. Pidä kriittiset osat lyhyinä ja vältä muun työn odottamista lukon ollessa hallussa.',
        ],
        example: 'A lukitsee luettelon ennen varaustaulua ja B tekee päinvastoin. Molemmat voivat pitää yhtä lukkoa ja odottaa toista. Määrää, että kummankin on lukittava luettelo ensin.',
      },
    },
    {
      section: '2.4',
      en: {
        title: 'Queues and executors',
        paragraphs: [
          'A thread-safe queue is a handoff point between producer and consumer. A bounded BlockingQueue limits how far the producer can get ahead. put waits for space and take waits for an item. Timed operations give the caller a way to handle a long wait.',
          'An ExecutorService schedules tasks on a managed set of threads. Submit Runnable for work with side effects or Callable for a result available through a Future. Decide how the producers, consumers, and executor all stop when the application shuts down.',
        ],
        example: 'A key-reader puts a timestamped key in an ArrayBlockingQueue. A scoring thread takes records in order and computes reaction times. On shutdown, send an explicit end marker or interrupt the waiting worker and handle its exit.',
      },
      fi: {
        title: 'Jonot ja tehtävien suorituspalvelut',
        paragraphs: [
          'Säieturvallinen jono on tuottajan ja kuluttajan luovutuspiste. Rajattu BlockingQueue rajoittaa, kuinka paljon tuottaja voi edetä kuluttajan edelle. put odottaa tilaa ja take alkiota. Aikarajalliset operaatiot antavat kutsujalle tavan käsitellä pitkää odotusta.',
          'ExecutorService ajoittaa tehtäviä hallitulle säiejoukolle. Runnable sopii sivuvaikutuksia tekevälle työlle ja Callable Future-olion kautta saatavalle tulokselle. Suunnittele, miten tuottajat, kuluttajat ja suorituspalvelu sammuvat sovelluksen päättyessä.',
        ],
        example: 'Näppäinsäie lisää aikaleimatun painalluksen ArrayBlockingQueue-jonoon. Pisteitä laskeva säie ottaa tiedot järjestyksessä ja laskee reaktioajat. Lopetettaessa lähetä erillinen loppumerkki tai keskeytä odottava säie ja käsittele sen päättyminen.',
      },
    },
    {
      section: '2.5–2.6',
      en: {
        title: 'Processes and threads across languages',
        paragraphs: [
          'On POSIX systems, fork creates a child process. An exec operation replaces the process image, and a parent can use wait to collect a child’s termination status. For concurrent work in one shared address space, POSIX threads use pthread_create and mutexes. C++ provides abstractions such as std::thread and std::mutex.',
          'Browser JavaScript can interleave asynchronous callbacks on its event loop. Web Workers can run computations separately and exchange messages with the page. Across languages, choose between isolation with messaging and shared state with explicit synchronization.',
        ],
        example: 'For a browser image filter, use a worker to process input pixels and send the result back. Keep interface updates on the main thread. The user can keep interacting while the worker runs.',
      },
      fi: {
        title: 'Prosessit ja säikeet eri kielissä',
        paragraphs: [
          'POSIX-järjestelmässä fork luo lapsiprosessin. exec korvaa prosessin ohjelman, ja vanhempi voi hakea lapsen päättymistilan wait-kutsulla. Yhteisessä osoiteavaruudessa POSIX-säikeet käyttävät pthread_create-kutsua ja mutexeja. C++ tarjoaa muun muassa std::thread- ja std::mutex-abstraktiot.',
          'Selaimen JavaScript voi lomittaa asynkronisia takaisinkutsuja tapahtumasilmukassa. Web Worker voi laskea erikseen ja vaihtaa viestejä sivun kanssa. Eri kielissä voi valita eristetyn tilan ja viestinnän tai jaetun tilan ja erillisen synkronoinnin.',
        ],
        example: 'Tee selaimen kuvasuodatus workerissa ja palauta käsitellyt pikselit viestillä. Päivitä käyttöliittymä pääsäikeessä. Käyttäjä voi jatkaa toimintaa workerin laskennan aikana.',
      },
    },
    {
      section: '2.8',
      en: {
        title: 'Safety, progress, and lock primitives',
        paragraphs: [
          'Mutual exclusion is a safety condition that permits one owner at a time. Deadlock freedom means someone can make progress when threads contend. Starvation freedom is stronger and requires each waiting participant to make progress eventually.',
          'An atomic test-and-set reads the old value and sets a new one as one hardware operation. It can choose one winner from competing threads. Software algorithms such as Dekker’s algorithm illustrate coordination using shared flags and a turn. Application code normally uses the language’s tested lock implementation.',
        ],
        example: 'A simple spinlock can preserve mutual exclusion while one unlucky thread repeatedly loses the race to acquire it. The safety claim holds and the starvation-freedom claim fails.',
      },
      fi: {
        title: 'Turvallisuus, eteneminen ja lukituksen alkeisoperaatiot',
        paragraphs: [
          'Keskinäinen poissulkeminen on turvallisuusehto, joka sallii lukolle kerrallaan yhden haltijan. Lukkiumavapaus tarkoittaa, että ainakin joku voi edetä kilpailutilanteessa. Nälkiintymättömyys on vahvempi ehto ja takaa etenemisen jokaiselle odottajalle.',
          'Atominen test-and-set lukee vanhan arvon ja asettaa uuden yhtenä laitteisto-operaationa. Se voi valita kilpailijoista yhden voittajan. Dekkerin algoritmin kaltaiset ohjelmistoratkaisut havainnollistavat yhteistyötä jaetuilla lipuilla ja vuorolla. Sovelluskoodi käyttää yleensä kielen valmista, testattua lukkoa.',
        ],
        example: 'Yksinkertainen aktiivisesti odottava lukko voi säilyttää keskinäisen poissulkemisen, vaikka sama säie häviää lukituskilpailun toistuvasti. Turvallisuusehto toteutuu, mutta nälkiintymättömyys ei toteudu.',
      },
    },
  ],
  exercises: [
    {
      reference: 'DE1 · 5–8',
      en: {
        title: 'Build a bounded family of Java threads',
        prompt: 'Make a Runnable that prints its name and then tries to start two children. Limit the total number of started tasks to eight, including the root.',
        tasks: [
          'Give each child a name derived from its parent. Use start and wait for children with join.',
          'Make checking and reserving a free slot a single atomic action. Test the number of starts over several runs.',
        ],
        solution: 'Keep a single shared counter protected by a common lock. Under that lock, check the limit and reserve one slot for each child you will actually start. Release the lock before start or join. Each parent joins its own children, so joining the root waits for all descendants.',
      },
      fi: {
        title: 'Rakenna rajattu Java-säikeiden sukupuu',
        prompt: 'Tee Runnable, joka tulostaa nimensä ja yrittää käynnistää kaksi lasta. Rajaa käynnistettyjen tehtävien kokonaismäärä kahdeksaan juuritehtävä mukaan lukien.',
        tasks: [
          'Johda lapsen nimi vanhemman nimestä. Käytä start-kutsua ja odota lapsia join-kutsuilla.',
          'Tee vapaan paikan tarkistuksesta ja varaamisesta yksi atominen toiminto. Testaa käynnistysten määrä usealla ajolla.',
        ],
        solution: 'Pidä yksi yhteisellä lukolla suojattu laskuri. Tarkista raja lukon alla ja varaa yksi paikka jokaiselle todella käynnistettävälle lapselle. Vapauta lukko ennen start- tai join-kutsua. Kukin vanhempi odottaa omia lapsiaan, joten juuren odottaminen odottaa kaikkia jälkeläisiä.',
      },
    },
    {
      reference: 'DE2 · 9–14',
      en: {
        title: 'Separate uniqueness from output ordering',
        prompt: 'Six workers fetch a sequence number and print one completed result. They pause for different durations between these operations.',
        tasks: [
          'Draw a valid schedule where 2 prints before 1 even though the numbers are unique.',
          'Design a way to print in order and stop after the first three results. Describe how waiting workers learn they can exit.',
        ],
        solution: 'Worker A can fetch 1 and pause while B fetches 2 and prints. A single consumer can buffer completed results by number and emit 1, 2, 3 in order. After the third output it can publish a stop signal and interrupt interruptible waits. Workers cooperate with that signal and the main thread joins them.',
      },
      fi: {
        title: 'Erota yksilöllisyys tulostusjärjestyksestä',
        prompt: 'Kuusi työntekijää hakee järjestysnumeron ja tulostaa tuloksensa. Toimintojen välissä on eripituisia taukoja.',
        tasks: [
          'Piirrä sallittu järjestys, jossa 2 tulostuu ennen numeroa 1, vaikka numerot ovat yksilöllisiä.',
          'Suunnittele tapa tulostaa järjestyksessä ja lopettaa kolmen tuloksen jälkeen. Kuvaa, miten odottajat kuulevat lopetuksesta.',
        ],
        solution: 'A voi hakea numeron 1 ja jäädä tauolle, kun B hakee numeron 2 ja tulostaa. Yksi kuluttaja voi puskuroida tulokset numeron mukaan ja tulostaa 1, 2 ja 3 tässä järjestyksessä. Kolmannen tulostuksen jälkeen se lähettää lopetusviestin ja voi keskeyttää keskeytettävät odotukset. Työntekijät noudattavat viestiä ja pääsäie odottaa niitä.',
      },
    },
    {
      reference: 'DE3 · 18–20',
      en: {
        title: 'Design the reaction-game queue',
        prompt: 'A prompt thread publishes a letter and a timestamp. A second worker records typed input. The first round allows three seconds and later rounds shrink the interval by 10 percent.',
        tasks: [
          'Define the records sent between threads and how a response is matched to the correct round.',
          'Describe how every worker terminates when a round times out.',
        ],
        solution: 'Use a round identifier, letter, and monotonic timestamp in each prompt. Associate responses with the active round and ignore stale records. A coordinator owns the deadline and the score. On timeout it sends an end signal, wakes interruptible waiters, and joins the workers after they exit.',
      },
      fi: {
        title: 'Suunnittele reaktiopelin jono',
        prompt: 'Kehotesäie julkaisee kirjaimen ja aikaleiman. Toinen työntekijä lukee näppäinsyötteen. Ensimmäisen kierroksen aikaraja on kolme sekuntia, ja seuraavilla kierroksilla se lyhenee 10 prosenttia.',
        tasks: [
          'Määrittele säikeiden väliset tietueet ja tapa yhdistää vastaus oikeaan kierrokseen.',
          'Kuvaa, miten kaikki työntekijät päättyvät kierroksen aikakatkaisuun.',
        ],
        solution: 'Lisää kehotteeseen kierrostunniste, kirjain ja monotoninen aikaleima. Liitä vastaukset aktiiviseen kierrokseen ja jätä vanhat tietueet käsittelemättä. Koordinoija omistaa määräajan ja tuloksen. Aikakatkaisussa se lähettää lopetussignaalin, herättää keskeytettävät odottajat ja odottaa työntekijöiden päättymistä.',
      },
    },
  ],
}
