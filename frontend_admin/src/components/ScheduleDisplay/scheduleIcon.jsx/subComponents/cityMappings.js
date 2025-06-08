// src/data/cityMappings.js

// Array of Indian city objects with their approximate latitude and longitude coordinates.
// Coordinates are stored as strings to match your schema's definition.
export const CITIES_COORDINATES = [
    { city: 'Karol Bagh', latitude: '19.0760', longitude: '72.8777' },
    { city: 'Noida Sector 18', latitude: '28.7041', longitude: '77.1025' },
    { city: 'Tilak Nagar', latitude: '12.9716', longitude: '77.5946' },
    { city: 'Sikanderpur', latitude: '13.0827', longitude: '80.2707' },
    { city: 'Sohna Road', latitude: '22.5726', longitude: '88.3639' },
    { city: 'Scottish 57', latitude: '17.3850', longitude: '78.4867' },
    { city: 'Gosavi Basti', latitude: '23.0225', longitude: '72.5714' },
    { city: 'Dandekar Pul', latitude: '18.5204', longitude: '73.8567' },
];

/**
 * Maps latitude and longitude coordinates to a city name.
 *
 * @param {string} lat - The latitude as a string.
 * @param {string} lng - The longitude as a string.
 * @returns {string} The corresponding city name, or 'Unknown City' if no match is found.
 */
export const getCityFromLatLng = (lat, lng) => {
    // This function performs a simple exact match against the dummy coordinate data.
    // In a real-world application, you'd typically use a geocoding API for more robust lookups.
    const foundCity = CITIES_COORDINATES.find(
        cityObj => cityObj.latitude === lat && cityObj.longitude === lng
    );
    return foundCity ? foundCity.city : 'Unknown City';
};

/**
 * Maps a city name to its corresponding latitude and longitude coordinates.
 *
 * @param {string} city - The name of the city.
 * @returns {{latitude: string, longitude: string}|null} An object containing the latitude and longitude,
 * or `null` if the city is not found in the mappings.
 */
export const getLatLngFromCity = (city) => {
    const foundCoords = CITIES_COORDINATES.find(
        cityObj => cityObj.city.toLowerCase() === city.toLowerCase()
    );
    return foundCoords ? { latitude: foundCoords.latitude, longitude: foundCoords.longitude } : null;
};