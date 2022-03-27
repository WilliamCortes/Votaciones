import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  Input,
  Image,
  Button,
  Card,
  message,
  Skeleton,
  Tooltip,
  Typography,
  Spin,
  Row,
  Col
} from "antd";
import swal from 'sweetalert';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { UploadOutlined } from "@ant-design/icons";
import logo from "../assets/logo.jpeg";


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

export const Table = ({ id, setTables, number, email }) => {
  const initialState = {
    name: '',
    email: '',
    password: '',
  }
  const [image, setImage] = useState("");
  const [votes, setVotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState)
  const [response, setResponse] = useState({})

  const { signup } = useAuth();

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Click para subir la imagen</Button>
  );
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
  const cover = image ? (
    <Image src={image} style={{ width: 260, height: 300, marginLeft: 45 }} />
  ) : (
    <Skeleton.Image style={{ width: 260, height: 300, marginLeft: 45 }} />
  );
  const handleChange = (e) => {
    setVotes(parseInt(e.target.value));
  };
  const title = votes ? (
    <span className="numeric-input-title">
      {votes !== "-" ? formatNumber(votes) : "-"}
    </span>
  ) : (
    "Número de votos"
  );

  const handleClick = () => {
    if (!votes) return;
    setTables((state) => {
      state[id] = {
        id,
        votes,
        img: image,
      };
      return [...state];
    });
  };
  const header = <span className="blue">Mesa número {number}</span>

  const handleChangeCreate = event => {
    setState({ ...state, [event.target.name]: event.target.value, })
  }

  const handleClickCreate = async () => {
    const {
      name,
      email,
      password,
    } = state
    if (!name || !email || !password) return
    try {
      await signup(state.email, state.password).then((() => {
        axios.put(`/api/tables/addname`, { ...state, id }).then(({ data }) => {
          setResponse({ email: data.email, name: data.name })
          swal({
            title: `Mesa asignada a ${data.name} 🎉`,
            icon: "success",
            timer: 1500,
          });
        })
      }))
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
      {email || Object.keys(response).length ?

        <Card title={header} className="card m-h" cover={cover}>
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
                  value={response.name}
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
        :
        // **********************************************************************
        <Card title={header} className="card m-h" >
          <Skeleton.Input style={{ width: 300, height: 222, marginBottom: 20, background: '#85F4FF', opacity: 0.1 }} />
          <Text className="m-t">Nombre del testigo</Text>
          <Input
            onChange={handleChangeCreate}
            placeholder="Nombre ..."
            name='name'
            value={state.name}
            type="text"
            size="large"
          />
          <Text className="m-t">Correo del testigo</Text>
          <Input
            onChange={handleChangeCreate}
            placeholder="Email ..."
            name='email'
            value={state.email}
            type="email"
            size="large"
          />

          <Text className="m-t">Contraseña del testigo</Text>
          <Input.Password
            name='password'
            value={state.password}
            placeholder='Contraseña...'
            onChange={handleChangeCreate}
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            size="large"
          />
          <Button
            block
            type="primary"
            size="large"
            onClick={handleClickCreate}
            style={{ marginTop: 15 }}
          >
            Enviar
          </Button>
          <img className="logo" src={logo} alt="logo" />
          {loading && <Spin className="spin" size="large" tip="Cargando..." />}
        </Card>}
    </>
  );
};
