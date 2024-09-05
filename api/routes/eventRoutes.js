const express = require('express');
const router = express.Router();

const events = [];

const checkConflicts = (newEvent) => {
  const { startTime, endTime, date } = newEvent;

  const overlapping = events.some(event => 
    event.date === date &&
    ((event.startTime < endTime && event.endTime > startTime))
  );

  const exactMatch = events.some(event => 
    event.date === date &&
    event.startTime === startTime &&
    event.endTime === endTime
  );

  return { overlapping, exactMatch };
};

router.post('/', (req, res) => {
  const { title, date, startTime, endTime } = req.body;
  const maxId = events.length > 0 ? Math.max(...events.map(event => event.id)) : 0;
  const newEvent = { 
    id: maxId + 1,
    title, 
    date, 
    startTime, 
    endTime 
  };
  const { overlapping, exactMatch } = checkConflicts(newEvent);
  if (exactMatch) {
    return res.status(400).json({ error: 'Exact match conflict detected' });
  }
  if (overlapping) {
    return res.status(400).json({ error: 'Overlapping event detected' });
  }
  events.push(newEvent);
  res.status(201).json(newEvent);
});

router.get('/', (req, res) => {
  res.json(events);
});

router.put('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { date, startTime, endTime, title } = req.body;

  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Update event
  events[eventIndex] = { id: eventId, date, startTime, endTime, title };
  res.status(200).json(events[eventIndex]);
});

router.delete('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);

  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Delete event
  events.splice(eventIndex, 1);
  res.status(200).json({ message: 'Event deleted successfully' });
});

router.get('/date/:date', (req, res) => {
  const { date } = req.params;
  const eventsForDate = events.filter(event => event.date === date);
  res.json(eventsForDate);
});

module.exports = router;