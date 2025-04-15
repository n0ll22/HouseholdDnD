const Tutorial = () => {
    /* FONTOS! ----------------------------------------------------
  ---------------------------------------------------------------
  Ez az oldal csak és kizárólag a dokumentáció miatt jött létre.
  Semmilyen funkciót nem biztosít az oldalnak, csak tájékoztató
  jelleggel hoztam létre. A dokumntációt követve fontos az eredeti
  kódot is szemelőtt tartani, mivel a JSX-et inkább nem jelenítem
  meg ebben a komponensben. -------------------------------------
  -------------------------------------------------------------*/

    return (
        <main className="p-10 w-full flex justify-center overflow-x-auto">
            <div className="flex flex-col w-full items-center">
                <div className="w-full">
                    <h1 className="text-4xl font-bold mb-5">How To Survive</h1>
                    <h2 className="text-2xl font-bold mb-5">Greetings!</h2>
                    <div className="mb-10">
                        <p className="mb-2">
                            Ez a program egy háztartásbeli rpg játékot szeretne
                            megtestesíteni. Az a lényege, hogy minden házimunka
                            után hozzá lehet adni egy adott feladatot a teendők
                            közé, amiért tapsztalat pontot (exp) lehet szeretni,
                            majd szinteket lépni.
                        </p>
                        <p className="">
                            Ez az oldal bemutatja, hogyan kell használni, és
                            hogyan működnek az oldal egyes részei. Alapvetően a
                            program az <b>MVC</b> modelt használja. A szerver
                            oldalon ExpressJS és MySql működik, habár
                            MongoDB-vel fogom továbbfejleszteni.
                        </p>
                    </div>
                    <h2 className="text-2xl font-bold mb-5">Chapters:</h2>
                    <ul className="list-disc mb-10">
                        <li className="ml-10">
                            <a href="#cp1" className="hover:font-medium">
                                Hooks & Routes
                            </a>
                        </li>
                        <li className="ml-10">
                            <a href="#cp2" className="hover:font-medium">
                                Manage Tasks
                            </a>
                        </li>
                        <li className="ml-10">
                            <a href="#cp3" className="hover:font-medium">
                                Complete Tasks
                            </a>
                        </li>
                        <li className="ml-10">
                            <a href="#cp4" className="hover:font-medium">
                                Login system
                            </a>
                        </li>
                        <li className="ml-10">
                            <a href="#cp5" className="hover:font-medium">
                                Backend
                            </a>
                        </li>
                        <li className="ml-10">
                            <a href="#cp6" className="hover:font-medium">
                                Future Plans
                            </a>
                        </li>
                    </ul>
                    <div className="mb-10">
                        <h2 id="cp1" className="text-2xl font-bold mb-10">
                            Chapter 1: Hooks & Routes
                        </h2>
                        <p className="mb-5">
                            Mielőtt a háztartási feladatok kezeléséről lenne
                            szó. Meg kell említenem a kommunikációt a szerver és
                            a kliens között
                        </p>
                        <div className="ml-2">
                            <h3 className="text-lg font-bold mb-5">
                                - Custom hooks:
                            </h3>
                            <p>
                                Első körben lekérjük az adatokat egy egyedi{" "}
                                <b>hook</b> segíségével.
                            </p>
                            <div className="my-5">
                                <code>useGet.tsx:</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>
                                    {`import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

//Adat interfésze
interface ApiResponse<T> {
  data: T | null; //az adat, amit a lekérés visszaad
  error: AxiosError | null; //esetleges hiba esetén error tárolása
  pending: boolean; //töltési folyamat jelzése
}

//Hook function
//Beállítjuk, milyen típusú lehet majd az adat amit visszakapunk
//GET esetén csak url-re van szükség
const useGet = <T,>(url: string): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [pending, setPending] = useState<boolean>(true);

  //Adat lekérésének megkezdése
  useEffect(() => {
    let isMounted = true;

    //ha van adat és sikeres a lekérés, akkor tárolja el az adatokat
    //ha van hiba, akkor tárolja el az errort
    //ha folyamatban a lekérés, addig legyen igaz a pending.
    //Bármelyik esetben ha van valami adat, akkor hamis lesz a pending és mountolás
    axios
      .get<T>(url)
      .then((res: AxiosResponse<T>) => {
        if (isMounted) {
          setData(res.data);
          setError(null);
          setPending(false);
        }
      })
      .catch((err: AxiosError) => {
        if (isMounted) {
          setError(err);
          setPending(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]); //url változása esetén fut le

  return { data, error, pending }; //mindhárom adat elküldése.
};

export default useGet;`}
                                </code>
                            </pre>
                            <h3 className="text-lg font-bold my-5">
                                - Routes:
                            </h3>
                            <p>
                                Ha megvannak a szükséges adatok, akkor azt az{" "}
                                <code>App.tsx</code> továbbadja az elérhető{" "}
                                <code>{"<Route>"}</code>
                                -nak. Bizonyos route-ok csak akkor elérhetőek,
                                ha a felhasználó be van jelentkezve, vagy
                                fordítva.
                            </p>
                            <div className="my-5">
                                <code>Route example:</code>
                            </div>

                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`
<Router>                
    //Ha nincs bejelentkezve a felhasználó
    {!loggedIn && (
        <div className="w-full col-span-6">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    )}

    //Ha a már van adat és a felhasználó bejelentkezett
    {taskData && loggedIn && (
        <div className="col-span-6 w-full">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/allTask" element={<AllTask data={taskData} />} />
            ...
            </Routes>
        </div>
    )}
</Router>        
              `}</code>
                            </pre>
                            <p>
                                Hogy a felhasználó be van-e jelentkezve azt a{" "}
                                <u>
                                    <a
                                        href="#cp4"
                                        className="hover:font-medium"
                                    >
                                        Login System
                                    </a>
                                </u>{" "}
                                részben részletezem hogyan működik.
                            </p>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h2 id="cp2" className="text-2xl font-bold mb-10">
                            Chapter 2: The managment of The Tasks
                        </h2>
                        <p className="mb-5">
                            A házimunka esetében objektumok tömbjéről van szó.
                            Egy feladat tartalmazza a nevét, leírását, segítő
                            videók linkjét (amit nem készítettem el) és
                            tapsztalat pontokat.
                        </p>
                        <p className="mb-5">A feladat objecktum sémája:</p>
                        <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                            <code>{`interface TaskData {
    id: number; //Ez MongoDB esetében string
    title: string;
    exp: number;
    description: string;
    tutorials: [];
}`}</code>
                        </pre>
                        <div className="ml-2">
                            <h3 className="text-lg font-bold my-5">
                                - Manage Task:
                            </h3>
                            <p>
                                Először lekérjük az adatokat, majd továbbítjuk a
                                megfelelő element felé. Azt az element fogadja,
                                majd feldolgozza az adatokat (pl. megjeleníti).
                                Ezt szemléltetem a feladatok kezelőjével:
                            </p>
                            <div className="my-5">
                                <code>ManageTask.tsx:</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>
                                    {`import React from "react";
import { Link } from "react-router-dom";

//Adatok sémája
interface TaskData {
  id: number;
  title: string;
  exp: number;
  description: string;
  tutorials: [];
}

interface ManageTaskProps {
  data: TaskData[]; // Adat fogadásához kell a type
}
//Beállítom, hogy milyen adat érkezik a prop-hoz
const ManageTask: React.FC<ManageTaskProps> = ({ data }) => {
  //A beérkezett adatot megjelenítjük
  return (
    <main className=" flex flex-col w-full items-start p-10">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-5">
        Recreation of Tasks
      </h1>
      <div className="flex-col">
        {data.map((i) => (
          <div key={i.id} className="mb-10 w-full mr-10 border-b p-2 h-36">
            <h2 className="font-bold text-3xl h-20">{i.title}</h2>
            <p className="mb-2">{i.description.substring(0, 50)}...</p>
            <div className="flex w-full justify-between font-bold">
              <div>EXP: {i.exp}</div>
              <Link to={"/task/" + i.id}>
                <div> {">"}Edit</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ManageTask;`}
                                </code>
                            </pre>
                            <p>
                                Ezen a ponton továbbhaladhatunk bármelyik
                                feladatra, és megváltoztathatjuk a benne lévő
                                adatokat. Először lekérem id szerint a
                                feladatot, és ha közzétesszük (Submit), akkor
                                PUT request-tel frissítjuk az adatbázist
                            </p>
                            <div className="my-5">
                                <code>TaskDetail.tsx:</code>
                            </div>

                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`const TaskDetail: React.FC = () => {
  const { id } = useParams();

  const { data } = useGet<Task>("http://localhost:8000/task/" + id);
  const [task, setTask] = useState<Task>();
  const [tutorialInput, setTutorialInput] = useState<string>("");

  useEffect(() => {
    if (data) {
      setTask(data);
    }
  }, [data]);

  //Új tutorial hozzáadása a feladat objecthez
  const handleAddTutorial = () => {
    setTask((prev) => ({
      ...prev!,
      tutorials: [...prev!.tutorials, tutorialInput],
    }));
  };

  //Tutorial törlése
  const handleRemoveTutorial = (index: number) => {
    const updateTutorial = [...task!.tutorials] || [];
    updateTutorial.splice(index, 1);
    setTask((prev) => ({ ...prev!, tutorials: updateTutorial }));
  };

  //Közzététel esetén id alapján frissítsünk
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios
      .put("http://localhost:8000/task/"+task.id, task) // Replace taskId with the actual id value
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };`}</code>
                            </pre>
                            <p>
                                Innen áttérek a feladat hozzáadásához. Ez egy
                                egyszerű post requestet igényel csak.
                            </p>
                            <h3 className="text-lg font-bold my-5">
                                - Add Task:
                            </h3>
                            <div className="my-5">
                                <code>AddTask.tsx:</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`interface Task {
  title: string;
  exp: number | null;
  description: string;
  tutorials: string[];
}

const AddTask: React.FC = () => {
  const [task, setTask] = useState<Task>({
    title: "",
    exp: 0,
    description: "",
    tutorials: [],
  });

  const [tutorialInput, setTutorialInput] = useState<string>("");

  const handleAddTutorial = () => {
    setTask((prev) => ({
      ...prev!,
      tutorials: [...prev.tutorials, tutorialInput],
    }));
  };

  const handleRemoveTutorial = (index: number) => {
    const updateTutorial = [...task.tutorials];
    updateTutorial.splice(index, 1);
    setTask((prev) => ({ ...prev, tutorials: updateTutorial }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8000/task/new", task)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };`}</code>
                            </pre>
                            <p>
                                Ránézésre nagyjából ugyanaz a kód, csak a post
                                request a más.
                            </p>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h2 id="cp3" className="text-2xl font-bold mb-10">
                            Chapter 3: The Completion of The Task
                        </h2>

                        <p>
                            Így, hogy vannak már feladatok az adatbázisban,
                            hozzá lehet adni a felhasználóhoz. Ez a fejezet
                            bemutatja ennek a működését
                        </p>
                        <div className="my-5 ml-2">
                            <h3 className="text-lg font-bold mb-5">
                                - Add Task to List:
                            </h3>
                            <p>
                                Ez a megvalósítás arra alapszik, hogy amint
                                kiválasztanak egy elemet, az frissül a User
                                táblában. Hozzáadja az EXP-t és a mai napi
                                teljesített feladatot.
                            </p>
                            <p>
                                Alábbiakban látható egy kis betekintés a kódba.
                            </p>
                            <div className="my-5">
                                <code>
                                    taskCounter.tsx {">"} handleAddTask()
                                </code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`//Task hozzáadása a felhasználóhoz-------------------------------------------------
    const handleAddTask = async (task: Task) => {
        try {
            //Ellenőrizzük van-e már adat, mert ha nincs akkor errort dob undefined miatt, majd adjuk hozzá a segéváltozóhoz az új feladatot
            const updateTasks: Task[] = currentTasks ? currentTasks : [];
            updateTasks.push(task);
          
            const expObj = { exp: task.exp };

            //véglegesítsük az adatot, amit az adatbázis meg fog kapni
            const finalData = { updateTasks, userData, expObj };
            console.log(finalData);
            //PUT request az adatbázis felé
            await axios
                .put("http://localhost:8000/user/manageTask", finalData)
                .then(() => console.log("Data added"))
                .catch((err) => console.error(err));

            setCurrentTasks(updateTasks);
            setInput(() => "");
        } catch (error) {
            console.error(error);
        }
    };`}</code>
                            </pre>
                            <h3 className="text-lg font-bold my-5">
                                - Delete Task from List:
                            </h3>
                            <p>Törlésnél ez visszafele működik.</p>
                            <div className="my-5">
                                <code>
                                    taskCounter.tsx {">"} handleRemoveTask()
                                </code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`//Task törlése-------------------------------------------------------------------
    const handleRemoveTask = async (index: number) => {
        try {
            //Ellenőrizzük van-e már adat, mert ha nincs akkor errort dob undefined miatt, majd adjuk hozzá a segéváltozóhoz az új feladatot
            const updateTasks: Task[] = [...(currentTasks ?? [])];

            //törlés az adott indexnél
            const expObj = { exp: -updateTasks[index].exp };
            updateTasks.splice(index, 1);

            //exp kivonása törlés esetén;

            //feltöltendő adat véglegesítése
            const finalData = { updateTasks, userData, expObj };

            console.log(finalData);

            //PUT request a frissítéshet
            await axios
                .put("http://localhost:8000/user/manageTask", finalData)
                .then((res) => console.log(res))
                .catch((err) => console.error(err));

            //lista frissítése
            setCurrentTasks(updateTasks);
        } catch (err) {
            console.error(err);
        }
    };`}</code>
                            </pre>
                            <p className="mb-2">
                                Ha úgy van vele a felhasználó, hogy mára eleget
                                tett, a Finish Day gombbal kitörölheti az
                                adatokat a listából. Persze egyénfüggő ki és
                                mikor végez a nappal, ezért nem raktam bele
                                semmilyen dátumtól függő funkciót.
                            </p>
                            <p>
                                A feladatokról átfogóan ezt tudtam bemutatni,
                                ezért áttérnék a belépésre és regisztrációra
                            </p>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-10" id="cp4">
                            Chapter 4: Joining The Guild
                        </h2>
                        <p>
                            Ahhoz, hogy egyáltalán feladatokat tudjunk felvenni,
                            először kell lennie egy session-nek, azaz be kell
                            jelentkezni. Ezt a backend ellenőrzi.
                        </p>
                        <div className="ml-2">
                            <h3 className="text-lg font-bold my-5">
                                - Context:
                            </h3>
                            <p>
                                Ha kijelentkezik a felhasználó, akkor semmilyen
                                más oldalt nem tud megnyitni a bejelentkezésen
                                vagy regisztráción kívül. Ezt egy úgynevezett{" "}
                                <code>ContextProvider</code> teszi lehetővé.
                            </p>
                            <div className="my-5">
                                <code>AuthContext.tsx</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`//adattípusok
interface AuthContext {
    loggedIn: boolean;
    getLoggedIn: () => Promise<void>;
}

interface AuthContextProviderProps {
    children: React.ReactNode;
}
//context létrehozása
const AuthContext = createContext<AuthContext | null>(null);

//meg kell majd adni egy children-t amin keresztül át lehet majd adni a context változóit
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    //be van-e a felhasználó jelentkezve
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    //visszakapjuk a szerevertől, hogy van e session. ha van akkor be van user jelentkezve
    const getLoggedIn = async () => {
        const result = await axios.get("http://localhost:8000/user/loggedIn");
        setLoggedIn(result.data);
    };


    useEffect(() => {
        getLoggedIn();
    }, []);

    
    return (
        <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export { AuthContextProvider };`}</code>
                            </pre>
                            <h3 className="text-lg font-bold my-5">
                                - Register:
                            </h3>
                            <p>
                                A regisztráció folyamata egyszerű. A felhasználó
                                megadja az adatait, a program eltárolja, és
                                elküldi a szervernek. Ha minden adat stimmel,
                                akkor az új user létrejön és ezzel a session is.
                            </p>
                            <div className="my-5">
                                <code>Register.tsx</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`interface RegisterData {
    name: string;
    password: string;
    passwordAgain: string;
}

const Register: React.FC = () => {
    const [data, setData] = useState<RegisterData>({
        name: "",
        password: "",
        passwordAgain: "",
    });

    const navigate = useNavigate();

    //regisztárció kezelése
    const handleRegistration = async (e: FormEvent) => {
        //ha minden field ki van töltve, akkor küldés az adatbázishoz
        e.preventDefault();
        await axios
            .post("http://localhost:8000/user/register", data)
            .then(() => console.log("User Created!"))
            .catch((err) => console.error(err));
        //navigáljunk a főoldalra majd frissítsük az oldalt
        navigate("/");
        window.location.reload();
    };`}</code>
                            </pre>
                            <h3 className="text-lg font-bold my-5">- Login:</h3>
                            <p>
                                A bejelentkezés is egyszerűen működik. Ha minden
                                adatot megadott a felhasználó, akkor a szerver
                                oldal megkeresi a felhasználót a név szerint,
                                ugyanis ebben az esetben nem a email, hanem a
                                név egyedi.
                            </p>
                            <div className="my-5">
                                <code>Login.tsx</code>
                            </div>
                            <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-4 w-min">
                                <code>{`interface LoginData {
    name: string;
    password: string;
}

const Login: React.FC = () => {
    const [data, setData] = useState<LoginData>({ name: "", password: "" });
    const [loginError, setLoginError] = useState<string>();
    const { getLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    //bejelentkezés kezelése
    const handleLogin = async (e: FormEvent) => {
        //ha minden adat megvan, akkor küldés az adatbázis felé
        e.preventDefault();
        if (data.name && data.password) {
            await axios
                .post("http://localhost:8000/user/login", data)
                .then(() => {
                    console.log("Logging in...");
                    getLoggedIn();
                    navigate("/");
                    window.location.reload();
                })
                .catch((err) => console.error(err));
        } else {
            setLoginError("Fill all fields!"); //különben hiba jelzése
        }
    };`}</code>
                            </pre>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h2 id="cp5" className="text-2xl font-bold mb-10">
                            Chapter 5: Communication
                        </h2>
                        <p>
                            A szerver oldalt két részre, azaz route-ra lehet
                            bontani. User és Task. Mindkét oldal rendelkezik egy
                            Data Access Object-tel, amik a query-ket
                            tartalmazzák.
                        </p>
                        <div className="ml-2">
                            <h3 className="text-lg font-bold my-5">- User:</h3>
                            <p className="mb-2">
                                A user route a következő endpoint-okkal
                                rendelkezik:
                            </p>
                            <ul className="list-disc">
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        POST /register
                                    </p>
                                    <p>
                                        A regisztrálásért felel. Végigmegy egy
                                        validáláson, és ha minden rendben,
                                        létrejön az új user, és bejelentkezik.
                                        Biztonság kedvéért JsonWebToken-t
                                        használok, ezért hash a jelszó.
                                        Cookie-ban tárolja a kliens a token-t. A
                                        token tartalmazza a felhasználó id-jét,
                                        így tudom lekérni kivel vagyok
                                        bejelentkezve.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">POST /login</p>
                                    <p>
                                        Ha egyeznek az adatok, létrehozza a
                                        sessiont.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">GET /logout</p>
                                    <p>
                                        Törli a tokent a Cookie-ból, így
                                        megszűnik a session.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">GET /</p>
                                    <p>Összes felhasználó lekérése.</p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">GET /loggedIn</p>
                                    <p>
                                        Visszaadja igaz vagy hamis értékkel,
                                        hogy be vagyunk-e jelentkezve.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        GET /loggedInUser
                                    </p>
                                    <p>
                                        Visszaadja a token felhasználásával id
                                        alapján a bejelentkezett felhasználó
                                        adatait, a jelszón kívül.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        PUT /manageTask
                                    </p>
                                    <p>
                                        Amikor új napi feladatot teljesítünk,
                                        frissítjük vele a felhasználó adatait.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        PUT /finishDay/:id
                                    </p>
                                    <p>
                                        Meglévő feladatok törlése a user adatai
                                        közük. User id-t kap a request
                                        paramétere, ezzel tudunk kereseni.
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        PUT /lvlUp/:id
                                    </p>
                                    <p>
                                        Szint beállítása. Itt is user id-t kap a
                                        request paramétere, ezzel tudunk
                                        kereseni.
                                    </p>
                                </li>
                            </ul>
                            <p className="mb-5">
                                Az endpointokhoz léteznek DAO-k, amik a sql
                                querry-t valósítják meg. Mindegyik Promise
                                alapú.
                            </p>
                            <h3 className="text-lg font-bold my-5">- Task:</h3>
                            <p className="mb-2">
                                A task endpointokhoz tartozik egy autorizáció,
                                amely azt ellenőrzni, hogy van-e folyamatban
                                lévő session a kliens és a szerver között. Ha
                                van, akkor elérhetőek az endpoint-ok
                            </p>
                            <p className="mb-2">
                                A task route a következő endpointokkal
                                rendelkezik:
                            </p>
                            <ul className="list-disc">
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">GET /</p>
                                    <p>Minden adat lekérése</p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">GET /:id</p>
                                    <p>Id alapján keresés</p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">POST /new</p>
                                    <p>Új task hozzáadása az adatbázishoz</p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">
                                        POST /taskByIds
                                    </p>
                                    <p>
                                        Kap egy tömböt, amiben id-k vannak. Csak
                                        azokat a task-okat kéri le, amelyek id-i
                                        benne vannak a tömbben
                                    </p>
                                </li>
                                <li className="ml-10 mb-2">
                                    <p className="font-medium">PUT /:id</p>
                                    <p>
                                        Csak egy adott task-ot frissít az id
                                        szerint
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h2 id="cp6" className="text-2xl font-bold my-10">
                            Chapter 5: The Future
                        </h2>
                        <p className="mb-2">
                            A programnak még vannak folyamatban lévő tervezései,
                            azonban a legfőbb funkciók működnek.
                        </p>
                        <p>A tervezett továbbfejleszési lehetőségek:</p>
                        <ul className="list-disc ml-10">
                            <li>UI vagy HUD a szint és exp megjelenítéséhez</li>
                            <li>CSS optimalizálása</li>
                            <li>Még reszponzívabb felület</li>
                            <li>Céhek/Klánok létrehozása</li>
                            <li>Felhasználó további testreszabása</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Tutorial;
