import { useEffect, useState } from "react";
import styles from "../../css/Pagination.module.css"
import { Person } from "../../models/Person";

export default function Persons() {

  const [persons, setPersons] = useState<Person[]>([]);
  const size = 3;
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/persons?size=${size}&page=${activePage-1}`, {
      headers: {"Authorization": "Bearer " + sessionStorage.getItem("token") || ""}
    })
    .then(res => res.json())
    .then(json => {
      setPersons(json.content);
      const pagesArray = [];
      for (let page = 1; page <= json.totalPages; page++) {
        pagesArray.push(page);
      }
      setPages(pagesArray);
    })
  }, [activePage]);


  function changePage (newPage: number) {
    setActivePage(newPage);
  }

  function changePersonAdmin (person: Person) {
    fetch(`http://localhost:8080/person-admin?size=${size}&page=${activePage-1}&personId=${person.id}&isAdmin=${person.role === "BASIC_USER"}`, {
      headers: {"Authorization": "Bearer " + sessionStorage.getItem("token") || ""},
      method: "PATCH"
    })
    .then(res => res.json())
    .then(json => {
      setPersons(json.content);
    })
  }

  return (
    <>
      {persons.map(person => <div>{person.id}</div>)}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map(person => 
            <tr key={person.id} className={person.role === "ADMIN" ? styles.active: styles.inactive}>
              <td>{person.id}</td>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.role === "ADMIN" ? "Admin" : person.role === "SUPERADMIN" ? "SuperAdmin" : "Basic user"}</td>
              <td>{person.email}</td>
              <td style={{width: "600px", textAlign: "center"}}>
                {person.role !== "SUPERADMIN" ? <button onClick={() => changePersonAdmin(person)}>
                  Muuda {person.role === "ADMIN" ? "tavakasutajaks" : "administraatoriks"}
                </button> :
                <div>Superadmin</div>
                }
              </td>
            </tr>)}
        </tbody>
      </table>

      <button hidden={activePage === 1} disabled={activePage === 1} onClick={() => changePage(activePage-1)} >{"<"}</button>
      {pages.map(page => 
        <button hidden={ 
          ( page < activePage - 2) ||
           page > activePage + 2 } 
          className={page === activePage ? styles.active : undefined }
           onClick={() => changePage(page)} key={page}>{page}</button>
      )}
      <button hidden={activePage === pages.length} disabled={activePage === pages.length} onClick={() => changePage(activePage+1)}>{">"}</button>

    </>
  )
}
