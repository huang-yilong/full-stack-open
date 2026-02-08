import Person from "./Person";

const Persons = ({ persons, handleDelete }) => (
  <ul>
    {persons.map((p) => (
      <Person key={p.id} person={p} handleDelete={() => handleDelete(p)} />
    ))}
  </ul>
);

export default Persons;
