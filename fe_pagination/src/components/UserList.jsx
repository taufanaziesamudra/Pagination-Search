import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const User = () => {
  const [users, setUsers] = useState([]); // Untuk Menampung data
  const [page, setPage] = useState(0); // Untuk SetUp page
  const [limit, setLimit] = useState(10); // Untuk menampilkan limit
  const [pages, setPages] = useState([0]); // Untuk Menampilkan pages keberapa
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState(""); // Untuk Menangkap keyword pencarian
  const [query, setQuery] = useState(""); // Untuk Menghandle saat onSubmit
  const [msg, setMsg] = useState(""); // Untuk menampilkan pesan page

  useEffect(() => {
    getUsers();
  }, [page, keyword]);

  const getUsers = async () => {
    const response = await axios.get(
      `http://localhost:5000/users?search_query=${keyword}&page=${page}&limit=${limit}`
    );
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "Jika tidak menemukan data yang Anda cari, silahkan gunakan kanta kunci pencarian"
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0); // Saat sudah melakukan pencarian akan kembali ke 0
    setKeyword(query);
  };
  return (
    <div className="container mt-5">
      <div className="columns">
        <div className="column is-centered">
          <form onSubmit={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find Something Here"
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
          </form>
          <table className="table is-striped is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <p className="has-text-centered has-text-danger">{msg}</p>
          <nav
            className="pagination is-centered"
            key={rows} // Akan dirender saat ada perubahan data
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)} // Membatasi jumlah halaman page
              onPageChange={changePage}
              containerClassName={"pagination-list"}
              pageLinkClassName={"pagination-link"}
              previousLinkClassName={"pagination-previous"}
              nextLinkClassName={"pagination-next"}
              activeLinkClassName={"pagination-link is-current"}
              disabledLinkClassName={"pagination-link is-disabled"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default User;
