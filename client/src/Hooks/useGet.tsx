import axios, { AxiosError } from "axios";
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

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setPending(true); // Ensure pending is true when the request starts
      try {
        const res = await axios.get<T>(url);
        if (isMounted) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as AxiosError);
        }
      } finally {
        if (isMounted) {
          setPending(false); // Ensure pending is false after the request completes
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, error, pending };
};

export default useGet;
