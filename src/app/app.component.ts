import { environment } from '../environments/environment';
import mapboxgl from 'mapbox-gl';
import { AfterViewInit, Component } from '@angular/core';
import { IconLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';

mapboxgl.accessToken = environment.mapbox.accessToken;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private map: mapboxgl.Map;

  initialZome = 2;

  // Categories and zones
  categories = [
    {
      id: 1,
      name: 'Food Help',
      zones: [
        { position: [31.2357, 30.0444], details: 'Cairo Zone 1' }, // Cairo
        { position: [32.5498, 29.9668], details: 'Suez Zone 2' }, // Suez
      ],
    },
    {
      id: 2,
      name: 'Education',
      zones: [
        { position: [29.9553, 31.2156], details: 'Alexandria Zone 1' }, // Alexandria
        { position: [31.0085, 30.5562], details: 'Tanta Zone 2' }, // Tanta
      ],
    },
    {
      id: 3,
      name: '8armat 3',
      zones: [
        { position: [32.6396, 25.6872], details: 'Luxor Zone 1' }, // Luxor
        { position: [33.8129, 27.2579], details: 'Hurghada Zone 2' }, // Hurghada
      ],
    },
  ];

  ngAfterViewInit(): void {
    // Initialize the Mapbox map
    this.map = new mapboxgl.Map({
      container: 'map-id', // ID of the map container
      center: [30.8025, 26.8206], // Center on Egypt
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: this.initialZome,
    });

    this.map.on('load', () => {
      console.log('Map is ready!');
    });
  }

  // Handle category selection
  onCategorySelect(category: any): void {
    // Remove existing layers if any
    this.removeExistingLayers();

    // Create a new Deck.gl IconLayer for the selected category
    const iconLayer = new MapboxLayer({
      id: `category-${category.id}`, // Unique ID for the layer
      type: IconLayer,
      pickable: true,
      data: category.zones,
      sizeScale: 14,
      getPosition: (d: any) => d.position,
      getIcon: () => ({
        url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Marker icon
        width: 128,
        height: 128,
        anchorY: 128,
      }),
      getSize: () => 10,
      onClick: (info: any) => {
        if (info.object) {
          const { details } = info.object;

          this.map.flyTo({
            zoom: this.initialZome, // Desired zoom level
            center: info.coordinate, // Optionally, update the center
            speed: 1.2, // Animation speed (default is 1.2)
            curve: 1.42, // Curve factor (default is 1.42)
          });
          // alert(`Zone Details: ${details}`);
        }
      },
    });

    // Add the IconLayer to the map
    this.map.addLayer(iconLayer);
  }

  // Remove existing layers
  private removeExistingLayers(): void {
    const layers = this.map.getStyle().layers || [];
    layers.forEach((layer) => {
      if (layer.id.startsWith('category-')) {
        console.log('layer >> ', layer.id);
        this.map.removeLayer(layer.id);
        this.map.removeSource(layer.id);
      }
    });
  }
}
