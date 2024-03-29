import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Input, Layout, Space, Typography } from "antd";
import { Table } from "./Table";
import logo from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import {LogoutOutlined,PlusOutlined} from '@ant-design/icons';
import { useParams } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Text, Link, Title } = Typography;

const totalVotes = (tables) =>
  tables.map((t) => t.votes).reduce((a, c) => a + c);
  
  const totalVotesPetro = (tables) =>
  tables.map((t) => t.votesPetro).reduce((a, c) => a + c);

export const Home = () => {
  const [tables, setTables] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPetro, setTotalPetro] = useState(0);
  const { logout, currentUser } = useAuth();
  const {haveTables} = useParams() || false

  useEffect(() => {
    if (!Array.isArray(tables) || !tables.length) return;
    setTotal(totalVotes(tables));
    setTotalPetro(totalVotesPetro(tables))
  }, [tables]);

  useEffect(()=>{
    console.log('Home-haveTables',haveTables);
    if(!haveTables) return
    getTables()
  },[])

  const getTables = async () => {
    const admin = currentUser.email
    const totalTables = await axios.get(`api/tables/${admin}`)
    return setTables(totalTables.data)
  }
  const handleChange = (e) => setTables(e.target.value);

  const handleClick = (e) => {
    if (!tables) return;
    const admin = currentUser.email
    axios.post(`/api/tables/${tables}/${admin}`)
    .then(({ data }) => {
      console.log('Home-data',data)
      setTables(data);
    })
  };

  const addOneTable = (e) => {
    const admin = currentUser.email
    axios.post(`/api/tables/${1}/${admin}`)
    .then(({ data }) => {
      console.log('Home-data',data)
      setTables(data);
    })
  };

  //******* */
  const history = useHistory();

  const handleLogout = async () => {
    try {
        await logout();
        history.push('/login');
    } catch (error) {
        console.log(error.message)
    }
}

  return (
    <div>
      <Layout>
        <Header>
          <Button onClick={handleLogout}><LogoutOutlined /></Button>
        </Header>
        <Content className="content">
          <Card
            title={`Total mesas ${Array.isArray(tables) ? tables.length : tables
              }`}
            className="fixed card"
          >
            {Array.isArray(tables)  && (
              <>
                <Title level={4} className="purple">
                  Total Votos Petro: {totalPetro}
                </Title>
                <hr/>
                <Title level={4} className="green">
                  Total votos: {total}
                </Title>
              </>
            )}

            <button className="logo-out" onClick={handleLogout}><LogoutOutlined /></button>
            <button className="logo-sum" onClick={addOneTable}><PlusOutlined /></button>
            <img className="logo" src={logo} alt="logo" />
          </Card>
          {Array.isArray(tables) && tables.length ? (
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
