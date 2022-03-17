import React, { useEffect, useState } from "react";
import { Button, Card, Input, Layout, Typography } from "antd";
import { Table } from "./Table";
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

  const table = {
    votes: 0,
    img: "",
  };
  const handleChange = (e) => setTables(e.target.value);
  const handleClick = (e) => {
    if (!tables) return;
    const totalTables = Array(parseInt(tables))
      .fill(table)
      .map((table, i) => ({ ...table, id: i }));
    setTables(totalTables);
  };
  console.log(total);

  return (
    <div>
      <Layout>
        <Header></Header>
        <Content className="content">
          <Card
            title={`Total mesas ${
              Array.isArray(tables) ? tables.length : tables
            }`}
            style={{ width: 400, margin: 20, padding: 15 }}
          >
            {Array.isArray(tables) && (
              <Title level={4}>Total votos: {total}</Title>
            )}
          </Card>
          {Array.isArray(tables) ? (
            tables.map((t, i) => <Table key={i} {...t} setTables={setTables} />)
          ) : (
            <Card
              title="Cuantas mesas deseas crear?"
              style={{ width: 400, margin: 20, padding: 15 }}
            >
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
