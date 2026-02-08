const Person = ({ person, handleDelete }) => (
  <li>
    {person.name} {person.number} <button onClick={handleDelete}>delete</button>
  </li>
);

export default Person;
