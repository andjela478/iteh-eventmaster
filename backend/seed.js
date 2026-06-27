const sequelize = require('./config/database');
const { User, Category, Location, Event, Registration } = require('./models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // Sinhronizacija baze (kreira tabele)
    await sequelize.sync({ force: true });
    console.log('Tabele kreirane');

    // Dodavanje image_url kolone u events tabelu (ako ne postoji)
    try {
      await sequelize.query(`
        ALTER TABLE events ADD COLUMN image_url VARCHAR(255) NULL AFTER description;
      `);
      console.log('image_url kolona dodata');
    } catch (error) {
      // Kolona već postoji, nastavi dalje
      console.log('image_url kolona već postoji ili je kreirana sa modelom');
    }

    // Kreiranje kategorija
    const categories = await Category.bulkCreate([
      { name: 'Koncert', description: 'Muzički događaji i koncerti' },
      { name: 'Sportski', description: 'Sportske utakmice i događaji' },
      { name: 'Edukativni', description: 'Seminari, predavanja i radionice' },
      { name: 'Kulturni', description: 'Pozorište, izložbe i kulturni eventi' }
    ]);
    console.log('Kategorije kreirane');

    // Kreiranje lokacija
    const locations = await Location.bulkCreate([
      { name: 'Arena Beograd', address: 'Bulevar Arsenija Čarnojevića 58', city: 'Beograd', capacity: 20000 },
      { name: 'Dom Omladine', address: 'Makedonska 22', city: 'Beograd', capacity: 500 },
      { name: 'Stadion Partizan', address: 'Humska 1', city: 'Beograd', capacity: 32000 },
      { name: 'Kulturni Centar', address: 'Knez Mihailova 6', city: 'Beograd', capacity: 300 }
    ]);
    console.log('Lokacije kreirane');

    // Kreiranje test korisnika
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.bulkCreate([
      { name: 'Marko Markovic', email: 'marko@example.com', password: hashedPassword, role: 'organizer' },
      { name: 'Ana Anić', email: 'ana@example.com', password: hashedPassword, role: 'user' },
      { name: 'Petar Petrovic', email: 'petar@example.com', password: hashedPassword, role: 'user' }
    ]);
    console.log('Korisnici kreirani');

    // Kreiranje test događaja sa slikama
    await Event.bulkCreate([
      {
        title: 'Rok Koncert 2026',
        short_description: 'Najbolji rok bendovi u gradu! Uzivajte u muzici i odlicnoj atmosferi.',
        description: 'Najbolji rok bendovi u gradu dolaze na jednu scenu! Uzivajte u muzici i odlicnoj atmosferi. Ocekuje nas nezaboravna vecera puna energije, svirke i dobrog provoda. Donesite prijatelje i budite spremni za najbolji rok dogadjaj ove godine. Ulaznice su limitirane, zato se pozurite sa prijavom!',
        date: new Date('2026-07-15'),
        max_participants: 5000,
        image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        organizer_id: users[0].id,
        category_id: categories[0].id,
        location_id: locations[0].id
      },
      {
        title: 'JavaScript Workshop',
        short_description: 'Naučite React od nule! Prakticne vezbe i rad na projektu.',
        description: 'Naucite React od nule uz prakticne vezbe! Ovaj workshop je savršen za pocetnike koji zele da savladaju najtrazeniju JavaScript biblioteku. Radićemo na realnom projektu, naučićete hooks, komponente i state management. Laptopovi su obavezni, a mi obezbedujemo kafu i grickalice tokom celog dana. Maksimalno 50 učesnika za najbolje iskustvo!',
        date: new Date('2026-07-20'),
        max_participants: 50,
        image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
        organizer_id: users[0].id,
        category_id: categories[2].id,
        location_id: locations[1].id
      },
      {
        title: 'Fudbalska Utakmica',
        short_description: 'Derbi veciti! Navijajte za svoj tim.',
        description: 'Derbi veciti na stadionu Partizan! Najveći susret sezone koji ne smete propustiti. Atmosfera na tribinama, strast navijaca i borba na terenu za sva tri boda. Dodjite sa porodicom ili prijateljima i budite deo nezaboravnog dogadjaja. Stadion ce biti pun, zato rezervišite svoje mesto na vreme!',
        date: new Date('2026-08-01'),
        max_participants: 30000,
        image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        organizer_id: users[0].id,
        category_id: categories[1].id,
        location_id: locations[2].id
      },
      {
        title: 'Jazz Nocni Koncert',
        short_description: 'Opustajuca vecera uz najbolje jazz izvodjace. Dobra atmosfera garantovana!',
        description: 'Opustajuca vecera uz najbolje jazz izvodjace iz regiona! Uzivajte u prijatnoj atmosferi Doma Omladine uz kvalitetnu muziku i dobro drustvo. Program pocinje u 20h, a nastupi ce trajati do kasno u noc. Pice se moze kupiti na licu mesta. Svi ljubitelji jazz muzike su dobrodosli!',
        date: new Date('2026-07-25'),
        max_participants: 200,
        image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
        organizer_id: users[0].id,
        category_id: categories[0].id,
        location_id: locations[1].id
      },
      {
        title: 'Pozorišna Predstava Hamlet',
        short_description: 'Klasicna Šekspirova drama u modernoj interpretaciji. Ne propustite!',
        description: 'Klasicna Šekspirova drama u modernoj interpretaciji! Predstava traje oko 2 sata sa pauzom. Glume najbolji glumci sa beogradske scene, a rezija je inovativna i osvezavajuca. Ovo je prilika da vidite jedan od najpoznatijih komada svetske knjizevnosti u novom svetlu. Ulaznice su ogranicene, preporucujemo rezervaciju unapred.',
        date: new Date('2026-08-05'),
        max_participants: 300,
        image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
        organizer_id: users[0].id,
        category_id: categories[3].id,
        location_id: locations[3].id
      },
      {
        title: 'Maraton Beograd',
        short_description: 'Godisnji maraton kroz centar grada. Prijavi se i trci sa nama!',
        description: 'Godisnji maraton kroz centar grada! Trčite 10km ili 21km i budite deo najveceg trkackog dogadjaja u Beogradu. Ruta prolazi pored najlepsih znamenitosti nasegg grada. Start je u 8h ujutru, a svi ucesnici dobijaju besplatnu majicu i medalju. Prijavi se i trci sa nama za zdravlje i dobar provod!',
        date: new Date('2026-09-15'),
        max_participants: 1000,
        image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
        organizer_id: users[0].id,
        category_id: categories[1].id,
        location_id: locations[2].id
      },
      {
        title: 'Python za Pocetnike',
        short_description: 'Osnovni kurs Python programiranja. Nema potrebe za prethodnim znanjem.',
        description: 'Osnovni kurs Python programiranja za apsolutne pocetnike! Nema potrebe za prethodnim znanjem. Naučićete osnove programiranja, rad sa promenljivim, funkcijama i bibliotekama. Kurs traje 4 sata sa pauzom. Svi materijali ce biti podeljeni besplatno, a posle kursa dobijate sertifikat. Idealno za studente i sve koji žele da pocnu sa programiranjem.',
        date: new Date('2026-07-30'),
        max_participants: 40,
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        organizer_id: users[0].id,
        category_id: categories[2].id,
        location_id: locations[1].id
      },
      {
        title: 'Izlozba Moderne Umetnosti',
        short_description: 'Prikaz dela savremenih umetnika iz regiona. Slobodan ulaz.',
        description: 'Prikaz dela savremenih umetnika iz regiona! Izlozba sadrzi slike, skulpture i video instalacije. Slobodan ulaz za sve posetioce. Galerija je otvorena svaki dan od 10h do 20h tokom cele nedelje. Dodjite i upoznajte se sa radom mladih talentovanih umetnika. Idealno za ljubitelje umetnosti i sve koji žele da vide nešto novo.',
        date: new Date('2026-08-10'),
        max_participants: 500,
        image_url: 'https://images.unsplash.com/photo-1531243625752-d44be0e14e5e?w=800',
        organizer_id: users[0].id,
        category_id: categories[3].id,
        location_id: locations[3].id
      },
      {
        title: 'EDM Festival',
        short_description: 'Najveci elektronski festival u regionu! DJ setovi iz celog sveta.',
        description: 'Najveci elektronski festival u regionu sa DJ setovima iz celog sveta! Ocekuje nas noc puna elektronske muzike, svetlosnih efekata i dobre energije. Festival pocinje u 20h i traje do jutra. Na raspologanju ce biti vise bina sa razlicitim žanrovima elektronske muzike. Ulaznice su limitirane, obezbedjene su sve mere bezbednosti. Dodjite i plesajte sa nama!',
        date: new Date('2026-08-20'),
        max_participants: 10000,
        image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        organizer_id: users[0].id,
        category_id: categories[0].id,
        location_id: locations[0].id
      },
      {
        title: 'Startup Networking',
        short_description: 'Umrezavanje za preduzetnike i startape. Upoznajte investitore i partnere.',
        description: 'Umrezavanje za preduzetnike, startape i investitore! Ovo je prilika da upoznate ljude iz startup ekosistema, podelite svoje ideje i nadjete potencijalne partnere. Program ukljucuje kratke prezentacije, panel diskusiju i networking sesiju uz koktel. Dodjite sa vizitkama i budite spremni da se predstavite. Broj mesta je ogranicen radi kvalitetnijeg umrezavanja.',
        date: new Date('2026-07-28'),
        max_participants: 100,
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        organizer_id: users[0].id,
        category_id: categories[2].id,
        location_id: locations[1].id
      }
    ]);
    console.log('Događaji kreirani - 10 test događaja');

    // Kreiranje 11. događaja koji je potpuno popunjen
    const fullEvent = await Event.create({
      title: 'Cooking Kurs za Pocetnike',
      short_description: 'Naučite osnove kuvanja uz iskusne kuvare! Svi sastojci obezbedjeni.',
      description: 'Naučite osnove kuvanja uz iskusne kuvare! Ovaj kurs je idealan za sve koji zele da savladaju osnovne tehnike pripreme hrane. Radićemo paste, salate i deserti. Svi sastojci su obezbedjeni, a vi donosite samo dobar apetit. Maksimalno 20 učesnika za najbolje iskustvo. Kurs traje 3 sata i svako ce odneti kući pripremljena jela!',
      date: new Date('2026-07-18'),
      max_participants: 20,
      image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      organizer_id: users[0].id,
      category_id: categories[2].id,
      location_id: locations[1].id
    });

    // Kreiranje prijava da popunimo događaj (20/20)
    const registrationPromises = [];
    for (let i = 0; i < 20; i++) {
      registrationPromises.push(
        Registration.create({
          user_id: i % 2 === 0 ? users[1].id : users[2].id,
          event_id: fullEvent.id,
          status: 'active'
        })
      );
    }
    await Promise.all(registrationPromises);
    console.log('Kreiran popunjen događaj sa 20/20 mesta');

    console.log('Baza uspešno popunjena sa test podacima!');
    process.exit(0);
  } catch (error) {
    console.error('Greška pri popunjavanju baze:', error);
    process.exit(1);
  }
};

seedDatabase();
