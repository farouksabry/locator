import { createContext, useEffect, useState } from "react";
import api from "../api/axios"

export const LocationsContext = createContext();

export default function LocationsProvider({ children }) {
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        const get_locations = async () => {
            try {
                const response = await api.get("/api/countries-cities/");
                setCountries(response.data.countries);
                setRegions(response.data.regions);
            } catch (error) {
                console.log("Connection error");
            }
        }

        get_locations();
    }, []);
    return (
        <LocationsContext.Provider value={{ countries, regions }}>
            {children}
        </LocationsContext.Provider>
    )
}
