import { Card, Col, Input, Row, Tooltip, Upload,Typography, Button,Spin, message, Skeleton, Image } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import {LogoutOutlined, UploadOutlined} from '@ant-design/icons';

import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logo from "../assets/logo.jpeg";
import swal from 'sweetalert';


const { Text } = Typography;

function formatNumber(value) {
    value += "";
    const list = value.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
  }




export const HomeTable = () => {
    const ref = useRef(null)
    const { logout } = useAuth();
    const {tableId} = useParams()

    const [image, setImage] = useState("");
    const [votes, setVotes] = useState("");
    const [table, setTable] = useState({})
    const [loading, setLoading] = useState(false);

    useEffect(() =>  getTable(), [])
    
    const getTable = async()=>{
        const res = await axios.get(`/api/tables/table/${tableId}`)
        return setTable(res.data)
    }

    const header = <span className="blue">Mesa número {table.number}</span>

    const uploadImage = async (e) => {
    setLoading(true);
    const files = e.fileList;
    const images = new FormData();
    const axiosInstance = axios.create();
    delete axiosInstance.defaults.headers.common["authorization"];
    images.append("file", files[0]?.originFileObj);
    images.append("upload_preset", "beti-work");
    await axiosInstance
      .post("https://api.cloudinary.com/v1_1/dkwdjfwfc/image/upload", images, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        message.success(`${files[0].name} imagen cargada corectamente`);
        setImage(res.data.secure_url);
      })
      .catch((err) => {
        message.error(`Upps algo salió mal, por favor intentalo nuevamente`);
        console.log("Table/Error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Click para subir la imagen</Button>
  );

  const handleChange = (e) => {
    setVotes(parseInt(e.target.value));
  };

  const cover = image ? (
    <Image src={image} style={{ width: 260, height: 300, marginLeft: 45 }} />
  ) : (
    <Skeleton.Image style={{ width: 260, height: 300, marginLeft: 45 }} />
  );


  const title = votes ? (
    <span className="numeric-input-title">
      {votes !== "-" ? formatNumber(votes) : "-"}
    </span>
  ) : (
    "Número de votos"
  );

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
  
  const handleClick = async () => {
    if (!votes || !image) return;
    const data = {
        image,
        votes,
        id: table.id
    }
    try {
        axios.put(`/api/tables/addData`, { ...data}).
        then(() => {
          swal({
            title: `Genial ${table.name} la mesa #: ${table.number} ya agregó los votos y la imagen 🎉`,
            icon: "success",
            timer: 5000,
          });
        })
 
    } catch (error) {
      swal({
        title: "Lo sentimos",
        text: `${error.message}`,
        icon: "warning",
        timer: 3000,
      });
      console.log(error.message);
    }
  }

  return (
      <>
    <Button onClick={handleLogout}><LogoutOutlined /></Button>

    <Card ref={ref} title={header} className="card m-h" cover={cover}>
    <Upload
      name="image"
      className="center"
      onChange={uploadImage}
    >
      {uploadButton}
    </Upload>
    <Row>
      <Text className="m-t">Cuantos votos obtuvo el PACTO?</Text>
      <Col span={9}>
        <Tooltip
          trigger={["focus"]}
          title={title}
          placement="topLeft"
          overlayClassName="numeric-input"
        >

          <Input
            onChange={handleChange}
            // onBlur={this.onBlur}
            placeholder="Número..."
            maxLength={4}
            value={votes}
            type="number"
            size="large"
          />
        </Tooltip>
      </Col>
      <Col span={1} />
      <Col span={14}>
        <Tooltip title='Testigo'>
          <Input
            value={table.name}
            size="large"
            readOnly
            bordered
          />
        </Tooltip>
      </Col>
    </Row>


    <Button
      block
      type="primary"
      size="large"
      onClick={handleClick}
      style={{ marginTop: 15 }}
    >
      Enviar
    </Button>
    <img className="logo" src={logo} alt="logo" />
    {loading && <Spin className="spin" size="large" tip="Cargando..." />}
  </Card>
  </>
  )
}
