import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Price from "../../components/Price/Price";
import i18n from "../../config/localization/i18n";



export default function BasicTable() {
  const [datos, setData] = useState([]);
  const [datosH, setDataH] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [año, setAño] = useState();

  useEffect(() => {
    read();
    readH();
  }, [datos]);

  //READ REGISTROS
  const read = async () => {
    let { data: registros } = await supabase.from("registros").select("*");
    let { data: precio } = await supabase.from("precio").select("valor");
    setData(registros);
    setPrecio(precio[0].valor);
    var today = new Date();
    setAño(
      today.getFullYear() + "/" + today.getMonth() + "/" + today.getDate()
    );
  };

  //READ HISTORY
  const readH = async () => {
    let { data: registros } = await supabase.from("historico").select("*");
    setDataH(registros);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <Typography variant="h1" component="div" gutterBottom align="center">
        {i18n.t("Administrador")}
      </Typography>
      <Typography variant="h3" component="div" gutterBottom align="center">
        {año}
      </Typography>
      <Typography variant="h4" component="div" gutterBottom align="center">
        {i18n.t("H/F") + precio + ".00"}
      </Typography>
      <Price />
      <Button variant="outlined" onClick={() => supabase.auth.signOut()}>
        {i18n.t("Deslogearse")}
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{i18n.t("Entrada")}</TableCell>
              <TableCell>{i18n.t("Salida")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.entrada}</TableCell>
                <TableCell>{row.salida}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="h1"
        component="div"
        gutterBottom
        align="center"
        marginTop={10}
      >
        {i18n.t("Historico")}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{i18n.t("Entrada")}</TableCell>
              <TableCell>{i18n.t("Salida")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosH.map((row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.entrada}</TableCell>
                <TableCell>{row.salida}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
