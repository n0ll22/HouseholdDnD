import axios, { AxiosError, AxiosResponse } from "axios";
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

        const fetchData = () => {
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
        };

        // Delay the fetch by 2 seconds
        const timer = setTimeout(fetchData, 1000);

        return () => {
            clearTimeout(timer);
            isMounted = false;
        };
    }, [url]); //url változása esetén fut le

    return { data, error, pending }; //mindhárom adat elküldése.
};

export default useGet;
