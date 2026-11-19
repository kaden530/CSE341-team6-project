const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

const hookTripsCatalog =async() => {
    const listEl = document.getElementById('trips-list');
    const loadingEl = document.getElementById('trips-loading');
    const errorEl = document.getElementById('trips-error');
    const template = document.getElementById('trip-card-template');
    const regionSelect = document.getElementById('region-filter');
    const seasonSelect = document.getElementById('season-filter');

    // Only run on the trips list page
    if (!listEl || !template) return;

    let allTrips = [];

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function populateFilters(trips) {
        const regions = [...new Set(trips.map(t => t.region).filter(Boolean))];
        const seasons = [...new Set(trips.map(t => t.bestSeason).filter(Boolean))];

        regions.forEach(region => {
            regionSelect.add(new Option(capitalize(region), region));
        });

        seasons.forEach(season => {
            seasonSelect.add(new Option(capitalize(season), season));
        });

        // Pre-select filter if passed in URL query string (e.g., ?region=central)
        const params = new URLSearchParams(window.location.search);
        if (params.get('region')) regionSelect.value = params.get('region');
        if (params.get('season')) seasonSelect.value = params.get('season');
    }

    function renderTrips() {
        const selectedRegion = regionSelect.value;
        const selectedSeason = seasonSelect.value;

        const filtered = allTrips.filter(trip => {
            const matchesRegion = selectedRegion === 'all' || trip.region === selectedRegion;
            const matchesSeason = selectedSeason === 'all' || trip.bestSeason === selectedSeason;
            return matchesRegion && matchesSeason;
        });

        listEl.innerHTML = '';

        if (filtered.length === 0) {
            listEl.innerHTML = '<p>No trips found matching your selected filters.</p>';
            return;
        }

        filtered.forEach(trip => {
            const clone = template.content.cloneNode(true);

            // Image (maps dataset's `imageUrl` to template's `data-field="image"`)
            const img = clone.querySelector('[data-field="image"]');
            if (img && trip.imageUrl) {
                img.src = trip.imageUrl;
                img.alt = trip.name || 'Scenic train trip';
            }

            // Text fields
            const cardEl = clone.querySelector('.trip-card');
            if (cardEl && trip.region) {
                cardEl.classList.add(trip.region.toLowerCase());
            }
            clone.querySelector('[data-field="name"]').textContent = trip.name;
            const regionEl = clone.querySelector('[data-field="region"]');
            regionEl.textContent = capitalize(trip.region);
            regionEl.dataset.region = trip.region?.toLowerCase();   
            clone.querySelector('[data-field="startStation"]').textContent = capitalize(trip.startStation);
            clone.querySelector('[data-field="endStation"]').textContent = capitalize(trip.endStation);
            clone.querySelector('[data-field="duration"]').textContent = trip.duration;
            clone.querySelector('[data-field="distance"]').textContent = trip.distance;
            const seasonEl = clone.querySelector('[data-field="bestSeason"]');
            if (seasonEl && trip.bestSeason) {
                seasonEl.textContent = capitalize(trip.bestSeason);
                seasonEl.classList.add(`season-${trip.bestSeason.toLowerCase()}`);
            }
            clone.querySelector('[data-field="description"]').textContent = trip.description;

            // Highlights array
            const highlightsEl = clone.querySelector('[data-field="highlights"]');
            if (highlightsEl) {
                highlightsEl.textContent = Array.isArray(trip.highlights)
                    ? trip.highlights.join(' • ')
                    : (trip.highlights || '');
            }

            // Details link (uses `trip.id`, e.g., "gorge-explorer")
            const link = clone.querySelector('[data-field="detailsLink"]');
            if (link) {
                link.href = `/trips/${trip.id}`;
            }

            listEl.appendChild(clone);
        });
    }

    try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error(`Failed to load trips (Status: ${response.status})`);
        }

        allTrips = await response.json();
        populateFilters(allTrips);
        renderTrips();
    } catch (error) {
        console.error('Error hydrating trips:', error);
        errorEl.textContent = 'Unable to load trips right now. Please try again later.';
        errorEl.hidden = false;
    } finally {
        loadingEl.hidden = true;
    }

    regionSelect.addEventListener('change', renderTrips);
    seasonSelect.addEventListener('change', renderTrips);
};



document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookTripsCatalog();
});