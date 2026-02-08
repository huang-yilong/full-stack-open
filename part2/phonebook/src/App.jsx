import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch(() => {
        setNotification({
          message: "Failed to fetch persons from server",
          type: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const personsToShow = filter
    ? persons.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((p) => p.name === newPerson.name)) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const existingPerson = persons.find((p) => p.name === newPerson.name);
        const updatedPerson = { ...existingPerson, number: newPerson.number };
        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((p) => (p.id === existingPerson.id ? response : p)),
            );
            setNewPerson({ name: "", number: "" });
            setNotification({
              message: `Updated ${response.name}`,
              type: "success",
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(() => {
            setNotification({
              message: `Failed to update ${existingPerson.name}`,
              type: "error",
            });
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
        return;
      }
    }
    personService
      .create(newPerson)
      .then((response) => {
        setPersons(persons.concat(response));
        setNewPerson({ name: "", number: "" });
        setNotification({
          message: `Added ${response.name}`,
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch(() => {
        setNotification({
          message: `Failed to add ${newPerson.name}`,
          type: "error",
        });
      });
  };

  const handleDelete = (p) => {
    if (window.confirm(`delete ${p.name}?`)) {
      personService
        .remove(p.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== p.id));
          setNotification({
            message: `Deleted ${p.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(() => {
          setNotification({
            message: `Information of ${p.name} has already been removed from server`,
            type: "error",
          });
          setPersons(persons.filter((person) => person.id !== p.id));
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
