import React from "react";
import MovieList from "./MovieList";
import TheaterTables from "./TheaterTables";
import { Tabs } from "antd";

function Admin() {
  const tabItems = [
    {
      key: "1",
      label: "Movies", // Corrected 'lable' to 'label'
      children: <MovieList />,
    },
    {
      key: "2",
      label: "Theaters", // Corrected 'lable' to 'label'
      children: <TheaterTables />,
    },
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <Tabs items={tabItems} />
    </div>
  );
}

export default Admin;
