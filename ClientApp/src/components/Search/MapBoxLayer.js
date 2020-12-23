import L from "leaflet";
import { } from "mapbox-gl-leaflet";
import PropTypes, { string } from "prop-types";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapBoxGLLayer({ style, accessToken, attribution}) {

    const map = useMap();
    useEffect(() => {
        L.mapboxGL({
            style: style,
            accessToken: accessToken,
            attribution: attribution,
        }).addTo(map);
    });

    return null;

}
