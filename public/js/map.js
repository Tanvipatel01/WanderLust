// Map Initialization Script
document.addEventListener('DOMContentLoaded', function() {
  console.log('Starting map initialization...');
  
  // Get map container and listing data
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded!');
    return;
  }

  try {
    // Get listing data from data attributes
    const listingTitle = mapContainer.dataset.title;
    const listingLocation = mapContainer.dataset.location;
    const listingCountry = mapContainer.dataset.country;
    const listingPrice = mapContainer.dataset.price;

    console.log('Listing data:', { listingTitle, listingLocation, listingCountry, listingPrice });

    // Initialize map with default center (Jabalpur)
    const map = L.map('map').setView([23.1815, 79.9864], 12);
    console.log('Map initialized');

    // Add CartoDB Voyager tiles (Dark theme with colors - better readability)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors | © CARTO',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);
    console.log('Tiles added');

    // Combine location and country
    const propertyLocation = `${listingLocation}, ${listingCountry}`;
    console.log('Searching for location:', propertyLocation);
    
    // Geocode listing location using Nominatim API
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(propertyLocation)}&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log('Geocoding response:', data);
        
        if (data.length > 0) {
          const { lat, lon } = data[0];
          console.log('Found coordinates:', lat, lon);
          
          // Center map on property
          map.setView([lat, lon], 14);
          
          // Create styled popup content
          const popupContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 250px;">
              <h5 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                ${listingTitle}
              </h5>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                Exact Location will be provided after booking
              </p>
              <p style="margin: 0; color: #111; font-weight: 600; font-size: 14px;">
                ₹${parseInt(listingPrice).toLocaleString('en-IN')}/night
              </p>
            </div>
          `;

          // Default red marker icon
          const redMarker = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          // Compass icon with pink halo effect
          const compassIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <!-- Pink circular halo background -->
                <div style="
                  position: absolute;
                  width: 60px;
                  height: 60px;
                  background-color: #f5d5e3;
                  border-radius: 50%;
                  opacity: 0.9;
                  box-shadow: 0 0 0 8px rgba(245, 213, 227, 0.4);
                "></div>
                
                <!-- Red compass icon center -->
                <i class="fas fa-compass" style="
                  font-size: 28px;
                  color: #ff385c;
                  position: relative;
                  z-index: 10;
                  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                "></i>
              </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30],
            popupAnchor: [0, -40],
            className: 'compass-marker-icon'
          });

          // Create marker with red icon initially
          const marker = L.marker([lat, lon], { icon: redMarker })
            .bindPopup(popupContent, {
              maxWidth: 300,
              className: 'listing-popup',
              closeButton: true
            })
            .addTo(map);

          // Change to compass icon on hover and show popup
          marker.on('mouseover', function() {
            marker.setIcon(compassIcon);
            marker.openPopup();
            console.log('Marker hovered - compass shown');
          });

          // Change back to red marker on mouseleave and hide popup
          marker.on('mouseout', function() {
            marker.setIcon(redMarker);
            marker.closePopup();
            console.log('Marker left - red marker restored');
          });

          console.log('Marker added successfully with hover effects!');
        } else {
          console.log('Location not found. Using default location.');
        }
      })
      .catch(err => {
        console.error('Geocoding error:', err);
      });

  } catch (error) {
    console.error('Map initialization error:', error);
  }
});