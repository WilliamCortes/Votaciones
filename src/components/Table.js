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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import logo from "../assets/logo.jpeg";
// const table = {
//     votes: null,
//     img: "",
//   };

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

export const Table = ({ id, setTables }) => {
  const [image, setImage] = useState("");
  const [votes, setVotes] = useState("");
  const [loading, setLoading] = useState(false);
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
  const header = <span className="blue">Mesa número {id + 1}</span>;
  return (
    <Card title={header} className="card" cover={cover}>
      {/* <label>Por favor carga la fotografía</label> */}
      <Upload
        name="image"
        className="center"
        // beforeUpload={beforeUpload}
        onChange={uploadImage}
      >
        {uploadButton}
      </Upload>
      <Text className="m-t">Cuantos botos obtuvo el PACTO?</Text>
      <Tooltip
        trigger={["focus"]}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          onChange={handleChange}
          // onBlur={this.onBlur}
          placeholder="Número de votos"
          maxLength={4}
          value={votes}
          type="number"
          size="large"
        />
      </Tooltip>

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
  );
};
