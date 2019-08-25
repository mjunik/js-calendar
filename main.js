(function () {
    const events = [];

    /*
     * Create events classes
     */

    class Event {
        constructor(title, date) {
            this.title = title;
            this.date = date;
            this.id = generateId();
        }
    }

    class Reminder extends Event {
        constructor(name, date, notes) {
            super(name, date);
            this.notes = notes || '';
            this.type = 'reminder';
        }

        renderInfo() {
            return `<p><b>Notes: </b>${this.notes}</p>`;
        }
    }

    class Meeting extends Reminder {
        constructor(name, date, notes, place, people) {
            super(name, date, notes);
            this.place = place || '';
            this.people = people || '';
            this.type = 'meeting';
        }

        renderInfo() {
            return `
                <p><b>Notes: </b>${this.notes}</p>
                <p><b>People: </b>${this.people}</p>
                <p><b>Place: </b>${this.place}</p>
            `;
        }
    }

    /*
     * Add example events
     */

    const addExampleEvents = () => {
        const event1 = new Reminder('Go shopping', '2019-06-01', 'Buy bread, milk and butter');
        const event2 = new Reminder('Feed dog', '2019-06-14', `Don't let him starve!`);
        const event3 = new Meeting('Code{sun}day', '2019-07-03', 'Prepare some cool JS stuff', 'Poznań');
        const event4 = new Meeting('JS for beginners', '2019-07-19', 'Prepare even more cool JS stuff', 'Wro', 'Patrycja');

        events.push(event1, event2, event3, event4);
    };

    /*
     * Display events in DOM
     */

    const displayEvents = () => {
        const addEventsToDOM = () => {
            events.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event';
                card.setAttribute('id', event.id);

                card.innerHTML = `
                    <div class="event-header">
                        <div class="icon ${event.type}"></div>
                        <div class="title">
                            <h3>${event.title}</h3>
                            <time>${event.date}</time>
                        </div>
                        <button class="delete js_deleteEvent">&times;</button>
                    </div>
                    <div class="event-body hidden">
                        ${event.renderInfo()}
                    </div>
                `;

                eventsList.appendChild(card);
            });
        };

        const sortEvents = () => {
            events.sort((a, b) => (a.date > b.date) ? 1 : -1);
        };

        const updateEventsCounter = () => {
            const counter = document.getElementById('js_eventsCounter');
            counter.innerText = events.length.toString();
        };

        const eventsList = document.getElementById('js_eventsList');
        eventsList.innerHTML = '';

        sortEvents();

        addEventsToDOM();

        handleCardAnimation();

        handleEventDeletion();

        updateEventsCounter();
    };

    /*
     * Handle deleting events
     */

    const handleEventDeletion = () => {
        const deleteItem = function(e) {
            e.stopPropagation();

            const card = this.closest('.event');
            const idToDelete = card.getAttribute('id');

            const eventIndex = events.findIndex(event => event.id === idToDelete);
            events.splice(eventIndex, 1);

            displayEvents();
        };

        const deleteButtons = document.querySelectorAll('.js_deleteEvent');

        deleteButtons.forEach(button => button.addEventListener('click', deleteItem));
    };

    /*
     * Handle adding an event
     */

    const handleEventAdding = () => {
        const clearForm = () => {
            const eventTypeSelect = document.getElementById('js_eventType');
            const eventType = eventTypeSelect.value;

            addEventForm.reset();

            // preserve chosen event type
            eventTypeSelect.value = eventType;
        };

        const getFormValues = () => {
            const formValues = [];

            Array.from(addEventForm.elements).forEach(element => formValues.push(element.value));

            return formValues;
        };

        const addEvent = (e) => {
            e.preventDefault();

            const [type, title, date, notes, place, people] = getFormValues();

            clearForm();

            if (type === 'Reminder') {
                events.push(new Reminder(title, date, notes));
            } else if (type === 'Meeting') {
                events.push(new Meeting(title, date, notes, place, people));
            } else {
                return;
            }

            displayEvents();
        };

        const addEventForm = document.getElementById('js_addEventForm');
        addEventForm.addEventListener('submit', addEvent);
    };


    /*
     * Toggle extra form fields for a meeting
     */

    const toggleMeetingExtraFields = () => {
        const changeEventType = function() {
            const eventType = this.value;
            const hideClass = 'hidden';

            if (eventType === 'Meeting') {
                meetingFields.classList.remove(hideClass);
            } else {
                meetingFields.classList.add(hideClass);
            }
        };

        const eventTypeSelect = document.getElementById('js_eventType');
        const meetingFields = document.getElementById('js_meetingFields');

        eventTypeSelect.addEventListener('change', changeEventType);
    };

    /*
     * Card toggle animation
     */

    const handleCardAnimation = () => {
        const toggleCard = function() {
            const card = this.closest('.event');
            const cardBody = card.querySelector('.event-body');

            cardBody.classList.toggle('hidden');
        };

        const cards = document.querySelectorAll('.event');
        cards.forEach(card => card.addEventListener('click', toggleCard));
    };

    /*
     * Utilities
     */

    const generateId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    /*
     * Run the app
     */

    addExampleEvents();

    displayEvents();

    handleEventAdding();

    toggleMeetingExtraFields();
}());
