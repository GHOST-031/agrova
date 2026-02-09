import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader } from "lucide-react";
import toast from "react-hot-toast";
import Button from "./Button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 16, {
        animate: true,
        duration: 1
      });
    }
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition, draggable = true }) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef(null);

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setMarkerPosition(newPos);
        setPosition(newPos);
      }
    },
  };

  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      setPosition(e.latlng);
    },
  });

  return markerPosition ? (
    <Marker
      position={markerPosition}
      draggable={draggable}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">Selected Location</p>
          <p>Lat: {markerPosition.lat.toFixed(6)}</p>
          <p>Lng: {markerPosition.lng.toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

const MapPicker = ({
  onLocationSelect,
  initialPosition = null,
  height = "400px",
  zoom = 13,
  showCurrentLocation = true,
}) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(initialPosition || { lat: 28.6139, lng: 77.209 });
  const [mapKey, setMapKey] = useState(0); // Force map re-render

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
        return data;
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
    return null;
  };

  // Set default location on component mount (don't auto-request location)
  useEffect(() => {
    if (!initialPosition) {
      // Use default location (Delhi, India) - user can click button to get their location
      const defaultPos = { lat: 28.6139, lng: 77.209 };
      setPosition(defaultPos);
      setMapCenter(defaultPos);
      setLoading(false);
    } else {
      setPosition(initialPosition);
      setMapCenter(initialPosition);
      setLoading(false);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (position) {
      reverseGeocode(position.lat, position.lng);
    }
  }, [position]);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPosition);
          setMapCenter(newPosition);
          setMapKey(prev => prev + 1); // Force map to re-center
          reverseGeocode(newPosition.lat, newPosition.lng);
          toast.success("Location detected successfully!");
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Could not get your current location.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
          }
          
          toast.error(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    if (onLocationSelect) {
      onLocationSelect({
        latitude: position.lat,
        longitude: position.lng,
        address: address,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Loading Overlay */}
      {loading && (
        <div className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Getting your accurate location...
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-forest-300 dark:border-forest-700">
        {position ? (
          <MapContainer
            key={mapKey}
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={zoom}
            style={{ height, width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap center={mapCenter} />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center bg-forest-100 dark:bg-forest-800" style={{ height, width: "100%" }}>
            <div className="text-center">
              <Loader className="w-12 h-12 mx-auto text-forest-400 animate-spin mb-4" />
              <p className="text-forest-600 dark:text-forest-400">Loading map...</p>
            </div>
          </div>
        )}

        {/* Current Location Button - Floating on Map */}
        {showCurrentLocation && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="absolute top-4 right-4 z-[1000] bg-white dark:bg-forest-800 p-3 rounded-full shadow-lg hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors disabled:opacity-50"
            title="Get current location"
          >
            {loading ? (
              <Loader className="w-5 h-5 text-forest-600 dark:text-forest-300 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5 text-forest-600 dark:text-forest-300" />
            )}
          </motion.button>
        )}
      </div>

      {/* Selected Location Info */}
      <div className="bg-forest-50 dark:bg-forest-800 p-4 rounded-lg space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-forest-600 dark:text-forest-300 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-forest-800 dark:text-forest-100 mb-1">
              {position ? "Selected Location" : "Waiting for location..."}
            </p>
            {position && (
              <>
                <p className="text-xs text-forest-600 dark:text-forest-400 mb-2">
                  {address || "Loading address..."}
                </p>
                <div className="flex gap-4 text-xs text-forest-500 dark:text-forest-400">
                  <span>Lat: {position.lat.toFixed(6)}</span>
                  <span>Lng: {position.lng.toFixed(6)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> {position 
            ? "Click on the map or drag the marker to adjust your exact location"
            : "Allow location access when prompted for accurate positioning"}
        </p>
      </div>

      {/* Confirm Button */}
      <Button 
        onClick={handleConfirmLocation} 
        className="w-full" 
        size="lg"
        disabled={!position}
      >
        <MapPin className="w-4 h-4 mr-2" />
        {position ? "Confirm Location" : "Waiting for location..."}
      </Button>
    </div>
  );
};

export default MapPicker;
