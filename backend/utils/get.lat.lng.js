import nodeGeocoder from "node-geocoder";

export const getLatLng = async (address) => {
    let options = {
        provider: "openstreetmap"
    };
    const geoCoder = nodeGeocoder(options);
    const res = await geoCoder.geocode(address);
    return [res[0].latitude, res[0].longitude];
};