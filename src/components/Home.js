import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Input, Layout, Typography } from "antd";
import { Table } from "./Table";
import logo from "../assets/logo.jpeg";

const { Header, Footer, Content } = Layout;
const { Text, Link, Title } = Typography;

const totalVotes = (tables) =>
  tables.map((t) => t.votes).reduce((a, c) => a + c);

export const Home = () => {
  const [tables, setTables] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!Array.isArray(tables)) return;
    setTotal(totalVotes(tables));
  }, [tables]);


  const handleChange = (e) => setTables(e.target.value);
  const handleClick = (e) => {
    if (!tables) return;
    axios.post(`/api/tables/${tables}`).then(({ data }) => {
      console.log(data)
      setTables(data);
    })
  };
  console.log(total);

  return (
    <div>
      <Layout>
        <Header></Header>
        <Content className="content">
          <Card
            title={`Total mesas ${Array.isArray(tables) ? tables.length : tables
              }`}
            className="fixed card"
          >
            {Array.isArray(tables) && (
              <Title level={4} className="green">
                Total votos: {total}
              </Title>
            )}
            <img className="logo" src={logo} alt="logo" />
          </Card>
          {Array.isArray(tables) ? (
            tables.map((t, i) => <Table key={i} {...t} setTables={setTables} />)
          ) : (
            <Card title="Cuantas mesas deseas crear?" className="card">
              <Input
                name="numbreTables"
                value={tables}
                onChange={handleChange}
              />
              <Button block type="primary" size="large" onClick={handleClick}>
                Crear
              </Button>
            </Card>
          )}
        </Content>
        <Footer>
          <Text>
            Hecho con 💜 por <Link>Will I'm</Link>
          </Text>
        </Footer>
      </Layout>
    </div>
  );
};
