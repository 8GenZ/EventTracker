const events = [
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

function getEvents() {

    let storedEvents = JSON.parse(localStorage.getItem('jgcevents') || '[]');

    if(storedEvents == 0) {
        storedEvents = events;
        localStorage.setItem('jgcevents', JSON.stringify(events));
    }

    return storedEvents;
}

function buildDropDown() {

    // get current events 
    let currentEvents = getEvents();

    // get list of unique cities
    let eventCities = currentEvents.map(event => event.city);
    let distinctCities = new Set(eventCities);
    let dropdownChoices = ['All', ...distinctCities,];

    const dropdownDiv = document.getElementById('city-dropdown');
    const dropdownItemTemplate = document.getElementById('dropdown-template');

    dropdownDiv.innerHTML = '';

    // with each unique city,

    dropdownChoices.forEach(choice => {

        //  copy the dropdown template 
        let dropdownItemCopy = dropdownItemTemplate.content.cloneNode(true);

        // change that copies text 
        let aTag = dropdownItemCopy.querySelector('a');
        aTag.innerText = choice;

        // put it in the dropdown
        dropdownDiv.appendChild(dropdownItemCopy);
    });

    document.getElementById("stats-location").textContent = 'All';
    displayEvents(currentEvents);
    displayStats(currentEvents);
}

function displayEvents(events) {

    // find the table on page
    const eventsTable = document.getElementById('events-table');
    // find the template
    const eventTemplate = document.getElementById('table-row-template');

    // clear out table
    eventsTable.innerHTML = "";

    // for each event:
    for (index = 0; index < events.length; index++) {
        // get one event
        let event = events[index];
        // --clone the template
        let tableRow = eventTemplate.content.cloneNode(true);
        // --get each property of an event
        // --insert each property into the cloned template
        let eventNameCell = tableRow.querySelector('[data-id="event"]')
        eventNameCell.innerText = event.event;

        tableRow.querySelector('[data-id="city"]').innerText = event.city;
        tableRow.querySelector('[data-id="state"]').innerText = event.state;
        tableRow.querySelector('[data-id="attendance"]').innerText = event.attendance.toLocaleString();
        tableRow.querySelector('[data-id="date"]').innerText = new Date(event.date).toLocaleDateString();

        // --insert event data into table    
        eventsTable.appendChild(tableRow);
    }

};

function displayStats(events) {

    let total = 0;
    let max = 0;
    let min = Infinity;

    for (let index = 0; index < events.length; index++) {
        let event = events[index];

        total += event.attendance;

        if (index > max) {
            max = event.attendance;
        }
        if (index < min) {
            min = event.attendance;
        }
    }

    let average = total / events.length;

    document.getElementById('total-att').innerText = total.toLocaleString();
    document.getElementById('average-att').innerText = Math.round(average).toLocaleString();
    document.getElementById('max-att').innerText = max.toLocaleString();
    document.getElementById('min-att').innerText = min.toLocaleString();

}

function filterEvents(dropdownItemClicked) {
    let cityName = dropdownItemClicked.innerText;

    document.getElementById("stats-location").textContent = cityName;

    let allEvents = getEvents();

    let filteredEvents = [];

    if (cityName == 'All') {
        filteredEvents = allEvents;
    } else {
        for (let i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];

            if (event.city == cityName) {
                filteredEvents.push(event);
            }
        }
    }

    displayStats(filteredEvents);
    displayEvents(filteredEvents);
}

function saveEvents() {

    let eventName = document.getElementById('newEvent').value;
    let city = document.getElementById('newCity').value;

    let stateSelect = document.getElementById('newState');
    let selectedIndex = stateSelect.selectedIndex;
    let selectedOption = stateSelect.options[selectedIndex];
    let state = selectedOption.text;

    let attendance = parseInt(document.getElementById('newAttendance').value);

    let dateString = document.getElementById('newDate').value;

    dateString = `${dateString} 00:00`;

    let eventDate = new Date(dateString).toLocaleDateString();

    let newEvent = {
        event: eventName,
        city: city,
        state: state,
        attendance: attendance,
        date: eventDate,
    };

    let allEvents = getEvents();

    allEvents.push(newEvent);

    localStorage.setItem('jgcevents', JSON.stringify(allEvents) );

    let form = document.getElementById('newEventForm');
    form.reset();

    buildDropDown();

    let modal = bootstrap.Modal.getInstance(document.getElementById('AddDataModal'));
    modal.hide();

}
