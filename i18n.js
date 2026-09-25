/* ============================================================
   PiMap translations: English (source), Eesti, Suomi, Español.
   The app renders English; this layer translates interface text in the
   DOM as it appears (text nodes and placeholder/aria-label/title), so every
   panel, popup and toast is covered without touching the render code.
   User content (shelter names, addresses, residents' posts) is never
   rewritten: only exact interface phrases and known patterns match.
   ============================================================ */
(function () {
  'use strict';
  const LANGS = [['en', 'EN', 'English'], ['et', 'ET', 'Eesti'], ['fi', 'FI', 'Suomi'], ['es', 'ES', 'Español'], ['uk', 'UA', 'Українська']];
  const IDX = { et: 1, fi: 2, es: 3, uk: 4 };
  const CODES = ['en', 'et', 'fi', 'es', 'uk'];
  const LOCALE = { en: 'en-GB', et: 'et-EE', fi: 'fi-FI', es: 'es-ES', uk: 'uk-UA' };

  /* English | Eesti | Suomi | Español */
  const RAW = `
// ---- header, navigation, search ----
Citizen portal|Kodaniku portaal|Asukasportaali|Portal ciudadano
Municipality portal|Linna portaal|Kaupungin portaali|Portal municipal
Reset|Lähtesta|Nollaa|Reiniciar
No alert|Ohuteadet pole|Ei hälytystä|Sin alerta
Contribute|Osale|Osallistu|Contribuir
+ Contribute|+ Osale|+ Osallistu|+ Contribuir
Offline|Võrguühenduseta|Ei yhteyttä|Sin conexión
cached|vahemälust|välimuistista|en caché
Search PiMap|Otsi PiMapist|Hae PiMapista|Buscar en PiMap
Search shelters, places and addresses|Otsi varjumiskohti, kohti ja aadresse|Hae suojia, paikkoja ja osoitteita|Busca refugios, lugares y direcciones
Menu|Menüü|Valikko|Menú
Clear search|Tühjenda otsing|Tyhjennä haku|Borrar búsqueda
Search|Otsi|Hae|Buscar
Directions|Juhised|Reittiohjeet|Cómo llegar
Directions to the nearest shelter|Juhised lähima varjumiskohani|Reittiohjeet lähimpään suojaan|Cómo llegar al refugio más cercano
More categories|Rohkem kategooriaid|Lisää luokkia|Más categorías
Places to go|Kuhu minna|Kohteet|Lugares
Map of Tallinn|Tallinna kaart|Tallinnan kartta|Mapa de Tallin
Map legend|Kaardi legend|Karttaselite|Leyenda del mapa
Portals|Portaalid|Portaalit|Portales
Municipality sections|Linna portaali jaotised|Kaupungin portaalin osiot|Secciones municipales
Language|Keel|Kieli|Idioma
Clear local state and reseed demo data|Tühjenda kohalikud andmed ja taasta demo|Tyhjennä paikalliset tiedot ja palauta demo|Borrar los datos locales y restaurar la demo
Report an issue or share an idea|Teata probleemist või jaga ideed|Ilmoita ongelmasta tai jaa idea|Informa de un problema o comparte una idea
Back|Tagasi|Takaisin|Atrás
Close|Sulge|Sulje|Cerrar
PiMap prototype|PiMapi prototüüp|PiMap-prototyyppi|Prototipo de PiMap
not an official City of Tallinn service|ei ole Tallinna linna ametlik teenus|ei ole Tallinnan kaupungin virallinen palvelu|no es un servicio oficial de la ciudad de Tallin
// ---- category chips ----
Shelters|Varjumiskohad|Suojat|Refugios
Fallen trees|Langenud puud|Kaatuneet puut|Árboles caídos
Hospitals|Haiglad|Sairaalat|Hospitales
Pharmacies|Apteegid|Apteekit|Farmacias
Cool places|Jahedad kohad|Viileät paikat|Lugares frescos
Drinking water|Joogivesi|Juomavesi|Agua potable
Groceries|Toidupoed|Ruokakaupat|Supermercados
Police|Politsei|Poliisi|Policía
Rescue stations|Päästekomandod|Paloasemat|Parques de bomberos
Construction|Ehitustööd|Rakennustyöt|Obras
Community|Kogukond|Yhteisö|Comunidad
Address|Aadress|Osoite|Dirección
Hospital|Haigla|Sairaala|Hospital
Pharmacy|Apteek|Apteekki|Farmacia
Grocery store|Toidupood|Ruokakauppa|Supermercado
Rescue station|Päästekomando|Paloasema|Parque de bomberos
// ---- legend ----
Public shelter|Avalik varjumiskoht|Yleinen väestönsuoja|Refugio público
Resident|Elanik|Asukas|Vecino
Shared vehicle, locked|Jagatud sõiduk, lukus|Jaettu ajoneuvo, lukittu|Vehículo compartido, bloqueado
Shared vehicle, free|Jagatud sõiduk, tasuta|Jaettu ajoneuvo, maksuton|Vehículo compartido, gratis
Neighbour listing|Naabri pakkumine|Naapurin ilmoitus|Oferta de un vecino
Driver offering pick-up|Juht pakub küüti|Kuljettaja tarjoaa kyytiä|Conductor que ofrece recogida
Pick-up request|Küüdisoov|Kyytipyyntö|Solicitud de recogida
Construction (street section)|Ehitustööd (tänavalõik)|Rakennustyöt (katuosuus)|Obras (tramo de calle)
Construction works|Ehitustööd|Rakennustyöt|Obras
Flooded area|Üleujutatud ala|Tulva-alue|Zona inundada
Unsafe place|Ohtlik koht|Vaarallinen paikka|Lugar peligroso
Fallen tree report|Langenud puu teade|Ilmoitus kaatuneesta puusta|Aviso de árbol caído
Storm area|Tormiala|Myrskyalue|Zona de tormenta
Citizen issue|Elaniku probleem|Asukkaan ongelma|Problema vecinal
Citizen idea|Elaniku idee|Asukkaan idea|Idea vecinal
// ---- home card, where to ----
Around you|Sinu ümber|Lähelläsi|A tu alrededor
Your nearest shelter|Sinu lähim varjumiskoht|Lähin suojasi|Tu refugio más cercano
Be ready|Ole valmis|Varaudu|Prepárate
Home supplies and what to do in each emergency|Kodused varud ja mida teha igas hädaolukorras|Kotivara ja toimintaohjeet eri hätätilanteisiin|Reservas en casa y qué hacer en cada emergencia
No construction within 2 km|2 km raadiuses ehitustöid pole|Ei rakennustöitä 2 km:n säteellä|No hay obras a menos de 2 km
Tap to see works across Tallinn|Vaata kõiki Tallinna ehitustöid|Katso kaikki Tallinnan työmaat|Ver las obras en todo Tallin
Routes go around them until cleared|Teekonnad väldivad neid, kuni need on koristatud|Reitit kiertävät ne, kunnes ne on raivattu|Las rutas los evitan hasta que se retiren
Support them or add your own|Toeta neid või lisa oma|Tue niitä tai lisää omasi|Apóyalos o añade los tuyos
Where to?|Kuhu?|Minne?|¿Adónde?
Search above, or pick one of these|Otsi ülalt või vali üks neist|Hae yltä tai valitse jokin näistä|Busca arriba o elige uno de estos
Nearest pharmacy|Lähim apteek|Lähin apteekki|Farmacia más cercana
Nearest grocery store|Lähim toidupood|Lähin ruokakauppa|Supermercado más cercano
Nearest hospital|Lähim haigla|Lähin sairaala|Hospital más cercano
Nearest public shelter|Lähim avalik varjumiskoht|Lähin yleinen väestönsuoja|Refugio público más cercano
Nearest drinking water|Lähim joogivesi|Lähin juomavesipiste|Agua potable más cercana
Nearest library or shopping centre|Lähim raamatukogu või kaubanduskeskus|Lähin kirjasto tai kauppakeskus|Biblioteca o centro comercial más cercano
Nearest shelter|Lähim varjumiskoht|Lähin suoja|Refugio más cercano
Nearest safe indoor place|Lähim ohutu siseruum|Lähin turvallinen sisätila|Lugar interior seguro más cercano
Nearest cool place|Lähim jahe koht|Lähin viileä paikka|Lugar fresco más cercano
Nearest dry shelter|Lähim kuiv varjumiskoht|Lähin kuiva suoja|Refugio seco más cercano
Go to nearest public shelter|Mine lähimasse avalikku varjumiskohta|Mene lähimpään yleiseen väestönsuojaan|Ve al refugio público más cercano
Go to nearest dry shelter|Mine lähimasse kuiva varjumiskohta|Mene lähimpään kuivaan suojaan|Ve al refugio seco más cercano
Go to nearest cool place|Mine lähimasse jahedasse kohta|Mene lähimpään viileään paikkaan|Ve al lugar fresco más cercano
Go to nearest safe indoor place|Mine lähimasse ohutusse siseruumi|Mene lähimpään turvalliseen sisätilaan|Ve al lugar interior seguro más cercano
Chosen shelter|Valitud varjumiskoht|Valittu suoja|Refugio elegido
Nearest public shelter (register)|Lähim avalik varjumiskoht (register)|Lähin yleinen väestönsuoja (rekisteri)|Refugio público más cercano (registro)
// ---- place cards ----
Opening hours|Lahtiolekuajad|Aukioloajat|Horario
Wheelchair access|Ratastooliga ligipääs|Esteettömyys|Acceso en silla de ruedas
yes|jah|kyllä|sí
no|ei|ei|no
limited|piiratud|rajoitettu|limitado
Public shelter, marked with the civil defence sign (blue triangle on orange)|Avalik varjumiskoht, tähistatud tsiviilkaitse märgiga (sinine kolmnurk oranžil taustal)|Yleinen väestönsuoja, merkitty väestönsuojelun merkillä (sininen kolmio oranssilla pohjalla)|Refugio público, señalizado con el símbolo de protección civil (triángulo azul sobre naranja)
Public library|Avalik raamatukogu|Yleinen kirjasto|Biblioteca pública
Shopping centre|Kaubanduskeskus|Kauppakeskus|Centro comercial
Dates|Kuupäevad|Päivämäärät|Fechas
Affects|Mõjutab|Koskee|Afecta a
Pedestrians|Jalakäijad|Jalankulkijat|Peatones
Cyclists|Jalgratturid|Pyöräilijät|Ciclistas
Cars|Autod|Autot|Coches
pedestrians|jalakäijad|jalankulkijat|peatones
cyclists|jalgratturid|pyöräilijät|ciclistas
cars|autod|autot|coches
walk|jalgsi|kävely|a pie
bike|ratas|pyörä|bici
drive|auto|auto|coche
no modes|ei ühtegi|ei mitään|ningún modo
Status|Olek|Tila|Estado
Street section|Tänavalõik|Katuosuus|Tramo de calle
Last updated|Viimati uuendatud|Päivitetty viimeksi|Última actualización
Registered by the municipality|Registreeris linn|Kaupungin rekisteröimä|Registrado por el ayuntamiento
Reported by|Teatas|Ilmoittaja|Informado por
City crew|Linna meeskond|Kaupungin työryhmä|Equipo municipal
You|Sina|Sinä|Tú
A neighbour|Naaber|Naapuri|Un vecino
Neighbour|Naaber|Naapuri|Vecino
Storm report|Tormiteade|Myrskyilmoitus|Aviso de tormenta
Reported, not yet confirmed|Teatatud, veel kinnitamata|Ilmoitettu, ei vielä vahvistettu|Informado, aún sin confirmar
Confirmed by the city|Linn on kinnitanud|Kaupunki on vahvistanut|Confirmado por el ayuntamiento
Cleared|Koristatud|Raivattu|Retirado
Finished|Lõppenud|Päättynyt|Terminada
// ---- directions ----
Your location|Sinu asukoht|Sijaintisi|Tu ubicación
Close directions|Sulge juhised|Sulje reittiohjeet|Cerrar indicaciones
How to get there|Kuidas kohale jõuda|Miten perille|Cómo llegar
Walk|Jalgsi|Kävely|A pie
Bike|Ratas|Pyörä|Bici
Drive|Auto|Auto|Coche
Pick-up|Küüt|Kyyti|Recogida
at your pace|sinu tempos|omaan tahtiisi|a tu ritmo
by car|autoga|autolla|en coche
your own bike or scooter|oma ratas või tõukeratas|oma pyörä tai potkulauta|tu bici o patinete
until pick-up|pealevõtmiseni|noutoon|hasta la recogida
pick-up runs during an alert|küüt toimib ohuteate ajal|kyyti toimii hälytyksen aikana|la recogida funciona durante una alerta
estimated door to destination|hinnanguliselt uksest sihtkohta|arvio ovelta perille|estimación de puerta a destino
no free driver right now|praegu pole vaba juhti|vapaata kuljettajaa ei nyt ole|ahora no hay conductor libre
Look for the civil defence sign: a blue triangle on an orange background.|Otsi tsiviilkaitse märki: sinine kolmnurk oranžil taustal.|Etsi väestönsuojelun merkkiä: sininen kolmio oranssilla pohjalla.|Busca la señal de protección civil: un triángulo azul sobre fondo naranja.
Walking route on the map.|Jalgsi teekond kaardil.|Kävelyreitti kartalla.|Ruta a pie en el mapa.
Route and destination are stored on this device and work without signal.|Teekond ja sihtkoht salvestatakse seadmesse ja töötavad ka ilma levita.|Reitti ja määränpää tallennetaan laitteeseen ja toimivat ilman verkkoa.|La ruta y el destino se guardan en este dispositivo y funcionan sin señal.
This is a long way at your pace.|Sinu tempos on see pikk maa.|Omaan tahtiisi tämä on pitkä matka.|A tu ritmo es un camino largo.
This is a long way at your pace on a mobility aid.|Liikumisabivahendiga on see sinu tempos pikk maa.|Liikkumisapuvälineellä tämä on omaan tahtiisi pitkä matka.|Con una ayuda a la movilidad, a tu ritmo es un camino largo.
Bike or pick-up gets you there faster.|Rattaga või küüdiga jõuad kiiremini.|Pyörällä tai kyydillä pääset perille nopeammin.|En bici o con recogida llegas antes.
Request pick-up|Telli küüt|Pyydä kyyti|Solicitar recogida
Park at least 50 m from the entrance and keep access lanes clear.|Pargi sissepääsust vähemalt 50 m kaugusele ja jäta juurdepääsuteed vabaks.|Pysäköi vähintään 50 m päähän sisäänkäynnistä ja pidä kulkuväylät vapaina.|Aparca al menos a 50 m de la entrada y deja libres los accesos.
Never drive into water: 30 cm can float a car.|Ära sõida kunagi vette: 30 cm vesi võib auto ujuma panna.|Älä koskaan aja veteen: 30 cm vettä voi saada auton kellumaan.|Nunca conduzcas hacia el agua: 30 cm pueden hacer flotar un coche.
During an alert you can offer spare seats here and be matched with a neighbour who cannot walk.|Ohuteate ajal saad siin pakkuda vabu kohti ja sind seotakse naabriga, kes ei saa kõndida.|Hälytyksen aikana voit tarjota tässä vapaita paikkoja, ja sinut yhdistetään naapuriin, joka ei pysty kävelemään.|Durante una alerta puedes ofrecer plazas libres aquí y te emparejamos con un vecino que no puede caminar.
You are listed as a driver|Oled juhtide nimekirjas|Olet kuljettajalistalla|Estás registrado como conductor
Pick up|Võta peale|Nouda|Recoge a
No one nearby needs a lift yet.|Lähedal ei vaja veel keegi küüti.|Lähellä kukaan ei vielä tarvitse kyytiä.|Nadie cerca necesita transporte todavía.
We will ping you.|Anname sulle märku.|Ilmoitamme sinulle.|Te avisaremos.
Withdraw|Võta tagasi|Peru|Retirar
Have spare seats? Neighbours who cannot walk are waiting.|Kas sul on vabu kohti? Naabrid, kes ei saa kõndida, ootavad.|Onko sinulla vapaita paikkoja? Naapurit, jotka eivät pysty kävelemään, odottavat.|¿Tienes plazas libres? Hay vecinos que no pueden caminar esperando.
Vehicle|Sõiduk|Ajoneuvo|Vehículo
Spare seats|Vabu kohti|Vapaita paikkoja|Plazas libres
Can take a wheelchair or mobility aid|Mahutab ratastooli või liikumisabivahendi|Pyörätuoli tai liikkumisapuväline mahtuu mukaan|Admite silla de ruedas o ayuda a la movilidad
Offer my seats|Paku oma kohti|Tarjoa paikkani|Ofrecer mis plazas
Car|Auto|Auto|Coche
Van|Kaubik|Pakettiauto|Furgoneta
Cargo bike|Kaubaratas|Tavarapyörä|Bici de carga
E-scooter|Elektritõukeratas|Sähköpotkulauta|Patinete eléctrico
City bike|Linnaratas|Kaupunkipyörä|Bici urbana
E-bike|Elektriratas|Sähköpyörä|Bici eléctrica
Wheelchair|Ratastool|Pyörätuoli|Silla de ruedas
Rollator|Rulaator|Rollaattori|Andador
Mobility aid (Pinge)|Liikumisabivahend (Pinge)|Liikkumisapuväline (Pinge)|Ayuda a la movilidad (Pinge)
Unlocking…|Avan…|Avataan…|Desbloqueando…
Sending the unlock event under the Emergency Unlock Mandate.|Saadan avamissündmuse hädaolukorra avamismandaadi alusel.|Lähetetään avaustapahtuma hätäavausvaltuutuksen nojalla.|Enviando el desbloqueo bajo el Mandato de Desbloqueo de Emergencia.
fare €0 under the mandate|sõit €0 mandaadi alusel|maksu 0 € valtuutuksen nojalla|tarifa 0 € bajo el mandato
Unlock code|Avamiskood|Avauskoodi|Código de desbloqueo
How to get it|Kuidas kätte saada|Miten sen saa|Cómo conseguirlo
End your trip at your destination.|Lõpeta sõit sihtkohas.|Lopeta matka määränpäässä.|Termina el viaje en tu destino.
Release and choose another|Vabasta ja vali teine|Vapauta ja valitse toinen|Liberar y elegir otro
Strong wind: riding is not recommended.|Tugev tuul: sõitmine pole soovitatav.|Kova tuuli: pyöräilyä ei suositella.|Viento fuerte: no se recomienda circular.
Walk if you can.|Kõnni, kui saad.|Kävele, jos pystyt.|Camina si puedes.
No bike?|Ratast pole?|Eikö pyörää?|¿No tienes bici?
Shared vehicles near shelters are free under the Emergency Unlock Mandate, and neighbours’ listings are active.|Varjumiskohtade lähedal on jagatud sõidukid hädaolukorra avamismandaadi alusel tasuta ja naabrite pakkumised on aktiivsed.|Suojien lähellä jaetut ajoneuvot ovat maksuttomia hätäavausvaltuutuksen nojalla, ja naapureiden ilmoitukset ovat voimassa.|Los vehículos compartidos cerca de los refugios son gratis bajo el Mandato de Desbloqueo de Emergencia y las ofertas de los vecinos están activas.
Neighbours’ listings are active.|Naabrite pakkumised on aktiivsed.|Naapureiden ilmoitukset ovat voimassa.|Las ofertas de los vecinos están activas.
Shared fleets unlock when the city publishes the mandate.|Jagatud sõidukid avanevad, kui linn mandaadi avaldab.|Jaetut ajoneuvot avautuvat, kun kaupunki julkaisee valtuutuksen.|Las flotas compartidas se desbloquean cuando el ayuntamiento publica el mandato.
During an alert shared vehicles unlock for free and neighbours’ spare bikes appear here.|Ohuteate ajal avanevad jagatud sõidukid tasuta ja siia ilmuvad naabrite vabad rattad.|Hälytyksen aikana jaetut ajoneuvot avautuvat maksutta ja naapureiden vapaat pyörät näkyvät tässä.|Durante una alerta los vehículos compartidos se desbloquean gratis y aquí aparecen las bicis libres de los vecinos.
Free near you|Tasuta sinu lähedal|Maksuttomia lähelläsi|Gratis cerca de ti
Unlock|Ava|Avaa|Desbloquear
Borrow|Laena|Lainaa|Pedir prestado
accessible|ligipääsetav|esteetön|accesible
Nothing free within reach right now.|Praegu pole lähedal midagi vaba.|Lähellä ei ole nyt mitään vapaana.|Ahora no hay nada libre cerca.
Try pick-up.|Proovi küüti.|Kokeile kyytiä.|Prueba la recogida.
Queued|Järjekorras|Jonossa|En cola
Cancel request|Tühista soov|Peru pyyntö|Cancelar solicitud
Your need|Sinu vajadus|Tarpeesi|Tu necesidad
People|Inimesi|Henkilöitä|Personas
Note for the driver|Märkus juhile|Viesti kuljettajalle|Nota para el conductor
3rd floor, no lift|3. korrus, lifti pole|3. kerros, ei hissiä|3.er piso, sin ascensor
Wheelchair user|Ratastoolikasutaja|Pyörätuolin käyttäjä|Usuario de silla de ruedas
Uses a mobility aid or cannot stand long|Kasutab liikumisabivahendit või ei suuda kaua seista|Käyttää liikkumisapuvälinettä tai ei jaksa seistä pitkään|Usa ayuda a la movilidad o no aguanta mucho de pie
Walks slowly (elderly, injured, pregnant)|Kõnnib aeglaselt (eakas, vigastatud, rase)|Kävelee hitaasti (iäkäs, loukkaantunut, raskaana)|Camina despacio (mayor, lesionado, embarazada)
Small children or a pram|Väikesed lapsed või lapsevanker|Pieniä lapsia tai lastenvaunut|Niños pequeños o carrito
No special need|Erivajadus puudub|Ei erityistarvetta|Sin necesidad especial
Pinge crew|Pinge meeskond|Pinge-tiimi|Equipo Pinge
Wait at your door.|Oota ukse juures.|Odota ovella.|Espera en tu puerta.
Matched to the nearest neighbour or Pinge crew with room.|Sind sobitatakse lähima vaba kohaga naabri või Pinge meeskonnaga.|Sinut yhdistetään lähimpään naapuriin tai Pinge-tiimiin, jolla on tilaa.|Te asignamos al vecino o equipo Pinge más cercano con sitio.
People who cannot walk go first.|Esimesena aidatakse neid, kes ei saa kõndida.|Kävelemään kykenemättömät autetaan ensin.|Primero van quienes no pueden caminar.
All nearby drivers are busy; the next free neighbour or Pinge crew is dispatched to you.|Kõik lähedal olevad juhid on hõivatud; sinu juurde saadetakse järgmine vaba naaber või Pinge meeskond.|Kaikki lähellä olevat kuljettajat ovat varattuja; seuraava vapaa naapuri tai Pinge-tiimi lähetetään luoksesi.|Todos los conductores cercanos están ocupados; te enviaremos al próximo vecino o equipo Pinge libre.
When an alert is declared, neighbours with spare seats and Pinge crews pick up residents who cannot get there on their own.|Ohuteate väljakuulutamisel võtavad vabade kohtadega naabrid ja Pinge meeskonnad peale elanikud, kes ise kohale ei jõua.|Kun hälytys julistetaan, naapurit, joilla on vapaita paikkoja, ja Pinge-tiimit hakevat asukkaat, jotka eivät pääse perille itse.|Cuando se declara una alerta, vecinos con plazas libres y equipos Pinge recogen a quienes no pueden llegar por sí mismos.
// ---- protocols ----
War / air strike|Sõda / õhurünnak|Sota / ilmaisku|Guerra / ataque aéreo
war / air strike|sõja / õhurünnaku|sodan / ilmaiskun|guerra / ataque aéreo
Flood|Üleujutus|Tulva|Inundación
flood|üleujutuse|tulvan|inundación
Heatwave|Kuumalaine|Helle|Ola de calor
heatwave|kuumalaine|helle|ola de calor
Storm|Torm|Myrsky|Tormenta
storm|tormi|myrskyn|tormenta
public shelter|avalik varjumiskoht|yleinen väestönsuoja|refugio público
dry shelter|kuiv varjumiskoht|kuiva suoja|refugio seco
cool place|jahe koht|viileä paikka|lugar fresco
safe indoor place|ohutu siseruum|turvallinen sisätila|lugar interior seguro
Routes to public shelters. Fleets unlock, neighbours lend, pick-ups for people who cannot walk.|Teekonnad avalikesse varjumiskohtadesse. Sõidukid avanevad, naabrid laenavad, küüt neile, kes ei saa kõndida.|Reitit yleisiin väestönsuojiin. Ajoneuvot avautuvat, naapurit lainaavat, kyydit niille, jotka eivät pysty kävelemään.|Rutas a refugios públicos. Se desbloquean flotas, los vecinos prestan y hay recogida para quien no puede caminar.
Air raid warning. Go to the nearest public shelter now. If you cannot reach one, stay in a windowless room or basement.|Õhuhäire. Mine kohe lähimasse avalikku varjumiskohta. Kui sa sinna ei jõua, jää aknata ruumi või keldrisse.|Ilmahälytys. Mene heti lähimpään yleiseen väestönsuojaan. Jos et pääse sinne, pysy ikkunattomassa huoneessa tai kellarissa.|Alerta antiaérea. Ve ya al refugio público más cercano. Si no puedes llegar, quédate en una habitación sin ventanas o en un sótano.
Go below ground if you can: basements, underpasses, parking garages.|Mine võimalusel maa alla: keldrid, tunnelid, parkimismajad.|Mene maan alle, jos voit: kellarit, alikulut, pysäköintihallit.|Baja bajo tierra si puedes: sótanos, pasos subterráneos, aparcamientos.
Keep away from windows and glass facades.|Hoia eemale akendest ja klaasfassaadidest.|Pysy kaukana ikkunoista ja lasijulkisivuista.|Aléjate de ventanas y fachadas de cristal.
Take water, medicine and your phone.|Võta kaasa vesi, ravimid ja telefon.|Ota mukaan vettä, lääkkeet ja puhelin.|Lleva agua, medicamentos y el móvil.
The city marks flooded areas. Routes go around them to shelters on dry ground.|Linn märgib üleujutatud alad. Teekonnad viivad neist mööda kuival maal asuvatesse varjumiskohtadesse.|Kaupunki merkitsee tulva-alueet. Reitit kiertävät ne kuivalla maalla oleviin suojiin.|El ayuntamiento marca las zonas inundadas. Las rutas las rodean hasta refugios en terreno seco.
Flood warning. Leave low-lying and coastal streets. Your route avoids flooded areas.|Üleujutuse hoiatus. Lahku madalatelt ja rannaäärsetelt tänavatelt. Sinu teekond väldib üleujutatud alasid.|Tulvavaroitus. Poistu matalilta ja rannan läheisiltä kaduilta. Reittisi välttää tulva-alueet.|Aviso de inundación. Sal de las calles bajas y costeras. Tu ruta evita las zonas inundadas.
Never walk or drive through moving water: 15 cm can knock you over, 30 cm can float a car.|Ära kunagi kõnni ega sõida läbi voolava vee: 15 cm võib sind jalust lüüa, 30 cm võib auto ujuma panna.|Älä koskaan kävele tai aja virtaavan veden läpi: 15 cm voi kaataa sinut, 30 cm voi saada auton kellumaan.|Nunca camines ni conduzcas por agua en movimiento: 15 cm pueden tumbarte y 30 cm hacer flotar un coche.
Move to higher ground or an upper floor.|Liigu kõrgemale maale või ülemisele korrusele.|Siirry korkeammalle tai ylempään kerrokseen.|Sube a terreno más alto o a un piso superior.
Stay away from rivers, the shoreline and open drains.|Hoia eemale jõgedest, rannajoonest ja lahtistest kraavidest.|Pysy kaukana joista, rantaviivasta ja avo-ojista.|Aléjate de ríos, de la costa y de desagües abiertos.
Routes to cool indoor places (libraries, shopping centres), choosing streets shaded by buildings and trees.|Teekonnad jahedatesse siseruumidesse (raamatukogud, kaubanduskeskused), valides hoonete ja puude varjus tänavad.|Reitit viileisiin sisätiloihin (kirjastot, kauppakeskukset) rakennusten ja puiden varjostamia katuja pitkin.|Rutas a interiores frescos (bibliotecas, centros comerciales) por calles con sombra de edificios y árboles.
Heat warning. Avoid direct sun between 11:00 and 17:00. Go to a cool indoor place; your route follows the shade.|Kuumahoiatus. Väldi otsest päikest kella 11–17. Mine jahedasse siseruumi; sinu teekond järgib varju.|Hellevaroitus. Vältä suoraa aurinkoa klo 11–17. Mene viileään sisätilaan; reittisi seuraa varjoa.|Aviso de calor. Evita el sol directo entre las 11:00 y las 17:00. Ve a un interior fresco; tu ruta sigue la sombra.
Walk on the shaded side of the street.|Kõnni tänava varjulisel poolel.|Kävele kadun varjoisalla puolella.|Camina por el lado de la sombra.
Drink water every 20 minutes, even if you are not thirsty.|Joo vett iga 20 minuti järel, isegi kui sul pole janu.|Juo vettä 20 minuutin välein, vaikka ei janottaisi.|Bebe agua cada 20 minutos, aunque no tengas sed.
Check on elderly neighbours and never leave anyone in a parked car.|Vaata eakate naabrite järele ja ära jäta kedagi pargitud autosse.|Tarkista iäkkäiden naapureiden vointi äläkä jätä ketään pysäköityyn autoon.|Pregunta por tus vecinos mayores y nunca dejes a nadie en un coche aparcado.
Routes to indoor safe places, avoiding marked unsafe places, trees, the shoreline and construction sites.|Teekonnad ohututesse siseruumidesse, vältides märgitud ohtlikke kohti, puid, rannajoont ja ehitusplatse.|Reitit turvallisiin sisätiloihin merkityt vaaralliset paikat, puut, rantaviiva ja työmaat välttäen.|Rutas a interiores seguros, evitando lugares peligrosos marcados, árboles, la costa y las obras.
Storm warning. Get indoors now. Your route avoids trees, the shoreline, construction sites and unsafe places.|Tormihoiatus. Mine kohe siseruumi. Sinu teekond väldib puid, rannajoont, ehitusplatse ja ohtlikke kohti.|Myrskyvaroitus. Mene heti sisälle. Reittisi välttää puut, rantaviivan, työmaat ja vaaralliset paikat.|Aviso de tormenta. Ponte a cubierto ya. Tu ruta evita árboles, la costa, obras y lugares peligrosos.
Keep away from trees, scaffolding, cranes and power lines.|Hoia eemale puudest, tellingutest, kraanadest ja elektriliinidest.|Pysy kaukana puista, rakennustelineistä, nostureista ja sähkölinjoista.|Aléjate de árboles, andamios, grúas y tendidos eléctricos.
Stay off the shoreline and piers.|Hoia eemale rannast ja muulidest.|Pysy poissa rannalta ja laitureilta.|No te acerques a la costa ni a los muelles.
Do not ride shared scooters or bikes in strong wind.|Ära sõida tugeva tuulega jagatud tõukerataste ega ratastega.|Älä aja jaetuilla potkulaudoilla tai pyörillä kovassa tuulessa.|No uses patinetes ni bicis compartidos con viento fuerte.
Seek shelter now. Sirens are active. Your nearest shelter and route are attached. If you cannot walk it, use Borrow or Request a ride.|Otsi kohe varju. Sireenid töötavad. Lähim varjumiskoht ja teekond on lisatud. Kui sa ei saa kõndida, laena sõiduk või telli küüt.|Hakeudu suojaan heti. Sireenit soivat. Lähin suoja ja reitti ovat mukana. Jos et pysty kävelemään, lainaa kulkuneuvo tai pyydä kyyti.|Busca refugio ya. Las sirenas están activas. Te enviamos tu refugio más cercano y la ruta. Si no puedes caminar, pide un vehículo prestado o una recogida.
// ---- protocol box ----
Finding the shadiest route…|Otsin kõige varjulisemat teekonda…|Etsitään varjoisinta reittiä…|Buscando la ruta con más sombra…
Checking trees, shoreline and unsafe places…|Kontrollin puid, rannajoont ja ohtlikke kohti…|Tarkistetaan puut, rantaviiva ja vaaralliset paikat…|Comprobando árboles, costa y lugares peligrosos…
Routing around flooded areas…|Koostan teekonda üleujutatud aladest mööda…|Reititetään tulva-alueiden ohi…|Calculando la ruta alrededor de las zonas inundadas…
Finding your route…|Otsin teekonda…|Etsitään reittiä…|Buscando tu ruta…
Checking construction and blocked paths…|Kontrollin ehitustöid ja suletud teid…|Tarkistetaan työmaat ja suljetut reitit…|Comprobando obras y pasos bloqueados…
Your route does not cross any flooded area.|Sinu teekond ei läbi ühtki üleujutatud ala.|Reittisi ei kulje tulva-alueiden läpi.|Tu ruta no cruza ninguna zona inundada.
Your route does not cross any marked unsafe place.|Sinu teekond ei läbi ühtki märgitud ohtlikku kohta.|Reittisi ei kulje merkittyjen vaarallisten paikkojen kautta.|Tu ruta no pasa por ningún lugar peligroso marcado.
Shade at|Vari kell|Varjo klo|Sombra a las
Now|Praegu|Nyt|Ahora
Plan shade for|Planeeri vari|Suunnittele varjo|Planificar sombra
Low sun casts long shadows.|Madal päike heidab pikki varje.|Matala aurinko luo pitkiä varjoja.|El sol bajo proyecta sombras largas.
The sun is down, so the whole route is shaded.|Päike on loojunud, seega on kogu teekond varjus.|Aurinko on laskenut, joten koko reitti on varjossa.|El sol se ha puesto, así que toda la ruta está a la sombra.
No public drinking water on this route. Carry water.|Sellel teekonnal pole avalikku joogivett. Võta vesi kaasa.|Reitillä ei ole yleistä juomavettä. Ota vettä mukaan.|No hay agua potable pública en esta ruta. Lleva agua.
Routes keep extra distance from trees and the shoreline.|Teekonnad hoiavad puudest ja rannajoonest suuremat vahet.|Reitit pysyvät kauempana puista ja rantaviivasta.|Las rutas se mantienen más lejos de árboles y costa.
Report one|Teata|Ilmoita|Avisa
See flooding, a blocked way or another danger?|Näed üleujutust, suletud teed või muud ohtu?|Näetkö tulvan, tukkeutuneen reitin tai muun vaaran?|¿Ves una inundación, un paso bloqueado u otro peligro?
Report it|Teata sellest|Ilmoita siitä|Avísalo
Construction on this route|Sellel teekonnal on ehitustööd|Reitillä on rakennustöitä|Obras en esta ruta
Offline: showing a straight-line estimate. Avoiding hazards and construction needs a connection.|Võrguühenduseta: näitan linnulennult hinnangut. Ohtude ja ehitustööde vältimiseks on vaja ühendust.|Ei yhteyttä: näytetään linnuntie-arvio. Vaarojen ja työmaiden välttäminen vaatii yhteyden.|Sin conexión: se muestra una estimación en línea recta. Evitar peligros y obras requiere conexión.
Street tree and building data could not be loaded, so this is the fastest route.|Puude ja hoonete andmeid ei õnnestunud laadida, seega on see kiireim teekond.|Puu- ja rakennustietoja ei voitu ladata, joten tämä on nopein reitti.|No se pudieron cargar los datos de árboles y edificios, así que esta es la ruta más rápida.
// ---- construction list ----
Updated by the city|Linn uuendas|Kaupungin päivittämä|Actualizado por el ayuntamiento
Within 2 km|2 km raadiuses|2 km:n säteellä|A menos de 2 km
All of Tallinn|Kogu Tallinn|Koko Tallinna|Todo Tallin
Area|Ala|Alue|Zona
Active now|Praegu käimas|Käynnissä nyt|En curso
Starting soon|Algamas|Alkamassa pian|Próximamente
No active construction here.|Siin pole käimasolevaid ehitustöid.|Täällä ei ole käynnissä olevia töitä.|No hay obras activas aquí.
Nothing scheduled.|Midagi pole plaanis.|Ei suunniteltuja töitä.|Nada programado.
Everyday routes steer around active sites that affect how you travel.|Igapäevased teekonnad väldivad käimasolevaid töid, mis sinu liikumist mõjutavad.|Arkireitit kiertävät käynnissä olevat työmaat, jotka vaikuttavat liikkumiseesi.|Las rutas del día a día evitan las obras activas que afectan a cómo te desplazas.
Roadworks|Teetööd|Tietyöt|Obras viales
Building site|Ehitusplats|Rakennustyömaa|Obra de edificación
Utility works|Trassitööd|Johtotyöt|Obras de servicios
Street closure|Tänava sulgemine|Kadun sulkeminen|Calle cortada
Tram line works|Trammiteetööd|Raitiotietyöt|Obras del tranvía
Official public shelters|Ametlikud avalikud varjumiskohad|Viralliset yleiset väestönsuojat|Refugios públicos oficiales
Nothing found nearby.|Lähedalt ei leitud midagi.|Läheltä ei löytynyt mitään.|No se encontró nada cerca.
Show on map|Näita kaardil|Näytä kartalla|Mostrar en el mapa
Addresses|Aadressid|Osoitteet|Direcciones
Searching addresses…|Otsin aadresse…|Haetaan osoitteita…|Buscando direcciones…
Type a place, shelter or address.|Sisesta koht, varjumiskoht või aadress.|Kirjoita paikka, suoja tai osoite.|Escribe un lugar, refugio o dirección.
No places found. Press Enter to search addresses.|Kohti ei leitud. Aadresside otsimiseks vajuta Enter.|Paikkoja ei löytynyt. Hae osoitteita painamalla Enter.|No se encontraron lugares. Pulsa Intro para buscar direcciones.
Search addresses in Tallinn|Otsi aadresse Tallinnas|Hae osoitteita Tallinnasta|Buscar direcciones en Tallin
// ---- menu, settings, lend ----
About you|Sinust|Tietoja sinusta|Sobre ti
Lend a vehicle|Laena sõidukit|Lainaa kulkuneuvo|Presta un vehículo
Pre-list a spare bike or mobility aid for emergencies|Lisa varuks vaba ratas või liikumisabivahend hädaolukordadeks|Ilmoita varapyörä tai liikkumisapuväline hätätilanteita varten|Registra una bici o ayuda a la movilidad para emergencias
Report an issue or share an idea with the city|Teata linnale probleemist või jaga ideed|Ilmoita kaupungille ongelmasta tai jaa idea|Informa al ayuntamiento de un problema o comparte una idea
Report an issue or share an idea with the city, or report a fallen tree|Teata linnale probleemist, jaga ideed või teata langenud puust|Ilmoita kaupungille ongelmasta, jaa idea tai ilmoita kaatuneesta puusta|Informa al ayuntamiento de un problema, comparte una idea o avisa de un árbol caído
Use my location|Kasuta minu asukohta|Käytä sijaintiani|Usar mi ubicación
From your device's GPS|Seadme GPS-ist|Laitteen GPS:stä|Del GPS de tu dispositivo
Set my location on the map|Määra oma asukoht kaardil|Aseta sijaintini kartalle|Fijar mi ubicación en el mapa
Demo: simulate a resident somewhere else|Demo: simuleeri elanikku mujal|Demo: simuloi asukasta muualla|Demo: simula un vecino en otro lugar
Mobility|Liikumisvõime|Liikkuminen|Movilidad
I can walk|Saan kõndida|Pystyn kävelemään|Puedo caminar
I walk slowly or have limited mobility|Kõnnin aeglaselt või mu liikumisvõime on piiratud|Kävelen hitaasti tai liikkumiseni on rajoittunut|Camino despacio o tengo movilidad reducida
I use a wheelchair or mobility aid|Kasutan ratastooli või liikumisabivahendit|Käytän pyörätuolia tai liikkumisapuvälinettä|Uso silla de ruedas o ayuda a la movilidad
Walking times use your pace, and pick-ups are prioritised for people who cannot walk.|Kõnniajad arvestavad sinu tempot ja küüt eelistab neid, kes ei saa kõndida.|Kävelyajat lasketaan tahtisi mukaan, ja kyydeissä etusijalla ovat ne, jotka eivät pysty kävelemään.|Los tiempos a pie usan tu ritmo y las recogidas dan prioridad a quien no puede caminar.
Accessible vehicles are offered first and your pick-up requests get top priority.|Esmalt pakutakse ligipääsetavaid sõidukeid ja sinu küüdisoovid saavad kõrgeima prioriteedi.|Esteettömiä ajoneuvoja tarjotaan ensin, ja kyytipyyntösi saavat korkeimman etusijan.|Primero se ofrecen vehículos accesibles y tus solicitudes de recogida tienen máxima prioridad.
The public shelter register does not record step-free access yet.|Avalike varjumiskohtade register ei kajasta veel astmevaba ligipääsu.|Yleisten väestönsuojien rekisteri ei vielä kerro esteettömästä pääsystä.|El registro de refugios públicos aún no indica el acceso sin escalones.
Use GPS|Kasuta GPS-i|Käytä GPS:ää|Usar GPS
Pick on map|Vali kaardil|Valitse kartalta|Elegir en el mapa
Pirent dormant listing|Pirenti ootel pakkumine|Pirent-lepotilailmoitus|Oferta latente en Pirent
List a spare bike, scooter or mobility aid once.|Lisa vaba ratas, tõukeratas või liikumisabivahend üks kord.|Ilmoita vapaa pyörä, potkulauta tai liikkumisapuväline kerran.|Registra una vez una bici, patinete o ayuda a la movilidad que no uses.
It stays invisible until an alert is declared; then neighbours see it under Bike with your instructions.|See on nähtamatu, kuni kuulutatakse välja ohuteade; siis näevad naabrid seda ratta all koos sinu juhistega.|Se pysyy näkymättömänä, kunnes hälytys julistetaan; silloin naapurit näkevät sen Pyörä-kohdassa ohjeidesi kanssa.|Permanece invisible hasta que se declara una alerta; entonces los vecinos la ven en Bici con tus instrucciones.
What is it?|Mis see on?|Mikä se on?|¿Qué es?
Short description|Lühikirjeldus|Lyhyt kuvaus|Descripción breve
How does a neighbour get it?|Kuidas naaber selle kätte saab?|Miten naapuri saa sen?|¿Cómo lo consigue un vecino?
Where|Kus|Missä|Dónde
Suitable for someone who cannot walk|Sobib inimesele, kes ei saa kõndida|Sopii henkilölle, joka ei pysty kävelemään|Apto para quien no puede caminar
your location|sinu asukoht|sijaintisi|tu ubicación
Clear|Tühjenda|Tyhjennä|Borrar
Pre-list as dormant|Lisa ootel pakkumisena|Ilmoita lepotilaan|Registrar como latente
List now (alert active)|Lisa kohe (ohuteade aktiivne)|Julkaise nyt (hälytys päällä)|Publicar ahora (alerta activa)
Your listings|Sinu pakkumised|Ilmoituksesi|Tus ofertas
Remove|Eemalda|Poista|Eliminar
dormant|ootel|lepotilassa|latente
active|aktiivne|aktiivinen|activo
claimed|võetud|varattu|reservado
Shelters: Päästeamet public shelter register|Varjumiskohad: Päästeameti avalike varjumiskohtade register|Suojat: Pelastusviraston yleisten väestönsuojien rekisteri|Refugios: registro de refugios públicos de Päästeamet
Places and routing: © OpenStreetMap contributors.|Kohad ja teekonnad: © OpenStreetMapi kaastöölised.|Paikat ja reititys: © OpenStreetMapin tekijät.|Lugares y rutas: © colaboradores de OpenStreetMap.
Construction and hazard zones: the municipality.|Ehitustööd ja ohualad: linn.|Rakennustyöt ja vaara-alueet: kaupunki.|Obras y zonas de peligro: el ayuntamiento.
© OpenStreetMap contributors|© OpenStreetMapi kaastöölised|© OpenStreetMapin tekijät|© colaboradores de OpenStreetMap
// ---- be ready ----
What to do before and during an emergency|Mida teha enne hädaolukorda ja selle ajal|Mitä tehdä ennen hätätilannetta ja sen aikana|Qué hacer antes y durante una emergencia
Päästeamet advises every household to keep supplies for at least a week.|Päästeamet soovitab igal leibkonnal hoida varusid vähemalt nädalaks.|Viro pelastusvirasto neuvoo jokaista kotitaloutta pitämään varoja vähintään viikoksi.|Päästeamet recomienda a cada hogar tener reservas para al menos una semana.
Drinking water: about 3 litres per person per day|Joogivesi: umbes 3 liitrit inimese kohta päevas|Juomavettä: noin 3 litraa henkeä kohti päivässä|Agua potable: unos 3 litros por persona y día
Food that keeps and needs no cooking|Säiliv toit, mis ei vaja valmistamist|Säilyvää ruokaa, joka ei vaadi valmistusta|Comida que se conserve y no necesite cocinarse
Prescription medicines and a first-aid kit|Retseptiravimid ja esmaabikomplekt|Reseptilääkkeet ja ensiapupakkaus|Medicamentos recetados y botiquín
Torch, spare batteries, power bank and a battery radio|Taskulamp, varupatareid, akupank ja patareidega raadio|Taskulamppu, varaparistot, varavirtalähde ja paristokäyttöinen radio|Linterna, pilas de repuesto, batería externa y radio a pilas
Some cash and copies of documents|Veidi sularaha ja dokumentide koopiad|Hieman käteistä ja asiakirjojen kopiot|Algo de efectivo y copias de documentos
Your nearest public shelter is always one tap away: the Shelters chip or the directions button during an alert.|Sinu lähim avalik varjumiskoht on alati ühe puudutuse kaugusel: varjumiskohtade nupp või ohuteate ajal juhiste nupp.|Lähin yleinen väestönsuojasi on aina yhden napautuksen päässä: Suojat-painike tai hälytyksen aikana reittiohjepainike.|Tu refugio público más cercano está siempre a un toque: el botón Refugios o el de cómo llegar durante una alerta.
// ---- contribute ----
Improve the city with the municipality and your neighbours|Paranda linna koos linnavalitsuse ja naabritega|Paranna kaupunkia yhdessä kaupungin ja naapuriesi kanssa|Mejora la ciudad con el ayuntamiento y tus vecinos
Emergency report|Hädaolukorra teade|Hätäilmoitus|Aviso de emergencia
Fallen tree|Langenud puu|Kaatunut puu|Árbol caído
Report an issue|Teata probleemist|Ilmoita ongelmasta|Informar de un problema
Share an idea|Jaga ideed|Jaa idea|Compartir una idea
Road or pavement damage|Tee- või kõnniteekahjustus|Tie- tai jalkakäytävävaurio|Daños en calzada o acera
Broken street light|Katkine tänavavalgusti|Rikkinäinen katuvalo|Farola averiada
Accessibility barrier|Ligipääsetavuse takistus|Esteettömyyden este|Barrera de accesibilidad
Litter or dumping|Prügi või prügistamine|Roskia tai luvaton kaatopaikka|Basura o vertidos
Broken bench or playground|Katkine pink või mänguväljak|Rikkinäinen penkki tai leikkipaikka|Banco o parque infantil roto
Other issue|Muu probleem|Muu ongelma|Otro problema
More trees or green space|Rohkem puid või haljasala|Lisää puita tai viheralueita|Más árboles o zonas verdes
Benches or shade|Pingid või vari|Penkkejä tai varjoa|Bancos o sombra
Cycling improvement|Rattasõidu parendus|Pyöräilyn parannus|Mejora ciclista
Safer crossing|Ohutum ülekäik|Turvallisempi suojatie|Cruce más seguro
Play or sport|Mäng või sport|Leikki tai urheilu|Juego o deporte
Other idea|Muu idee|Muu idea|Otra idea
Your idea|Sinu idee|Ideasi|Tu idea
What is wrong?|Mis on valesti?|Mikä on vialla?|¿Qué pasa?
e.g. Bike racks by the Balti jaam market|nt jalgrattahoidjad Balti jaama turu juures|esim. pyörätelineet Balti jaamin torin viereen|p. ej., aparcabicis junto al mercado de Balti jaam
e.g. Deep pothole on the cycle path|nt sügav auk jalgrattateel|esim. syvä kuoppa pyörätiellä|p. ej., bache profundo en el carril bici
Details (optional)|Üksikasjad (valikuline)|Lisätiedot (valinnainen)|Detalles (opcional)
Why would it help, and who?|Miks see aitaks ja keda?|Miksi se auttaisi ja ketä?|¿Por qué ayudaría y a quién?
Where exactly, and since when?|Kus täpselt ja millest alates?|Missä tarkalleen ja mistä lähtien?|¿Dónde exactamente y desde cuándo?
Pinned on the map|Kaardile märgitud|Merkitty kartalle|Marcado en el mapa
At your current location|Sinu praeguses asukohas|Nykyisessä sijainnissasi|En tu ubicación actual
Move pin|Liiguta märki|Siirrä merkkiä|Mover marcador
Share idea|Jaga ideed|Jaa idea|Compartir idea
Send to the city|Saada linnale|Lähetä kaupungille|Enviar al ayuntamiento
Visible to the city and your neighbours. Neighbours can support it and comment; the city updates its status.|Nähtav linnale ja naabritele. Naabrid saavad seda toetada ja kommenteerida; linn uuendab selle olekut.|Näkyy kaupungille ja naapureillesi. Naapurit voivat tukea ja kommentoida; kaupunki päivittää tilan.|Visible para el ayuntamiento y tus vecinos. Los vecinos pueden apoyarlo y comentar; el ayuntamiento actualiza su estado.
Near you|Sinu lähedal|Lähelläsi|Cerca de ti
most supported|enim toetatud|eniten tuettu|más apoyados
What did you see?|Mida sa nägid?|Mitä näit?|¿Qué has visto?
Blocking a street or path|Blokeerib tänava või tee|Tukkii kadun tai polun|Bloquea una calle o camino
Fallen branches|Langenud oksad|Pudonneita oksia|Ramas caídas
Branches or debris on the ground|Oksad või prahti maas|Oksia tai roskia maassa|Ramas o escombros en el suelo
Tree at risk|Ohtlik puu|Vaarallinen puu|Árbol en riesgo
Leaning, cracked or large tree that could fall|Kaldu, lõhenenud või suur puu, mis võib kukkuda|Kallistunut, haljennut tai suuri puu, joka voi kaatua|Árbol inclinado, agrietado o grande que podría caer
Flooded street|Üleujutatud tänav|Tulvinut katu|Calle inundada
Water on the street or in an underpass|Vesi tänaval või tunnelis|Vettä kadulla tai alikulussa|Agua en la calle o en un paso subterráneo
Blocked way|Suletud tee|Tukkeutunut reitti|Paso bloqueado
Debris, a fallen pole or a closed passage|Praht, kukkunud post või suletud läbipääs|Roskia, kaatunut pylväs tai suljettu kulku|Escombros, un poste caído o un paso cerrado
Other danger|Muu oht|Muu vaara|Otro peligro
Loose roofing, broken glass, a downed power line|Lahtine katusekate, katkine klaas, maha kukkunud elektriliin|Irtonainen katto, rikkoutunut lasi, katkennut sähkölinja|Tejado suelto, cristales rotos, un cable eléctrico caído
e.g. Birch across the pavement by the tram stop|nt kask üle kõnnitee trammipeatuse juures|esim. koivu jalkakäytävän poikki raitiovaunupysäkillä|p. ej., abedul atravesado en la acera junto a la parada del tranvía
Send emergency report|Saada hädaolukorra teade|Lähetä hätäilmoitus|Enviar aviso de emergencia
Send storm report|Saada tormiteade|Lähetä myrskyilmoitus|Enviar aviso de tormenta
Routes for everyone avoid it straight away, and the city sees it under Citizen contributions.|Kõigi teekonnad väldivad seda kohe ja linn näeb seda elanike panuste all.|Kaikkien reitit välttävät sen heti, ja kaupunki näkee sen asukkaiden ehdotuksissa.|Las rutas de todos lo evitan al momento y el ayuntamiento lo ve en Aportaciones vecinales.
Routes for everyone avoid it straight away.|Kõigi teekonnad väldivad seda kohe.|Kaikkien reitit välttävät sen heti.|Las rutas de todos lo evitan al momento.
Report fallen tree|Teata langenud puust|Ilmoita kaatuneesta puusta|Avisar de árbol caído
Report flooding|Teata üleujutusest|Ilmoita tulvasta|Avisar de inundación
Report a hazard|Teata ohust|Ilmoita vaarasta|Avisar de un peligro
Report a fallen tree|Teata langenud puust|Ilmoita kaatuneesta puusta|Avisar de un árbol caído
New|Uus|Uusi|Nuevo
Seen by the city|Linn on näinud|Kaupunki on nähnyt|Visto por el ayuntamiento
Planned|Planeeritud|Suunniteltu|Planificado
In progress|Töös|Työn alla|En curso
Done|Valmis|Valmis|Hecho
Not planned|Pole plaanis|Ei suunnitteilla|No previsto
Issue|Probleem|Ongelma|Problema
Idea|Idee|Idea|Idea
Comments|Kommentaarid|Kommentit|Comentarios
No comments yet.|Kommentaare veel pole.|Ei vielä kommentteja.|Aún no hay comentarios.
Add a comment|Lisa kommentaar|Lisää kommentti|Añade un comentario
Post|Postita|Lähetä|Publicar
Issues and ideas from residents|Elanike probleemid ja ideed|Asukkaiden ongelmat ja ideat|Problemas e ideas de los vecinos
Nothing yet. Be the first.|Veel pole midagi. Ole esimene.|Ei vielä mitään. Ole ensimmäinen.|Aún no hay nada. Sé el primero.
city|linn|kaupunki|ayuntamiento
resident|elanik|asukas|vecino
example|näide|esimerkki|ejemplo
// ---- municipality: tabs ----
Construction works|Ehitustööd|Rakennustyöt|Obras
Citizen contributions|Elanike panused|Asukkaiden ehdotukset|Aportaciones vecinales
Overview|Ülevaade|Yleiskatsaus|Resumen
Crisis operations|Kriisitöö|Kriisitoiminta|Operaciones de crisis
Fleet unlock|Sõidukite avamine|Ajoneuvojen avaus|Desbloqueo de flotas
Pick-up dispatch|Küüdikorraldus|Kyytien välitys|Gestión de recogidas
Neighbour listings|Naabrite pakkumised|Naapureiden ilmoitukset|Ofertas de vecinos
MDS log|MDS-logi|MDS-loki|Registro MDS
Tallinna Linnavalitsus|Tallinna Linnavalitsus|Tallinnan kaupunginhallitus|Ayuntamiento de Tallin
// ---- municipality: contributions ----
Issues and ideas residents pinned on the map. Set a status and reply; residents see both.|Probleemid ja ideed, mille elanikud kaardile märkisid. Määra olek ja vasta; elanikud näevad mõlemat.|Asukkaiden kartalle merkitsemät ongelmat ja ideat. Aseta tila ja vastaa; asukkaat näkevät molemmat.|Problemas e ideas que los vecinos marcaron en el mapa. Pon un estado y responde; los vecinos ven ambos.
All|Kõik|Kaikki|Todo
Issues|Probleemid|Ongelmat|Problemas
Ideas|Ideed|Ideat|Ideas
Emergency|Hädaolukord|Hätä|Emergencia
Filter|Filter|Suodatin|Filtro
Fallen trees, flooded streets, blocked ways and other dangers residents reported during alerts. Routes avoid everything not cleared.|Langenud puud, üleujutatud tänavad, suletud teed ja muud ohud, millest elanikud ohuteadete ajal teatasid. Teekonnad väldivad kõike, mis pole koristatud.|Kaatuneet puut, tulvineet kadut, tukkeutuneet reitit ja muut vaarat, joista asukkaat ilmoittivat hälytysten aikana. Reitit välttävät kaiken raivaamattoman.|Árboles caídos, calles inundadas, pasos bloqueados y otros peligros que los vecinos avisaron durante alertas. Las rutas evitan todo lo que no se ha retirado.
No emergency reports.|Hädaolukorra teateid pole.|Ei hätäilmoituksia.|No hay avisos de emergencia.
city crew|linna meeskond|kaupungin työryhmä|equipo municipal
new|uus|uusi|nuevo
confirmed|kinnitatud|vahvistettu|confirmado
cleared|koristatud|raivattu|retirado
Confirm|Kinnita|Vahvista|Confirmar
Mark cleared|Märgi koristatuks|Merkitse raivatuksi|Marcar como retirado
Reopen|Ava uuesti|Avaa uudelleen|Reabrir
Show|Näita|Näytä|Mostrar
Plan as construction works|Planeeri ehitustööna|Suunnittele rakennustyöksi|Planificar como obra
Reply publicly as the city|Vasta avalikult linna nimel|Vastaa julkisesti kaupungin puolesta|Responder públicamente como ayuntamiento
Reply|Vasta|Vastaa|Responder
City reply|Linna vastus|Kaupungin vastaus|Respuesta municipal
Reply published|Vastus avaldatud|Vastaus julkaistu|Respuesta publicada
// ---- municipality: works ----
Add construction works|Lisa ehitustööd|Lisää rakennustyö|Añadir obra
Edit construction works|Muuda ehitustöid|Muokkaa rakennustyötä|Editar obra
Register a site with its dates. Citizens see it on the map, and everyday routes steer around it for the modes it affects.|Registreeri töö koos kuupäevadega. Elanikud näevad seda kaardil ja igapäevased teekonnad väldivad seda neis liikumisviisides, mida see mõjutab.|Rekisteröi työmaa päivämäärineen. Asukkaat näkevät sen kartalla, ja arkireitit kiertävät sen niissä kulkutavoissa, joihin se vaikuttaa.|Registra una obra con sus fechas. Los vecinos la ven en el mapa y las rutas diarias la evitan en los modos a los que afecta.
Change the location, dates or affected modes. Citizens see the update straight away.|Muuda asukohta, kuupäevi või mõjutatud liikumisviise. Elanikud näevad muudatust kohe.|Muuta sijaintia, päivämääriä tai kulkutapoja. Asukkaat näkevät päivityksen heti.|Cambia la ubicación, las fechas o los modos afectados. Los vecinos ven el cambio al momento.
Name|Nimi|Nimi|Nombre
e.g. Telliskivi street reconstruction|nt Telliskivi tänava rekonstrueerimine|esim. Telliskivi-kadun peruskorjaus|p. ej., reforma de la calle Telliskivi
Type|Tüüp|Tyyppi|Tipo
Now click where the works end|Nüüd klõpsa, kus tööd lõpevad|Napsauta nyt, mihin työt päättyvät|Ahora haz clic donde terminan las obras
Snapping to the streets…|Joondan tänavatega…|Sovitetaan katuihin…|Ajustando a las calles…
Click where the works start and where they end; the line follows the streets|Klõpsa, kus tööd algavad ja lõpevad; joon järgib tänavaid|Napsauta, mistä työt alkavat ja mihin ne päättyvät; viiva seuraa katuja|Haz clic donde empiezan y terminan las obras; la línea sigue las calles
Draw on map|Joonista kaardile|Piirrä kartalle|Dibujar en el mapa
Add points|Lisa punkte|Lisää pisteitä|Añadir puntos
Undo point|Võta punkt tagasi|Kumoa piste|Deshacer punto
Start date|Alguskuupäev|Alkupäivä|Fecha de inicio
End date|Lõppkuupäev|Loppupäivä|Fecha de fin
Note for residents|Märkus elanikele|Viesti asukkaille|Nota para los vecinos
e.g. Pavement closed, use the other side|nt kõnnitee suletud, kasuta teist poolt|esim. jalkakäytävä suljettu, käytä toista puolta|p. ej., acera cerrada, usa la otra
Publish construction works|Avalda ehitustööd|Julkaise rakennustyö|Publicar obra
Save changes|Salvesta muudatused|Tallenna muutokset|Guardar cambios
Cancel|Tühista|Peruuta|Cancelar
Registered works|Registreeritud tööd|Rekisteröidyt työt|Obras registradas
upcoming|tulemas|tulossa|próxima
finished|lõppenud|päättynyt|terminada
Edit|Muuda|Muokkaa|Editar
+7 days|+7 päeva|+7 päivää|+7 días
Tip: click a site on the map to edit it.|Nõuanne: klõpsa kaardil tööl, et seda muuta.|Vinkki: muokkaa työmaata napsauttamalla sitä kartalla.|Consejo: haz clic en una obra del mapa para editarla.
Finished works stay listed but leave the map automatically.|Lõppenud tööd jäävad nimekirja, kuid kaovad kaardilt automaatselt.|Päättyneet työt jäävät luetteloon mutta poistuvat kartalta automaattisesti.|Las obras terminadas siguen en la lista pero desaparecen del mapa.
// ---- municipality: overview ----
City works|Linna tööd|Kaupungin työt|Obras municipales
live|reaalajas|reaaliajassa|en directo
construction sites active|käimasolevat ehitustööd|käynnissä olevat työmaat|obras activas
starting soon|algamas|alkamassa|próximamente
shelters near works|varjumiskohad tööde lähedal|suojat työmaiden lähellä|refugios cerca de obras
Crisis status|Kriisi olek|Kriisitilanne|Estado de crisis
Standby|Valmisolek|Valmiustila|En espera
public shelters (register)|avalikud varjumiskohad (register)|yleiset väestönsuojat (rekisteri)|refugios públicos (registro)
devices pushed (sim.)|teade saadetud seadmetele (sim.)|laitteille lähetetty (sim.)|dispositivos avisados (sim.)
operators applied|operaatorid rakendanud|operaattorit soveltaneet|operadores aplicado
vehicles at €0|sõidukid €0 hinnaga|ajoneuvot 0 €:lla|vehículos a 0 €
listings active|pakkumised aktiivsed|ilmoitukset voimassa|ofertas activas
pick-ups matched|küüdid sobitatud|kyydit yhdistetty|recogidas asignadas
Map|Kaart|Kartta|Mapa
Lend|Laenamine|Lainaus|Préstamo
Waiting for declaration.|Ootab väljakuulutamist.|Odottaa julistamista.|Esperando la declaración.
Fleets locked.|Sõidukid lukus.|Ajoneuvot lukittu.|Flotas bloqueadas.
Publishing…|Avaldan…|Julkaistaan…|Publicando…
Data sources|Andmeallikad|Tietolähteet|Fuentes de datos
Public shelters|Avalikud varjumiskohad|Yleiset väestönsuojat|Refugios públicos
Hospitals, pharmacies, cool places, water|Haiglad, apteegid, jahedad kohad, vesi|Sairaalat, apteekit, viileät paikat, vesi|Hospitales, farmacias, lugares frescos, agua
OpenStreetMap, fetched 25 Sep 2026|OpenStreetMap, laaditud 25.09.2026|OpenStreetMap, haettu 25.9.2026|OpenStreetMap, obtenido el 25/09/2026
Hazard zones|Ohualad|Vaara-alueet|Zonas de peligro
Drawn by the city during an alert; seeded ones are examples|Linn joonistab ohuteate ajal; eelseadistatud on näited|Kaupunki piirtää hälytyksen aikana; valmiit ovat esimerkkejä|Las dibuja el ayuntamiento durante una alerta; las precargadas son ejemplos
Fallen tree reports|Langenud puude teated|Ilmoitukset kaatuneista puista|Avisos de árboles caídos
From citizens and city crews|Elanikelt ja linna meeskondadelt|Asukkailta ja kaupungin työryhmiltä|De vecinos y equipos municipales
Storms|Tormid|Myrskyt|Tormentas
Added by the city under the storm protocol|Linn lisab tormiprotokolli alusel|Kaupunki lisää myrskyprotokollan mukaisesti|Las añade el ayuntamiento con el protocolo de tormenta
Issues and ideas pinned by residents|Elanike märgitud probleemid ja ideed|Asukkaiden merkitsemät ongelmat ja ideat|Problemas e ideas marcados por vecinos
// ---- municipality: crisis ----
Choose the protocol|Vali protokoll|Valitse protokolla|Elige el protocolo
Emergency protocol|Hädaolukorra protokoll|Hätäprotokolla|Protocolo de emergencia
Each protocol changes where citizens are sent and how their route is chosen.|Iga protokoll muudab, kuhu elanikud suunatakse ja kuidas nende teekond valitakse.|Jokainen protokolla muuttaa, minne asukkaat ohjataan ja miten heidän reittinsä valitaan.|Cada protocolo cambia a dónde se envía a los vecinos y cómo se elige su ruta.
District|Linnaosa|Kaupunginosa|Distrito
Time-box|Kestus|Kesto|Duración
Message pushed to phones|Telefonidesse saadetav teade|Puhelimiin lähetettävä viesti|Mensaje enviado a los móviles
Unlock shared fleets on declaration|Ava jagatud sõidukid väljakuulutamisel|Avaa jaetut ajoneuvot julistettaessa|Desbloquear flotas compartidas al declarar
Unlock shared fleets on declaration (not advised in strong wind)|Ava jagatud sõidukid väljakuulutamisel (tugeva tuulega ei soovitata)|Avaa jaetut ajoneuvot julistettaessa (ei suositella kovassa tuulessa)|Desbloquear flotas compartidas al declarar (no recomendable con viento fuerte)
Active|Aktiivne|Aktiivinen|Activa
End alert|Lõpeta ohuteade|Lopeta hälytys|Finalizar alerta
End the alert to switch protocol.|Protokolli vahetamiseks lõpeta ohuteade.|Lopeta hälytys vaihtaaksesi protokollaa.|Finaliza la alerta para cambiar de protocolo.
Name the storm|Anna tormile nimi|Nimeä myrsky|Ponle nombre a la tormenta
Add the storm the city is tracking. Citizens see its area and wind, and gusts of 25 m/s or more make routes keep further from trees and the shoreline.|Lisa torm, mida linn jälgib. Elanikud näevad selle ala ja tuult ning vähemalt 25 m/s puhangute korral hoiavad teekonnad puudest ja rannajoonest kaugemale.|Lisää myrsky, jota kaupunki seuraa. Asukkaat näkevät sen alueen ja tuulen, ja vähintään 25 m/s puuskissa reitit pysyvät kauempana puista ja rantaviivasta.|Añade la tormenta que sigue el ayuntamiento. Los vecinos ven su zona y el viento, y con rachas de 25 m/s o más las rutas se alejan más de árboles y costa.
Storm name|Tormi nimi|Myrskyn nimi|Nombre de la tormenta
e.g. Storm Ingrid|nt torm Ingrid|esim. myrsky Ingrid|p. ej., tormenta Ingrid
Wind (m/s)|Tuul (m/s)|Tuuli (m/s)|Viento (m/s)
Gusts (m/s)|Puhangud (m/s)|Puuskat (m/s)|Rachas (m/s)
Wind from|Tuule suund|Tuulen suunta|Viento del
Arrives|Saabub|Saapuu|Llega
Lasts (h)|Kestab (h)|Kestää (h)|Dura (h)
Area (km)|Ala (km)|Alue (km)|Zona (km)
Centred on Tallinn|Keskpunkt Tallinnas|Keskitetty Tallinnaan|Centrada en Tallin
Set centre on map|Määra keskpunkt kaardil|Aseta keskipiste kartalle|Fijar el centro en el mapa
Add storm|Lisa torm|Lisää myrsky|Añadir tormenta
No storm added yet.|Tormi pole veel lisatud.|Myrskyä ei ole vielä lisätty.|Aún no se ha añadido ninguna tormenta.
Fallen trees and branches|Langenud puud ja oksad|Kaatuneet puut ja oksat|Árboles y ramas caídos
Reported by citizens in the app and by city crews. Routes avoid every report that is not cleared.|Teatavad elanikud rakenduses ja linna meeskonnad. Teekonnad väldivad kõiki koristamata teateid.|Asukkaiden sovelluksessa ja kaupungin työryhmien ilmoittamat. Reitit välttävät kaikki raivaamattomat ilmoitukset.|Avisados por vecinos en la app y por equipos municipales. Las rutas evitan todos los avisos no retirados.
Add city report|Lisa linna teade|Lisää kaupungin ilmoitus|Añadir aviso municipal
Place on map|Märgi kaardile|Merkitse kartalle|Marcar en el mapa
Not placed yet|Pole veel märgitud|Ei vielä merkitty|Aún sin marcar
Flooded areas|Üleujutatud alad|Tulva-alueet|Zonas inundadas
Unsafe places|Ohtlikud kohad|Vaaralliset paikat|Lugares peligrosos
Flood protocol|Üleujutuse protokoll|Tulvaprotokolla|Protocolo de inundación
Storm protocol|Tormiprotokoll|Myrskyprotokolla|Protocolo de tormenta
Mark streets under water. Citizen routes are recalculated around them, and shelters inside them are skipped.|Märgi vee all olevad tänavad. Elanike teekonnad arvutatakse neist mööda ja nende sees olevad varjumiskohad jäetakse vahele.|Merkitse veden alla jääneet kadut. Asukkaiden reitit lasketaan niiden ohi, ja niiden sisällä olevat suojat ohitetaan.|Marca las calles bajo el agua. Las rutas se recalculan para rodearlas y se omiten los refugios dentro de ellas.
Mark fallen trees, flying debris or closed streets. Citizen routes avoid them, as well as trees, the shoreline and construction sites.|Märgi langenud puud, lendav praht või suletud tänavad. Elanike teekonnad väldivad neid, samuti puid, rannajoont ja ehitusplatse.|Merkitse kaatuneet puut, lentävät roskat tai suljetut kadut. Asukkaiden reitit välttävät ne sekä puut, rantaviivan ja työmaat.|Marca árboles caídos, objetos volando o calles cerradas. Las rutas los evitan, igual que árboles, costa y obras.
Add flooded area|Lisa üleujutatud ala|Lisää tulva-alue|Añadir zona inundada
Add unsafe place|Lisa ohtlik koht|Lisää vaarallinen paikka|Añadir lugar peligroso
No flooded areas marked.|Üleujutatud alasid pole märgitud.|Tulva-alueita ei ole merkitty.|No hay zonas inundadas marcadas.
No unsafe places marked.|Ohtlikke kohti pole märgitud.|Vaarallisia paikkoja ei ole merkitty.|No hay lugares peligrosos marcados.
Radius (m)|Raadius (m)|Säde (m)|Radio (m)
example zone|näidisala|esimerkkialue|zona de ejemplo
// ---- municipality: fleet, dispatch, listings, log ----
Fleet unlock (MDS)|Sõidukite avamine (MDS)|Ajoneuvojen avaus (MDS)|Desbloqueo de flotas (MDS)
Unlock the operators|Ava operaatorite sõidukid|Avaa operaattoreiden ajoneuvot|Desbloquear a los operadores
Publishes an Emergency Unlock Mandate as an MDS Policy: zero fare near shelters, time-boxed to the alert, revoked automatically.|Avaldab hädaolukorra avamismandaadi MDS-poliitikana: nullhind varjumiskohtade lähedal, kehtib ohuteate ajal ja tühistatakse automaatselt.|Julkaisee hätäavausvaltuutuksen MDS-käytäntönä: maksuton suojien lähellä, voimassa hälytyksen ajan ja peruuntuu automaattisesti.|Publica un Mandato de Desbloqueo de Emergencia como política MDS: tarifa cero cerca de refugios, limitado a la alerta y revocado automáticamente.
Geofence radius around each shelter:|Geoaia raadius iga varjumiskoha ümber:|Geoaidan säde kunkin suojan ympärillä:|Radio de geovalla alrededor de cada refugio:
Lock fleets|Lukusta sõidukid|Lukitse ajoneuvot|Bloquear flotas
Re-publish|Avalda uuesti|Julkaise uudelleen|Volver a publicar
Unlock fleets|Ava sõidukid|Avaa ajoneuvot|Desbloquear flotas
Declare an alert first, under Crisis operations.|Kuuluta esmalt välja ohuteade jaotises Kriisitöö.|Julista ensin hälytys kohdassa Kriisitoiminta.|Declara primero una alerta en Operaciones de crisis.
Storm protocol: riding in strong wind is dangerous. Unlock only if the wind has eased.|Tormiprotokoll: tugeva tuulega sõitmine on ohtlik. Ava ainult siis, kui tuul on vaibunud.|Myrskyprotokolla: ajaminen kovassa tuulessa on vaarallista. Avaa vain, jos tuuli on tyyntynyt.|Protocolo de tormenta: circular con viento fuerte es peligroso. Desbloquea solo si el viento ha amainado.
Fleet|Sõidukipark|Kalusto|Flota
In geofence|Geoaias|Geoaidan sisällä|En la geovalla
Types|Tüübid|Tyypit|Tipos
locked|lukus|lukittu|bloqueado
normal pricing|tavahind|normaali hinta|precio normal
awaiting…|ootel…|odottaa…|esperando…
Organise|Korraldus|Organisointi|Organización
pick-up dispatch|küüdikorraldus|kyytien välitys|gestión de recogidas
Priority queue|Prioriteetne järjekord|Prioriteettijono|Cola de prioridad
Run matching|Sobita|Yhdistä|Asignar
Pri.|Prior.|Prior.|Prior.
Who|Kes|Kuka|Quién
Need|Vajadus|Tarve|Necesidad
matched|sobitatud|yhdistetty|asignado
phone|telefon|puhelin|teléfono
Add a request from a phone call|Lisa telefonikõne põhjal soov|Lisää pyyntö puhelun perusteella|Añadir una solicitud telefónica
Caller|Helistaja|Soittaja|Quien llama
Name or address|Nimi või aadress|Nimi tai osoite|Nombre o dirección
Add to queue|Lisa järjekorda|Lisää jonoon|Añadir a la cola
No pick-up requests. They appear the moment an alert is declared.|Küüdisoove pole. Need ilmuvad kohe, kui ohuteade välja kuulutatakse.|Ei kyytipyyntöjä. Ne näkyvät heti, kun hälytys julistetaan.|No hay solicitudes. Aparecen en cuanto se declara una alerta.
Resolve / remove|Lahenda / eemalda|Ratkaise / poista|Resolver / eliminar
Lend from the citizens|Laenamine elanikelt|Lainaus asukkailta|Préstamo de los vecinos
Shared with the Rescue Board only while an alert is active; owners are notified on every claim.|Jagatakse Päästeametiga ainult ohuteate ajal; omanikke teavitatakse igast võtmisest.|Jaetaan pelastusviranomaisen kanssa vain hälytyksen aikana; omistajalle ilmoitetaan jokaisesta varauksesta.|Se comparte con los servicios de rescate solo durante una alerta; los dueños reciben aviso de cada reserva.
MDS exchange log|MDS-andmevahetuse logi|MDS-tiedonvaihtoloki|Registro de intercambio MDS
No calls yet. Unlock the fleets to publish the mandate.|Päringuid veel pole. Mandaadi avaldamiseks ava sõidukid.|Ei vielä kutsuja. Julkaise valtuutus avaamalla ajoneuvot.|Aún no hay llamadas. Desbloquea las flotas para publicar el mandato.
Rescue Board|Päästeamet|Pelastusviranomainen|Servicios de rescate
// ---- toasts & dialogs ----
Demo reset|Demo lähtestatud|Demo nollattu|Demo reiniciada
Reset the demo? This clears the alert, listings, works, hazard zones and requests on this device.|Kas lähtestada demo? See kustutab selles seadmes ohuteate, pakkumised, tööd, ohualad ja soovid.|Nollataanko demo? Tämä tyhjentää tämän laitteen hälytyksen, ilmoitukset, työt, vaara-alueet ja pyynnöt.|¿Reiniciar la demo? Se borrarán la alerta, las ofertas, las obras, las zonas de peligro y las solicitudes de este dispositivo.
Could not read your location|Asukohta ei õnnestunud lugeda|Sijaintiasi ei voitu lukea|No se pudo leer tu ubicación
Geolocation not available|Asukohatuvastus pole saadaval|Paikannus ei ole käytettävissä|Geolocalización no disponible
Give the construction site a name|Anna ehitustööle nimi|Anna työmaalle nimi|Ponle nombre a la obra
Draw the street section: click where the works start and where they end|Joonista tänavalõik: klõpsa, kus tööd algavad ja lõpevad|Piirrä katuosuus: napsauta, mistä työt alkavat ja mihin ne päättyvät|Dibuja el tramo: haz clic donde empiezan y terminan las obras
Check the dates: the end must not be before the start|Kontrolli kuupäevi: lõpp ei tohi olla enne algust|Tarkista päivämäärät: loppu ei voi olla ennen alkua|Revisa las fechas: el final no puede ser anterior al inicio
Construction site published to the citizen map|Ehitustöö avaldati elanike kaardil|Työmaa julkaistiin asukkaiden kartalle|Obra publicada en el mapa vecinal
Changes published — citizens see the new location and dates|Muudatused avaldatud — elanikud näevad uut asukohta ja kuupäevi|Muutokset julkaistu — asukkaat näkevät uuden sijainnin ja päivämäärät|Cambios publicados: los vecinos ven la nueva ubicación y fechas
Thank you. The city and your neighbours can see it, and routes avoid it now.|Aitäh. Linn ja naabrid näevad seda ning teekonnad väldivad seda nüüd.|Kiitos. Kaupunki ja naapurisi näkevät sen, ja reitit välttävät sen nyt.|Gracias. El ayuntamiento y tus vecinos pueden verlo y las rutas ya lo evitan.
Report added — routes avoid it|Teade lisatud — teekonnad väldivad seda|Ilmoitus lisätty — reitit välttävät sen|Aviso añadido: las rutas lo evitan
Idea shared with the city and your neighbours|Idee jagati linna ja naabritega|Idea jaettiin kaupungille ja naapureillesi|Idea compartida con el ayuntamiento y tus vecinos
Issue sent to the city. Neighbours can support it too.|Probleem saadeti linnale. Naabrid saavad seda ka toetada.|Ongelma lähetettiin kaupungille. Naapurit voivat myös tukea sitä.|Problema enviado al ayuntamiento. Los vecinos también pueden apoyarlo.
Give your idea a short title|Anna oma ideele lühike pealkiri|Anna ideallesi lyhyt otsikko|Ponle un título corto a tu idea
Describe the issue in a few words|Kirjelda probleemi mõne sõnaga|Kuvaile ongelma muutamalla sanalla|Describe el problema en pocas palabras
Storm published to the citizen map|Torm avaldati elanike kaardil|Myrsky julkaistiin asukkaiden kartalle|Tormenta publicada en el mapa vecinal
Set when the storm arrives|Määra tormi saabumise aeg|Aseta myrskyn saapumisaika|Indica cuándo llega la tormenta
Place it on the map first|Märgi see esmalt kaardile|Merkitse se ensin kartalle|Márcalo primero en el mapa
Place the report on the map first|Märgi teade esmalt kaardile|Merkitse ilmoitus ensin kartalle|Marca primero el aviso en el mapa
Name the flooded area|Anna üleujutatud alale nimi|Nimeä tulva-alue|Ponle nombre a la zona inundada
Name the unsafe place|Anna ohtlikule kohale nimi|Nimeä vaarallinen paikka|Ponle nombre al lugar peligroso
Flooded area published — citizen routes go around it|Üleujutatud ala avaldatud — elanike teekonnad lähevad sellest mööda|Tulva-alue julkaistu — asukkaiden reitit kiertävät sen|Zona inundada publicada: las rutas la rodean
Unsafe place published — citizen routes avoid it|Ohtlik koht avaldatud — elanike teekonnad väldivad seda|Vaarallinen paikka julkaistu — asukkaiden reitit välttävät sen|Lugar peligroso publicado: las rutas lo evitan
Give the listing a short description|Anna pakkumisele lühikirjeldus|Anna ilmoitukselle lyhyt kuvaus|Añade una descripción breve a la oferta
Listing is live — an alert is active|Pakkumine on avaldatud — ohuteade on aktiivne|Ilmoitus on julkaistu — hälytys on päällä|La oferta está publicada: hay una alerta activa
Listed as dormant — invisible until an alert is declared|Lisatud ootel — nähtamatu kuni ohuteate väljakuulutamiseni|Ilmoitettu lepotilaan — näkymätön, kunnes hälytys julistetaan|Registrada como latente: invisible hasta que se declare una alerta
Listed as a driver — you will be matched with a neighbour who needs a pick-up|Oled juhtide nimekirjas — sind sobitatakse küüti vajava naabriga|Olet kuljettajalistalla — sinut yhdistetään kyytiä tarvitsevaan naapuriin|Estás como conductor: te emparejaremos con un vecino que necesite recogida
Request added to the dispatch queue|Soov lisati küüdijärjekorda|Pyyntö lisättiin jonoon|Solicitud añadida a la cola
Who is calling? Add a name or address|Kes helistab? Lisa nimi või aadress|Kuka soittaa? Lisää nimi tai osoite|¿Quién llama? Añade un nombre o dirección
Fleets locked again — normal pricing restored|Sõidukid taas lukus — tavahind taastatud|Ajoneuvot lukittu jälleen — normaali hinta palautettu|Flotas bloqueadas de nuevo: precio normal restablecido
Alert ended — pricing restored, listings back to dormant|Ohuteade lõppenud — hinnad taastatud, pakkumised taas ootel|Hälytys päättynyt — hinnat palautettu, ilmoitukset takaisin lepotilaan|Alerta finalizada: precios restablecidos y ofertas de nuevo latentes
Time-box elapsed — alert ended automatically|Kestus möödas — ohuteade lõppes automaatselt|Kesto päättyi — hälytys päättyi automaattisesti|Se agotó el tiempo: la alerta terminó automáticamente
Click the map where you are|Klõpsa kaardil, kus sa oled|Napsauta karttaa siinä, missä olet|Haz clic en el mapa donde estás
Click the map where it is|Klõpsa kaardil, kus see asub|Napsauta karttaa siinä, missä se on|Haz clic en el mapa donde está
Click the map where the vehicle is kept|Klõpsa kaardil, kus sõidukit hoitakse|Napsauta karttaa siinä, missä ajoneuvoa säilytetään|Haz clic en el mapa donde se guarda el vehículo
Click the map where the caller is|Klõpsa kaardil, kus helistaja on|Napsauta karttaa siinä, missä soittaja on|Haz clic en el mapa donde está quien llama
Click the map where the tree or branches are|Klõpsa kaardil, kus puu või oksad on|Napsauta karttaa siinä, missä puu tai oksat ovat|Haz clic en el mapa donde está el árbol o las ramas
Click the map at the centre of the area|Klõpsa kaardil ala keskel|Napsauta alueen keskikohtaa kartalla|Haz clic en el mapa en el centro de la zona
Click the map at the centre of the storm|Klõpsa kaardil tormi keskel|Napsauta myrskyn keskikohtaa kartalla|Haz clic en el mapa en el centro de la tormenta
Click where the works start, then where they end. Add clicks to follow a longer stretch.|Klõpsa, kus tööd algavad, siis kus need lõpevad. Pikema lõigu jaoks lisa klõpse.|Napsauta, mistä työt alkavat ja sitten mihin ne päättyvät. Lisää napsautuksia pidempää osuutta varten.|Haz clic donde empiezan las obras y luego donde terminan. Añade clics para seguir un tramo más largo.
Click where the works start, then where they end.|Klõpsa, kus tööd algavad, siis kus need lõpevad.|Napsauta, mistä työt alkavat ja sitten mihin ne päättyvät.|Haz clic donde empiezan las obras y luego donde terminan.
Planned after residents reported it in PiMap|Planeeritud pärast elanike teadet PiMapis|Suunniteltu asukkaiden PiMap-ilmoituksen perusteella|Planificado tras el aviso de los vecinos en PiMap
// ---- popups ----
Citizen report|Elaniku teade|Asukkaan ilmoitus|Aviso vecinal
In use|Kasutusel|Käytössä|En uso
Dormant — activates on declaration|Ootel — aktiveerub väljakuulutamisel|Lepotilassa — aktivoituu julistettaessa|Latente: se activa al declarar
Active — free to borrow|Aktiivne — vabalt laenatav|Aktiivinen — vapaasti lainattavissa|Activa: libre para pedir prestada
Claimed by a neighbour|Naaber võttis|Naapuri varasi|Reservada por un vecino
Available for pick-up|Saadaval küüdiks|Käytettävissä kyytiin|Disponible para recogida
On a pick-up|Küüdil|Kyydissä|En una recogida
Matched|Sobitatud|Yhdistetty|Asignado
Routes go around this area.|Teekonnad lähevad sellest alast mööda.|Reitit kiertävät tämän alueen.|Las rutas rodean esta zona.
Routes avoid this place.|Teekonnad väldivad seda kohta.|Reitit välttävät tämän paikan.|Las rutas evitan este lugar.
Accessible vehicle|Ligipääsetav sõiduk|Esteetön ajoneuvo|Vehículo accesible
Emergency Unlock Mandate|Hädaolukorra avamismandaat|Hätäavausvaltuutus|Mandato de Desbloqueo de Emergencia
€0|€0|0 €|0 €
`;

  /* Added later: English | Eesti | Suomi | Español | Українська */
  const RAW5 = `
Your local map|Sinu kohalik kaart|Paikallinen karttasi|Tu mapa local|Карта міста
with live data from your municipality|linnavalitsuse reaalajas andmetega|kuntasi reaaliaikaisilla tiedoilla|con datos en directo de tu ayuntamiento|з живими даними від мерії
Choose your city to continue.|Jätkamiseks vali oma linn.|Jatka valitsemalla kaupunkisi.|Elige tu ciudad para continuar.|Щоб продовжити, оберіть своє місто.
For municipalities|Omavalitsustele|Kunnille|Para ayuntamientos|Для муніципалітетів
Work for a city or a rescue service? See PiMap from your side, or bring it to your city.|Töötad linnas või päästeteenistuses? Vaata PiMapi oma vaatest või too see oma linna.|Työskenteletkö kaupungilla tai pelastuspalvelussa? Katso PiMapia omasta näkökulmastasi tai tuo se kaupunkiisi.|¿Trabajas para una ciudad o un servicio de emergencias? Mira PiMap desde tu lado o llévalo a tu ciudad.|Працюєте в міській раді чи рятувальній службі? Подивіться на PiMap зі свого боку або запровадьте його у своєму місті.
Open the municipality portal|Ava linna portaal|Avaa kaupungin portaali|Abrir el portal municipal|Відкрити міський портал
Bring PiMap to your city|Too PiMap oma linna|Tuo PiMap kaupunkiisi|Lleva PiMap a tu ciudad|Запровадьте PiMap у своєму місті
Choose your city above first.|Vali kõigepealt ülal oma linn.|Valitse ensin kaupunkisi yläpuolelta.|Primero elige tu ciudad arriba.|Спершу оберіть своє місто вище.
Demo access. Real municipality accounts will be verified before they can change anything.|Demojuurdepääs. Päris omavalitsuse kontod kinnitatakse enne, kui need saavad midagi muuta.|Demokäyttö. Oikeat kuntatilit vahvistetaan ennen kuin niillä voi muuttaa mitään.|Acceso de demostración. Las cuentas municipales reales se verificarán antes de poder cambiar nada.|Демо-доступ. Справжні облікові записи муніципалітетів перевірятимуться, перш ніж вони зможуть щось змінювати.
// ---- welcome page, profile, platform feedback ----
Your local map with live data from your municipality|Sinu kohalik kaart linnavalitsuse reaalajas andmetega|Paikallinen karttasi kuntasi reaaliaikaisilla tiedoilla|Tu mapa local con datos en directo de tu ayuntamiento|Карта міста з живими даними від мерії
Where are you from?|Kust sa pärit oled?|Mistä olet?|¿De dónde eres?|Звідки ви?
Other|Muu|Muu|Otra|Інше
Type your city|Kirjuta oma linn|Kirjoita kaupunkisi|Escribe tu ciudad|Введіть своє місто
Live data|Andmed olemas|Tiedot saatavilla|Datos disponibles|Дані доступні
PiMap has live data for Tallinn only. We will save your city and show you the Tallinn demo.|PiMapis on praegu andmed ainult Tallinna kohta. Salvestame sinu linna ja näitame Tallinna demot.|PiMapissa on toistaiseksi tiedot vain Tallinnasta. Tallennamme kaupunkisi ja näytämme Tallinnan demon.|PiMap solo tiene datos de Tallin por ahora. Guardaremos tu ciudad y te mostraremos la demo de Tallin.|Наразі PiMap має дані лише для Таллінна. Ми збережемо ваше місто й покажемо демо Таллінна.
Who are you?|Kes sa oled?|Kuka olet?|¿Quién eres?|Хто ви?
Citizen|Elanik|Asukas|Ciudadano|Мешканець
Find shelters and safe routes, report issues, share ideas|Leia varjumiskohad ja ohutud teed, teata probleemidest, jaga ideid|Löydä suojat ja turvalliset reitit, ilmoita ongelmista, jaa ideoita|Encuentra refugios y rutas seguras, informa de problemas, comparte ideas|Знаходьте укриття й безпечні маршрути, повідомляйте про проблеми, діліться ідеями
Municipality employee|Linna töötaja|Kaupungin työntekijä|Empleado municipal|Працівник міської ради
Manage construction, run crisis protocols, answer residents|Halda ehitustöid, juhi kriisiprotokolle, vasta elanikele|Hallitse rakennustöitä, johda kriisiprotokollia, vastaa asukkaille|Gestiona obras, activa protocolos de crisis, responde a los vecinos|Керуйте будівельними роботами, запускайте кризові протоколи, відповідайте мешканцям
Email|E-post|Sähköposti|Correo electrónico|Електронна пошта
optional|valikuline|valinnainen|opcional|необов’язково
Stays on this device only. This prototype has no server and sends nothing.|Jääb ainult sellesse seadmesse. Sellel prototüübil pole serverit ja see ei saada midagi.|Pysyy vain tällä laitteella. Tällä prototyypillä ei ole palvelinta, eikä se lähetä mitään.|Solo se guarda en este dispositivo. Este prototipo no tiene servidor y no envía nada.|Залишається лише на цьому пристрої. Цей прототип не має сервера й нічого не надсилає.
Continue|Jätka|Jatka|Continuar|Продовжити
Save profile|Salvesta profiil|Tallenna profiili|Guardar perfil|Зберегти профіль
Choose your city and who you are to continue.|Jätkamiseks vali oma linn ja kes sa oled.|Jatka valitsemalla kaupunkisi ja kuka olet.|Elige tu ciudad y quién eres para continuar.|Щоб продовжити, оберіть місто і хто ви.
Help build PiMap|Aita PiMapi ehitada|Auta rakentamaan PiMapia|Ayuda a construir PiMap|Допоможіть створювати PiMap
Found a bug or have an idea for the platform? Tell us.|Leidsid vea või on sul idee platvormi jaoks? Anna teada.|Löysitkö virheen tai onko sinulla idea alustaa varten? Kerro meille.|¿Has encontrado un error o tienes una idea para la plataforma? Cuéntanos.|Знайшли помилку чи маєте ідею для платформи? Напишіть нам.
Report a bug|Teata veast|Ilmoita virheestä|Informar de un error|Повідомити про помилку
Suggest an idea|Paku ideed|Ehdota ideaa|Sugerir una idea|Запропонувати ідею
About PiMap: what this project is|PiMapist: mis projekt see on|Tietoa PiMapista: mikä tämä hanke on|Sobre PiMap: qué es este proyecto|Про PiMap: що це за проєкт
Welcome to PiMap|Tere tulemast PiMapi|Tervetuloa PiMapiin|Bienvenido a PiMap|Ласкаво просимо до PiMap
Saved. You are exploring the Tallinn demo.|Salvestatud. Vaatad Tallinna demot.|Tallennettu. Tutustut Tallinnan demoon.|Guardado. Estás viendo la demo de Tallin.|Збережено. Ви переглядаєте демо Таллінна.
Your profile|Sinu profiil|Profiilisi|Tu perfil|Ваш профіль
City|Linn|Kaupunki|Ciudad|Місто
Role|Roll|Rooli|Rol|Роль
Not shared|Pole jagatud|Ei jaettu|No compartido|Не вказано
Member since|Liige alates|Jäsen alkaen|Miembro desde|Учасник з
Edit profile|Muuda profiili|Muokkaa profiilia|Editar perfil|Редагувати профіль
Your activity|Sinu tegevus|Toimintasi|Tu actividad|Ваша активність
Issues and ideas|Probleemid ja ideed|Ongelmat ja ideat|Problemas e ideas|Проблеми та ідеї
Emergency reports|Hädaolukorra teated|Hätäilmoitukset|Avisos de emergencia|Повідомлення про небезпеку
Lent vehicles|Laenatud sõidukid|Lainatut kulkuneuvot|Vehículos prestados|Позичені транспортні засоби
Nothing yet. Contribute from the map.|Veel pole midagi. Osale kaardilt.|Ei vielä mitään. Osallistu kartalta.|Todavía nada. Contribuye desde el mapa.|Поки нічого. Долучайтеся з карти.
Sign out|Logi välja|Kirjaudu ulos|Cerrar sesión|Вийти
Sign out? Your profile is removed from this device.|Kas logida välja? Sinu profiil eemaldatakse sellest seadmest.|Kirjaudutaanko ulos? Profiilisi poistetaan tältä laitteelta.|¿Cerrar sesión? Tu perfil se eliminará de este dispositivo.|Вийти? Ваш профіль буде видалено з цього пристрою.
Bug|Viga|Virhe|Error|Помилка
reported|teatatud|ilmoitettu|notificado|повідомлено
Type|Tüüp|Tyyppi|Tipo|Тип
What went wrong? What did you expect?|Mis läks valesti? Mida sa ootasid?|Mikä meni vikaan? Mitä odotit?|¿Qué salió mal? ¿Qué esperabas?|Що пішло не так? Чого ви очікували?
What should PiMap do? Who would it help?|Mida PiMap võiks teha? Keda see aitaks?|Mitä PiMapin pitäisi tehdä? Ketä se auttaisi?|¿Qué debería hacer PiMap? ¿A quién ayudaría?|Що має робити PiMap? Кому це допоможе?
Send on GitHub|Saada GitHubi kaudu|Lähetä GitHubissa|Enviar en GitHub|Надіслати через GitHub
Send by email|Saada e-postiga|Lähetä sähköpostilla|Enviar por correo|Надіслати поштою
GitHub needs a free account. Email opens your mail app. A copy stays in your profile.|GitHub vajab tasuta kontot. E-post avab sinu meilirakenduse. Koopia jääb sinu profiili.|GitHub vaatii ilmaisen tilin. Sähköposti avaa sähköpostisovelluksesi. Kopio jää profiiliisi.|GitHub necesita una cuenta gratuita. El correo abre tu aplicación de correo. Una copia queda en tu perfil.|Для GitHub потрібен безкоштовний обліковий запис. Пошта відкриє ваш поштовий застосунок. Копія залишиться у вашому профілі.
Write a few words first|Kirjuta enne paar sõna|Kirjoita ensin muutama sana|Escribe unas palabras primero|Спочатку напишіть кілька слів
Thank you for helping build PiMap|Aitäh, et aitad PiMapi ehitada|Kiitos, että autat rakentamaan PiMapia|Gracias por ayudar a construir PiMap|Дякуємо, що допомагаєте створювати PiMap
Tallinn|Tallinn|Tallinna|Tallin|Таллінн
Helsinki|Helsingi|Helsinki|Helsinki|Гельсінкі
Dnipro|Dnipro|Dnipro|Dnipró|Дніпро
Lviv|Lviv|Lviv|Leópolis|Львів
Valencia|Valencia|Valencia|Valencia|Валенсія
Estonia|Eesti|Viro|Estonia|Естонія
Finland|Soome|Suomi|Finlandia|Фінляндія
Ukraine|Ukraina|Ukraina|Ucrania|Україна
Spain|Hispaania|Espanja|España|Іспанія
// ---- about page ----
About PiMap|PiMapist|Tietoa PiMapista|Sobre PiMap|Про PiMap
Open PiMap|Ava PiMap|Avaa PiMap|Abrir PiMap|Відкрити PiMap
Every resident reaches safety, whether or not they can walk.|Iga elanik jõuab ohutusse, olenemata sellest, kas ta suudab kõndida.|Jokainen asukas pääsee turvaan, pystyi hän kävelemään tai ei.|Cada vecino llega a un lugar seguro, pueda caminar o no.|Кожен мешканець дістається безпечного місця, навіть якщо не може йти пішки.
PiMap shows your nearest shelter and the safest way there, every day and in an emergency. It connects residents, neighbours and the city on one map.|PiMap näitab lähimat varjumiskohta ja ohutuimat teed sinna, iga päev ja hädaolukorras. See ühendab elanikud, naabrid ja linna ühel kaardil.|PiMap näyttää lähimmän suojan ja turvallisimman reitin sinne, joka päivä ja hätätilanteessa. Se yhdistää asukkaat, naapurit ja kaupungin yhdellä kartalla.|PiMap muestra tu refugio más cercano y el camino más seguro hasta él, cada día y en una emergencia. Une a residentes, vecinos y el ayuntamiento en un solo mapa.|PiMap показує найближче укриття і найбезпечніший шлях до нього, щодня і в надзвичайній ситуації. Він об’єднує мешканців, сусідів і місто на одній карті.
A prototype built for City Resilience Hack 2026 in Tallinn. Not an official City of Tallinn service.|Prototüüp, mis on loodud Tallinnas toimunud City Resilience Hack 2026 jaoks. Ei ole Tallinna linna ametlik teenus.|Tallinnan City Resilience Hack 2026 -tapahtumaa varten tehty prototyyppi. Ei Tallinnan kaupungin virallinen palvelu.|Un prototipo creado para City Resilience Hack 2026 en Tallin. No es un servicio oficial de la ciudad de Tallin.|Прототип, створений для City Resilience Hack 2026 у Таллінні. Не є офіційним сервісом міста Таллінн.
The problem|Probleem|Ongelma|El problema|Проблема
Cities have shelters, sirens and emergency alerts, but no plan for the last kilometre. If you cannot walk it, you do not reach it.|Linnadel on varjumiskohad, sireenid ja ohuteated, kuid puudub plaan viimaseks kilomeetriks. Kui sa seda jalgsi läbida ei suuda, sa kohale ei jõua.|Kaupungeilla on suojat, sireenit ja hätäviestit, mutta ei suunnitelmaa viimeiselle kilometrille. Jos et pysty kävelemään sitä, et pääse perille.|Las ciudades tienen refugios, sirenas y alertas de emergencia, pero no un plan para el último kilómetro. Si no puedes recorrerlo a pie, no llegas.|Міста мають укриття, сирени та сповіщення про небезпеку, але не мають плану для останнього кілометра. Якщо ви не можете його пройти, ви не дістанетеся.
Older people, people with limited mobility and families with small children are the first to be left behind.|Esimesena jäävad maha eakad, liikumispuudega inimesed ja väikeste lastega pered.|Ensimmäisinä jälkeen jäävät ikääntyneet, liikuntarajoitteiset ja pikkulapsiperheet.|Las personas mayores, las personas con movilidad reducida y las familias con niños pequeños son las primeras en quedarse atrás.|Першими позаду залишаються літні люди, люди з обмеженою мобільністю та родини з малими дітьми.
How PiMap works|Kuidas PiMap töötab|Miten PiMap toimii|Cómo funciona PiMap|Як працює PiMap
One alert brings your nearest shelter, a route that avoids danger, and four ways to get there: walk, bike, drive or request a pick-up. It works without signal.|Üks ohuteade toob sulle lähima varjumiskoha, ohtudest mööduva tee ja neli viisi sinna jõudmiseks: jalgsi, rattaga, autoga või järeletulemist paludes. See töötab ka ilma levita.|Yksi hälytys tuo lähimmän suojan, vaarat kiertävän reitin ja neljä tapaa päästä perille: kävellen, pyörällä, autolla tai kyytiä pyytämällä. Se toimii ilman verkkoyhteyttä.|Una sola alerta te da tu refugio más cercano, una ruta que evita el peligro y cuatro formas de llegar: a pie, en bici, en coche o pidiendo que te recojan. Funciona sin cobertura.|Одне сповіщення показує найближче укриття, маршрут в обхід небезпеки і чотири способи дістатися: пішки, велосипедом, автомобілем або з проханням забрати вас. Працює без зв’язку.
During an alert, shared scooters and bikes near shelters become free to ride, time-boxed and limited to the shelter area.|Ohuteate ajal muutuvad varjumiskohtade lähedal olevad jagatud tõukerattad ja rattad tasuta, ajaliselt piiratult ja ainult varjumiskoha piirkonnas.|Hälytyksen aikana suojien lähellä olevat yhteiskäyttöpotkulaudat ja -pyörät ovat maksuttomia, määräajan ja vain suoja-alueella.|Durante una alerta, los patinetes y bicis compartidos cerca de los refugios son gratuitos, por tiempo limitado y solo en la zona del refugio.|Під час тривоги спільні самокати й велосипеди біля укриттів стають безкоштовними, на обмежений час і лише в зоні укриття.
Neighbours pre-list spare bikes and mobility aids and offer seats in their cars. People who cannot walk are picked up first.|Naabrid lisavad eelnevalt oma varurattad ja liikumisabivahendid ning pakuvad kohti oma autodes. Kõndida mittesuutjad viiakse esimesena.|Naapurit ilmoittavat etukäteen ylimääräiset pyöränsä ja liikkumisen apuvälineensä sekä tarjoavat kyytejä autoissaan. Ne, jotka eivät pysty kävelemään, haetaan ensin.|Los vecinos registran de antemano bicis y ayudas a la movilidad que no usan y ofrecen plazas en sus coches. Quienes no pueden caminar son recogidos primero.|Сусіди заздалегідь додають вільні велосипеди та засоби пересування й пропонують місця у своїх авто. Тих, хто не може йти, забирають першими.
A protocol for each emergency|Iga hädaolukorra jaoks oma protokoll|Oma protokolla jokaiseen hätätilanteeseen|Un protocolo para cada emergencia|Протокол для кожної надзвичайної ситуації
War or air strike|Sõda või õhurünnak|Sota tai ilmaisku|Guerra o ataque aéreo|Війна або повітряний удар
Routes to the nearest public shelter.|Teed lähimasse avalikku varjumiskohta.|Reitit lähimpään yleiseen suojaan.|Rutas al refugio público más cercano.|Маршрути до найближчого публічного укриття.
The city marks flooded streets and routes go around them.|Linn märgib üleujutatud tänavad ja teed lähevad neist mööda.|Kaupunki merkitsee tulvivat kadut, ja reitit kiertävät ne.|El ayuntamiento marca las calles inundadas y las rutas las rodean.|Місто позначає затоплені вулиці, і маршрути їх оминають.
Routes to cool indoor places along the shadiest streets.|Teed jahedatesse siseruumidesse mööda kõige varjulisemaid tänavaid.|Reitit viileisiin sisätiloihin varjoisimpia katuja pitkin.|Rutas a lugares interiores frescos por las calles con más sombra.|Маршрути до прохолодних приміщень найтінистішими вулицями.
Routes avoid trees, the shoreline and reported fallen trees.|Teed väldivad puid, rannajoont ja teatatud langenud puid.|Reitit välttävät puita, rantaviivaa ja ilmoitettuja kaatuneita puita.|Las rutas evitan árboles, la costa y los árboles caídos notificados.|Маршрути оминають дерева, берегову лінію та повідомлені повалені дерева.
Useful every day|Kasulik iga päev|Hyödyllinen joka päivä|Útil cada día|Корисно щодня
Find the nearest pharmacy, hospital, grocery store or drinking water.|Leia lähim apteek, haigla, toidupood või joogivesi.|Löydä lähin apteekki, sairaala, ruokakauppa tai juomavesi.|Encuentra la farmacia, el hospital, el supermercado o el agua potable más cercanos.|Знайдіть найближчу аптеку, лікарню, продуктовий магазин або питну воду.
See construction works and routes that steer around them, kept up to date by the city.|Vaata ehitustöid ja neist mööda juhatavaid teid, mida linn ajakohasena hoiab.|Katso rakennustyöt ja niitä kiertävät reitit, jotka kaupunki pitää ajan tasalla.|Consulta las obras y las rutas que las evitan, actualizadas por el ayuntamiento.|Переглядайте будівельні роботи й маршрути в їх обхід, які місто підтримує актуальними.
Report issues and share ideas for your street. Neighbours support them and the city replies.|Teata probleemidest ja jaga ideid oma tänava kohta. Naabrid toetavad neid ja linn vastab.|Ilmoita ongelmista ja jaa ideoita kadullesi. Naapurit tukevat niitä ja kaupunki vastaa.|Informa de problemas y comparte ideas para tu calle. Los vecinos las apoyan y el ayuntamiento responde.|Повідомляйте про проблеми й діліться ідеями для своєї вулиці. Сусіди їх підтримують, а місто відповідає.
Two portals, one map|Kaks portaali, üks kaart|Kaksi portaalia, yksi kartta|Dos portales, un mapa|Два портали, одна карта
Residents use the citizen portal. City staff use the municipality portal to update construction, declare and run emergency protocols, and answer residents.|Elanikud kasutavad kodaniku portaali. Linna töötajad kasutavad linna portaali, et uuendada ehitustöid, kuulutada välja ja juhtida hädaolukorra protokolle ning vastata elanikele.|Asukkaat käyttävät asukasportaalia. Kaupungin henkilöstö päivittää kaupungin portaalissa rakennustyöt, julistaa ja johtaa hätäprotokollia ja vastaa asukkaille.|Los vecinos usan el portal ciudadano. El personal municipal usa el portal municipal para actualizar las obras, declarar y gestionar los protocolos de emergencia y responder a los vecinos.|Мешканці користуються порталом мешканця. Працівники міста в міському порталі оновлюють будівельні роботи, оголошують і ведуть протоколи надзвичайних ситуацій та відповідають мешканцям.
Open data|Avaandmed|Avoin data|Datos abiertos|Відкриті дані
Public shelters: the Estonian Rescue Board register, through the Land and Spatial Development Board geoportal.|Avalikud varjumiskohad: Päästeameti register Maa- ja Ruumiameti geoportaali kaudu.|Yleiset suojat: Viron pelastuslaitoksen rekisteri Maa- ja Ruumiametin karttapalvelun kautta.|Refugios públicos: el registro de la Junta de Rescate de Estonia, a través del geoportal de la Junta de Tierras y Desarrollo Espacial.|Публічні укриття: реєстр Рятувальної служби Естонії через геопортал Земельного та просторового управління.
Places, buildings, trees and walking routes: OpenStreetMap contributors.|Kohad, hooned, puud ja jalgteed: OpenStreetMapi kaastöölised.|Paikat, rakennukset, puut ja kävelyreitit: OpenStreetMapin tekijät.|Lugares, edificios, árboles y rutas a pie: colaboradores de OpenStreetMap.|Місця, будівлі, дерева та пішохідні маршрути: учасники OpenStreetMap.
Who is building it|Kes seda ehitab|Kuka sitä rakentaa|Quién lo construye|Хто це створює
PiMap is built by Pinge Electronics OÜ in Tallinn, which runs light electric vehicles and mobility aids for people who find walking hard.|PiMapi ehitab Tallinnas tegutsev Pinge Electronics OÜ, mis pakub kergeid elektrisõidukeid ja liikumisabivahendeid inimestele, kellel on kõndimine raske.|PiMapia rakentaa tallinnalainen Pinge Electronics OÜ, joka tarjoaa kevyitä sähköajoneuvoja ja liikkumisen apuvälineitä ihmisille, joille kävely on vaikeaa.|PiMap lo construye Pinge Electronics OÜ en Tallin, que ofrece vehículos eléctricos ligeros y ayudas a la movilidad para personas a las que les cuesta caminar.|PiMap створює таллінська компанія Pinge Electronics OÜ, яка надає легкий електротранспорт і засоби пересування людям, яким важко ходити.
The next step is a one-district pilot with the city and the Rescue Board. The code is open.|Järgmine samm on ühe linnaosa pilootprojekt koos linna ja Päästeametiga. Kood on avatud.|Seuraava vaihe on yhden kaupunginosan pilotti yhdessä kaupungin ja pelastuslaitoksen kanssa. Koodi on avointa.|El siguiente paso es un piloto en un distrito con el ayuntamiento y la Junta de Rescate. El código es abierto.|Наступний крок: пілот в одному районі разом із містом і Рятувальною службою. Код відкритий.
Source code on GitHub|Lähtekood GitHubis|Lähdekoodi GitHubissa|Código fuente en GitHub|Вихідний код на GitHub
PiMap prototype · not an official City of Tallinn service|PiMapi prototüüp · ei ole Tallinna linna ametlik teenus|PiMap-prototyyppi · ei ole Tallinnan kaupungin virallinen palvelu|Prototipo de PiMap · no es un servicio oficial de la ciudad de Tallin|Прототип PiMap · не є офіційним сервісом міста Таллінн
No contributions yet.|Panuseid veel pole.|Ei vielä ehdotuksia.|Aún no hay aportaciones.|Ще немає внесків.
prototype with Pinge Electronics OÜ|prototüüp koostöös Pinge Electronics OÜ-ga|prototyyppi yhdessä Pinge Electronics OÜ:n kanssa|prototipo con Pinge Electronics OÜ|прототип спільно з Pinge Electronics OÜ
Details|Üksikasjad|Tiedot|Detalles|Деталі
Pinge eTricycle|Pinge eTricycle|Pinge eTricycle|Pinge eTricycle|Pinge eTricycle
Kalamaja low streets (Soo tn)|Kalamaja madalad tänavad (Soo tn)|Kalamajan matalat kadut (Soo tn)|Calles bajas de Kalamaja (Soo tn)|Низинні вулиці Каламая (Soo tn)
Kalaranna shoreline|Kalaranna rannajoon|Kalarannan rantaviiva|Costa de Kalaranna|Узбережжя Каларанна
Pirita river mouth|Pirita jõe suue|Piritanjoen suisto|Desembocadura del río Pirita|Гирло річки Піріта
Stroomi beach and Pelgulinn low ground|Stroomi rand ja Pelgulinna madalad alad|Stroomin ranta ja Pelgulinnan alavat alueet|Playa de Stroomi y zonas bajas de Pelgulinn|Пляж Строомі та низини Пельгулінна
Kadriorg shore, Pirita tee|Kadrioru rand, Pirita tee|Kadriorgin ranta, Pirita tee|Costa de Kadriorg, Pirita tee|Узбережжя Кадріорга, Pirita tee
Fallen trees, Kadriorg park|Langenud puud, Kadrioru park|Kaatuneita puita, Kadriorgin puisto|Árboles caídos, parque de Kadriorg|Повалені дерева, парк Кадріорг
Flying debris, Linnahall seafront|Lendav praht, Linnahalli rannaala|Lentäviä roskia, Linnahallin ranta|Objetos volando, frente marítimo de Linnahall|Уламки в повітрі, набережна Ліннахалл
Loose roofing, Kalamaja (Kotzebue tn)|Lahtine katusekate, Kalamaja (Kotzebue tn)|Irtonainen katto, Kalamaja (Kotzebue tn)|Tejado suelto, Kalamaja (Kotzebue tn)|Незакріплена покрівля, Каламая (Kotzebue tn)
Vana-Kalamaja street reconstruction|Vana-Kalamaja tänava rekonstrueerimine|Vana-Kalamaja-kadun peruskorjaus|Reforma de la calle Vana-Kalamaja|Реконструкція вулиці Вана-Каламая
Kopli tram line works|Kopli trammiliini tööd|Koplin raitiolinjan työt|Obras de la línea de tranvía de Kopli|Роботи на трамвайній лінії Коплі
Pärnu mnt utility works|Pärnu mnt trassitööd|Pärnu mnt:n johtotyöt|Obras de servicios en Pärnu mnt|Ремонт комунікацій на Pärnu mnt
Pavement closed on the north side, pedestrians use the south side|Kõnnitee on põhjaküljel suletud, jalakäijad kasutavad lõunakülge|Jalkakäytävä suljettu pohjoispuolelta, jalankulkijat käyttävät eteläpuolta|Acera cerrada en el lado norte; los peatones usan el lado sur|Тротуар з північного боку закрито, пішоходи йдуть південним боком
Tram tracks being replaced, cycle lane diverted|Trammirööpaid vahetatakse, rattatee on ümber suunatud|Raitiokiskoja vaihdetaan, pyöräkaista ohjattu muualle|Se cambian las vías del tranvía; el carril bici está desviado|Замінюють трамвайні колії, велодоріжку перенаправлено
District heating pipe, one lane closed|Kaugküttetoru, üks sõidurada suletud|Kaukolämpöputki, yksi kaista suljettu|Tubería de calefacción urbana, un carril cerrado|Труба теплопостачання, одну смугу закрито
Deep pothole on the cycle path|Sügav auk jalgrattateel|Syvä kuoppa pyörätiellä|Bache profundo en el carril bici|Глибока вибоїна на велодоріжці
Street light out on Kotzebue|Kotzebue tänaval ei põle valgusti|Katuvalo pimeänä Kotzebuella|Farola apagada en Kotzebue|Не світить ліхтар на Kotzebue
No ramp at the tram stop kerb|Trammipeatuse äärekivil pole kaldteed|Raitiovaunupysäkin reunakivellä ei ole luiskaa|No hay rampa en el bordillo de la parada del tranvía|Немає пандуса на бордюрі трамвайної зупинки
Bike racks by the Balti jaam market|Jalgrattahoidjad Balti jaama turu juurde|Pyörätelineet Balti jaamin torin viereen|Aparcabicis junto al mercado de Balti jaam|Велопарковки біля ринку Балті-яам
Plant street trees on Tööstuse|Istutage Tööstuse tänavale puid|Katupuita Tööstuse-kadulle|Plantar árboles en la calle Tööstuse|Висадити дерева на вулиці Tööstuse
Benches along the Kalaranna promenade|Pingid Kalaranna promenaadile|Penkkejä Kalarannan rantakadulle|Bancos a lo largo del paseo de Kalaranna|Лавки вздовж набережної Каларанна
Illegal dumping behind the garages|Ebaseaduslik prügila garaažide taga|Luvaton kaatopaikka autotallien takana|Vertido ilegal detrás de los garajes|Незаконне звалище за гаражами
Next to the Kalamaja park entrance, easy to fall at night.|Kalamaja pargi sissepääsu juures, pimedas on kerge kukkuda.|Kalamajan puiston sisäänkäynnin vieressä, pimeällä on helppo kaatua.|Junto a la entrada del parque de Kalamaja; de noche es fácil caerse.|Біля входу до парку Каламая, вночі легко впасти.
Two lamps dark between Soo and Vana-Kalamaja.|Soo ja Vana-Kalamaja vahel ei põle kaks lampi.|Kaksi valoa pimeänä Soon ja Vana-Kalamajan välillä.|Dos farolas apagadas entre Soo y Vana-Kalamaja.|Два ліхтарі не світять між Soo та Vana-Kalamaja.
Wheelchair users cannot get onto the platform from the crossing.|Ratastoolikasutajad ei pääse ülekäigult platvormile.|Pyörätuolin käyttäjät eivät pääse suojatieltä laiturille.|Los usuarios de silla de ruedas no pueden subir al andén desde el paso.|Люди на візках не можуть потрапити на платформу з переходу.
Bikes are chained to every fence on market days.|Turupäevadel on rattad lukustatud igale aiale.|Toripäivinä pyöriä on lukittu jokaiseen aitaan.|Los días de mercado hay bicis atadas a cada valla.|У ринкові дні велосипеди пристебнуті до кожного паркану.
No shade at all in summer; would also help in a heatwave.|Suvel pole üldse varju; aitaks ka kuumalaine ajal.|Kesällä ei lainkaan varjoa; auttaisi myös helteellä.|En verano no hay nada de sombra; también ayudaría en una ola de calor.|Влітку зовсім немає тіні; це допомогло б і в спеку.
Older residents have nowhere to rest between the tram and the sea.|Eakatel elanikel pole trammi ja mere vahel kuskil puhata.|Iäkkäillä asukkailla ei ole paikkaa levätä raitiovaunun ja meren välillä.|Los vecinos mayores no tienen dónde descansar entre el tranvía y el mar.|Літнім мешканцям ніде відпочити між трамваєм і морем.
Old furniture and tyres.|Vana mööbel ja rehvid.|Vanhoja huonekaluja ja renkaita.|Muebles viejos y neumáticos.|Старі меблі та шини.
Nearly came off my bike here yesterday.|Eile kukkusin siin peaaegu rattalt.|Olin eilen vähällä kaatua pyörällä tässä.|Ayer casi me caigo de la bici aquí.|Учора ледь не впав тут із велосипеда.
Thank you. Repair is scheduled with the October pavement works.|Aitäh. Remont on planeeritud koos oktoobri teetöödega.|Kiitos. Korjaus tehdään lokakuun päällystystöiden yhteydessä.|Gracias. La reparación está programada con las obras de firme de octubre.|Дякуємо. Ремонт заплановано разом із жовтневими дорожніми роботами.
Same problem with a pram.|Sama probleem lapsevankriga.|Sama ongelma lastenvaunujen kanssa.|El mismo problema con un carrito.|Та сама проблема з дитячим візком.
Yes please, covered ones if possible.|Jah, palun, võimalusel katusega.|Kyllä kiitos, mieluiten katettuja.|Sí, por favor, cubiertos si es posible.|Так, будь ласка, по можливості накриті.
Six benches are being installed this autumn.|Sel sügisel paigaldatakse kuus pinki.|Tänä syksynä asennetaan kuusi penkkiä.|Este otoño se instalan seis bancos.|Цієї осені встановлюють шість лавок.
Cleared on 22 September.|Koristatud 22. septembril.|Siivottu 22. syyskuuta.|Retirado el 22 de septiembre.|Прибрано 22 вересня.
Birch across the pavement|Kask üle kõnnitee|Koivu jalkakäytävän poikki|Abedul atravesado en la acera|Береза впала поперек тротуару
Large branches on the cycle path|Suured oksad jalgrattateel|Isoja oksia pyörätiellä|Ramas grandes en el carril bici|Великі гілки на велодоріжці
Old poplar leaning over the playground|Vana pappel kaldub mänguväljaku kohale|Vanha poppeli kallistuu leikkipaikan ylle|Álamo viejo inclinado sobre el parque infantil|Стара тополя нахилилася над дитячим майданчиком
Lime tree down on Kadrioru tee|Pärn kukkunud Kadrioru teele|Lehmus kaatunut Kadrioru teelle|Tilo caído en Kadrioru tee|Липа впала на Kadrioru tee
Blue city bike, basket|Sinine linnaratas korviga|Sininen kaupunkipyörä korilla|Bici urbana azul con cesta|Синій міський велосипед з кошиком
Xiaomi e-scooter, charged|Xiaomi elektritõukeratas, laetud|Xiaomi-sähköpotkulauta, ladattu|Patinete eléctrico Xiaomi, cargado|Електросамокат Xiaomi, заряджений
Manual wheelchair, folding|Käsiratastool, kokkupandav|Käsikäyttöinen pyörätuoli, kokoontaitettava|Silla de ruedas manual, plegable|Механічний візок, складаний
Cargo bike, seats 2 children|Kaubaratas, kaks lapsekohta|Tavarapyörä, kaksi lapsen istuinta|Bici de carga para 2 niños|Вантажний велосипед на 2 дітей
Rollator with seat|Istmega rulaator|Istuimellinen rollaattori|Andador con asiento|Ходунки з сидінням
E-bike, 60 km range|Elektriratas, 60 km sõiduulatus|Sähköpyörä, 60 km toimintamatka|Bici eléctrica, 60 km de autonomía|Електровелосипед, запас ходу 60 км
Kids bike + adult bike|Lasteratas + täiskasvanu ratas|Lasten pyörä + aikuisten pyörä|Bici infantil + bici de adulto|Дитячий велосипед + дорослий
Elderly couple, Kalamaja|Eakas paar, Kalamaja|Iäkäs pariskunta, Kalamaja|Pareja mayor, Kalamaja|Літня пара, Каламая
Wheelchair user, Vanalinn|Ratastoolikasutaja, Vanalinn|Pyörätuolin käyttäjä, Vanalinn|Usuario de silla de ruedas, Vanalinn|Людина на візку, Ваналінн
Parent with pram, Kesklinn|Lapsevankriga vanem, Kesklinn|Vanhempi lastenvaunujen kanssa, Kesklinn|Padre o madre con carrito, Kesklinn|Батьки з візком, Кесклінн
Resident on crutches, Kristiine|Karkudega elanik, Kristiine|Asukas kyynärsauvoilla, Kristiine|Vecino con muletas, Kristiine|Мешканець на милицях, Крістійне
Built when the mandate is published: a|Koostatakse mandaadi avaldamisel:|Luodaan, kun valtuutus julkaistaan:|Se crea al publicar el mandato: una regla|Створюється під час публікації мандата: правило
rule with rate_amount 0 inside shelter geographies, a|reegel rate_amount 0 varjumiskohtade aladel,|-sääntö rate_amount 0 suojien alueilla,|con rate_amount 0 en las zonas de los refugios, una regla|з rate_amount 0 у зонах укриттів, правило
rule so trips end at shelters, a|reegel, et sõidud lõpeksid varjumiskohtades,|-sääntö, jotta matkat päättyvät suojiin,|para que los viajes terminen en refugios, una regla|щоб поїздки завершувалися в укриттях, правило
rule holding accessible vehicles for priority riders, and a ban on rebalancing out of geofences.|reegel, mis hoiab ligipääsetavad sõidukid eelisõitjatele, ning keeld viia sõidukeid geoaedadest välja.|-sääntö, joka varaa esteettömät ajoneuvot etusijalla oleville, sekä kielto siirtää ajoneuvoja geoaitojen ulkopuolelle.|que reserva los vehículos accesibles para usuarios prioritarios, y la prohibición de retirarlos de las geovallas.|що резервує доступний транспорт для пріоритетних пасажирів, і заборона вивозити транспорт за межі геозон.
`;

  /* Ukrainian for every entry in RAW: English | Українська */
  const RAW_UK = `
Citizen portal|Портал мешканця
Municipality portal|Портал міста
Reset|Скинути
No alert|Тривоги немає
Contribute|Долучитися
+ Contribute|+ Долучитися
Offline|Офлайн
cached|з кешу
Search PiMap|Пошук у PiMap
Search shelters, places and addresses|Шукайте укриття, місця й адреси
Menu|Меню
Clear search|Очистити пошук
Search|Пошук
Directions|Маршрут
Directions to the nearest shelter|Маршрут до найближчого укриття
More categories|Більше категорій
Places to go|Куди піти
Map of Tallinn|Карта Таллінна
Map legend|Легенда карти
Portals|Портали
Municipality sections|Розділи порталу міста
Language|Мова
Clear local state and reseed demo data|Очистити локальні дані й відновити демо
Report an issue or share an idea|Повідомте про проблему або поділіться ідеєю
Back|Назад
Close|Закрити
PiMap prototype|Прототип PiMap
not an official City of Tallinn service|не є офіційним сервісом міста Таллінн
Shelters|Укриття
Fallen trees|Повалені дерева
Hospitals|Лікарні
Pharmacies|Аптеки
Cool places|Прохолодні місця
Drinking water|Питна вода
Groceries|Продукти
Police|Поліція
Rescue stations|Рятувальні частини
Construction|Будівництво
Community|Спільнота
Address|Адреса
Hospital|Лікарня
Pharmacy|Аптека
Grocery store|Продуктовий магазин
Rescue station|Рятувальна частина
Public shelter|Громадське укриття
Resident|Мешканець
Shared vehicle, locked|Спільний транспорт, заблокований
Shared vehicle, free|Спільний транспорт, безкоштовний
Neighbour listing|Пропозиція сусіда
Driver offering pick-up|Водій пропонує підвезти
Pick-up request|Запит на підвезення
Construction (street section)|Будівництво (ділянка вулиці)
Construction works|Будівельні роботи
Flooded area|Затоплена ділянка
Unsafe place|Небезпечне місце
Fallen tree report|Повідомлення про повалене дерево
Storm area|Зона шторму
Citizen issue|Проблема від мешканця
Citizen idea|Ідея від мешканця
Around you|Поруч із вами
Your nearest shelter|Ваше найближче укриття
Be ready|Будьте готові
Home supplies and what to do in each emergency|Домашні запаси й дії в кожній надзвичайній ситуації
No construction within 2 km|У радіусі 2 км робіт немає
Tap to see works across Tallinn|Переглянути роботи по всьому Таллінну
Routes go around them until cleared|Маршрути оминають їх, доки їх не приберуть
Support them or add your own|Підтримайте їх або додайте власні
Where to?|Куди?
Search above, or pick one of these|Шукайте вгорі або оберіть одне з цього
Nearest pharmacy|Найближча аптека
Nearest grocery store|Найближчий продуктовий магазин
Nearest hospital|Найближча лікарня
Nearest public shelter|Найближче громадське укриття
Nearest drinking water|Найближча питна вода
Nearest library or shopping centre|Найближча бібліотека чи торговий центр
Nearest shelter|Найближче укриття
Nearest safe indoor place|Найближче безпечне приміщення
Nearest cool place|Найближче прохолодне місце
Nearest dry shelter|Найближче сухе укриття
Go to nearest public shelter|До найближчого громадського укриття
Go to nearest dry shelter|До найближчого сухого укриття
Go to nearest cool place|До найближчого прохолодного місця
Go to nearest safe indoor place|До найближчого безпечного приміщення
Chosen shelter|Обране укриття
Nearest public shelter (register)|Найближче громадське укриття (реєстр)
Opening hours|Години роботи
Wheelchair access|Доступ для візків
yes|так
no|ні
limited|обмежений
Public shelter, marked with the civil defence sign (blue triangle on orange)|Громадське укриття, позначене знаком цивільного захисту (синій трикутник на помаранчевому тлі)
Public library|Публічна бібліотека
Shopping centre|Торговий центр
Dates|Дати
Affects|Стосується
Pedestrians|Пішоходи
Cyclists|Велосипедисти
Cars|Автомобілі
pedestrians|пішоходи
cyclists|велосипедисти
cars|автомобілі
walk|пішки
bike|велосипед
drive|авто
no modes|жодного
Status|Статус
Street section|Ділянка вулиці
Last updated|Останнє оновлення
Registered by the municipality|Зареєстровано містом
Reported by|Повідомив
City crew|Міська бригада
You|Ви
A neighbour|Сусід
Neighbour|Сусід
Storm report|Повідомлення про шторм
Reported, not yet confirmed|Повідомлено, ще не підтверджено
Confirmed by the city|Підтверджено містом
Cleared|Прибрано
Finished|Завершено
Your location|Ваше місцезнаходження
Close directions|Закрити маршрут
How to get there|Як дістатися
Walk|Пішки
Bike|Велосипед
Drive|Авто
Pick-up|Підвезення
at your pace|у вашому темпі
by car|автомобілем
your own bike or scooter|ваш велосипед чи самокат
until pick-up|до підвезення
pick-up runs during an alert|підвезення працює під час тривоги
estimated door to destination|орієнтовно від дверей до місця
no free driver right now|зараз немає вільного водія
Look for the civil defence sign: a blue triangle on an orange background.|Шукайте знак цивільного захисту: синій трикутник на помаранчевому тлі.
Walking route on the map.|Пішохідний маршрут на карті.
Route and destination are stored on this device and work without signal.|Маршрут і пункт призначення збережено на пристрої, вони працюють без зв'язку.
This is a long way at your pace.|У вашому темпі це далеко.
This is a long way at your pace on a mobility aid.|Із засобом пересування у вашому темпі це далеко.
Bike or pick-up gets you there faster.|Велосипедом чи з підвезенням дістанетеся швидше.
Request pick-up|Замовити підвезення
Park at least 50 m from the entrance and keep access lanes clear.|Паркуйтеся щонайменше за 50 м від входу й не перекривайте під'їзди.
Never drive into water: 30 cm can float a car.|Ніколи не заїжджайте у воду: 30 см води можуть підняти авто.
During an alert you can offer spare seats here and be matched with a neighbour who cannot walk.|Під час тривоги тут можна запропонувати вільні місця, і вас з'єднають із сусідом, який не може ходити.
You are listed as a driver|Ви у списку водіїв
Pick up|Підвезіть
No one nearby needs a lift yet.|Поруч ще нікому не потрібне підвезення.
We will ping you.|Ми вас повідомимо.
Withdraw|Скасувати
Have spare seats? Neighbours who cannot walk are waiting.|Маєте вільні місця? На вас чекають сусіди, які не можуть ходити.
Vehicle|Транспорт
Spare seats|Вільні місця
Can take a wheelchair or mobility aid|Вміщує візок або засіб пересування
Offer my seats|Запропонувати місця
Car|Автомобіль
Van|Фургон
Cargo bike|Вантажний велосипед
E-scooter|Електросамокат
City bike|Міський велосипед
E-bike|Електровелосипед
Wheelchair|Візок
Rollator|Ходунки
Mobility aid (Pinge)|Засіб пересування (Pinge)
Unlocking…|Розблоковуємо…
Sending the unlock event under the Emergency Unlock Mandate.|Надсилаємо розблокування за Мандатом екстреного розблокування.
fare €0 under the mandate|вартість 0 € за мандатом
Unlock code|Код розблокування
How to get it|Як отримати
End your trip at your destination.|Завершіть поїздку в пункті призначення.
Release and choose another|Звільнити й обрати інший
Strong wind: riding is not recommended.|Сильний вітер: їздити не рекомендується.
Walk if you can.|Ідіть пішки, якщо можете.
No bike?|Немає велосипеда?
Shared vehicles near shelters are free under the Emergency Unlock Mandate, and neighbours’ listings are active.|Спільний транспорт біля укриттів безкоштовний за Мандатом екстреного розблокування, а пропозиції сусідів активні.
Neighbours’ listings are active.|Пропозиції сусідів активні.
Shared fleets unlock when the city publishes the mandate.|Спільний транспорт розблокується, коли місто опублікує мандат.
During an alert shared vehicles unlock for free and neighbours’ spare bikes appear here.|Під час тривоги спільний транспорт розблоковується безкоштовно, а тут з'являються вільні велосипеди сусідів.
Free near you|Безкоштовно поруч
Unlock|Розблокувати
Borrow|Позичити
accessible|доступний
Nothing free within reach right now.|Зараз поруч немає нічого вільного.
Try pick-up.|Спробуйте підвезення.
Queued|У черзі
Cancel request|Скасувати запит
Your need|Ваша потреба
People|Людей
Note for the driver|Примітка для водія
3rd floor, no lift|3-й поверх, без ліфта
Wheelchair user|Людина на візку
Uses a mobility aid or cannot stand long|Користується засобом пересування або не може довго стояти
Walks slowly (elderly, injured, pregnant)|Ходить повільно (літні, травмовані, вагітні)
Small children or a pram|Маленькі діти або візочок
No special need|Без особливих потреб
Pinge crew|Бригада Pinge
Wait at your door.|Чекайте біля дверей.
Matched to the nearest neighbour or Pinge crew with room.|Вас з'єднають із найближчим сусідом чи бригадою Pinge, де є місце.
People who cannot walk go first.|Першими допомагають тим, хто не може ходити.
All nearby drivers are busy; the next free neighbour or Pinge crew is dispatched to you.|Усі водії поруч зайняті; до вас направлять наступного вільного сусіда або бригаду Pinge.
When an alert is declared, neighbours with spare seats and Pinge crews pick up residents who cannot get there on their own.|Коли оголошують тривогу, сусіди з вільними місцями й бригади Pinge підвозять мешканців, які не можуть дістатися самі.
War / air strike|Війна / авіаудар
war / air strike|війна / авіаудар
Flood|Повінь
flood|повінь
Heatwave|Спека
heatwave|спека
Storm|Шторм
storm|шторм
public shelter|громадське укриття
dry shelter|сухе укриття
cool place|прохолодне місце
safe indoor place|безпечне приміщення
Routes to public shelters. Fleets unlock, neighbours lend, pick-ups for people who cannot walk.|Маршрути до громадських укриттів. Транспорт розблоковується, сусіди позичають, підвезення для тих, хто не може ходити.
Air raid warning. Go to the nearest public shelter now. If you cannot reach one, stay in a windowless room or basement.|Повітряна тривога. Негайно йдіть до найближчого громадського укриття. Якщо не можете дістатися, залишайтеся в кімнаті без вікон або в підвалі.
Go below ground if you can: basements, underpasses, parking garages.|Якщо можете, спустіться під землю: підвали, підземні переходи, паркінги.
Keep away from windows and glass facades.|Тримайтеся подалі від вікон і скляних фасадів.
Take water, medicine and your phone.|Візьміть воду, ліки й телефон.
The city marks flooded areas. Routes go around them to shelters on dry ground.|Місто позначає затоплені ділянки. Маршрути оминають їх до укриттів на сухому місці.
Flood warning. Leave low-lying and coastal streets. Your route avoids flooded areas.|Попередження про повінь. Залиште низинні та прибережні вулиці. Ваш маршрут оминає затоплені ділянки.
Never walk or drive through moving water: 15 cm can knock you over, 30 cm can float a car.|Ніколи не йдіть і не їдьте крізь текучу воду: 15 см можуть збити з ніг, 30 см — підняти авто.
Move to higher ground or an upper floor.|Перейдіть на вище місце або верхній поверх.
Stay away from rivers, the shoreline and open drains.|Тримайтеся подалі від річок, узбережжя та відкритих стоків.
Routes to cool indoor places (libraries, shopping centres), choosing streets shaded by buildings and trees.|Маршрути до прохолодних приміщень (бібліотеки, торгові центри) вулицями в тіні будівель і дерев.
Heat warning. Avoid direct sun between 11:00 and 17:00. Go to a cool indoor place; your route follows the shade.|Попередження про спеку. Уникайте прямого сонця з 11:00 до 17:00. Ідіть до прохолодного приміщення; ваш маршрут пролягає в тіні.
Walk on the shaded side of the street.|Ідіть затіненим боком вулиці.
Drink water every 20 minutes, even if you are not thirsty.|Пийте воду кожні 20 хвилин, навіть якщо не відчуваєте спраги.
Check on elderly neighbours and never leave anyone in a parked car.|Навідайте літніх сусідів і ніколи не залишайте нікого в припаркованому авто.
Routes to indoor safe places, avoiding marked unsafe places, trees, the shoreline and construction sites.|Маршрути до безпечних приміщень в обхід позначених небезпечних місць, дерев, узбережжя та будмайданчиків.
Storm warning. Get indoors now. Your route avoids trees, the shoreline, construction sites and unsafe places.|Штормове попередження. Негайно зайдіть у приміщення. Ваш маршрут оминає дерева, узбережжя, будмайданчики та небезпечні місця.
Keep away from trees, scaffolding, cranes and power lines.|Тримайтеся подалі від дерев, риштувань, кранів і ліній електропередач.
Stay off the shoreline and piers.|Не підходьте до узбережжя та пірсів.
Do not ride shared scooters or bikes in strong wind.|Не користуйтеся спільними самокатами й велосипедами за сильного вітру.
Seek shelter now. Sirens are active. Your nearest shelter and route are attached. If you cannot walk it, use Borrow or Request a ride.|Негайно шукайте укриття. Лунають сирени. Найближче укриття й маршрут додано. Якщо не можете дійти, позичте транспорт або замовте підвезення.
Finding the shadiest route…|Шукаємо найтінистіший маршрут…
Checking trees, shoreline and unsafe places…|Перевіряємо дерева, узбережжя й небезпечні місця…
Routing around flooded areas…|Прокладаємо маршрут в обхід затоплених ділянок…
Finding your route…|Шукаємо маршрут…
Checking construction and blocked paths…|Перевіряємо роботи й перекриті шляхи…
Your route does not cross any flooded area.|Ваш маршрут не перетинає затоплених ділянок.
Your route does not cross any marked unsafe place.|Ваш маршрут не проходить через позначені небезпечні місця.
Shade at|Тінь о
Now|Зараз
Plan shade for|Планувати тінь на
Low sun casts long shadows.|Низьке сонце дає довгі тіні.
The sun is down, so the whole route is shaded.|Сонце зайшло, тож увесь маршрут у тіні.
No public drinking water on this route. Carry water.|На цьому маршруті немає громадської питної води. Візьміть воду з собою.
Routes keep extra distance from trees and the shoreline.|Маршрути тримаються далі від дерев і узбережжя.
Report one|Повідомити
See flooding, a blocked way or another danger?|Бачите підтоплення, перекритий шлях чи іншу небезпеку?
Report it|Повідомте
Construction on this route|На маршруті ведуться роботи
Offline: showing a straight-line estimate. Avoiding hazards and construction needs a connection.|Офлайн: показуємо оцінку по прямій. Для обходу небезпек і робіт потрібен зв'язок.
Street tree and building data could not be loaded, so this is the fastest route.|Не вдалося завантажити дані про дерева й будівлі, тож це найшвидший маршрут.
Updated by the city|Оновлено містом
Within 2 km|У радіусі 2 км
All of Tallinn|Увесь Таллінн
Area|Територія
Active now|Тривають зараз
Starting soon|Незабаром почнуться
No active construction here.|Тут немає активних робіт.
Nothing scheduled.|Нічого не заплановано.
Everyday routes steer around active sites that affect how you travel.|Щоденні маршрути оминають активні роботи, що впливають на ваше пересування.
Roadworks|Дорожні роботи
Building site|Будмайданчик
Utility works|Ремонт комунікацій
Street closure|Перекриття вулиці
Tram line works|Роботи на трамвайній лінії
Official public shelters|Офіційні громадські укриття
Nothing found nearby.|Поруч нічого не знайдено.
Show on map|Показати на карті
Addresses|Адреси
Searching addresses…|Шукаємо адреси…
Type a place, shelter or address.|Введіть місце, укриття або адресу.
No places found. Press Enter to search addresses.|Місць не знайдено. Натисніть Enter, щоб шукати адреси.
Search addresses in Tallinn|Шукати адреси в Таллінні
About you|Про вас
Lend a vehicle|Позичити транспорт
Pre-list a spare bike or mobility aid for emergencies|Заздалегідь запропонуйте вільний велосипед чи засіб пересування на випадок надзвичайних ситуацій
Report an issue or share an idea with the city|Повідомте місту про проблему або поділіться ідеєю
Report an issue or share an idea with the city, or report a fallen tree|Повідомте місту про проблему, поділіться ідеєю або повідомте про повалене дерево
Use my location|Використати моє місцезнаходження
From your device's GPS|З GPS вашого пристрою
Set my location on the map|Вказати місцезнаходження на карті
Demo: simulate a resident somewhere else|Демо: змоделювати мешканця в іншому місці
Mobility|Мобільність
I can walk|Я можу ходити
I walk slowly or have limited mobility|Я ходжу повільно або маю обмежену мобільність
I use a wheelchair or mobility aid|Я користуюся візком або засобом пересування
Walking times use your pace, and pick-ups are prioritised for people who cannot walk.|Час пішки розраховано за вашим темпом, а підвезення насамперед для тих, хто не може ходити.
Accessible vehicles are offered first and your pick-up requests get top priority.|Спершу пропонується доступний транспорт, а ваші запити на підвезення мають найвищий пріоритет.
The public shelter register does not record step-free access yet.|Реєстр громадських укриттів поки не містить даних про безбар'єрний доступ.
Use GPS|Використати GPS
Pick on map|Обрати на карті
Pirent dormant listing|Неактивна пропозиція в Pirent
List a spare bike, scooter or mobility aid once.|Один раз додайте вільний велосипед, самокат чи засіб пересування.
It stays invisible until an alert is declared; then neighbours see it under Bike with your instructions.|Пропозиція прихована до оголошення тривоги; тоді сусіди бачать її в розділі «Велосипед» з вашими інструкціями.
What is it?|Що це?
Short description|Короткий опис
How does a neighbour get it?|Як сусіду його отримати?
Where|Де
Suitable for someone who cannot walk|Підходить тим, хто не може ходити
your location|ваше місцезнаходження
Clear|Очистити
Pre-list as dormant|Додати як неактивну
List now (alert active)|Опублікувати зараз (тривога активна)
Your listings|Ваші пропозиції
Remove|Видалити
dormant|неактивна
active|активна
claimed|зайнято
Shelters: Päästeamet public shelter register|Укриття: реєстр громадських укриттів Päästeamet
Places and routing: © OpenStreetMap contributors.|Місця й маршрути: © учасники OpenStreetMap.
Construction and hazard zones: the municipality.|Роботи й небезпечні зони: місто.
© OpenStreetMap contributors|© учасники OpenStreetMap
What to do before and during an emergency|Що робити до та під час надзвичайної ситуації
Päästeamet advises every household to keep supplies for at least a week.|Päästeamet радить кожному домогосподарству мати запаси щонайменше на тиждень.
Drinking water: about 3 litres per person per day|Питна вода: близько 3 літрів на людину на день
Food that keeps and needs no cooking|Їжа, що довго зберігається й не потребує приготування
Prescription medicines and a first-aid kit|Рецептурні ліки та аптечка
Torch, spare batteries, power bank and a battery radio|Ліхтарик, запасні батарейки, павербанк і радіо на батарейках
Some cash and copies of documents|Трохи готівки та копії документів
Your nearest public shelter is always one tap away: the Shelters chip or the directions button during an alert.|Найближче громадське укриття завжди за один дотик: кнопка «Укриття» або кнопка маршруту під час тривоги.
Improve the city with the municipality and your neighbours|Покращуйте місто разом із міською владою та сусідами
Emergency report|Екстрене повідомлення
Fallen tree|Повалене дерево
Report an issue|Повідомити про проблему
Share an idea|Поділитися ідеєю
Road or pavement damage|Пошкодження дороги чи тротуару
Broken street light|Несправний ліхтар
Accessibility barrier|Бар'єр для доступності
Litter or dumping|Сміття або звалище
Broken bench or playground|Зламана лавка чи дитячий майданчик
Other issue|Інша проблема
More trees or green space|Більше дерев чи зелених зон
Benches or shade|Лавки чи тінь
Cycling improvement|Покращення для велосипедистів
Safer crossing|Безпечніший перехід
Play or sport|Ігри чи спорт
Other idea|Інша ідея
Your idea|Ваша ідея
What is wrong?|Що не так?
e.g. Bike racks by the Balti jaam market|напр. велопарковки біля ринку Балті-яам
e.g. Deep pothole on the cycle path|напр. глибока вибоїна на велодоріжці
Details (optional)|Деталі (необов'язково)
Why would it help, and who?|Чому це допоможе і кому?
Where exactly, and since when?|Де саме й відколи?
Pinned on the map|Позначено на карті
At your current location|У вашому поточному місці
Move pin|Перемістити позначку
Share idea|Поділитися ідеєю
Send to the city|Надіслати місту
Visible to the city and your neighbours. Neighbours can support it and comment; the city updates its status.|Бачать місто й ваші сусіди. Сусіди можуть підтримати й коментувати; місто оновлює статус.
Near you|Поруч із вами
most supported|найпідтримуваніші
What did you see?|Що ви побачили?
Blocking a street or path|Перекриває вулицю чи доріжку
Fallen branches|Повалені гілки
Branches or debris on the ground|Гілки чи уламки на землі
Tree at risk|Небезпечне дерево
Leaning, cracked or large tree that could fall|Нахилене, тріснуте чи велике дерево, що може впасти
Flooded street|Затоплена вулиця
Water on the street or in an underpass|Вода на вулиці чи в підземному переході
Blocked way|Перекритий шлях
Debris, a fallen pole or a closed passage|Уламки, повалений стовп чи закритий прохід
Other danger|Інша небезпека
Loose roofing, broken glass, a downed power line|Незакріплена покрівля, розбите скло, обірваний дріт
e.g. Birch across the pavement by the tram stop|напр. береза впала на тротуар біля трамвайної зупинки
Send emergency report|Надіслати екстрене повідомлення
Send storm report|Надіслати повідомлення про шторм
Routes for everyone avoid it straight away, and the city sees it under Citizen contributions.|Маршрути для всіх одразу оминають це місце, а місто бачить повідомлення у «Внесках мешканців».
Routes for everyone avoid it straight away.|Маршрути для всіх одразу оминають це місце.
Report fallen tree|Повідомити про повалене дерево
Report flooding|Повідомити про підтоплення
Report a hazard|Повідомити про небезпеку
Report a fallen tree|Повідомити про повалене дерево
New|Нове
Seen by the city|Переглянуто містом
Planned|Заплановано
In progress|У роботі
Done|Виконано
Not planned|Не заплановано
Issue|Проблема
Idea|Ідея
Comments|Коментарі
No comments yet.|Коментарів ще немає.
Add a comment|Додати коментар
Post|Надіслати
Issues and ideas from residents|Проблеми та ідеї від мешканців
Nothing yet. Be the first.|Ще нічого немає. Будьте першими.
city|місто
resident|мешканець
example|приклад
Citizen contributions|Внески мешканців
Overview|Огляд
Crisis operations|Кризове реагування
Fleet unlock|Розблокування транспорту
Pick-up dispatch|Диспетчеризація підвезень
Neighbour listings|Пропозиції сусідів
MDS log|Журнал MDS
Tallinna Linnavalitsus|Міська управа Таллінна
Issues and ideas residents pinned on the map. Set a status and reply; residents see both.|Проблеми та ідеї, які мешканці позначили на карті. Встановіть статус і відповідайте; мешканці бачать і те, й інше.
All|Усі
Issues|Проблеми
Ideas|Ідеї
Emergency|Екстрені
Filter|Фільтр
Fallen trees, flooded streets, blocked ways and other dangers residents reported during alerts. Routes avoid everything not cleared.|Повалені дерева, затоплені вулиці, перекриті шляхи та інші небезпеки, про які мешканці повідомили під час тривог. Маршрути оминають усе неприбране.
No emergency reports.|Екстрених повідомлень немає.
city crew|міська бригада
new|нове
confirmed|підтверджено
cleared|прибрано
Confirm|Підтвердити
Mark cleared|Позначити прибраним
Reopen|Відкрити знову
Show|Показати
Plan as construction works|Запланувати як роботи
Reply publicly as the city|Відповісти публічно від імені міста
Reply|Відповісти
City reply|Відповідь міста
Reply published|Відповідь опубліковано
Add construction works|Додати будівельні роботи
Edit construction works|Редагувати будівельні роботи
Register a site with its dates. Citizens see it on the map, and everyday routes steer around it for the modes it affects.|Зареєструйте роботи з датами. Мешканці бачать їх на карті, а щоденні маршрути оминають їх для відповідних способів пересування.
Change the location, dates or affected modes. Citizens see the update straight away.|Змініть місце, дати чи способи пересування. Мешканці одразу бачать оновлення.
Name|Назва
e.g. Telliskivi street reconstruction|напр. реконструкція вулиці Теллісківі
Type|Тип
Now click where the works end|Тепер клацніть, де роботи закінчуються
Snapping to the streets…|Прив'язуємо до вулиць…
Click where the works start and where they end; the line follows the streets|Клацніть, де роботи починаються й закінчуються; лінія йде вулицями
Draw on map|Намалювати на карті
Add points|Додати точки
Undo point|Скасувати точку
Start date|Дата початку
End date|Дата завершення
Note for residents|Примітка для мешканців
e.g. Pavement closed, use the other side|напр. тротуар закрито, йдіть іншим боком
Publish construction works|Опублікувати роботи
Save changes|Зберегти зміни
Cancel|Скасувати
Registered works|Зареєстровані роботи
upcoming|заплановані
finished|завершені
Edit|Редагувати
+7 days|+7 днів
Tip: click a site on the map to edit it.|Порада: клацніть на роботи на карті, щоб їх редагувати.
Finished works stay listed but leave the map automatically.|Завершені роботи лишаються в списку, але автоматично зникають з карти.
City works|Міські роботи
live|наживо
construction sites active|активних робіт
starting soon|незабаром почнуться
shelters near works|укриттів поруч із роботами
Crisis status|Стан кризи
Standby|Режим очікування
public shelters (register)|громадських укриттів (реєстр)
devices pushed (sim.)|пристроїв сповіщено (сим.)
operators applied|операторів застосували
vehicles at €0|транспорту за 0 €
listings active|активних пропозицій
pick-ups matched|підвезень призначено
Map|Карта
Lend|Позика
Waiting for declaration.|Очікування оголошення.
Fleets locked.|Транспорт заблоковано.
Publishing…|Публікуємо…
Data sources|Джерела даних
Public shelters|Громадські укриття
Hospitals, pharmacies, cool places, water|Лікарні, аптеки, прохолодні місця, вода
OpenStreetMap, fetched 25 Sep 2026|OpenStreetMap, отримано 25.09.2026
Hazard zones|Небезпечні зони
Drawn by the city during an alert; seeded ones are examples|Місто позначає під час тривоги; попередньо додані — приклади
Fallen tree reports|Повідомлення про повалені дерева
From citizens and city crews|Від мешканців і міських бригад
Storms|Шторми
Added by the city under the storm protocol|Додаються містом за штормовим протоколом
Issues and ideas pinned by residents|Проблеми та ідеї, позначені мешканцями
Choose the protocol|Оберіть протокол
Emergency protocol|Протокол надзвичайної ситуації
Each protocol changes where citizens are sent and how their route is chosen.|Кожен протокол змінює, куди спрямовують мешканців і як обирається їхній маршрут.
District|Район
Time-box|Тривалість
Message pushed to phones|Повідомлення на телефони
Unlock shared fleets on declaration|Розблокувати спільний транспорт під час оголошення
Unlock shared fleets on declaration (not advised in strong wind)|Розблокувати спільний транспорт під час оголошення (не радимо за сильного вітру)
Active|Активна
End alert|Завершити тривогу
End the alert to switch protocol.|Щоб змінити протокол, завершіть тривогу.
Name the storm|Назвіть шторм
Add the storm the city is tracking. Citizens see its area and wind, and gusts of 25 m/s or more make routes keep further from trees and the shoreline.|Додайте шторм, який відстежує місто. Мешканці бачать його зону й вітер, а за поривів від 25 м/с маршрути тримаються далі від дерев і узбережжя.
Storm name|Назва шторму
e.g. Storm Ingrid|напр. шторм Інгрід
Wind (m/s)|Вітер (м/с)
Gusts (m/s)|Пориви (м/с)
Wind from|Вітер з
Arrives|Прибуття
Lasts (h)|Триває (год)
Area (km)|Зона (км)
Centred on Tallinn|Центр у Таллінні
Set centre on map|Вказати центр на карті
Add storm|Додати шторм
No storm added yet.|Шторм ще не додано.
Fallen trees and branches|Повалені дерева й гілки
Reported by citizens in the app and by city crews. Routes avoid every report that is not cleared.|Повідомляють мешканці в застосунку та міські бригади. Маршрути оминають усі неприбрані повідомлення.
Add city report|Додати повідомлення міста
Place on map|Позначити на карті
Not placed yet|Ще не позначено
Flooded areas|Затоплені ділянки
Unsafe places|Небезпечні місця
Flood protocol|Протокол повені
Storm protocol|Штормовий протокол
Mark streets under water. Citizen routes are recalculated around them, and shelters inside them are skipped.|Позначте затоплені вулиці. Маршрути мешканців перераховуються в обхід, а укриття всередині пропускаються.
Mark fallen trees, flying debris or closed streets. Citizen routes avoid them, as well as trees, the shoreline and construction sites.|Позначте повалені дерева, уламки чи закриті вулиці. Маршрути мешканців оминають їх, а також дерева, узбережжя та будмайданчики.
Add flooded area|Додати затоплену ділянку
Add unsafe place|Додати небезпечне місце
No flooded areas marked.|Затоплених ділянок не позначено.
No unsafe places marked.|Небезпечних місць не позначено.
Radius (m)|Радіус (м)
example zone|приклад зони
Fleet unlock (MDS)|Розблокування транспорту (MDS)
Unlock the operators|Розблокувати операторів
Publishes an Emergency Unlock Mandate as an MDS Policy: zero fare near shelters, time-boxed to the alert, revoked automatically.|Публікує Мандат екстреного розблокування як політику MDS: безкоштовно біля укриттів, на час тривоги, скасовується автоматично.
Geofence radius around each shelter:|Радіус геозони навколо кожного укриття:
Lock fleets|Заблокувати транспорт
Re-publish|Опублікувати знову
Unlock fleets|Розблокувати транспорт
Declare an alert first, under Crisis operations.|Спершу оголосіть тривогу в розділі «Кризове реагування».
Storm protocol: riding in strong wind is dangerous. Unlock only if the wind has eased.|Штормовий протокол: їздити за сильного вітру небезпечно. Розблоковуйте, лише коли вітер ущухне.
Fleet|Парк
In geofence|У геозоні
Types|Типи
locked|заблоковано
normal pricing|звичайна ціна
awaiting…|очікування…
Organise|Організація
pick-up dispatch|диспетчеризація підвезень
Priority queue|Пріоритетна черга
Run matching|Підібрати
Pri.|Пріор.
Who|Хто
Need|Потреба
matched|призначено
phone|телефон
Add a request from a phone call|Додати запит із телефонного дзвінка
Caller|Абонент
Name or address|Ім'я або адреса
Add to queue|Додати до черги
No pick-up requests. They appear the moment an alert is declared.|Запитів на підвезення немає. Вони з'являються щойно оголошують тривогу.
Resolve / remove|Вирішити / видалити
Lend from the citizens|Позики від мешканців
Shared with the Rescue Board only while an alert is active; owners are notified on every claim.|Передається рятувальній службі лише під час тривоги; власники отримують сповіщення про кожне бронювання.
MDS exchange log|Журнал обміну MDS
No calls yet. Unlock the fleets to publish the mandate.|Запитів ще немає. Розблокуйте транспорт, щоб опублікувати мандат.
Rescue Board|Рятувальна служба
Demo reset|Демо скинуто
Reset the demo? This clears the alert, listings, works, hazard zones and requests on this device.|Скинути демо? Буде очищено тривогу, пропозиції, роботи, небезпечні зони й запити на цьому пристрої.
Could not read your location|Не вдалося визначити місцезнаходження
Geolocation not available|Геолокація недоступна
Give the construction site a name|Дайте роботам назву
Draw the street section: click where the works start and where they end|Намалюйте ділянку вулиці: клацніть, де роботи починаються й закінчуються
Check the dates: the end must not be before the start|Перевірте дати: завершення не може бути раніше початку
Construction site published to the citizen map|Роботи опубліковано на карті мешканців
Changes published — citizens see the new location and dates|Зміни опубліковано — мешканці бачать нове місце й дати
Thank you. The city and your neighbours can see it, and routes avoid it now.|Дякуємо. Місто й сусіди бачать це, а маршрути вже оминають це місце.
Report added — routes avoid it|Повідомлення додано — маршрути оминають це місце
Idea shared with the city and your neighbours|Ідею надіслано місту й сусідам
Issue sent to the city. Neighbours can support it too.|Проблему надіслано місту. Сусіди теж можуть її підтримати.
Give your idea a short title|Дайте ідеї коротку назву
Describe the issue in a few words|Опишіть проблему кількома словами
Storm published to the citizen map|Шторм опубліковано на карті мешканців
Set when the storm arrives|Вкажіть, коли прийде шторм
Place it on the map first|Спершу позначте це на карті
Place the report on the map first|Спершу позначте повідомлення на карті
Name the flooded area|Назвіть затоплену ділянку
Name the unsafe place|Назвіть небезпечне місце
Flooded area published — citizen routes go around it|Затоплену ділянку опубліковано — маршрути мешканців оминають її
Unsafe place published — citizen routes avoid it|Небезпечне місце опубліковано — маршрути мешканців його оминають
Give the listing a short description|Додайте короткий опис пропозиції
Listing is live — an alert is active|Пропозиція активна — триває тривога
Listed as dormant — invisible until an alert is declared|Додано як неактивну — прихована до оголошення тривоги
Listed as a driver — you will be matched with a neighbour who needs a pick-up|Ви у списку водіїв — вас з'єднають із сусідом, якому потрібне підвезення
Request added to the dispatch queue|Запит додано до черги
Who is calling? Add a name or address|Хто телефонує? Додайте ім'я або адресу
Fleets locked again — normal pricing restored|Транспорт знову заблоковано — звичайні ціни відновлено
Alert ended — pricing restored, listings back to dormant|Тривогу завершено — ціни відновлено, пропозиції знову неактивні
Time-box elapsed — alert ended automatically|Час минув — тривогу завершено автоматично
Click the map where you are|Клацніть на карті, де ви
Click the map where it is|Клацніть на карті, де це
Click the map where the vehicle is kept|Клацніть на карті, де зберігається транспорт
Click the map where the caller is|Клацніть на карті, де абонент
Click the map where the tree or branches are|Клацніть на карті, де дерево чи гілки
Click the map at the centre of the area|Клацніть на карті в центрі ділянки
Click the map at the centre of the storm|Клацніть на карті в центрі шторму
Click where the works start, then where they end. Add clicks to follow a longer stretch.|Клацніть, де роботи починаються, потім де закінчуються. Додайте кліки для довшої ділянки.
Click where the works start, then where they end.|Клацніть, де роботи починаються, потім де закінчуються.
Planned after residents reported it in PiMap|Заплановано після повідомлень мешканців у PiMap
Citizen report|Повідомлення мешканця
In use|Використовується
Dormant — activates on declaration|Неактивна — активується під час оголошення
Active — free to borrow|Активна — можна позичити
Claimed by a neighbour|Зайнято сусідом
Available for pick-up|Доступний для підвезення
On a pick-up|На підвезенні
Matched|Призначено
Routes go around this area.|Маршрути оминають цю ділянку.
Routes avoid this place.|Маршрути оминають це місце.
Accessible vehicle|Доступний транспорт
Emergency Unlock Mandate|Мандат екстреного розблокування
€0|0 €
`;

  const D = new Map();
  const rows = s => s.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).map(l => l.split('|'));
  rows(RAW).forEach(p => { if (p.length === 4) D.set(p[0], p.concat([null])); });
  rows(RAW5).forEach(p => { if (p.length === 5) D.set(p[0], p); });
  rows(RAW_UK).forEach(p => { if (p.length !== 2) return; const r = D.get(p[0]); if (r) r[4] = p[1]; else D.set(p[0], [p[0], null, null, null, p[1]]); });
  const COMPASS = { N: ['põhjast', 'pohjoisesta', 'del norte', 'з півночі'], NE: ['kirdest', 'koillisesta', 'del noreste', 'з північного сходу'], E: ['idast', 'idästä', 'del este', 'зі сходу'], SE: ['kagust', 'kaakosta', 'del sureste', 'з південного сходу'], S: ['lõunast', 'etelästä', 'del sur', 'з півдня'], SW: ['edelast', 'lounaasta', 'del suroeste', 'з південного заходу'], W: ['läänest', 'lännestä', 'del oeste', 'із заходу'], NW: ['loodest', 'luoteesta', 'del noroeste', 'з північного заходу'] };
  const DIRSHORT = { N: ['P', 'P', 'N', 'Пн'], NE: ['KI', 'KO', 'NE', 'ПнСх'], E: ['I', 'I', 'E', 'Сх'], SE: ['KA', 'KA', 'SE', 'ПдСх'], S: ['L', 'E', 'S', 'Пд'], SW: ['E', 'LO', 'SO', 'ПдЗх'], W: ['L', 'L', 'O', 'Зх'], NW: ['LO', 'LU', 'NO', 'ПнЗх'] };

  let lang = 'en';
  try { lang = localStorage.getItem('pimap-lang') || ''; } catch (e) { /* ignore */ }
  if (!CODES.includes(lang)) { const nl = (navigator.language || 'en').slice(0, 2).toLowerCase(); lang = CODES.includes(nl) ? nl : 'en'; }
  const pick = arr => arr[IDX[lang] - 1];               // for [et, fi, es, uk] arrays
  const look = s => { const r = D.get(s); return r ? r[IDX[lang]] : null; };
  const plural = (n, one, many) => (Number(n) === 1 ? one : many);
  const ukPlural = (n, one, few, many) => { n = Math.abs(Number(n)) % 100; const d = n % 10; return n > 10 && n < 20 ? many : d === 1 ? one : d >= 2 && d <= 4 ? few : many; };
  const u = s => (lang === 'uk' ? s.replace(/ km$/, ' км').replace(/ m$/, ' м') : s);   // unit names in Ukrainian

  /* Patterns for text with numbers, times, distances. t() translates a sub-phrase. */
  const P = [
    [/^(~?\d+) min$/, m => pick([null, null, null, `${m[1]} хв`])],
    [/^([\d.,]+) (k?m)$/, m => pick([null, null, null, `${m[1]} ${m[2] === 'km' ? 'км' : 'м'}`])],
    [/^([\d.,]+ k?m) away$/, m => pick([`${m[1]} kaugusel`, `${m[1]} päässä`, `a ${m[1]}`, `за ${u(m[1])}`])],
    [/^(\d+) min walk$/, m => pick([`${m[1]} min jalgsi`, `${m[1]} min kävellen`, `${m[1]} min a pie`, `${m[1]} хв пішки`])],
    [/^(\d+) d left$/, m => pick([`${m[1]} p jäänud`, `${m[1]} pv jäljellä`, `quedan ${m[1]} d`, `залишилось ${m[1]} дн.`])],
    [/^in (\d+) d$/, m => pick([`${m[1]} p pärast`, `${m[1]} pv päästä`, `en ${m[1]} d`, `через ${m[1]} дн.`])],
    [/^until ([^·]+)$/, m => pick([`kuni ${m[1]}`, `${m[1]} asti`, `hasta ${m[1]}`, `до ${m[1]}`])],
    [/^from ([^·]+)$/, m => pick([`alates ${m[1]}`, `${m[1]} alkaen`, `desde ${m[1]}`, `з ${m[1]}`])],
    [/^ends ([^·]+)$/, m => pick([`lõpeb ${m[1]}`, `päättyy ${m[1]}`, `termina ${m[1]}`, `завершується о ${m[1]}`])],
    [/^Declared ([^·]+)$/, m => pick([`Välja kuulutatud ${m[1]}`, `Julistettu ${m[1]}`, `Declarada ${m[1]}`, `Оголошено о ${m[1]}`])],
    [/^just now$/, () => pick(['just praegu', 'juuri nyt', 'ahora mismo', 'щойно'])],
    [/^(\d+) min ago$/, m => pick([`${m[1]} min tagasi`, `${m[1]} min sitten`, `hace ${m[1]} min`, `${m[1]} хв тому`])],
    [/^(\d+) h ago$/, m => pick([`${m[1]} h tagasi`, `${m[1]} h sitten`, `hace ${m[1]} h`, `${m[1]} год тому`])],
    [/^(\d+) d ago$/, m => pick([`${m[1]} p tagasi`, `${m[1]} pv sitten`, `hace ${m[1]} d`, `${m[1]} дн. тому`])],
    [/^Updated by the city (.+)$/, (m, t) => pick([`Linn uuendas ${t(m[1])}`, `Kaupunki päivitti ${t(m[1])}`, `Actualizado por el ayuntamiento ${t(m[1])}`, `Оновлено містом ${t(m[1])}`])],
    [/^(\d+) closest$/, m => pick([`${m[1]} lähimat`, `${m[1]} lähintä`, `los ${m[1]} más cercanos`, `${m[1]} найближчих`])],
    [/^(.+) near you$/, m => { const x = look(m[1]); return x == null ? null : pick([`${x} sinu lähedal`, `${x} lähelläsi`, `${x} cerca de ti`, `${x} поруч із вами`]); }],
    [/^(\d+) construction sites? within 2 km$/, m => pick([`${m[1]} ehitustööd 2 km raadiuses`, `${m[1]} työmaata 2 km:n säteellä`, `${m[1]} ${plural(m[1], 'obra', 'obras')} a menos de 2 km`, `Робіт у радіусі 2 км: ${m[1]}`])],
    [/^(\d+) hazard reports?$/, m => pick([`Ohuteateid: ${m[1]}`, `Vaarailmoituksia: ${m[1]}`, `${m[1]} ${plural(m[1], 'aviso de peligro', 'avisos de peligro')}`, `Повідомлень про небезпеки: ${m[1]}`])],
    [/^(\d+) fallen tree reports?$/, m => pick([`Teateid langenud puudest: ${m[1]}`, `Ilmoituksia kaatuneista puista: ${m[1]}`, `${m[1]} ${plural(m[1], 'aviso', 'avisos')} de árboles caídos`, `Повідомлень про повалені дерева: ${m[1]}`])],
    [/^(\d+) issues and ideas near you$/, m => pick([`Probleeme ja ideid sinu lähedal: ${m[1]}`, `Ongelmia ja ideoita lähelläsi: ${m[1]}`, `${m[1]} problemas e ideas cerca de ti`, `Проблем та ідей поруч: ${m[1]}`])],
    [/^Päästeamet register, (.+)$/, m => pick([`Päästeameti register, ${m[1]}`, `Pelastusviraston rekisteri, ${m[1]}`, `Registro de Päästeamet, ${m[1]}`, `Реєстр Päästeamet, ${m[1]}`])],
    [/^Päästeamet register via Maa- ja Ruumiamet, (.+)$/, m => pick([`Päästeameti register Maa- ja Ruumiameti kaudu, ${m[1]}`, `Pelastusviraston rekisteri Maa- ja Ruumiametin kautta, ${m[1]}`, `Registro de Päästeamet vía Maa- ja Ruumiamet, ${m[1]}`, `Реєстр Päästeamet через Maa- ja Ruumiamet, ${m[1]}`])],
    [/^(Public library|Shopping centre): an indoor place to cool down during a heatwave or wait out a storm\.$/, (m, t) => `${t(m[1])}: ` + pick(['siseruum, kus kuumalaine ajal jahtuda või tormi üle oodata.', 'sisätila, jossa viilentyä helteellä tai odottaa myrskyn yli.', 'un interior donde refrescarse en una ola de calor o esperar a que pase una tormenta.', 'приміщення, де можна охолонути в спеку або перечекати шторм.'])],
    [/^Active · (\d+) days left$/, m => pick([`Käimas · ${m[1]} päeva jäänud`, `Käynnissä · ${m[1]} päivää jäljellä`, `En curso · quedan ${m[1]} días`, `Триває · залишилось ${m[1]} дн.`])],
    [/^Starts in (\d+) days$/, m => pick([`Algab ${m[1]} päeva pärast`, `Alkaa ${m[1]} päivän päästä`, `Empieza en ${m[1]} días`, `Почнеться через ${m[1]} дн.`])],
    [/^Routes keep (\d+) m away until the city clears it\.$/, m => pick([`Teekonnad hoiavad ${m[1]} m kaugusele, kuni linn selle koristab.`, `Reitit pysyvät ${m[1]} m:n päässä, kunnes kaupunki raivaa sen.`, `Las rutas se mantienen a ${m[1]} m hasta que el ayuntamiento lo retire.`, `Маршрути оминають це місце на ${m[1]} м, доки місто його не прибере.`])],
    [/^([\d.,]+ k?m) to the vehicle, then ride$/, m => pick([`${m[1]} sõidukini, siis sõida`, `${m[1]} ajoneuvolle, sitten aja`, `${m[1]} hasta el vehículo y luego a rodar`, `${u(m[1])} до транспорту, далі їхати`])],
    [/^battery (\d+)%$/, m => pick([`aku ${m[1]}%`, `akku ${m[1]} %`, `batería ${m[1]} %`, `батарея ${m[1]}%`])],
    [/^(.+), neighbour$/, m => pick([`${m[1]}, naaber`, `${m[1]}, naapuri`, `${m[1]}, vecino`, `${m[1]}, сусід`])],
    [/^position (\d+)$/, m => pick([`koht ${m[1]}`, `sija ${m[1]}`, `posición ${m[1]}`, `місце ${m[1]}`])],
    [/^(.+) is coming$/, (m, t) => pick([`${t(m[1])} on teel`, `${t(m[1])} on tulossa`, `${t(m[1])} está en camino`, `${t(m[1])} їде до вас`])],
    [/^Pinge crew (\d+)$/, m => pick([`Pinge meeskond ${m[1]}`, `Pinge-tiimi ${m[1]}`, `Equipo Pinge ${m[1]}`, `Бригада Pinge ${m[1]}`])],
    [/^(\d+) seats$/, m => pick([`${m[1]} kohta`, `${m[1]} paikkaa`, `${m[1]} plazas`, `${m[1]} місць`])],
    [/^(\d+) spare seats?$/, m => pick([`${m[1]} vaba kohta`, `${m[1]} vapaata paikkaa`, `${m[1]} ${plural(m[1], 'plaza libre', 'plazas libres')}`, `вільних місць: ${m[1]}`])],
    [/^(\d+) pers\.$/, m => pick([`${m[1]} in.`, `${m[1]} hlö`, `${m[1]} pers.`, `${m[1]} ос.`])],
    [/^queued #(\d+)$/, m => pick([`järjekorras #${m[1]}`, `jonossa #${m[1]}`, `en cola #${m[1]}`, `у черзі #${m[1]}`])],
    [/^Location (.+)$/, m => pick([`Asukoht ${m[1]}`, `Sijainti ${m[1]}`, `Ubicación ${m[1]}`, `Місцезнаходження ${m[1]}`])],
    [/^Pin: (.+)$/, (m, t) => pick([`Märk: ${t(m[1])}`, `Merkki: ${t(m[1])}`, `Marcador: ${t(m[1])}`, `Позначка: ${t(m[1])}`])],
    [/^Pinned at (.+)$/, m => pick([`Märgitud: ${m[1]}`, `Merkitty: ${m[1]}`, `Marcado en ${m[1]}`, `Позначено: ${m[1]}`])],
    [/^Centred at (.+)$/, m => pick([`Keskpunkt: ${m[1]}`, `Keskipiste: ${m[1]}`, `Centro en ${m[1]}`, `Центр: ${m[1]}`])],
    [/^(\d+) m of street$/, m => pick([`${m[1]} m tänavat`, `${m[1]} m katua`, `${m[1]} m de calle`, `${m[1]} м вулиці`])],
    [/^(\d+) m of street · (\d+) points$/, m => pick([`${m[1]} m tänavat · ${m[2]} punkti`, `${m[1]} m katua · ${m[2]} pistettä`, `${m[1]} m de calle · ${m[2]} puntos`, `${m[1]} м вулиці · точок: ${m[2]}`])],
    [/^(\d+) m radius$/, m => pick([`raadius ${m[1]} m`, `säde ${m[1]} m`, `radio de ${m[1]} m`, `радіус ${m[1]} м`])],
    [/^(\d+) active$/, m => pick([`${m[1]} käimas`, `${m[1]} käynnissä`, `${m[1]} activas`, `активних: ${m[1]}`])],
    [/^(\d+) upcoming$/, m => pick([`${m[1]} tulemas`, `${m[1]} tulossa`, `${m[1]} próximas`, `запланованих: ${m[1]}`])],
    [/^(\d+) open$/, m => pick([`${m[1]} avatud`, `${m[1]} avoinna`, `${m[1]} abiertos`, `відкритих: ${m[1]}`])],
    [/^(\d+) new$/, m => pick([`${m[1]} uut`, `${m[1]} uutta`, `${m[1]} nuevos`, `нових: ${m[1]}`])],
    [/^(\d+) confirmed$/, m => pick([`${m[1]} kinnitatud`, `${m[1]} vahvistettu`, `${m[1]} confirmados`, `підтверджених: ${m[1]}`])],
    [/^(\d+) cleared$/, m => pick([`${m[1]} koristatud`, `${m[1]} raivattu`, `${m[1]} retirados`, `прибраних: ${m[1]}`])],
    [/^(\d+) calls$/, m => pick([`${m[1]} päringut`, `${m[1]} kutsua`, `${m[1]} llamadas`, `запитів: ${m[1]}`])],
    [/^sorted by new first, then most supported$/, () => pick(['uued eespool, seejärel enim toetatud', 'uusimmat ensin, sitten eniten tuetut', 'primero los nuevos y luego los más apoyados', 'спершу нові, потім найпідтримуваніші'])],
    [/^(\d+) hours?$/, m => pick([`${m[1]} ${plural(m[1], 'tund', 'tundi')}`, `${m[1]} ${plural(m[1], 'tunti', 'tuntia')}`, `${m[1]} ${plural(m[1], 'hora', 'horas')}`, `${m[1]} ${ukPlural(m[1], 'година', 'години', 'годин')}`])],
    [/^(\d+)h (\d+)m left$/, m => pick([`${m[1]} h ${m[2]} min jäänud`, `${m[1]} h ${m[2]} min jäljellä`, `quedan ${m[1]} h ${m[2]} min`, `залишилось ${m[1]} год ${m[2]} хв`])],
    [/^Declare (.+) alert$/, (m, t) => pick([`Kuuluta välja ${t(m[1])} ohuteade`, `Julista ${t(m[1])} hälytys`, `Declarar alerta de ${t(m[1])}`, `Оголосити тривогу: ${t(m[1])}`])],
    [/^(War \/ air strike|Flood|Heatwave|Storm) alert$/, (m, t) => pick([`${t(m[1])}: ohuteade`, `${t(m[1])}: hälytys`, `Alerta: ${t(m[1]).toLowerCase()}`, `${t(m[1])}: тривога`])],
    [/^(War \/ air strike|Flood|Heatwave|Storm) alert active$/, (m, t) => pick([`${t(m[1])}: ohuteade aktiivne`, `${t(m[1])}: hälytys päällä`, `Alerta activa: ${t(m[1]).toLowerCase()}`, `${t(m[1])}: тривога активна`])],
    [/^(War \/ air strike|Flood|Heatwave|Storm) alert: your reports help everyone route safely$/, (m, t) => pick([`${t(m[1])}: sinu teated aitavad kõigil ohutult liikuda`, `${t(m[1])}: ilmoituksesi auttavat kaikkia kulkemaan turvallisesti`, `${t(m[1])}: tus avisos ayudan a todos a moverse con seguridad`, `${t(m[1])}: ваші повідомлення допомагають усім безпечно пересуватися`])],
    [/^Citizens are routed to the nearest (.+)\.$/, (m, t) => pick([`Elanikud suunatakse lähimasse kohta: ${t(m[1])}.`, `Asukkaat ohjataan lähimpään kohteeseen: ${t(m[1])}.`, `Se dirige a los vecinos a: ${t(m[1])} más cercano.`, `Мешканців спрямовують до найближчого місця: ${t(m[1])}.`])],
    [/^EE-ALARM pushed with the (.+) route and four ways to get there\.$/, (m, t) => pick([`EE-ALARM saadeti koos teekonnaga (${t(m[1])}) ja nelja liikumisviisiga.`, `EE-ALARM lähetettiin reitin (${t(m[1])}) ja neljän kulkutavan kanssa.`, `EE-ALARM enviado con la ruta (${t(m[1])}) y cuatro formas de llegar.`, `EE-ALARM надіслано з маршрутом (${t(m[1])}) і чотирма способами дістатися.`])],
    [/^(\d+) dormant listings waiting\.$/, m => pick([`Ootel pakkumisi: ${m[1]}.`, `Lepotilassa olevia ilmoituksia: ${m[1]}.`, `${m[1]} ofertas latentes a la espera.`, `Неактивних пропозицій в очікуванні: ${m[1]}.`])],
    [/^(\d+) neighbour listings live\.$/, m => pick([`Aktiivseid naabripakkumisi: ${m[1]}.`, `Naapureiden ilmoituksia voimassa: ${m[1]}.`, `${m[1]} ofertas de vecinos activas.`, `Активних пропозицій сусідів: ${m[1]}.`])],
    [/^(\d+) vehicles free in (\d+) m zones$/, m => pick([`${m[1]} sõidukit tasuta ${m[2]} m tsoonides`, `${m[1]} ajoneuvoa maksutta ${m[2]} m:n alueilla`, `${m[1]} vehículos gratis en zonas de ${m[2]} m`, `${m[1]} од. транспорту безкоштовно в зонах ${m[2]} м`])],
    [/^Drivers free: (\d+) of (\d+) \((\d+) Pinge crews, (\d+) neighbours\)\.$/, m => pick([`Vabu juhte: ${m[1]}/${m[2]} (${m[3]} Pinge meeskonda, ${m[4]} naabrit).`, `Vapaita kuljettajia: ${m[1]}/${m[2]} (${m[3]} Pinge-tiimiä, ${m[4]} naapuria).`, `Conductores libres: ${m[1]} de ${m[2]} (${m[3]} equipos Pinge, ${m[4]} vecinos).`, `Вільних водіїв: ${m[1]} з ${m[2]} (бригад Pinge: ${m[3]}, сусідів: ${m[4]}).`])],
    [/^Policy object \(MDS Policy ([\d.]+)\)$/, m => pick([`Poliitikaobjekt (MDS Policy ${m[1]})`, `Käytäntöobjekti (MDS Policy ${m[1]})`, `Objeto de política (MDS Policy ${m[1]})`, `Об'єкт політики (MDS Policy ${m[1]})`])],
    [/^(\d+)% of the route is in shade$/, m => pick([`${m[1]}% teekonnast on varjus`, `${m[1]} % reitistä on varjossa`, `el ${m[1]} % de la ruta está a la sombra`, `${m[1]}% маршруту в тіні`])],
    [/^(\d+)% of the route is exposed$/, m => pick([`${m[1]}% teekonnast on avatud`, `${m[1]} % reitistä on alttiina`, `el ${m[1]} % de la ruta está expuesta`, `${m[1]}% маршруту відкриті`])],
    [/^, versus (\d+)% on the fastest route\. Green is shade from buildings and trees, orange is direct sun\.$/, m => pick([`, kiireimal teekonnal ${m[1]}%. Roheline on hoonete ja puude vari, oranž otsene päike.`, `, nopeimmalla reitillä ${m[1]} %. Vihreä on rakennusten ja puiden varjoa, oranssi suoraa aurinkoa.`, `, frente al ${m[1]} % de la ruta más rápida. Verde es sombra de edificios y árboles; naranja, sol directo.`, `, проти ${m[1]}% на найшвидшому маршруті. Зелене — тінь від будівель і дерев, помаранчеве — пряме сонце.`])],
    [/^\. Green is shade from buildings and trees, orange is direct sun\.$/, () => pick(['. Roheline on hoonete ja puude vari, oranž otsene päike.', '. Vihreä on rakennusten ja puiden varjoa, oranssi suoraa aurinkoa.', '. Verde es sombra de edificios y árboles; naranja, sol directo.', '. Зелене — тінь від будівель і дерев, помаранчеве — пряме сонце.'])],
    [/^, down from (\d+)% on the fastest route\. Red marks stretches under trees, by the shoreline or next to construction\.$/, m => pick([`, kiireimal teekonnal ${m[1]}%. Punane tähistab lõike puude all, ranna ääres või ehitustööde kõrval.`, `, nopeimmalla reitillä ${m[1]} %. Punainen merkitsee osuuksia puiden alla, rannan tuntumassa tai työmaiden vieressä.`, `, frente al ${m[1]} % de la ruta más rápida. En rojo, tramos bajo árboles, junto a la costa o junto a obras.`, `, проти ${m[1]}% на найшвидшому маршруті. Червоним позначено ділянки під деревами, біля узбережжя чи поруч із будівництвом.`])],
    [/^\. Red marks stretches under trees, by the shoreline or next to construction\.$/, () => pick(['. Punane tähistab lõike puude all, ranna ääres või ehitustööde kõrval.', '. Punainen merkitsee osuuksia puiden alla, rannan tuntumassa tai työmaiden vieressä.', '. En rojo, tramos bajo árboles, junto a la costa o junto a obras.', '. Червоним позначено ділянки під деревами, біля узбережжя чи поруч із будівництвом.'])],
    [/^Sun from the (N|NE|E|SE|S|SW|W|NW), (-?\d+)° above the horizon at ([\d:.]+)\.$/, m => pick([`Päike paistab ${COMPASS[m[1]][0]}, ${m[2]}° kõrgusel kell ${m[3]}.`, `Aurinko paistaa ${COMPASS[m[1]][1]}, ${m[2]}° korkeudella klo ${m[3]}.`, `Sol ${COMPASS[m[1]][2]}, a ${m[2]}° sobre el horizonte a las ${m[3]}.`, `Сонце світить ${COMPASS[m[1]][3]}, на висоті ${m[2]}° о ${m[3]}.`])],
    [/^(\d+) drinking water points? on the way, marked on the map\.$/, m => pick([`Teel on ${m[1]} joogiveepunkti, märgitud kaardil.`, `Matkalla on ${m[1]} juomavesipistettä, merkitty kartalle.`, `Hay ${m[1]} ${plural(m[1], 'fuente', 'fuentes')} de agua potable en el camino, marcadas en el mapa.`, `Точок з питною водою на шляху: ${m[1]}, вони позначені на карті.`])],
    [/^: wind (\d+) m\/s, gusts up to (\d+) m\/s from the (N|NE|E|SE|S|SW|W|NW), (until|from) ([\d:.]+)\.$/, m => pick([`: tuul ${m[1]} m/s, puhangud kuni ${m[2]} m/s ${COMPASS[m[3]][0]}, ${m[4] === 'until' ? 'kuni' : 'alates'} ${m[5]}.`, `: tuuli ${m[1]} m/s, puuskat jopa ${m[2]} m/s ${COMPASS[m[3]][1]}, ${m[4] === 'until' ? m[5] + ' asti' : m[5] + ' alkaen'}.`, `: viento ${m[1]} m/s, rachas de hasta ${m[2]} m/s ${COMPASS[m[3]][2]}, ${m[4] === 'until' ? 'hasta las' : 'desde las'} ${m[5]}.`, `: вітер ${m[1]} м/с, пориви до ${m[2]} м/с ${COMPASS[m[3]][3]}, ${m[4] === 'until' ? 'до' : 'з'} ${m[5]}.`])],
    [/^(\d+) fallen trees? and branch reports on the map\.$/, m => pick([`Kaardil on ${m[1]} teadet langenud puudest ja okstest.`, `Kartalla on ${m[1]} ilmoitusta kaatuneista puista ja oksista.`, `Hay ${m[1]} avisos de árboles y ramas caídos en el mapa.`, `Повідомлень про повалені дерева й гілки на карті: ${m[1]}.`])],
    [/^Avoids (\d+) (flooded areas?|unsafe places?): (.+)$/, m => { const fl = m[2].startsWith('flooded'); return pick([`Väldib ${m[1]} ${fl ? 'üleujutatud ala' : 'ohtlikku kohta'}: ${m[3]}`, `Välttää ${m[1]} ${fl ? 'tulva-aluetta' : 'vaarallista paikkaa'}: ${m[3]}`, `Evita ${m[1]} ${fl ? plural(m[1], 'zona inundada', 'zonas inundadas') : plural(m[1], 'lugar peligroso', 'lugares peligrosos')}: ${m[3]}`, `Оминає ${fl ? 'затоплені ділянки' : 'небезпечні місця'} (${m[1]}): ${m[3]}`]); }],
    [/^Avoids a blocked stretch:$/, () => pick(['Väldib suletud lõiku:', 'Välttää suljetun osuuden:', 'Evita un tramo bloqueado:', 'Оминає перекриту ділянку:'])],
    [/^Avoids (\d+) blocked stretches:$/, m => pick([`Väldib ${m[1]} suletud lõiku:`, `Välttää ${m[1]} suljettua osuutta:`, `Evita ${m[1]} tramos bloqueados:`, `Оминає перекриті ділянки (${m[1]}):`])],
    [/^▲ Support$/, () => pick(['▲ Toeta', '▲ Tue', '▲ Apoyar', '▲ Підтримати'])],
    [/^▲ Supported$/, () => pick(['▲ Toetatud', '▲ Tuettu', '▲ Apoyado', '▲ Підтримано'])],
    [/^(\d+) comments?$/, m => pick([`${m[1]} kommentaari`, `${m[1]} kommenttia`, `${m[1]} ${plural(m[1], 'comentario', 'comentarios')}`, `коментарів: ${m[1]}`])],
    [/^(\d+) support$/, m => pick([`${m[1]} toetust`, `${m[1]} tukea`, `${m[1]} apoyos`, `підтримок: ${m[1]}`])],
    [/^applied ([\d:.]+)$/, m => pick([`rakendatud ${m[1]}`, `sovellettu ${m[1]}`, `aplicado ${m[1]}`, `застосовано ${m[1]}`])],
    [/^revoked ([\d:.]+)$/, m => pick([`tühistatud ${m[1]}`, `peruttu ${m[1]}`, `revocado ${m[1]}`, `скасовано ${m[1]}`])],
    [/^(\d+) at €0$/, m => pick([`${m[1]} hinnaga €0`, `${m[1]} 0 €:lla`, `${m[1]} a 0 €`, `${m[1]} за 0 €`])],
    [/^Wind (\d+) m\/s$/, m => pick([`Tuul ${m[1]} m/s`, `Tuuli ${m[1]} m/s`, `Viento ${m[1]} m/s`, `Вітер ${m[1]} м/с`])],
    [/^gusts (\d+) m\/s from (N|NE|E|SE|S|SW|W|NW)$/, m => pick([`puhangud ${m[1]} m/s ${COMPASS[m[2]][0]}`, `puuskat ${m[1]} m/s ${COMPASS[m[2]][1]}`, `rachas de ${m[1]} m/s ${COMPASS[m[2]][2]}`, `пориви ${m[1]} м/с ${COMPASS[m[2]][3]}`])],
    [/^(N|NE|E|SE|S|SW|W|NW)$/, m => pick(DIRSHORT[m[1]])],
  ];

  function tr(s) {
    if (lang === 'en' || !s) return null;
    let v = look(s); if (v != null) return v;
    const pm = s.match(/^([\s\S]*?)([.:!?…]+)$/);
    if (pm && pm[1]) { v = look(pm[1]); if (v != null) return v + pm[2]; }
    if (!/[.!?]$/.test(s)) { v = look(s + '.'); if (v != null) return v.replace(/\.$/, ''); }
    for (const [re, fn] of P) { const m = s.match(re); if (m) { const out = fn(m, trOr); if (out != null) return out; } }
    if (s.includes(' · ')) { const parts = s.split(' · '), t = parts.map(trOr); if (t.some((x, i) => x !== parts[i])) return t.join(' · '); }
    if (s.includes(', ')) { const parts = s.split(', '), t = parts.map(p => tr(p)); if (t.every(x => x != null)) return t.join(', '); }
    const sents = s.split(/(?<=[.?!])\s+/);
    if (sents.length > 1) { const t = sents.map(trOr); if (t.some((x, i) => x !== sents[i])) return t.join(' '); }
    return null;
  }
  function trOr(s) { const t = tr(s); return t == null ? s : t; }
  /* Strip decoration (·, whitespace) around a text node's content before matching */
  function trNodeText(orig) {
    const m = orig.match(/^([\s·]*)([\s\S]*?)([\s·]*)$/);
    if (!m[2] || !/[A-Za-z]/.test(m[2])) return orig;
    const t = tr(m[2]);
    return t == null ? orig : m[1] + t + m[3];
  }

  /* ---- DOM layer ---- */
  const ORIG = new WeakMap(), DONE = new WeakMap(), AORIG = new WeakMap();
  const ATTRS = ['placeholder', 'aria-label', 'title'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'SVG', 'svg', 'path', 'CODE', 'PRE']);
  function skipEl(el) { for (let e = el; e && e !== document.documentElement; e = e.parentNode) { if (e.nodeType === 1 && (SKIP.has(e.nodeName) || (e.hasAttribute && e.hasAttribute('data-no-i18n')))) return true; } return false; }
  function doText(node) {
    const cur = node.nodeValue;
    if (DONE.get(node) === cur) return;
    ORIG.set(node, cur);
    const out = lang === 'en' ? cur : trNodeText(cur);
    DONE.set(node, out);
    if (out !== cur) node.nodeValue = out;
  }
  function doAttrs(el) {
    let o = AORIG.get(el); if (!o) { o = {}; AORIG.set(el, o); }
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      if (o['done_' + a] === cur) continue;
      o[a] = cur;
      const out = lang === 'en' ? cur : trNodeText(cur);
      o['done_' + a] = out;
      if (out !== cur) el.setAttribute(a, out);
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!skipEl(root.parentNode)) doText(root); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    if (root.hasAttribute && ATTRS.some(a => root.hasAttribute(a))) doAttrs(root);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => (n.nodeType === 1 && (SKIP.has(n.nodeName) || n.hasAttribute('data-no-i18n'))) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    let n; while ((n = tw.nextNode())) { if (n.nodeType === 3) doText(n); else if (ATTRS.some(a => n.hasAttribute(a))) doAttrs(n); }
  }
  /* Re-translate everything from the stored English originals */
  function retranslateAll() {
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n; while ((n = tw.nextNode())) {
      if (n.nodeType === 3) { const o = ORIG.get(n); if (o != null && DONE.get(n) === n.nodeValue) { n.nodeValue = o; DONE.delete(n); } }
      else { const o = AORIG.get(n); if (o) for (const a of ATTRS) if (o[a] != null && o['done_' + a] === n.getAttribute(a)) { n.setAttribute(a, o[a]); delete o['done_' + a]; } }
    }
    walk(document.body);
    translateTitle();
  }
  let titleOrig = document.title, titleDone = null;
  function translateTitle() {
    if (document.title !== titleDone) titleOrig = document.title;
    titleDone = lang === 'en' ? titleOrig : trNodeText(titleOrig);
    if (document.title !== titleDone) document.title = titleDone;
  }
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'characterData') { if (!skipEl(m.target.parentNode)) doText(m.target); }
      else if (m.type === 'childList') m.addedNodes.forEach(walk);
      else if (m.type === 'attributes') { if (!skipEl(m.target)) doAttrs(m.target); }
    }
  });
  const titleMo = new MutationObserver(translateTitle);

  function renderSwitch() {
    const el = document.getElementById('langSwitch'); if (!el) return;
    el.innerHTML = LANGS.map(([k, s, name]) => `<button type="button" data-lang="${k}" class="${k === lang ? 'on' : ''}" aria-pressed="${k === lang}" title="${name}" data-no-i18n>${s}</button>`).join('');
  }
  function setLang(l) {
    if (!CODES.includes(l)) return;
    lang = l; try { localStorage.setItem('pimap-lang', l); } catch (e) { /* ignore */ }
    document.documentElement.lang = l; window.LKP_LANG = l;
    renderSwitch();
    window.dispatchEvent(new CustomEvent('lkp:lang', { detail: l }));   // app re-renders dates in the new locale
    retranslateAll();
  }

  /* Debug aid: visible interface text that stayed in English in the current language */
  window.LKP_I18N_MISSING = () => {
    const out = new Set(), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) {
      const p = n.parentElement; if (!p || skipEl(p) || (p.offsetParent === null && !p.closest('.leaflet-popup'))) continue;
      const o = ORIG.get(n), v = n.nodeValue.trim();
      if (o != null && o === n.nodeValue && /[A-Za-z]{3}/.test(v)) out.add(v);
    }
    return [...out];
  };
  window.LKP_SET_LANG = setLang;   // used by the welcome page's language picker
  window.LKP_LANG = lang;
  window.LKP_LOCALE = () => LOCALE[lang];
  window.LKP_T = s => (lang === 'en' ? s : trOr(s));
  document.documentElement.lang = lang;
  function start() {
    renderSwitch();
    const sw = document.getElementById('langSwitch');
    if (sw) sw.addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b) setLang(b.dataset.lang); });
    walk(document.body); translateTitle();
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    const t = document.querySelector('title'); if (t) titleMo.observe(t, { childList: true, characterData: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
