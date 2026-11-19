const section = document.getElementById('trip-schedules');

if (section) {
    const tripId = section.dataset.tripId;
    const monthSelect = document.getElementById('schedule-month');
    const list = document.getElementById('schedules-list');
    const loading = document.getElementById('schedules-loading');
    const errorBox = document.getElementById('schedules-error');
    const empty = document.getElementById('schedules-empty');
    const template = document.getElementById('schedule-card-template');

    let latestRequest = 0;

    function showState({ isLoading = false, error = '', isEmpty = false }) {
        loading.hidden = !isLoading;
        errorBox.hidden = !error;
        errorBox.textContent = error;
        empty.hidden = !isEmpty;
    }

    function renderSchedules(schedules) {
        const fragment = document.createDocumentFragment();

        schedules.forEach((schedule) => {
            const card = template.content.cloneNode(true);

            card.querySelector('[data-field="departure"]').textContent = schedule.departureTime;
            card.querySelector('[data-field="arrival"]').textContent = schedule.arrivalTime;

            const days = card.querySelector('[data-field="days"]');
            schedule.daysOfWeek.forEach((day) => {
                const badge = document.createElement('span');
                badge.className = 'day-badge';
                badge.textContent = day.substring(0, 3);
                days.appendChild(badge);
            });

            card.querySelector('[data-field="book"]').href = `/trips/booking/${schedule.id}`;

            fragment.appendChild(card);
        });

        list.replaceChildren(fragment);
    }

    async function loadSchedules(month) {
        const requestId = ++latestRequest;
        showState({ isLoading: true });
        list.replaceChildren();

        try {
            const query = month ? `?month=${encodeURIComponent(month)}` : '';
            const response = await fetch(`/api/trips/${encodeURIComponent(tripId)}/schedules${query}`);

            if (!response.ok) {
                throw new Error('Unable to load schedules.');
            }

            const schedules = await response.json();

            if (requestId !== latestRequest) return;

            if (schedules.length === 0) {
                showState({ isEmpty: true });
                return;
            }

            renderSchedules(schedules);
            showState({});
        } catch (error) {
            if (requestId !== latestRequest) return;
            showState({ error: 'Unable to load schedules. Please try again.' });
        }
    }

    monthSelect.addEventListener('change', () => loadSchedules(monthSelect.value));
    loadSchedules('');
}